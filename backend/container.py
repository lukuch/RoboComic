import injector
import structlog
from agents.comedian_agent import ComedianAgent
from services.agent_manager import AgentManager
from tts.tts_service import TTSService
from tts.eleven_tts_service import ElevenTTSService
from tts.bark_tts_service import BarkTTSService
from utils.logger import setup_logger

class AppContainer(injector.Module):
    def configure(self, binder: injector.Binder) -> None:
        # Set up and bind logger
        logger = setup_logger("robocomic")
        binder.bind(structlog.BoundLogger, to=logger, scope=injector.SingletonScope)
        
        # Bind services
        binder.bind(ComedianAgent, to=ComedianAgent)
        binder.bind(AgentManager, to=AgentManager, scope=injector.SingletonScope)
        binder.bind(TTSService, to=ElevenTTSService, scope=injector.SingletonScope)

container = injector.Injector([AppContainer()])