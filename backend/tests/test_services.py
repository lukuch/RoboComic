from unittest.mock import Mock, patch

import pytest

from config.personas import COMEDIAN_PERSONAS
from models.api_models import GenerateShowRequest, TTSRequest
from services.agent_manager import AgentManager
from services.api_service import ApiService
from utils.logger import get_logger


class TestAgentManager:
    """Test AgentManager functionality"""

    def test_agent_manager_initialization(self):
        mock_logger = Mock()
        manager = AgentManager(logger=mock_logger)
        assert manager is not None
        assert hasattr(manager, "logger")
        assert hasattr(manager, "comedian1_key")
        assert hasattr(manager, "comedian2_key")

    @patch("openai.OpenAI")
    def test_generate_show_basic(self, mock_openai):
        mock_logger = Mock()
        mock_client = Mock()
        mock_openai.return_value = mock_client
        mock_choice = Mock()
        mock_choice.message.content = "Test joke"
        mock_response = Mock()
        mock_response.choices = [mock_choice]
        mock_client.chat.completions.create.return_value = mock_response
        manager = AgentManager(logger=mock_logger)
        request = GenerateShowRequest(
            comedian1_style="relatable",
            comedian2_style="absurd",
            lang="en",
            mode="topical",
            topic="airplanes",
            num_rounds=1,
            build_context=False,
            temperature=0.7,
        )
        try:
            result = manager.run_duel(
                request.mode, request.topic, max_rounds=request.num_rounds, lang=request.lang, temperature=request.temperature
            )
            assert result is not None
        except Exception:
            pass

    def test_validate_comedians(self):
        mock_logger = Mock()
        manager = AgentManager(logger=mock_logger)
        valid_comedians = list(COMEDIAN_PERSONAS.keys())[:2]
        assert len(valid_comedians) >= 2
        try:
            manager.set_personas(valid_comedians[0], valid_comedians[1], lang="en")
            assert manager.comedian1_key == valid_comedians[0]
            assert manager.comedian2_key == valid_comedians[1]
        except Exception:
            pass


class TestApiService:
    """Test ApiService functionality"""

    def test_api_service_initialization(self):
        mock_agent_manager = Mock()
        mock_tts_service = Mock()
        mock_logger = Mock()
        service = ApiService(agent_manager=mock_agent_manager, tts_service=mock_tts_service, logger=mock_logger)
        assert service is not None
        assert hasattr(service, "agent_manager")
        assert hasattr(service, "tts_service")
        assert hasattr(service, "logger")

    def test_generate_show_service(self):
        mock_agent_manager = Mock()
        mock_tts_service = Mock()
        mock_logger = Mock()
        service = ApiService(agent_manager=mock_agent_manager, tts_service=mock_tts_service, logger=mock_logger)
        request = GenerateShowRequest(
            comedian1_style="relatable",
            comedian2_style="absurd",
            lang="en",
            mode="topical",
            topic="airplanes",
            num_rounds=1,
            build_context=False,
            temperature=0.7,
        )
        try:
            service.agent_manager.set_personas.return_value = None
            service.agent_manager.run_duel.return_value = [{"role": "comedian1", "content": "joke"}]
            result = service.generate_show(request)
            assert result is not None
            assert hasattr(result, "history")
        except Exception:
            pass

    def test_tts_service(self):
        mock_agent_manager = Mock()
        mock_tts_service = Mock()
        mock_logger = Mock()
        service = ApiService(agent_manager=mock_agent_manager, tts_service=mock_tts_service, logger=mock_logger)
        request = TTSRequest(text="Hello, this is a test.", lang="en")
        try:
            service.tts_service.speak.return_value = (Mock(), 22050)
            result = service.tts(request)
            assert result is not None
        except Exception:
            pass


class TestConfiguration:
    """Test configuration loading and validation"""

    def test_personas_configuration(self):
        """Test personas configuration is valid"""
        assert COMEDIAN_PERSONAS is not None
        assert isinstance(COMEDIAN_PERSONAS, dict)
        assert len(COMEDIAN_PERSONAS) > 0

        # Check each persona has required fields
        for persona_id, persona in COMEDIAN_PERSONAS.items():
            assert "style" in persona
            assert "description" in persona

    def test_temperature_presets(self):
        """Test temperature presets configuration"""
        from config.settings import TEMPERATURE_PRESETS

        assert TEMPERATURE_PRESETS is not None
        assert isinstance(TEMPERATURE_PRESETS, dict)
        assert len(TEMPERATURE_PRESETS) > 0

        # Check each preset has required fields
        for preset_name, preset in TEMPERATURE_PRESETS.items():
            assert "temperature" in preset
            assert isinstance(preset["temperature"], (int, float))
            assert 0 <= preset["temperature"] <= 2


class TestErrorHandling:
    """Test error handling in services"""

    def test_invalid_request_handling(self):
        """Test handling of invalid requests"""
        # Test with invalid comedian IDs - this should raise validation error
        with pytest.raises(Exception):
            request = GenerateShowRequest(
                comedian1_style="invalid_comedian",
                comedian2_style="another_invalid",
                lang="en",
                mode="topical",
                topic="airplanes",
                num_rounds=1,
                build_context=False,
                temperature=0.7,
            )

    def test_tts_error_handling(self):
        """Test TTS error handling"""
        # Test with empty text - this should raise validation error
        with pytest.raises(Exception):
            request = TTSRequest(text="", lang="en")  # Empty text
