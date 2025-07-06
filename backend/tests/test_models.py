import pytest
from pydantic import ValidationError
from models.api_models import (
    GenerateShowRequest, 
    GenerateShowResponse, 
    TTSRequest, 
    PersonasResponse,
    HealthResponse,
    LLMConfig,
    TemperaturePresetConfig,
    ChatMessage
)

class TestGenerateShowRequest:
    def test_valid_request(self):
        request = GenerateShowRequest(
            comedian1_style="relatable",
            comedian2_style="absurd",
            lang="en",
            mode="topical",
            topic="airplanes",
            num_rounds=1,
            build_context=False,
            temperature=0.7
        )
        assert request.comedian1_style == "relatable"
        assert request.comedian2_style == "absurd"
        assert request.lang == "en"
        assert request.mode == "topical"
        assert request.topic == "airplanes"
        assert request.num_rounds == 1
        assert request.build_context is False
        assert request.temperature == 0.7

    def test_invalid_num_rounds(self):
        with pytest.raises(ValidationError):
            GenerateShowRequest(
                comedian1_style="relatable",
                comedian2_style="absurd",
                lang="en",
                mode="topical",
                topic="airplanes",
                num_rounds=0,
                build_context=False,
                temperature=0.7
            )

    def test_invalid_temperature(self):
        with pytest.raises(ValidationError):
            GenerateShowRequest(
                comedian1_style="relatable",
                comedian2_style="absurd",
                lang="en",
                mode="topical",
                topic="airplanes",
                num_rounds=1,
                build_context=False,
                temperature=2.5
            )

class TestTTSRequest:
    def test_valid_request(self):
        request = TTSRequest(
            text="Hello, this is a test.",
            lang="en"
        )
        assert request.text == "Hello, this is a test."
        assert request.lang == "en"

    def test_empty_text(self):
        with pytest.raises(ValidationError):
            TTSRequest(
                text="",
                lang="en"
            )

class TestGenerateShowResponse:
    def test_valid_response(self):
        chat_history = [
            ChatMessage(role="user", content="Test joke 1"),
            ChatMessage(role="assistant", content="Test joke 2")
        ]
        response = GenerateShowResponse(
            history=chat_history,
            success=True,
            message=None
        )
        assert response.success is True
        assert isinstance(response.history, list)
        assert response.history[0].role == "user"
        assert response.history[1].role == "assistant"

class TestPersonasResponse:
    def test_valid_response(self):
        personas = {
            "relatable": {"id": "relatable", "name": "Relatable", "description": "Relatable style"}
        }
        response = PersonasResponse(personas=personas)
        assert "relatable" in response.personas

class TestHealthResponse:
    def test_valid_response(self):
        response = HealthResponse(
            status="healthy",
            version="1.0.0",
            timestamp="2024-01-01T12:00:00Z"
        )
        assert response.status == "healthy"
        assert response.version == "1.0.0"
        assert response.timestamp == "2024-01-01T12:00:00Z"

class TestLLMConfig:
    def test_valid_config(self):
        config = LLMConfig(temperature=0.7)
        assert config.temperature == 0.7

class TestTemperaturePresetConfig:
    def test_valid_preset(self):
        preset = TemperaturePresetConfig(
            name="Creative",
            temperature=0.8
        )
        assert preset.name == "Creative"
        assert preset.temperature == 0.8

class TestChatMessage:
    def test_valid_message(self):
        message = ChatMessage(
            role="user",
            content="Hello, this is a test message."
        )
        assert message.role == "user"
        assert message.content == "Hello, this is a test message." 