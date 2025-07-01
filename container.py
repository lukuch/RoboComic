import injector
from agents.comedian_agent import ComedianAgent
from agents.audience_agent import AudienceAgent
from services.agent_manager import AgentManager
from tts.eleven_tts_service import ElevenTTSService

class AppContainer(injector.Module):
    def configure(self, binder: injector.Binder) -> None:
        binder.bind(ComedianAgent, to=ComedianAgent)
        binder.bind(AudienceAgent, to=AudienceAgent)
        binder.bind(AgentManager, to=AgentManager)
        binder.bind(ElevenTTSService, to=ElevenTTSService)

container = injector.Injector([AppContainer()])
