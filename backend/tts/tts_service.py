from abc import ABC, abstractmethod

class TTSService(ABC):
    @abstractmethod
    def speak(self, text, lang="en"):
        pass 