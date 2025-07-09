from typing import Tuple, Union

import injector
import numpy as np
import requests
import structlog

from models import ChatMessage, GenerateShowRequest, GenerateShowResponse, TTSRequest
from services.agent_manager import AgentManager
from services.llm_service import LLMService
from tts.tts_service import TTSService
from utils import APIException, TTSServiceException


class ApiService:
    @injector.inject
    def __init__(
        self, agent_manager: AgentManager, tts_service: TTSService, logger: structlog.BoundLogger, llm_service: LLMService
    ):
        self.agent_manager = agent_manager
        self.tts_service = tts_service
        self.logger = logger
        self.llm_service = llm_service

    def generate_show(self, request: GenerateShowRequest) -> GenerateShowResponse:
        self.logger.info(
            f"Generating show: {request.comedian1_style} vs {request.comedian2_style}, mode={request.mode}, rounds={request.num_rounds}, temperature={request.temperature}"
        )
        try:
            self.agent_manager.set_personas(request.comedian1_style, request.comedian2_style, lang=request.lang)
            context = ""
            if request.build_context and request.topic.strip():
                self.logger.info(f"Generating topic context for: {request.topic}")
                context = self.llm_service.generate_topic_context(request.topic, request.lang)
            self.logger.info(f"Starting comedy duel with {request.num_rounds} rounds")
            history = self.agent_manager.run_duel(
                request.mode,
                request.topic,
                max_rounds=request.num_rounds,
                lang=request.lang,
                context=context,
                temperature=request.temperature,
            )
            chat_messages = [ChatMessage(role=msg["role"], content=msg["content"]) for msg in history]
            self.logger.info(f"Successfully generated show with {len(chat_messages)} messages")
            return GenerateShowResponse(history=chat_messages)
        except Exception as e:
            self.logger.error(f"Failed to generate show: {str(e)}", exc_info=True)
            raise APIException(
                message="Failed to generate comedy show",
                status_code=500,
                error_code="SHOW_GENERATION_FAILED",
                details={"original_error": str(e)},
            )

    def tts(self, request: TTSRequest) -> Union[bytes, Tuple[np.ndarray, int]]:
        self.logger.info(f"TTS request: {len(request.text)} characters, lang={request.lang}, voice_id={request.voice_id}")
        try:
            audio_result = self.tts_service.speak(request.text, lang=request.lang, voice_id=request.voice_id)
            return audio_result
        except requests.exceptions.HTTPError as e:
            if e.response is not None and e.response.status_code == 401:
                self.logger.error("TTS service unavailable: out of credits or invalid API key.")
                raise TTSServiceException(
                    message="TTS service unavailable: out of credits or invalid API key.",
                    error_code="TTS_CREDITS_EXCEEDED",
                    details={"original_error": str(e)},
                )
            self.logger.error(f"TTS generation failed: {str(e)}", exc_info=True)
            raise TTSServiceException(
                message="Failed to generate audio", error_code="TTS_GENERATION_FAILED", details={"original_error": str(e)}
            )
        except Exception as e:
            self.logger.error(f"TTS generation failed: {str(e)}", exc_info=True)
            raise TTSServiceException(
                message="Failed to generate audio", error_code="TTS_GENERATION_FAILED", details={"original_error": str(e)}
            )
