from agents.comedian_agent import ComedianAgent
from services.prompt_templates import COMEDIAN_PROMPT_TEMPLATE
from autogen import GroupChat, GroupChatManager
from config import settings

class AgentManager:
    def __init__(self, comedian1_key="sarcastic", comedian2_key="absurd", lang="en"):
        self.comedian1_key = comedian1_key
        self.comedian2_key = comedian2_key
        self.lang = lang
        self.reset_agents()
        self.history = []

    def reset_agents(self):
        self.comedian1 = ComedianAgent(self.comedian1_key, display_name="Comedian_1", lang=self.lang)
        self.comedian2 = ComedianAgent(self.comedian2_key, display_name="Comedian_2", lang=self.lang)

    def set_personas(self, comedian1_key, comedian2_key, lang=None):
        self.comedian1_key = comedian1_key
        self.comedian2_key = comedian2_key
        if lang is not None:
            self.lang = lang
        self.reset_agents()

    def run_duel(self, mode: str, topic: str = None, max_rounds: int = 2, lang: str = "en", context: str = ""):
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
        return self.history
