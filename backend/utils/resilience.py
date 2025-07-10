"""Resilience utilities using tenacity for external API calls."""

import functools
import logging
from typing import Any, Callable, TypeVar

import injector
import requests
import structlog
from tenacity import before_sleep_log, retry, retry_if_exception_type, stop_after_attempt, wait_exponential

T = TypeVar("T")

# Common exceptions that should trigger retries
RETRYABLE_EXCEPTIONS = (
    requests.exceptions.ConnectionError,
    requests.exceptions.Timeout,
    requests.exceptions.HTTPError,
    requests.exceptions.RequestException,
    ConnectionError,
    TimeoutError,
    OSError,
)


class ResilienceService:
    """Service for providing resilient API calls with proper IoC logging."""

    @injector.inject
    def __init__(self, logger: structlog.BoundLogger):
        self.logger = logger

    def resilient_api_call(
        self,
        max_attempts: int = 3,
        base_wait: float = 1.0,
        max_wait: float = 10.0,
        exceptions: tuple = RETRYABLE_EXCEPTIONS,
    ) -> Callable[[Callable[..., T]], Callable[..., T]]:
        """
        Decorator for resilient external API calls with exponential backoff.

        Args:
            max_attempts: Maximum number of retry attempts
            base_wait: Base wait time in seconds
            max_wait: Maximum wait time in seconds
            exceptions: Tuple of exceptions that should trigger retries
        """

        def decorator(func: Callable[..., T]) -> Callable[..., T]:
            @functools.wraps(func)
            @retry(
                stop=stop_after_attempt(max_attempts),
                wait=wait_exponential(multiplier=base_wait, max=max_wait),
                retry=retry_if_exception_type(exceptions),
                before_sleep=before_sleep_log(self.logger, logging.WARNING),
            )
            def wrapper(*args: Any, **kwargs: Any) -> T:
                return func(*args, **kwargs)

            return wrapper

        return decorator

    def resilient_llm_call(
        self,
        max_attempts: int = 1,  # Reduced to minimize conversation state loss
        base_wait: float = 1.0,  # Faster retry for conversation-level calls
        max_wait: float = 3.0,  # Shorter max wait
    ) -> Callable[[Callable[..., T]], Callable[..., T]]:
        """
        Decorator specifically for LLM API calls with conservative retry settings.

        Args:
            max_attempts: Maximum number of retry attempts (lower for LLM calls)
            base_wait: Base wait time in seconds
            max_wait: Maximum wait time in seconds
        """
        return self.resilient_api_call(
            max_attempts=max_attempts,
            base_wait=base_wait,
            max_wait=max_wait,
            exceptions=(Exception,),  # Broader exception handling for LLM calls
        )

    def resilient_tts_call(
        self,
        max_attempts: int = 3,
        base_wait: float = 1.0,
        max_wait: float = 5.0,
    ) -> Callable[[Callable[..., T]], Callable[..., T]]:
        """
        Decorator specifically for TTS API calls.

        Args:
            max_attempts: Maximum number of retry attempts
            base_wait: Base wait time in seconds
            max_wait: Maximum wait time in seconds
        """
        return self.resilient_api_call(
            max_attempts=max_attempts,
            base_wait=base_wait,
            max_wait=max_wait,
            exceptions=RETRYABLE_EXCEPTIONS,
        )
