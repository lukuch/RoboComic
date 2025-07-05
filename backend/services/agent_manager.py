"""AgentManager service for RoboComic backend."""

import injector
import structlog
from agents.comedian_agent import ComedianAgent
from services.prompt_templates import COMEDIAN_PROMPT_TEMPLATE
from autogen import GroupChat, GroupChatManager
from config import settings

class AgentManager:
    @injector.inject
    def __init__(self, logger: structlog.BoundLogger, comedian1_key="sarcastic", comedian2_key="absurd", lang="en"):
        self.logger = logger
        self.comedian1_key = comedian1_key
        self.comedian2_key = comedian2_key
        self.lang = lang
        self.reset_agents()
        self.history = []

    def reset_agents(self) -> None:
        self.logger.debug(f"Resetting agents: {self.comedian1_key} and {self.comedian2_key}")
        # Create agents through the container to get proper dependency injection
        from container import container
        self.comedian1 = container.get(ComedianAgent)
        self.comedian1._setup_agent(self.comedian1_key, "Comedian_1", self.lang)
        self.comedian2 = container.get(ComedianAgent)
        self.comedian2._setup_agent(self.comedian2_key, "Comedian_2", self.lang)

    def set_personas(self, comedian1_key: str, comedian2_key: str, lang: str = None) -> None:
        self.logger.info(f"Setting personas: {comedian1_key} vs {comedian2_key}, lang={lang or self.lang}")
        self.comedian1_key = comedian1_key
        self.comedian2_key = comedian2_key
        if lang is not None:
            self.lang = lang
        self.reset_agents()

    def run_duel(self, mode: str, topic: str = None, max_rounds: int = 2, lang: str = "en", context: str = "") -> list:
        self.logger.info(f"Starting duel: mode={mode}, topic={topic}, max_rounds={max_rounds}, lang={lang}")
        self.reset_agents()
        agents = [
            self.comedian1.agent,
            self.comedian2.agent,
        ]
        if mode == "topical":
            initial_prompt = COMEDIAN_PROMPT_TEMPLATE[lang][mode].format(
                name=self.comedian1.name, style=self.comedian1.style, topic=topic or ("anything" if lang == "en" else "cokolwiek"), context=context or ""
            )
        else:
            initial_prompt = COMEDIAN_PROMPT_TEMPLATE[lang][mode].format(
                name=self.comedian1.name, style=self.comedian1.style, topic=topic or ("anything" if lang == "en" else "cokolwiek")
            )
        group_chat = GroupChat(
            agents=agents,
            messages=[],
            max_round=max_rounds * 4,
            speaker_selection_method="round_robin"
        )
        manager = GroupChatManager(
            groupchat=group_chat,
            llm_config={
                "config_list": [
                    {
                        "model": settings.LLM_MODEL,
                        "api_key": settings.OPENAI_API_KEY
                    }
                ]
            }
        )
        chat_result = manager.initiate_chat(
            self.comedian1.agent,
            message=initial_prompt,
            max_turns=max_rounds * 4,
            summary_method="last_msg"
        )
        duel_history = []
        for msg in chat_result.chat_history:
            role = msg.get("name") or msg.get("role")
            content = msg["content"]
            duel_history.append({"role": role, "content": content})
        self.history = duel_history
        self.logger.info(f"Duel completed: {len(duel_history)} messages generated")
        return self.history
