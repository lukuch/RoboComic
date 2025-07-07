import injector
import structlog
from agents.comedian_agent import ComedianAgent
from services.agent_manager import AgentManager
from tts.tts_service import TTSService
from tts.eleven_tts_service import ElevenTTSService
from utils.logger import setup_logger
from services.api_service import ApiService


class AppContainer(injector.Module):
    def configure(self, binder: injector.Binder) -> None:
        # Set up and bind logger
        logger = setup_logger("robocomic")
        binder.bind(structlog.BoundLogger, to=logger, scope=injector.SingletonScope)

        # Bind services
        binder.bind(ComedianAgent, to=ComedianAgent, scope=injector.SingletonScope)
        binder.bind(AgentManager, to=AgentManager, scope=injector.SingletonScope)
        binder.bind(TTSService, to=ElevenTTSService, scope=injector.SingletonScope)
        binder.bind(ApiService, to=ApiService, scope=injector.SingletonScope)

        # Only bind UIService if streamlit is available (for local development)
        try:
            from ui.streamlit_ui import UIService

            binder.bind(UIService, to=UIService, scope=injector.SingletonScope)
        except ImportError:
            # Streamlit not available, skip UIService binding
            pass


container = injector.Injector([AppContainer()])
