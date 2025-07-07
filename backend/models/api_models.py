from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, field_validator

from config.personas import get_valid_comedian_styles, validate_comedian_style


class Language(str, Enum):
    ENGLISH = "en"
    POLISH = "pl"


class Mode(str, Enum):
    TOPICAL = "topical"
    ROAST = "roast"


class TemperaturePreset(str, Enum):
    CONSERVATIVE = "conservative"
    BALANCED = "balanced"
    CREATIVE = "creative"
    EXPERIMENTAL = "experimental"


class LLMConfig(BaseModel):
    temperature: float = Field(0.9, ge=0.0, le=1.0, description="Creativity level (0.0-1.0)")


class TemperaturePresetConfig(BaseModel):
    name: str = Field(..., description="Preset name")
    temperature: float = Field(..., description="Temperature value")


class GenerateShowRequest(BaseModel):
    comedian1_style: str = Field(..., description="Style of the first comedian")
    comedian2_style: str = Field(..., description="Style of the second comedian")
    lang: Language = Field(default=Language.ENGLISH, description="Language for the comedy duel")
    mode: Mode = Field(default=Mode.TOPICAL, description="Mode of the comedy duel")
    topic: str = Field(default="", description="Topic for the comedy duel")
    num_rounds: int = Field(default=1, ge=1, le=10, description="Number of rounds (1-10)")
    build_context: bool = Field(default=False, description="Whether to build context for the topic")
    temperature: Optional[float] = Field(None, ge=0.0, le=1.0, description="LLM temperature (0.0-1.0)")

    @field_validator("topic")
    @classmethod
    def validate_topic(cls, v):
        if len(v) > 500:
            raise ValueError("Topic too long (max 500 characters)")
        return v.strip()

    @field_validator("comedian1_style", "comedian2_style")
    @classmethod
    def validate_comedian_style(cls, v):
        if not validate_comedian_style(v):
            valid_styles = get_valid_comedian_styles()
            raise ValueError(f'Invalid comedian style "{v}". Must be one of: {", ".join(valid_styles)}')
        return v


class TTSRequest(BaseModel):
    text: str = Field(..., description="Text to convert to speech")
    lang: Language = Field(default=Language.ENGLISH, description="Language for TTS")
    voice_id: Optional[str] = Field(default=None, description="Voice ID to use for TTS")

    @field_validator("text")
    @classmethod
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError("Text cannot be empty")
        if len(v) > 1000:
            raise ValueError("Text too long (max 1000 characters)")
        return v.strip()


class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the speaker")
    content: str = Field(..., description="Content of the message")


class GenerateShowResponse(BaseModel):
    history: List[ChatMessage] = Field(..., description="Chat history of the comedy duel")
    success: bool = Field(default=True, description="Whether the request was successful")
    message: Optional[str] = Field(default=None, description="Optional message")


class ErrorResponse(BaseModel):
    success: bool = Field(default=False, description="Request was not successful")
    error: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(default=None, description="Error code for debugging")


class PersonasResponse(BaseModel):
    personas: Dict[str, Dict[str, str]] = Field(..., description="Available comedian personas")


class HealthResponse(BaseModel):
    status: str = Field(..., description="Health status")
    version: str = Field(..., description="API version")
    timestamp: str = Field(..., description="Current timestamp")


class VoiceIdsResponse(BaseModel):
    comedian1_voice_id: str = Field(..., description="Voice ID for the first comedian")
    comedian2_voice_id: str = Field(..., description="Voice ID for the second comedian")
