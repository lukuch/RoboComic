"""AgentManager service for RoboComic backend."""

import injector
import structlog
from autogen import GroupChat, GroupChatManager
from langsmith import traceable

from agents.comedian_agent import ComedianAgent
from config import settings
from models import Language, Mode
from services.prompt_templates import COMEDIAN_PROMPT_TEMPLATE
from utils.resilience import ResilienceService


class AgentManager:
    @injector.inject
    def __init__(
        self,
        logger: structlog.BoundLogger,
        resilience_service: ResilienceService,
        comedian1_key="sarcastic",
        comedian2_key="absurd",
        lang="en",
    ):
        self.logger = logger
        self.resilience_service = resilience_service
        self.comedian1_key = comedian1_key
        self.comedian2_key = comedian2_key
        self.lang = lang
        self.reset_agents()
        self.history = []

    def reset_agents(self, temperature: float = None) -> None:
        self.logger.debug(f"Resetting agents: {self.comedian1_key} and {self.comedian2_key}")
        # Instantiate new ComedianAgent objects directly to avoid singleton issue
        self.comedian1 = ComedianAgent(self.logger)
        self.comedian1._setup_agent(self.comedian1_key, "Comedian_1", self.lang, temperature)
        self.comedian2 = ComedianAgent(self.logger)
        self.comedian2._setup_agent(self.comedian2_key, "Comedian_2", self.lang, temperature)

    def set_personas(self, comedian1_key: str, comedian2_key: str, lang: str = None) -> None:
        self.logger.info(f"Setting personas: {comedian1_key} vs {comedian2_key}, lang={lang or self.lang}")
        self.comedian1_key = comedian1_key
        self.comedian2_key = comedian2_key
        if lang is not None:
            self.lang = lang
        self.reset_agents()

    def _format_initial_prompt(self, mode, topic, lang, context):
        if mode == Mode.TOPICAL:
            if context and context.strip():
                return COMEDIAN_PROMPT_TEMPLATE[lang]["topical_with_context"].format(
                    name=self.comedian1.name,
                    style=self.comedian1.style,
                    topic=topic or ("anything" if lang == Language.ENGLISH else "cokolwiek"),
                    context=context,
                )
            else:
                return COMEDIAN_PROMPT_TEMPLATE[lang]["topical_without_context"].format(
                    name=self.comedian1.name,
                    style=self.comedian1.style,
                    topic=topic or ("anything" if lang == Language.ENGLISH else "cokolwiek"),
                )
        else:
            return COMEDIAN_PROMPT_TEMPLATE[lang][mode].format(
                name=self.comedian1.name,
                style=self.comedian1.style,
                topic=topic or ("anything" if lang == Language.ENGLISH else "cokolwiek"),
            )

    def run_duel(
        self, mode: str, topic: str = None, max_rounds: int = 2, lang: str = "en", context: str = "", temperature: float = None
    ) -> list:
        self.logger.info(
            f"Starting duel: mode={mode}, topic={topic}, max_rounds={max_rounds}, lang={lang}, temperature={temperature}"
        )
        self.reset_agents(temperature)
        agents = [
            self.comedian1.agent,
            self.comedian2.agent,
        ]
        initial_prompt = self._format_initial_prompt(mode, topic, lang, context)
        group_chat = GroupChat(agents=agents, messages=[], max_round=max_rounds * 4, speaker_selection_method="round_robin")

        manager = GroupChatManager(
            groupchat=group_chat,
            llm_config={"config_list": [{"model": settings.LLM_MODEL, "api_key": settings.OPENAI_API_KEY}]},
        )

        # Use resilience at conversation level with better error handling
        @traceable
        @self.resilience_service.resilient_llm_call()
        def _run_chat():
            chat_result = manager.initiate_chat(
                self.comedian1.agent, message=initial_prompt, max_turns=max_rounds * 4, summary_method="last_msg"
            )
            duel_history = []
            for msg in chat_result.chat_history:
                role = msg.get("name") or msg.get("role")
                content = msg["content"]
                duel_history.append({"role": role, "content": content})
            return duel_history

        try:
            self.history = _run_chat()
            self.logger.info(f"Duel completed: {len(self.history)} messages generated")
            return self.history
        except Exception as e:
            self.logger.error(f"Error running duel after retries: {e}")
            # Return a minimal conversation to prevent frontend issues
            return [
                {"role": "system", "content": "Conversation failed to generate properly."},
                {"role": "Comedian_1", "content": "Sorry, I'm having technical difficulties right now."},
                {"role": "Comedian_2", "content": "Yeah, let's try again later!"},
            ]
