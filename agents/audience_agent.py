from config.personas import AUDIENCE_PERSONAS
from config import settings
from autogen import ConversableAgent

class AudienceAgent:
    def __init__(self, persona_key: str = "audience1", display_name: str = "Audience", lang: str = "en"):
        self.name = display_name
        self.persona = AUDIENCE_PERSONAS[persona_key]
        self.style = self.persona["style"]

        if lang == "pl":
            description = self.persona.get("description_pl", self.persona["description"])
        else:
            description = self.persona["description"]
        self.agent = ConversableAgent(
            name=display_name,
            system_message=f"You are the audience. {description}",
            llm_config={
                "config_list": [
                    {"model": settings.LLM_MODEL, "api_key": settings.OPENAI_API_KEY}
                ],
                "temperature": 0.9,
                "max_tokens": 20
            },
            human_input_mode="NEVER"
        )
