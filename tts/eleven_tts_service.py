import requests
from config.settings import ELEVENLABS_API_KEY

class ElevenTTSService:
    def __init__(self):
        self.api_key = ELEVENLABS_API_KEY
        self.base_url = "https://api.elevenlabs.io/v1/text-to-speech/"

    def speak(self, text: str, voice_id: str) -> bytes:
        url = f"{self.base_url}{voice_id}"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "text": text,
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
        }
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.content
