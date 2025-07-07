"""Configuration settings for RoboComic backend."""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
# Use absolute path to ensure .env is found regardless of where the script is run from
import pathlib

env_path = pathlib.Path(__file__).parent.parent / ".env"
load_dotenv(env_path)


class ConfigError(Exception):
    """Raised when required configuration is missing or invalid."""

    pass


def get_required_env(key: str, description: str) -> str:
    """Get a required environment variable or raise ConfigError."""
    value = os.getenv(key)
    if not value:
        raise ConfigError(f"Missing required environment variable: {key} ({description})")
    return value


def get_optional_env(key: str, default: str, description: str) -> str:
    """Get an optional environment variable with a default value."""
    return os.getenv(key, default)


# Required settings (will raise ConfigError if missing)
try:
    OPENAI_API_KEY = get_required_env("OPENAI_API_KEY", "OpenAI API key for LLM services")
    ELEVENLABS_API_KEY = get_required_env("ELEVENLABS_API_KEY", "ElevenLabs API key for TTS")
    COMEDIAN1_VOICE_ID = get_required_env("COMEDIAN1_VOICE_ID", "ElevenLabs voice ID for first comedian")
    COMEDIAN2_VOICE_ID = get_required_env("COMEDIAN2_VOICE_ID", "ElevenLabs voice ID for second comedian")
except ConfigError as e:
    print(f"Configuration Error: {e}")
    print("Please check your .env file and ensure all required variables are set.")
    raise

# Optional settings with defaults
LLM_MODEL = get_optional_env("LLM_MODEL", "gpt-3.5-turbo", "OpenAI model to use for LLM operations")
DEFAULT_TEMPERATURE = float(get_optional_env("DEFAULT_TEMPERATURE", "0.9", "Default LLM temperature"))
DEFAULT_MAX_TOKENS = int(get_optional_env("DEFAULT_MAX_TOKENS", "1000", "Default max tokens for LLM responses"))
DEFAULT_LANG = get_optional_env("DEFAULT_LANG", "en", "Default language for LLM operations")
API_HOST = get_optional_env("API_HOST", "0.0.0.0", "Host for the API server")
API_PORT = int(get_optional_env("API_PORT", "8000", "Port for the API server"))
LOG_LEVEL = get_optional_env("LOG_LEVEL", "INFO", "Logging level")
LOG_FORMAT = get_optional_env("LOG_FORMAT", "json", "Log format (json or human)")

# Temperature presets
TEMPERATURE_PRESETS = {
    "conservative": {"temperature": 0.3},
    "balanced": {"temperature": 0.7},
    "creative": {"temperature": 0.9},
    "experimental": {"temperature": 1.0},
}

# Validate optional settings
if LOG_FORMAT not in ["json", "human"]:
    raise ConfigError(f"Invalid LOG_FORMAT: {LOG_FORMAT}. Must be 'json' or 'human'")

if not (1 <= API_PORT <= 65535):
    raise ConfigError(f"Invalid API_PORT: {API_PORT}. Must be between 1 and 65535")


# Configuration validation function
def validate_config() -> None:
    """Validate all configuration settings."""
    print("✅ Configuration validation passed")
    print(f"   LLM Model: {LLM_MODEL}")
    print(f"   API Host: {API_HOST}")
    print(f"   API Port: {API_PORT}")
    print(f"   Log Level: {LOG_LEVEL}")
    print(f"   Log Format: {LOG_FORMAT}")
