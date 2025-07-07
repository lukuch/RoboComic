"""Configuration module for RoboComic backend."""

from .settings import (
    validate_config,
    ConfigError,
    OPENAI_API_KEY,
    ELEVENLABS_API_KEY,
    COMEDIAN1_VOICE_ID,
    COMEDIAN2_VOICE_ID,
    LLM_MODEL,
    API_HOST,
    API_PORT,
    LOG_LEVEL,
    LOG_FORMAT,
)

__all__ = [
    "validate_config",
    "ConfigError",
    "OPENAI_API_KEY",
    "ELEVENLABS_API_KEY",
    "COMEDIAN1_VOICE_ID",
    "COMEDIAN2_VOICE_ID",
    "LLM_MODEL",
    "API_HOST",
    "API_PORT",
    "LOG_LEVEL",
    "LOG_FORMAT",
]
