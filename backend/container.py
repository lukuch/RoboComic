import injector
import structlog

from services.agent_manager import AgentManager
from services.api_service import ApiService
from tts.eleven_tts_service import ElevenTTSService
from tts.tts_service import TTSService
from utils.logger import setup_logger
from utils.resilience import ResilienceService


class AppContainer(injector.Module):
    def configure(self, binder: injector.Binder) -> None:
        # Set up and bind logger
        logger = setup_logger("robocomic")
        binder.bind(structlog.BoundLogger, to=logger, scope=injector.SingletonScope)

        # Bind services
        binder.bind(AgentManager, to=AgentManager, scope=injector.NoScope)
        binder.bind(TTSService, to=ElevenTTSService, scope=injector.SingletonScope)
        binder.bind(ApiService, to=ApiService, scope=injector.SingletonScope)
        binder.bind(ResilienceService, to=ResilienceService, scope=injector.SingletonScope)

        # Only bind UIService if streamlit is available (for local development)
        try:
            from ui.streamlit_ui import UIService

            binder.bind(UIService, to=UIService, scope=injector.SingletonScope)
        except ImportError:
            # Streamlit not available, skip UIService binding
            pass


container = injector.Injector([AppContainer()])
