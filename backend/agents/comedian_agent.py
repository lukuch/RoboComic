from config.personas import COMEDIAN_PERSONAS
from config import settings
from autogen import ConversableAgent

class ComedianAgent:
    def __init__(self, persona_key: str = "simple", display_name: str = "Comedian", lang: str = "en"):
        self.name = display_name
        self.persona = COMEDIAN_PERSONAS[persona_key]
        self.style = self.persona["style"]
        
        if lang == "pl":
            description = self.persona.get("description_pl", self.persona["description"])
        else:
            description = self.persona["description"]
        self.agent = ConversableAgent(
            name=display_name,
            system_message=f"You are {display_name}, a {self.style} comedian. {description}",
            llm_config={
                "config_list": [
                    {"model": settings.LLM_MODEL, "api_key": settings.OPENAI_API_KEY}
                ],
                "temperature": 0.9
            },
            human_input_mode="NEVER"
        )
