"""
Code Evaluation API Router for compila.dev
============================================

REST endpoint for code evaluation, testing, and AI feedback.
"""

import json
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from src.logging import get_logger

logger = get_logger("CodeEvaluationAPI")

router = APIRouter()


class TestCase(BaseModel):
    """Test case definition"""
    input_data: str = Field(..., description="Input data for the test")
    expected_output: str = Field(..., description="Expected output")
    is_hidden: bool = Field(default=False, description="Whether this test is hidden from user")


class CodeEvaluationRequest(BaseModel):
    """Request model for code evaluation"""
    code: str = Field(..., description="User's code submission")
    language: str = Field(..., description="Programming language (python, javascript, java, etc.)")
    problem_statement: str = Field(..., description="The problem/challenge description")
    test_cases: list[TestCase] = Field(default_factory=list, description="Test cases to validate")
    constraints: dict[str, Any] = Field(default_factory=dict, description="Execution constraints")
    requirements: str = Field(default="", description="Additional requirements/hints")


class TestResult(BaseModel):
    """Result of a single test case"""
    test_name: str
    passed: bool
    expected_output: str | None = None
    actual_output: str | None = None
    error_message: str | None = None
    is_hidden: bool = False


class CodeFeedback(BaseModel):
    """AI feedback on the code"""
    overall_score: int = Field(..., ge=0, le=100, description="Score from 0-100")
    strengths: list[str] = Field(default_factory=list, description="What the code does well")
    improvements: list[str] = Field(default_factory=list, description="Suggested improvements")
    best_practices: list[str] = Field(default_factory=list, description="Best practice suggestions")
    complexity_analysis: str | None = None
    hint: str | None = None


class CodeEvaluationResponse(BaseModel):
    """Response model for code evaluation"""
    success: bool
    passed_tests: int
    total_tests: int
    test_results: list[TestResult]
    feedback: CodeFeedback
    execution_time_ms: int | None = None
    error: str | None = None


@router.post("/evaluate")
async def evaluate_code(request: CodeEvaluationRequest) -> CodeEvaluationResponse:
    """
    Evaluate submitted code against test cases and provide AI feedback.

    This endpoint:
    1. Executes the code against provided test cases
    2. Runs static analysis on the code
    3. Generates AI-powered feedback in Portuguese
    4. Returns detailed results
    """
    logger.info(f"Evaluating {request.language} code submission")

    try:
        # Import the code evaluation service
        from src.services.code_executor import CodeExecutor
        from src.services.code_analyzer import CodeAnalyzer

        # 1. Execute code against test cases
        executor = CodeExecutor(language=request.language)
        test_results = []
        passed_count = 0

        for idx, test_case in enumerate(request.test_cases):
            test_name = f"Test {idx + 1}"
            try:
                result = executor.execute(
                    code=request.code,
                    input_data=test_case.input_data
                )

                expected = test_case.expected_output.strip()
                actual = result.get("output", "").strip()

                passed = actual == expected
                if passed:
                    passed_count += 1

                test_results.append(TestResult(
                    test_name=test_name,
                    passed=passed,
                    expected_output=test_case.expected_output if not test_case.is_hidden else None,
                    actual_output=actual if not test_case.is_hidden else None,
                    error_message=result.get("error"),
                    is_hidden=test_case.is_hidden
                ))

            except Exception as e:
                test_results.append(TestResult(
                    test_name=test_name,
                    passed=False,
                    error_message=str(e),
                    is_hidden=test_case.is_hidden
                ))

        # 2. Analyze code quality
        analyzer = CodeAnalyzer(language=request.language)
        feedback = await analyzer.analyze(
            code=request.code,
            problem_statement=request.problem_statement,
            test_results=test_results
        )

        return CodeEvaluationResponse(
            success=True,
            passed_tests=passed_count,
            total_tests=len(request.test_cases),
            test_results=test_results,
            feedback=feedback,
            execution_time_ms=executor.get_last_execution_time()
        )

    except ImportError as e:
        logger.warning(f"Code executor not available: {e}")
        # Fallback: return mock response for development
        return CodeEvaluationResponse(
            success=True,
            passed_tests=0,
            total_tests=len(request.test_cases),
            test_results=[],
            feedback=CodeFeedback(
                overall_score=0,
                strengths=[],
                improvements=["Avaliação de código em desenvolvimento"],
                best_practices=[],
                hint="Funcionalidade de avaliação em desenvolvimento"
            ),
            error="Code evaluation service not fully configured"
        )
    except Exception as e:
        logger.error(f"Error evaluating code: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze")
async def analyze_code(request: CodeEvaluationRequest) -> CodeFeedback:
    """
    Analyze code without executing tests.
    Returns AI feedback on code quality, best practices, and suggestions.
    """
    logger.info(f"Analyzing {request.language} code")

    try:
        from src.services.code_analyzer import CodeAnalyzer

        analyzer = CodeAnalyzer(language=request.language)
        feedback = await analyzer.analyze(
            code=request.code,
            problem_statement=request.problem_statement,
            test_results=[]
        )

        return feedback

    except ImportError:
        # Return mock feedback for development
        return CodeFeedback(
            overall_score=75,
            strengths=["Código bem estruturado"],
            improvements=["Adicione tratamento de erros"],
            best_practices=["Use type hints onde possível"],
            complexity_analysis="Complexidade baixa",
            hint="Considere adicionar validação de entrada"
        )
    except Exception as e:
        logger.error(f"Error analyzing code: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "code-evaluation"}


@router.get("/languages")
async def supported_languages():
    """Get list of supported programming languages"""
    return {
        "languages": [
            {"id": "python", "name": "Python", "version": "3.10+"},
            {"id": "javascript", "name": "JavaScript", "version": "ES2022"},
            {"id": "typescript", "name": "TypeScript", "version": "5.0+"},
            {"id": "java", "name": "Java", "version": "17+"},
        ]
    }
