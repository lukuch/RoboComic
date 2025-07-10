"""LLM utility functions for RoboComic backend."""

import re

import injector
import structlog
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_openai import ChatOpenAI

from config import settings
from models import Language
from services.prompt_templates import COMEDIANIFY_PROMPT, JUDGING_PROMPT, RESPONSE_SCHEMA_DESCRIPTIONS, TOPIC_CONTEXT_PROMPT
from utils.resilience import ResilienceService


class LLMService:
    @injector.inject
    def __init__(self, logger: structlog.BoundLogger, resilience_service: ResilienceService):
        self.logger = logger
        self.resilience_service = resilience_service

    def _create_llm(self, temperature=None):
        return ChatOpenAI(
            openai_api_key=settings.OPENAI_API_KEY,
            model=settings.LLM_MODEL,
            temperature=temperature if temperature is not None else settings.DEFAULT_TEMPERATURE,
        )

    def generate_topic_context(self, topic: str, lang: str = Language.ENGLISH) -> str:
        if not topic:
            return ""

        @self.resilience_service.resilient_llm_call()
        def _generate_context():
            prompt = ChatPromptTemplate.from_template(TOPIC_CONTEXT_PROMPT[lang])
            llm = self._create_llm()
            chain = RunnablePassthrough() | prompt | llm | RunnableLambda(lambda x: x.content)
            response = chain.invoke({"topic": topic})
            context = response.strip()
            context = re.sub(r"(?<!\d)\. ", ".\n", context)
            return f"\n{context}\n"

        try:
            return _generate_context()
        except Exception as e:
            self.logger.error(f"Error generating topic context: {e}")
            return ""

    def comedianify_text(self, text: str, gender: str = "MAN", lang: str = Language.ENGLISH) -> str:
        if not text:
            return ""

        @self.resilience_service.resilient_llm_call()
        def _comedianify():
            prompt = ChatPromptTemplate.from_template(COMEDIANIFY_PROMPT[lang])
            llm = self._create_llm()
            chain = RunnablePassthrough() | prompt | llm | RunnableLambda(lambda x: x.content)
            response = chain.invoke({"text": text, "gender": gender})
            return response.strip()

        try:
            return _comedianify()
        except Exception as e:
            self.logger.error(f"Error comedianifying text: {e}")
            return text

    def judge_show(
        self, comedian1_name: str, comedian2_name: str, history: list, lang: str = Language.ENGLISH
    ) -> tuple[str, str]:
        history_text = "\n".join(
            [f"{msg['role']}: {msg['content']}" if isinstance(msg, dict) else f"{msg.role}: {msg.content}" for msg in history]
        )
        descriptions = RESPONSE_SCHEMA_DESCRIPTIONS.get(lang, RESPONSE_SCHEMA_DESCRIPTIONS["en"])
        response_schemas = [
            ResponseSchema(name="winner", description=descriptions["winner"]),
            ResponseSchema(name="summary", description=descriptions["summary"]),
        ]
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = output_parser.get_format_instructions()
        prompt = ChatPromptTemplate.from_template(JUDGING_PROMPT[lang])
        llm = self._create_llm()
        chain = (
            RunnablePassthrough.assign(
                format_instructions=lambda _: format_instructions,
                history_text=lambda _: history_text,
            )
            | prompt
            | llm
            | RunnableLambda(lambda x: x.content)
            | output_parser
        )

        @self.resilience_service.resilient_llm_call()
        def _judge():
            result = chain.invoke(
                {
                    "comedian1_name": comedian1_name,
                    "comedian2_name": comedian2_name,
                }
            )
            return result["winner"], result["summary"]

        try:
            return _judge()
        except Exception as e:
            self.logger.error(f"Error judging show: {e}")
            return comedian1_name, f"{comedian1_name} wins by default (LLM error)."
