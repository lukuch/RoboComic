import asyncio
import io
import os
import sys
import time
from concurrent.futures import ProcessPoolExecutor
from datetime import UTC, datetime
from typing import List

import uvicorn
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from config import settings, validate_config
from config.personas import COMEDIAN_PERSONAS
from config.settings import COMEDIAN1_VOICE_ID, COMEDIAN2_VOICE_ID, DEFAULT_TEMPERATURE, TEMPERATURE_PRESETS
from container import container
from models import (
    GenerateShowRequest,
    GenerateShowResponse,
    HealthResponse,
    JudgeShowRequest,
    JudgeShowResponse,
    LLMConfig,
    PersonasResponse,
    TemperaturePresetConfig,
    TTSRequest,
    VoiceIdsResponse,
)
from services.api_service import ApiService
from services.llm_service import LLMService
from utils import general_exception_handler, robocomic_exception_handler, validation_exception_handler
from utils.exceptions import TTSServiceException

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

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
llm_service = container.get(LLMService)

process_pool = ProcessPoolExecutor()


def generate_show_worker(body_dict):
    api_service = container.get(ApiService)
    request_obj = GenerateShowRequest(**body_dict)
    result = api_service.generate_show(request_obj)
    return result


@app.post("/generate-show", response_model=GenerateShowResponse)
@limiter.limit("2/minute")
async def generate_show_api(request: Request, body: GenerateShowRequest):
    loop = asyncio.get_running_loop()
    body_dict = body.model_dump()
    result = await loop.run_in_executor(process_pool, generate_show_worker, body_dict)
    return result


@app.post("/judge-show", response_model=JudgeShowResponse)
@limiter.limit("2/minute")
async def judge_show(request: Request, body: JudgeShowRequest):
    """Judge a comedy duel and return the winner and a summary using LLM."""
    winner, summary = llm_service.judge_show(
        comedian1_name=body.comedian1_name,
        comedian2_name=body.comedian2_name,
        history=[msg.model_dump() for msg in body.history],
        lang=body.lang,
    )
    return JudgeShowResponse(winner=winner, summary=summary)


@app.post("/tts")
@limiter.limit("4/10 minutes")
async def tts_api(request: Request, body: TTSRequest):
    audio_result = api_service.tts(body)
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
@limiter.limit("20/minute")
def get_personas(request: Request):
    return PersonasResponse(personas=COMEDIAN_PERSONAS)


@app.api_route("/health", methods=["GET", "HEAD", "OPTIONS"], response_model=HealthResponse)
async def health_check():
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


@app.get("/voice-ids", response_model=VoiceIdsResponse)
def get_voice_ids():
    """Get current voice IDs for comedians."""
    return VoiceIdsResponse(
        comedian1_voice_id=COMEDIAN1_VOICE_ID,
        comedian2_voice_id=COMEDIAN2_VOICE_ID,
    )


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
