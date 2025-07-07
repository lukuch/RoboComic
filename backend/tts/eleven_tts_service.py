"""ElevenTTSService for RoboComic backend."""

import injector
import requests
import structlog

from config.settings import COMEDIAN1_VOICE_ID, ELEVENLABS_API_KEY

from .tts_service import TTSService


class ElevenTTSService(TTSService):
    @injector.inject
    def __init__(self, logger: structlog.BoundLogger):
        self.logger = logger
        self.api_key = ELEVENLABS_API_KEY
        self.base_url = "https://api.elevenlabs.io/v1/text-to-speech/"

    def speak(self, text: str, lang: str = None, voice_id: str = COMEDIAN1_VOICE_ID) -> bytes:
        self.logger.info(f"TTS request to ElevenLabs: voice_id={voice_id}, text_length={len(text)}")

        url = f"{self.base_url}{voice_id}"
        headers = {"xi-api-key": self.api_key, "Content-Type": "application/json"}
        data = {"text": text, "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}}

        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            self.logger.info(f"ElevenLabs TTS successful: {len(response.content)} bytes")
            return response.content
        except requests.exceptions.RequestException as e:
            self.logger.error(f"ElevenLabs TTS failed: {str(e)}")
            raise
