"""Configuration module for RoboComic backend."""

from .settings import (
    API_HOST,
    API_PORT,
    COMEDIAN1_VOICE_ID,
    COMEDIAN2_VOICE_ID,
    ELEVENLABS_API_KEY,
    LLM_MODEL,
    LOG_FORMAT,
    LOG_LEVEL,
    OPENAI_API_KEY,
    ConfigError,
    validate_config,
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
