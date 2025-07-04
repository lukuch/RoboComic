import requests
from config.settings import ELEVENLABS_API_KEY, COMEDIAN1_VOICE_ID, COMEDIAN2_VOICE_ID
from .tts_service import TTSService

class ElevenTTSService(TTSService):
    def __init__(self):
        self.api_key = ELEVENLABS_API_KEY
        self.base_url = "https://api.elevenlabs.io/v1/text-to-speech/"
        self.voice_ids = [COMEDIAN1_VOICE_ID, COMEDIAN2_VOICE_ID]
        self.voice_index = 0

    def speak(self, text, lang=None):
        voice_id = self.voice_ids[self.voice_index]
        self.voice_index = (self.voice_index + 1) % len(self.voice_ids)
        url = f"{self.base_url}{voice_id}"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        data = {
            "text": text,
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
        }
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.content
