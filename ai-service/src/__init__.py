"""
Compatibility layer for DeepTutor-style imports.

The original codebase expects modules under the "src" package. In this repo,
those modules live at the project root (ai-service/). We alias them here.
"""

from importlib import import_module
import sys

_ALIASES = ("api", "agents", "knowledge", "logging", "services", "tools", "utils")

for name in _ALIASES:
    try:
        module = import_module(name)
    except Exception:
        continue
    sys.modules[f"src.{name}"] = module
