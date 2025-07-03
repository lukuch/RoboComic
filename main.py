from container import container
from services.agent_manager import AgentManager
from tts.tts_service import TTSService
from ui.streamlit_ui import run_ui

def main():
    agent_manager = container.get(AgentManager)
    tts_service = container.get(TTSService)
    run_ui(agent_manager, tts_service)

if __name__ == "__main__":
    main()
