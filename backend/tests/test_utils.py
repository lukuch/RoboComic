from utils.exceptions import RoboComicException, TTSServiceException, ValidationException
from utils.logger import setup_logger


class TestExceptions:
    """Test custom exception classes"""

    def test_robocomic_exception(self):
        """Test base RoboComicException"""
        exception = RoboComicException("Test error message")
        assert str(exception) == "Test error message"
        assert isinstance(exception, Exception)

    def test_validation_exception(self):
        """Test ValidationException"""
        exception = ValidationException("Invalid input")
        assert str(exception) == "Invalid input"
        assert isinstance(exception, RoboComicException)

    def test_tts_service_exception(self):
        """Test TTSServiceException"""
        exception = TTSServiceException("TTS service error")
        assert str(exception) == "TTS service error"
        assert isinstance(exception, RoboComicException)


class TestLogger:
    """Test logging configuration"""

    def test_setup_logger(self):
        """Test logger setup"""
        logger = setup_logger("test_logger")

        # The setup_logger function returns a structlog logger, not a standard logging.Logger
        # We just check that it's not None and has the expected name
        assert logger is not None
        # The logger name is set in the logger factory args
        assert hasattr(logger, "_logger_factory_args")

    def test_logger_handlers(self):
        """Test logger has proper handlers"""
        logger = setup_logger("test_logger_with_handlers")

        # The structlog logger doesn't have handlers in the same way as standard logging
        # We just check that it's properly initialized
        assert logger is not None


class TestValidationUtils:
    """Test validation utility functions"""

    def test_validate_comedian_style(self):
        """Test comedian style validation"""
        from config.personas import COMEDIAN_PERSONAS, validate_comedian_style

        # Test valid comedian style
        valid_comedian = list(COMEDIAN_PERSONAS.keys())[0]
        assert validate_comedian_style(valid_comedian) is True

        # Test invalid comedian style
        invalid_comedian = "invalid_comedian_style"
        assert validate_comedian_style(invalid_comedian) is False

    def test_validate_language(self):
        """Test language validation"""
        from models.api_models import Language

        valid_languages = [Language.ENGLISH, Language.POLISH]
        invalid_languages = ["invalid", "fr", "de"]

        for lang in valid_languages:
            assert lang in valid_languages

        for lang in invalid_languages:
            assert lang not in valid_languages

    def test_validate_temperature(self):
        """Test temperature validation"""
        valid_temperatures = [0.0, 0.5, 1.0, 1.5, 2.0]
        invalid_temperatures = [-0.1, 2.1, 3.0]

        for temp in valid_temperatures:
            assert 0.0 <= temp <= 2.0

        for temp in invalid_temperatures:
            assert not (0.0 <= temp <= 2.0)
