"""
Type protocols for ai-service components.

This module provides Protocol classes for type checking and better IDE support
without requiring changes to existing implementations.
"""

from typing import Any, Protocol


class TokenTracker(Protocol):
    """
    Protocol for token tracking components.

    This protocol defines the interface that token trackers must implement.
    The existing TokenTracker class in research/utils/token_tracker.py
    already satisfies this protocol.
    """

    @property
    def total_prompt_tokens(self) -> int: ...

    @property
    def total_completion_tokens(self) -> int: ...

    @property
    def total_tokens(self) -> int: ...

    @property
    def total_cost_usd(self) -> float: ...

    def add_usage(
        self,
        agent_name: str,
        stage: str,
        model: str,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        token_counts: dict[str, int] | None = None,
        system_prompt: str | None = None,
        user_prompt: str | None = None,
        response_text: str | None = None,
        messages: list[dict] | None = None,
    ) -> None: ...

    def get_summary(self) -> dict[str, Any]: ...

    def format_summary(self) -> str: ...

    def reset(self) -> None: ...

    def save(self, filepath: str) -> None: ...

    def set_on_usage_added_callback(self, callback: Any) -> None: ...

