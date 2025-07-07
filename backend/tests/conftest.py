import pytest
from unittest.mock import patch

# Patch OpenAI LLM generation
@pytest.fixture(autouse=True)
def mock_llm(monkeypatch):
    monkeypatch.setattr(
        "services.llm_utils.generate_comedy_show",
        lambda *args, **kwargs: "This is a mock comedy show."
    )
    yield

# Patch ElevenLabs TTS (and optionally Bark TTS)
@pytest.fixture(autouse=True)
def mock_tts(monkeypatch):
    monkeypatch.setattr(
        "tts.eleven_tts_service.generate_elevenlabs_tts",
        lambda *args, **kwargs: b"FAKE_WAV_DATA"
    )
    monkeypatch.setattr(
        "tts.bark_tts_service.generate_bark_tts",
        lambda *args, **kwargs: (b"FAKE_WAV_DATA", 22050)
    )
    yield 