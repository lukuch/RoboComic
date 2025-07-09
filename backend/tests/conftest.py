import os
from unittest.mock import MagicMock

import pytest


# Patch generate_topic_context_llm (used for context generation)
@pytest.fixture(autouse=True)
def mock_llm(monkeypatch):
    monkeypatch.setattr(
        "services.llm_service.LLMService.generate_topic_context", lambda *args, **kwargs: "This is a mock topic context."
    )
    # Patch GroupChatManager.initiate_chat to return a mock chat result
    from autogen import GroupChatManager

    mock_chat_result = MagicMock()
    mock_chat_result.chat_history = [{"role": "comedian1", "content": "Joke 1"}, {"role": "comedian2", "content": "Joke 2"}]
    monkeypatch.setattr(GroupChatManager, "initiate_chat", lambda self, *a, **kw: mock_chat_result)
    yield


# Patch TTSService implementations' speak methods
@pytest.fixture(autouse=True)
def mock_tts(monkeypatch):
    monkeypatch.setattr("tts.eleven_tts_service.ElevenTTSService.speak", lambda self, *args, **kwargs: b"FAKE_WAV_DATA")
    monkeypatch.setattr("tts.bark_tts_service.BarkTTSService.speak", lambda self, *args, **kwargs: (b"FAKE_WAV_DATA", 22050))
    yield


@pytest.fixture(autouse=True)
def fail_on_real_api_keys():
    # Fail if real API keys are set (not dummy or test values)
    openai_key = os.environ.get("OPENAI_API_KEY", "").lower()
    elevenlabs_key = os.environ.get("ELEVENLABS_API_KEY", "").lower()
    if openai_key and openai_key not in ["dummy", "test", "", None]:
        pytest.fail("Real OPENAI_API_KEY detected in test environment! Use a dummy value.")
    if elevenlabs_key and elevenlabs_key not in ["dummy", "test", "", None]:
        pytest.fail("Real ELEVENLABS_API_KEY detected in test environment! Use a dummy value.")
