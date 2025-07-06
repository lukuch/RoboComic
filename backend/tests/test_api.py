import pytest
from fastapi.testclient import TestClient
from main import app
from models import Mode, Language

client = TestClient(app)

def test_generate_show():
    response = client.post(
        "/generate-show",
        json={
            "comedian1_style": "relatable",
            "comedian2_style": "absurd",
            "lang": Language.ENGLISH,
            "mode": Mode.TOPICAL,
            "topic": "airplanes",
            "num_rounds": 1
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "history" in data
    assert isinstance(data["history"], list)
    assert len(data["history"]) > 0

def test_tts():
    response = client.post(
        "/tts",
        json={
            "text": "This is a test of the RoboComic TTS system.",
            "lang": Language.ENGLISH
        }
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/wav"
    assert len(response.content) > 1000  # Should be non-trivial audio data 