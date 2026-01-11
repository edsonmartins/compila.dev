"""
Unified Logging System for DeepTutor
=====================================

A clean, consistent logging system with:
- Unified format: [Module] Symbol Message
- English-only output
- File output to data/user/logs/
- WebSocket streaming support
- Color-coded console output
- LLM usage statistics tracking
- External library log forwarding (LightRAG, LlamaIndex)

Usage:
    from src.logging import get_logger, LLMStats

    logger = get_logger("Solver")
    logger.info("Processing started")
    logger.success("Task completed in 2.3s")
    logger.error("Something went wrong")

    # Track LLM usage
    stats = LLMStats("Solver")
    stats.add_call(model="gpt-4o", prompt_tokens=100, completion_tokens=50)
    stats.print_summary()
"""

# CRITICAL: Ensure stdlib logging is imported BEFORE any local logging imports
# This prevents the local 'logging' package from shadowing the stdlib module
import sys
import importlib.util
import os

# Find and load the stdlib logging module AND its submodules directly from file location
# This bypasses Python's module finder which would find our local package
def load_stdlib_logging():
    """Load stdlib logging and its submodules, bypassing the local package."""
    stdlib_base = os.path.join(sys.prefix, 'lib', f'python{sys.version_info.major}.{sys.version_info.minor}', 'logging')

    # Load main logging module
    stdlib_path = os.path.join(stdlib_base, '__init__.py')
    if not os.path.exists(stdlib_path):
        # Try alternate locations
        for base in sys.path:
            candidate = os.path.join(base, 'logging', '__init__.py')
            if os.path.exists(candidate) and 'ai-service' not in candidate:
                stdlib_path = candidate
                stdlib_base = os.path.dirname(candidate)
                break

    if not os.path.exists(stdlib_path):
        return None

    # Load main logging module
    spec = importlib.util.spec_from_file_location('_stdlib_logging', stdlib_path)
    _stdlib_logging = importlib.util.module_from_spec(spec)
    sys.modules['_stdlib_logging'] = _stdlib_logging
    # Temporarily set 'logging' to stdlib for the exec_module call
    sys.modules['logging'] = _stdlib_logging
    spec.loader.exec_module(_stdlib_logging)

    # Load critical submodules that handlers.py needs
    handlers_path = os.path.join(stdlib_base, 'handlers.py')
    if os.path.exists(handlers_path):
        spec2 = importlib.util.spec_from_file_location('logging.handlers', handlers_path)
        _handlers = importlib.util.module_from_spec(spec2)
        sys.modules['logging.handlers'] = _handlers
        # Ensure 'logging' in sys.modules points to stdlib during this load
        spec2.loader.exec_module(_handlers)

    # CRITICAL: Remove 'logging' from sys.modules so that subsequent imports
    # will use the local package (this file)
    if 'logging' in sys.modules and sys.modules['logging'] is _stdlib_logging:
        del sys.modules['logging']

    return _stdlib_logging

# Load stdlib logging BEFORE importing anything else
_stdlib_logging = load_stdlib_logging()

if _stdlib_logging:
    # Store stdlib logging reference for adapters to use
    sys.modules['_stdlib_logging'] = _stdlib_logging
else:
    # Fallback if loading failed
    raise ImportError("Could not load stdlib logging module")

# Core logging
# Adapters for external libraries
from .adapters import (
    LightRAGLogContext,
    LightRAGLogForwarder,
    LlamaIndexLogContext,
    LlamaIndexLogForwarder,
    get_lightrag_forwarding_config,
)

# Configuration
from .config import (
    LoggingConfig,
    get_default_log_dir,
    load_logging_config,
)

# Handlers
from .handlers import (
    ConsoleHandler,
    FileHandler,
    JSONFileHandler,
    LogInterceptor,
    RotatingFileHandler,
    WebSocketLogHandler,
)
from .logger import (
    ConsoleFormatter,
    FileFormatter,
    Logger,
    LogLevel,
    get_logger,
    reset_logger,
)

# Statistics tracking
from .stats import (
    MODEL_PRICING,
    LLMCall,
    LLMStats,
    estimate_tokens,
    get_pricing,
)

__all__ = [
    # Core
    "Logger",
    "LogLevel",
    "get_logger",
    "reset_logger",
    "ConsoleFormatter",
    "FileFormatter",
    # Handlers
    "ConsoleHandler",
    "FileHandler",
    "JSONFileHandler",
    "RotatingFileHandler",
    "WebSocketLogHandler",
    "LogInterceptor",
    # Adapters
    "LightRAGLogContext",
    "LightRAGLogForwarder",
    "get_lightrag_forwarding_config",
    "LlamaIndexLogContext",
    "LlamaIndexLogForwarder",
    # Stats
    "LLMStats",
    "LLMCall",
    "get_pricing",
    "estimate_tokens",
    "MODEL_PRICING",
    # Config
    "LoggingConfig",
    "load_logging_config",
    "get_default_log_dir",
]
