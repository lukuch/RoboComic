import structlog
import logging
import sys
from typing import Optional
from pathlib import Path


def setup_logger(
    name: str = "robocomic", level: str = "INFO", log_file: Optional[Path] = None, json_format: bool = True
) -> structlog.BoundLogger:
    """
    Set up a structured logger for the application.

    Args:
        name: Logger name
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Optional file path for logging
        json_format: Whether to use JSON format (True) or human-readable (False)

    Returns:
        Configured structured logger instance
    """
    # Configure structlog processors
    processors = [
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    if json_format:
        processors.append(structlog.processors.JSONRenderer())
    else:
        processors.append(structlog.dev.ConsoleRenderer(colors=True))

    structlog.configure(
        processors=processors,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Set up standard logging for handlers and level
    std_logger = logging.getLogger(name)
    std_logger.setLevel(getattr(logging, level.upper()))
    std_logger.handlers.clear()

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter("%(message)s"))
    std_logger.addHandler(console_handler)

    # File handler (if specified)
    if log_file:
        log_file.parent.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(logging.Formatter("%(message)s"))
        std_logger.addHandler(file_handler)

    return structlog.get_logger(name)


def get_logger(name: str = "robocomic") -> structlog.BoundLogger:
    """
    Get a structured logger instance. Creates one if it doesn't exist.

    Args:
        name: Logger name

    Returns:
        Structured logger instance
    """
    return structlog.get_logger(name)
