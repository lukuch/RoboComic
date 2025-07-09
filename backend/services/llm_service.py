"""LLM utility functions for RoboComic backend."""

import re

from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_openai import ChatOpenAI

from config import settings
from models import Language
from services.prompt_templates import COMEDIANIFY_PROMPT, JUDGING_PROMPT, RESPONSE_SCHEMA_DESCRIPTIONS, TOPIC_CONTEXT_PROMPT
from utils.logger import get_logger

logger = get_logger(__name__)


class LLMService:
    def __init__(self):
        self.llm = ChatOpenAI(
            openai_api_key=settings.OPENAI_API_KEY,
            model=settings.LLM_MODEL,
            temperature=settings.DEFAULT_TEMPERATURE,
        )

    def generate_topic_context(self, topic: str, lang: str = Language.ENGLISH) -> str:
        if not topic:
            return ""
        prompt = ChatPromptTemplate.from_template(TOPIC_CONTEXT_PROMPT[lang])
        chain = RunnablePassthrough() | prompt | self.llm | RunnableLambda(lambda x: x.content)
        try:
            response = chain.invoke({"topic": topic})
            context = response.strip()
            context = re.sub(r"(?<!\d)\. ", ".\n", context)
            return f"\n{context}\n"
        except Exception as e:
            logger.error(f"Error generating topic context: {e}")
            return ""

    def comedianify_text(self, text: str, gender: str = "MAN", lang: str = Language.ENGLISH) -> str:
        if not text:
            return ""
        prompt = ChatPromptTemplate.from_template(COMEDIANIFY_PROMPT[lang])
        chain = RunnablePassthrough() | prompt | self.llm | RunnableLambda(lambda x: x.content)
        try:
            response = chain.invoke({"text": text, "gender": gender})
            return response.strip()
        except Exception as e:
            logger.error(f"Error comedianifying text: {e}")
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
        chain = (
            RunnablePassthrough.assign(
                format_instructions=lambda _: format_instructions,
                history_text=lambda _: history_text,
            )
            | prompt
            | self.llm
            | RunnableLambda(lambda x: x.content)
            | output_parser
        )
        try:
            result = chain.invoke(
                {
                    "comedian1_name": comedian1_name,
                    "comedian2_name": comedian2_name,
                }
            )
            return result["winner"], result["summary"]
        except Exception as e:
            logger.error(f"Error judging show: {e}")
            return comedian1_name, f"{comedian1_name} wins by default (LLM error)."
