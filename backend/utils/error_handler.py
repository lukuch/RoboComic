import traceback
from typing import Union

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from .exceptions import RoboComicException
from .logger import get_logger

logger = get_logger(__name__)


def _clean_validation_errors(errors):
    """Clean validation errors to make them JSON serializable."""
    cleaned_errors = []
    for error in errors:
        cleaned_error = {
            "type": error.get("type"),
            "loc": error.get("loc"),
            "msg": error.get("msg"),
            "input": error.get("input"),
        }
        # Clean the context if it exists
        if "ctx" in error:
            cleaned_ctx = {}
            for key, value in error["ctx"].items():
                if isinstance(value, Exception):
                    cleaned_ctx[key] = str(value)
                else:
                    cleaned_ctx[key] = value
            cleaned_error["ctx"] = cleaned_ctx
        cleaned_errors.append(cleaned_error)
    return cleaned_errors


async def validation_exception_handler(request: Request, exc: Union[RequestValidationError, ValidationError]):
    """Handle Pydantic validation errors."""
    logger.warning(f"Validation error: {exc.errors()}")

    # Clean the errors to make them JSON serializable
    cleaned_errors = _clean_validation_errors(exc.errors())

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "error": "Validation error", "error_code": "VALIDATION_ERROR", "details": cleaned_errors},
    )


async def robocomic_exception_handler(request: Request, exc: RoboComicException):
    """Handle custom RoboComic exceptions."""
    logger.error(
        f"RoboComic exception: {exc.message}",
        extra={"error_code": exc.error_code, "details": exc.details, "url": str(request.url), "method": request.method},
    )

    status_code = getattr(exc, "status_code", status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JSONResponse(
        status_code=status_code,
        content={"success": False, "error": exc.message, "error_code": exc.error_code, "details": exc.details},
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions."""
    logger.error(
        f"Unexpected error: {str(exc)}",
        extra={"traceback": traceback.format_exc(), "url": str(request.url), "method": request.method},
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": "Internal server error", "error_code": "INTERNAL_ERROR"},
    )
