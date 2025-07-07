class RoboComicException(Exception):
    """Base exception for RoboComic application."""

    def __init__(self, message: str, error_code: str = None, details: dict = None):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.details = details or {}


class AgentException(RoboComicException):
    """Exception raised when there's an issue with AI agents."""

    pass


class TTSServiceException(RoboComicException):
    """Exception raised when there's an issue with TTS services."""

    pass


class ConfigurationException(RoboComicException):
    """Exception raised when there's a configuration issue."""

    pass


class ValidationException(RoboComicException):
    """Exception raised when input validation fails."""

    pass


class APIException(RoboComicException):
    """Exception raised for API-related errors."""

    def __init__(self, message: str, status_code: int = 500, error_code: str = None, details: dict = None):
        super().__init__(message, error_code, details)
        self.status_code = status_code
