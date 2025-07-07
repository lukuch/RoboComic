from container import container
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
import io
import time
import os
import sys
import uvicorn
from config.personas import COMEDIAN_PERSONAS
from models import (
    GenerateShowRequest,
    GenerateShowResponse,
    TTSRequest,
    PersonasResponse,
    HealthResponse,
    LLMConfig,
    TemperaturePresetConfig,
)
from typing import List
from utils import validation_exception_handler, robocomic_exception_handler, general_exception_handler
from utils.exceptions import TTSServiceException
from services.api_service import ApiService
from datetime import datetime, UTC
from config.settings import DEFAULT_TEMPERATURE, TEMPERATURE_PRESETS
from config import settings, validate_config

# Production settings
IS_PRODUCTION = os.getenv("ENVIRONMENT", "development") == "production"

# Detect if running under pytest (for test CORS)
IS_TEST = "pytest" in sys.modules

app = FastAPI(
    title="RoboComic API",
    description="AI Standup Comedy App - RoboComic",
    version="1.0.0",
    docs_url="/docs" if not IS_PRODUCTION else None,
    redoc_url="/redoc" if not IS_PRODUCTION else None,
)

# Add exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(TTSServiceException, robocomic_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# CORS middleware with production settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if IS_TEST else ["https://robo-comic.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


api_service = container.get(ApiService)


@app.post("/generate-show", response_model=GenerateShowResponse)
async def generate_show_api(request: GenerateShowRequest):
    return api_service.generate_show(request)


@app.post("/tts")
async def tts_api(request: TTSRequest):
    audio_result = api_service.tts(request)
    if isinstance(audio_result, tuple) and len(audio_result) == 2:
        audio_array, sample_rate = audio_result
        import soundfile as sf

        buf = io.BytesIO()
        sf.write(buf, audio_array, sample_rate, format="WAV")
        buf.seek(0)
        return StreamingResponse(buf, media_type="audio/wav")
    else:
        return StreamingResponse(io.BytesIO(audio_result), media_type="audio/wav")


@app.get("/personas", response_model=PersonasResponse)
def get_personas():
    return PersonasResponse(personas=COMEDIAN_PERSONAS)


@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="healthy", version="1.0.0", timestamp=datetime.now(UTC).isoformat())


@app.get("/llm-config", response_model=LLMConfig)
def get_default_llm_config():
    """Get default LLM configuration."""
    return LLMConfig(temperature=DEFAULT_TEMPERATURE)


@app.get("/temperature-presets", response_model=List[TemperaturePresetConfig])
def get_temperature_presets():
    """Get available temperature presets."""
    return [
        TemperaturePresetConfig(name=name, temperature=preset["temperature"]) for name, preset in TEMPERATURE_PRESETS.items()
    ]


if __name__ == "__main__":
    # Validate configuration on startup
    validate_config()

    if len(sys.argv) > 1 and sys.argv[1] == "api":
        uvicorn.run("main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
    else:
        # Only run UI if streamlit is available
        try:
            from ui.streamlit_ui import UIService

            container.get(UIService).run_ui()
        except ImportError:
            print("Streamlit not available. ")
