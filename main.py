from container import container
from services.agent_manager import AgentManager
from tts.tts_service import TTSService
from ui.streamlit_ui import run_ui
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
import uvicorn
import io
from services.llm_utils import generate_topic_context_llm
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-show")
async def generate_show_api(request: Request):
    data = await request.json()
    comedian1_style = data.get("comedian1_style", "relatable")
    comedian2_style = data.get("comedian2_style", "relatable")
    lang = data.get("lang", "en")
    mode = data.get("mode", "topical")
    topic = data.get("topic", "")
    num_rounds = data.get("num_rounds", 1)
    agent_manager = container.get(AgentManager)
    agent_manager.set_personas(comedian1_style, comedian2_style, lang=lang)
    context = generate_topic_context_llm(topic, lang) if mode == "topical" else ""
    history = agent_manager.run_duel(mode, topic, max_rounds=num_rounds, lang=lang, context=context)
    return JSONResponse({"history": history})

@app.post("/tts")
async def tts_api(request: Request):
    data = await request.json()
    text = data.get("text", "")
    lang = data.get("lang", "en")
    tts_service = container.get(TTSService)
    audio_result = tts_service.speak(text, lang=lang)
    if isinstance(audio_result, tuple) and len(audio_result) == 2:
        audio_array, sample_rate = audio_result
        import soundfile as sf
        buf = io.BytesIO()
        sf.write(buf, audio_array, sample_rate, format='WAV')
        buf.seek(0)
        return StreamingResponse(buf, media_type="audio/wav")
    else:
        return StreamingResponse(io.BytesIO(audio_result), media_type="audio/wav")

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
