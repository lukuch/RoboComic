from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Any, Optional
from enum import Enum

class Language(str, Enum):
    ENGLISH = "en"
    POLISH = "pl"

class Mode(str, Enum):
    TOPICAL = "topical"
    ROAST = "roast"

class GenerateShowRequest(BaseModel):
    comedian1_style: str = Field(..., description="Style of the first comedian")
    comedian2_style: str = Field(..., description="Style of the second comedian")
    lang: Language = Field(default=Language.ENGLISH, description="Language for the comedy duel")
    mode: Mode = Field(default=Mode.TOPICAL, description="Mode of the comedy duel")
    topic: str = Field(default="", description="Topic for the comedy duel")
    num_rounds: int = Field(default=1, ge=1, le=10, description="Number of rounds (1-10)")

    @field_validator('topic')
    @classmethod
    def validate_topic(cls, v):
        if not v.strip():
            raise ValueError('Topic cannot be empty')
        if len(v) > 500:
            raise ValueError('Topic too long (max 500 characters)')
        return v.strip()

    @field_validator('comedian1_style', 'comedian2_style')
    @classmethod
    def validate_comedian_style(cls, v):
        valid_styles = [
            'relatable', 'sarcastic', 'absurd', 'uncle_heniek', 
            'gen_z', 'simple', 'philosophical', 'dark'
        ]
        if v not in valid_styles:
            raise ValueError(f'Invalid comedian style. Must be one of: {valid_styles}')
        return v

class TTSRequest(BaseModel):
    text: str = Field(..., description="Text to convert to speech")
    lang: Language = Field(default=Language.ENGLISH, description="Language for TTS")

    @field_validator('text')
    @classmethod
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError('Text cannot be empty')
        if len(v) > 1000:
            raise ValueError('Text too long (max 1000 characters)')
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