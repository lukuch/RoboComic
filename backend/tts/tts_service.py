from abc import ABC, abstractmethod
from typing import Tuple, Union

import numpy as np

from models import Language


class TTSService(ABC):
    @abstractmethod
    def speak(self, text: str, lang: str = Language.ENGLISH) -> Union[bytes, Tuple[np.ndarray, int]]:
        """Convert text to speech audio.

        Args:
            text: Text to convert to speech
            lang: Language code (e.g., 'en', 'pl')

        Returns:
            Audio data as bytes (ElevenLabs) or tuple of (audio_array, sample_rate) (Bark)
        """
