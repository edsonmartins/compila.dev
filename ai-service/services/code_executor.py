"""
Code Executor Service
=====================

Safely execute user code in different programming languages.
"""

import asyncio
import tempfile
from pathlib import Path
from typing import Any

from src.logging import get_logger

logger = get_logger("CodeExecutor")


class CodeExecutor:
    """Execute code in various programming languages"""

    # Language configurations
    LANGUAGE_CONFIGS = {
        "python": {
            "extension": ".py",
            "command": ["python3"],
            "timeout": 10,
        },
        "javascript": {
            "extension": ".js",
            "command": ["node"],
            "timeout": 10,
        },
        "typescript": {
            "extension": ".ts",
            "command": ["ts-node"],
            "timeout": 10,
        },
        "java": {
            "extension": ".java",
            "command": ["java"],
            "timeout": 15,
        },
    }

    def __init__(self, language: str):
        self.language = language.lower()
        self.config = self.LANGUAGE_CONFIGS.get(self.language)
        if not self.config:
            raise ValueError(f"Unsupported language: {language}")

        self._last_execution_time = 0

    def execute(self, code: str, input_data: str = "") -> dict[str, Any]:
        """
        Execute code and return the result.

        Args:
            code: The source code to execute
            input_data: Input to provide to the program via stdin

        Returns:
            Dictionary with 'output', 'error', and 'exit_code' keys
        """
        import time
        start_time = time.time()

        try:
            result = asyncio.run(self._execute_async(code, input_data))
            self._last_execution_time = int((time.time() - start_time) * 1000)
            return result
        except Exception as e:
            logger.error(f"Error executing {self.language} code: {e}")
            return {
                "output": "",
                "error": str(e),
                "exit_code": -1
            }

    async def _execute_async(self, code: str, input_data: str) -> dict[str, Any]:
        """Execute code asynchronously with timeout"""
        import subprocess

        with tempfile.TemporaryDirectory() as tmpdir:
            tmpdir_path = Path(tmpdir)
            code_file = tmpdir_path / f"code{self.config['extension']}"

            # Write code to file
            code_file.write_text(code)

            # Build command
            cmd = self.config["command"] + [str(code_file)]

            try:
                # Run subprocess with timeout
                process = await asyncio.create_subprocess_exec(
                    *cmd,
                    stdin=asyncio.subprocess.PIPE,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    cwd=str(tmpdir_path)
                )

                # Send input and wait for completion
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(input=input_data.encode() if input_data else None),
                    timeout=self.config["timeout"]
                )

                output = stdout.decode('utf-8', errors='replace').strip()
                error = stderr.decode('utf-8', errors='replace').strip()

                return {
                    "output": output,
                    "error": error if error else None,
                    "exit_code": process.returncode
                }

            except asyncio.TimeoutError:
                # Kill the process on timeout
                try:
                    process.kill()
                    await process.wait()
                except:
                    pass

                return {
                    "output": "",
                    "error": f"Execution timeout (> {self.config['timeout']}s)",
                    "exit_code": -1
                }
            except Exception as e:
                return {
                    "output": "",
                    "error": str(e),
                    "exit_code": -1
                }

    def get_last_execution_time(self) -> int | None:
        """Return the execution time of the last run in milliseconds"""
        return self._last_execution_time

    @classmethod
    def get_supported_languages(cls) -> list[str]:
        """Return list of supported language identifiers"""
        return list(cls.LANGUAGE_CONFIGS.keys())
