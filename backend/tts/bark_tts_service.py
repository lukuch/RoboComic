"""BarkTTSService for RoboComic backend."""

import os
from typing import Tuple

import injector
import numpy as np
import structlog

# Enable small models for 8GB VRAM GPUs, but do not disable CUDA or offload to CPU
os.environ["SUNO_USE_SMALL_MODELS"] = "True"

from bark import SAMPLE_RATE, generate_audio

from models import Language
from services.llm_utils import comedianify_text_llm

from .tts_service import TTSService


class BarkTTSService(TTSService):
    @injector.inject
    def __init__(self, logger: structlog.BoundLogger, output_dir="tts_output"):
        self.logger = logger
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.prompt_index = 0

    def speak(self, text: str, lang: str = Language.ENGLISH) -> Tuple[np.ndarray, int]:
        # Alternate gender for each call
        gender = "MAN" if self.prompt_index == 0 else "WOMAN"
        self.prompt_index = (self.prompt_index + 1) % 2
        # Comedianify the text using the LLM
        comedianified_text = comedianify_text_llm(text, gender=gender, lang=lang)
        self.logger.debug(f"Comedianified text: {comedianified_text}")
        audio_array = generate_audio(comedianified_text)
        return audio_array, SAMPLE_RATE
