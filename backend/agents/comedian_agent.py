"""ComedianAgent class for RoboComic backend."""

import injector
import structlog
from autogen import ConversableAgent

from config import settings
from config.personas import COMEDIAN_PERSONAS
from models import Language


class ComedianAgent:
    @injector.inject
    def __init__(self, logger: structlog.BoundLogger):
        self.logger = logger
        self.name = None
        self.persona = None
        self.style = None
        self.agent = None

    def _setup_agent(
        self, persona_key: str, display_name: str, lang: str = Language.ENGLISH, temperature: float = None
    ) -> None:
        """Setup the agent with specific persona and language"""
        self.name = display_name
        self.persona = COMEDIAN_PERSONAS[persona_key]
        self.style = self.persona["style"]

        description = self.persona["description_pl"] if lang == Language.POLISH else self.persona["description"]

        temp = temperature if temperature is not None else settings.DEFAULT_TEMPERATURE

        self.agent = ConversableAgent(
            name=display_name,
            system_message=f"You are {display_name}, a {self.style} comedian. {description}",
            llm_config={
                "config_list": [{"model": settings.LLM_MODEL, "api_key": settings.OPENAI_API_KEY}],
                "temperature": temp,
            },
            human_input_mode="NEVER",
        )

        self.logger.debug(f"Created ComedianAgent: {display_name} with style {self.style}, temperature: {temp}")
