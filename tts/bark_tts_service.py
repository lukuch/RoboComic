import os
# Enable small models for 8GB VRAM GPUs, but do not disable CUDA or offload to CPU
os.environ["SUNO_USE_SMALL_MODELS"] = "True"

from .tts_service import TTSService
from bark import SAMPLE_RATE, generate_audio
from services.llm_utils import comedianify_text_llm


class BarkTTSService(TTSService):
    def __init__(self, output_dir="tts_output"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.prompt_index = 0

    def speak(self, text, lang="en"):
        # Alternate gender for each call
        gender = "MAN" if self.prompt_index == 0 else "WOMAN"
        self.prompt_index = (self.prompt_index + 1) % 2
        # Comedianify the text using the LLM
        comedianified_text = comedianify_text_llm(text, gender=gender, lang=lang)
        print(comedianified_text)
        audio_array = generate_audio(comedianified_text)
        return audio_array, SAMPLE_RATE 