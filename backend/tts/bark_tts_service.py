"""BarkTTSService for RoboComic backend."""

import os
from typing import Tuple

import injector
import numpy as np
import structlog

import models
from services.llm_service import LLMService

from .tts_service import TTSService

# NOTE: This must be set after imports for flake8 compliance, but before Bark is used.
os.environ["SUNO_USE_SMALL_MODELS"] = "True"


class BarkTTSService(TTSService):
    @injector.inject
    def __init__(self, logger: structlog.BoundLogger, llm_service: LLMService):
        self.logger = logger
        self.llm_service = llm_service
        self.prompt_index = 0

    def speak(self, text: str, lang: str = models.Language.ENGLISH) -> Tuple[np.ndarray, int]:
        from bark import SAMPLE_RATE, generate_audio  # moved import here to avoid test dependency

        # Alternate gender for each call
        gender = "MAN" if self.prompt_index == 0 else "WOMAN"
        self.prompt_index = (self.prompt_index + 1) % 2
        # Comedianify the text using the LLM
        comedianified_text = self.llm_service.comedianify_text(text, gender=gender, lang=lang)
        self.logger.debug(f"Comedianified text: {comedianified_text}")
        audio_array = generate_audio(comedianified_text)
        return audio_array, SAMPLE_RATE
