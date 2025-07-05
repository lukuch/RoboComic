from container import container
from services.agent_manager import AgentManager
from tts.tts_service import TTSService
from ui.streamlit_ui import run_ui
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
import uvicorn
import io
from services.llm_utils import generate_topic_context_llm
from fastapi.middleware.cors import CORSMiddleware
from config.personas import COMEDIAN_PERSONAS
from models import (
    GenerateShowRequest,
    GenerateShowResponse,
    TTSRequest,
    PersonasResponse,
    ErrorResponse,
    ChatMessage,
    HealthResponse
)

app = FastAPI(
    title="RoboComic API",
    description="AI Standup Comedy App - RoboComic",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-show", response_model=GenerateShowResponse)
async def generate_show_api(request: GenerateShowRequest):
    try:
        agent_manager = container.get(AgentManager)
        agent_manager.set_personas(request.comedian1_style, request.comedian2_style, lang=request.lang)
        context = generate_topic_context_llm(request.topic, request.lang) if request.mode == "topical" else ""
        history = agent_manager.run_duel(request.mode, request.topic, max_rounds=request.num_rounds, lang=request.lang, context=context)
        
        chat_messages = [ChatMessage(role=msg["role"], content=msg["content"]) for msg in history]
        
        return GenerateShowResponse(history=chat_messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate show: {str(e)}")

@app.post("/tts")
async def tts_api(request: TTSRequest):
    try:
        tts_service = container.get(TTSService)
        audio_result = tts_service.speak(request.text, lang=request.lang)
        if isinstance(audio_result, tuple) and len(audio_result) == 2:
            audio_array, sample_rate = audio_result
            import soundfile as sf
            buf = io.BytesIO()
            sf.write(buf, audio_array, sample_rate, format='WAV')
            buf.seek(0)
            return StreamingResponse(buf, media_type="audio/wav")
        else:
            return StreamingResponse(io.BytesIO(audio_result), media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

@app.get("/personas", response_model=PersonasResponse)
def get_personas():
    return PersonasResponse(personas=COMEDIAN_PERSONAS)

@app.get("/health", response_model=HealthResponse)
def health_check():
    from datetime import datetime
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat()
    )

def main():
    agent_manager = container.get(AgentManager)
    tts_service = container.get(TTSService)
    run_ui(agent_manager, tts_service)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "api":
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    else:
        main()
