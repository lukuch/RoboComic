"""ComedianAgent class for RoboComic backend."""

import injector
import structlog
from autogen import ConversableAgent

from config import settings
from models import Language


class ComedianAgent:
    @injector.inject
    def __init__(self, logger: structlog.BoundLogger):
        self.logger = logger
        self.name = None
        self.persona = None
        self.style = None
        self.agent = None

    def _setup_agent(self, persona: dict, display_name: str, lang: str = Language.ENGLISH, temperature: float = None) -> None:
        """Setup the agent with specific persona and language"""
        self.name = display_name
        self.persona = persona
        self.style = persona.get("style", persona.get("name", "unknown"))
        description = persona.get("description_pl") if lang == Language.POLISH else persona.get("description")

        temp = temperature if temperature is not None else settings.DEFAULT_TEMPERATURE

        llm_config = {
            "config_list": [{"model": settings.LLM_MODEL, "api_key": settings.OPENAI_API_KEY}],
            "temperature": temp,
        }

        self.agent = ConversableAgent(
            name=display_name,
            system_message=f"You are {display_name}, a {self.style} comedian. {description}",
            llm_config=llm_config,
            human_input_mode="NEVER",
        )

        self.logger.debug(f"Created ComedianAgent: {display_name} with style {self.style}, temperature: {temp}")
