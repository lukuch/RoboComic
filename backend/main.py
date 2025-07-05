from container import container
from services.agent_manager import AgentManager
from tts.tts_service import TTSService
from ui.streamlit_ui import UIService
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.exceptions import RequestValidationError
import io
from fastapi.middleware.cors import CORSMiddleware
from config.personas import COMEDIAN_PERSONAS
from models import (
    GenerateShowRequest,
    GenerateShowResponse,
    TTSRequest,
    PersonasResponse,
    ChatMessage,
    HealthResponse
)
from utils import (
    validation_exception_handler,
    general_exception_handler
)
from services.api_service import ApiService
from datetime import datetime, UTC



app = FastAPI(
    title="RoboComic API",
    description="AI Standup Comedy App - RoboComic",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        sf.write(buf, audio_array, sample_rate, format='WAV')
        buf.seek(0)
        return StreamingResponse(buf, media_type="audio/wav")
    else:
        return StreamingResponse(io.BytesIO(audio_result), media_type="audio/wav")

@app.get("/personas", response_model=PersonasResponse)
def get_personas():
    return PersonasResponse(personas=COMEDIAN_PERSONAS)

@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.now(UTC).isoformat()
    ) 

if __name__ == "__main__":
    import sys
    import uvicorn
    from config import settings, validate_config
    
    # Validate configuration on startup
    validate_config()
    
    if len(sys.argv) > 1 and sys.argv[1] == "api":
        uvicorn.run("main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
    else:
        container.get(UIService).run_ui()
