import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
COMEDIAN1_VOICE_ID = os.getenv("COMEDIAN1_VOICE_ID")
COMEDIAN2_VOICE_ID = os.getenv("COMEDIAN2_VOICE_ID")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
