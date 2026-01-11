"""
Code Evaluation WebSocket API Router for compila.dev
======================================================

WebSocket endpoint for real-time code evaluation with streaming feedback.
"""

import asyncio
from typing import Any

from fastapi import WebSocket, WebSocketDisconnect, APIRouter

from src.api.utils.task_id_manager import TaskIDManager
from src.logging import get_logger

logger = get_logger("CodeEvaluationWS")

router = APIRouter()


@router.websocket("/evaluate")
async def websocket_evaluate(websocket: WebSocket):
    """
    Real-time code evaluation over WebSocket.

    Client sends:
    {
        "code": "<user code>",
        "language": "python",
        "problem_statement": "...",
        "test_cases": [
            {"input_data": "...", "expected_output": "...", "is_hidden": false}
        ]
    }

    Server streams:
    {
        "type": "task_id",
        "task_id": "eval_xxx"
    }
    {
        "type": "status",
        "content": "starting evaluation"
    }
    {
        "type": "test_result",
        "test_name": "Test 1",
        "passed": true,
        "output": "..."
    }
    {
        "type": "feedback",
        "overall_score": 85,
        "strengths": ["Good structure"],
        "improvements": ["Add error handling"],
        "hint": "Try using try-except"
    }
    {
        "type": "result",
        "success": true,
        "passed_tests": 3,
        "total_tests": 5
    }
    """
    await websocket.accept()

    task_manager = TaskIDManager.get_instance()

    try:
        # 1. Receive initial message with code and config
        data = await websocket.receive_json()

        code = data.get("code")
        language = data.get("language", "python")
        problem_statement = data.get("problem_statement", "")
        test_cases = data.get("test_cases", [])

        if not code:
            await websocket.send_json({"type": "error", "content": "Code is required"})
            return

        # Generate task ID
        task_key = f"eval_{language}_{hash(str(code + str(test_cases)))}"
        task_id = task_manager.generate_task_id("evaluate", task_key)

        await websocket.send_json({"type": "task_id", "task_id": task_id})

        logger.info(f"[{task_id}] Evaluating {language} code")

        # 2. Setup for streaming results
        log_queue = asyncio.Queue()
        connection_closed = asyncio.Event()

        async def safe_send_json(msg: dict[str, Any]) -> bool:
            """Safely send JSON to WebSocket"""
            if connection_closed.is_set():
                return False
            try:
                await websocket.send_json(msg)
                return True
            except (WebSocketDisconnect, RuntimeError, ConnectionError):
                connection_closed.set()
                return False
            except Exception as e:
                logger.debug(f"Error sending WebSocket message: {e}")
                connection_closed.set()
                return False

        # 3. Background task to push logs to WebSocket
        async def log_pusher():
            while not connection_closed.is_set():
                try:
                    msg = await asyncio.wait_for(log_queue.get(), timeout=0.5)
                    try:
                        await websocket.send_json(msg)
                    except (WebSocketDisconnect, RuntimeError, ConnectionError):
                        connection_closed.set()
                        break
                    except Exception as e:
                        logger.debug(f"Error sending log entry: {e}")
                    log_queue.task_done()
                except asyncio.TimeoutError:
                    continue
                except Exception as e:
                    logger.debug(f"Error in log_pusher: {e}")
                    break

        pusher_task = asyncio.create_task(log_pusher())

        try:
            await safe_send_json({"type": "status", "content": "starting evaluation"})

            # 4. Execute tests
            from src.services.code_executor import CodeExecutor
            from src.services.code_analyzer import CodeAnalyzer

            executor = CodeExecutor(language)
            analyzer = CodeAnalyzer(language)

            passed_tests = 0
            all_results = []

            for idx, test_case in enumerate(test_cases):
                test_name = f"Test {idx + 1}"
                await safe_send_json({
                    "type": "status",
                    "content": f"Running {test_name}..."
                })

                try:
                    result = executor.execute(code, test_case.get("input_data", ""))
                    expected = test_case.get("expected_output", "").strip()
                    actual = result.get("output", "").strip()

                    passed = actual == expected
                    if passed:
                        passed_tests += 1

                    test_result = {
                        "test_name": test_name,
                        "passed": passed,
                        "expected_output": expected if not test_case.get("is_hidden") else None,
                        "actual_output": actual if not test_case.get("is_hidden") else None,
                        "error_message": result.get("error"),
                        "is_hidden": test_case.get("is_hidden", False)
                    }

                    all_results.append(test_result)

                    await safe_send_json({
                        "type": "test_result",
                        **test_result
                    })

                except Exception as e:
                    test_result = {
                        "test_name": test_name,
                        "passed": False,
                        "error_message": str(e),
                        "is_hidden": test_case.get("is_hidden", False)
                    }
                    all_results.append(test_result)
                    await safe_send_json({
                        "type": "test_result",
                        **test_result
                    })

            # 5. Get AI feedback
            await safe_send_json({
                "type": "status",
                "content": "Analyzing code quality..."
            })

            feedback = await analyzer.analyze(
                code=code,
                problem_statement=problem_statement,
                test_results=[]
            )

            # Stream feedback
            await safe_send_json({
                "type": "feedback",
                "overall_score": feedback.overall_score,
                "strengths": feedback.strengths,
                "improvements": feedback.improvements,
                "best_practices": feedback.best_practices,
                "complexity_analysis": feedback.complexity_analysis,
                "hint": feedback.hint
            })

            # 6. Send final result
            await safe_send_json({
                "type": "result",
                "success": True,
                "passed_tests": passed_tests,
                "total_tests": len(test_cases),
                "execution_time_ms": executor.get_last_execution_time()
            })

            logger.success(f"[{task_id}] Evaluation completed: {passed_tests}/{len(test_cases)} passed")
            task_manager.update_task_status(task_id, "completed")

        except Exception as e:
            await safe_send_json({
                "type": "error",
                "content": str(e)
            })
            logger.error(f"[{task_id}] Evaluation failed: {e}")
            task_manager.update_task_status(task_id, "error", error=str(e))

        finally:
            # Stop log pusher
            connection_closed.set()
            pusher_task.cancel()
            try:
                await pusher_task
            except asyncio.CancelledError:
                pass

            # Close WebSocket
            try:
                await websocket.close()
            except:
                pass

    except WebSocketDisconnect:
        logger.debug("Client disconnected from code evaluation")
    except Exception as e:
        logger.error(f"WebSocket error in code evaluation: {e}")
