"""LLM utility functions for RoboComic backend."""

import re

import openai

from config import settings
from models import Language
from utils.logger import get_logger

logger = get_logger(__name__)


def generate_topic_context_llm(topic: str, lang: str = Language.ENGLISH) -> str:
    """Generate a list of anecdotes or facts about the topic using LLM."""
    if not topic:
        return ""
    if lang == Language.POLISH:
        prompt = (
            f"Wypisz dokładnie 10 najsłynniejszych, powszechnie znanych, prawdziwych anegdot, ciekawostek lub śmiesznych momentów związanych z tematem: '{topic}'. "
            "Podaj wyłącznie listę, bez żadnych wstępnych ani końcowych zdań. Każdy punkt powinien być krótki i konkretny. Opieraj się wyłącznie na faktach, wydarzeniach i sytuacjach, które naprawdę miały miejsce lub są powszechnie znane. Nie wymyślaj informacji. Odpowiedź po polsku."
        )
    else:
        prompt = (
            f"List exactly 10 best-known, widely recognized, true anecdotes, interesting facts, or funny moments about the topic: '{topic}'. "
            "Return only the list, with no introductory or closing sentences. Each item should be short and specific. Base your answer only on facts, events, and situations that really happened or are widely known. Do not invent or make up information. Answer in English."
        )
    try:
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=settings.DEFAULT_MAX_TOKENS,
            temperature=settings.DEFAULT_TEMPERATURE,
        )
        context = response.choices[0].message.content.strip()
        context = re.sub(r"(?<!\d)\. ", ".\n", context)
        return f"\n{context}\n"
    except Exception as e:
        logger.error(f"Error generating topic context: {e}")
        return ""


def comedianify_text_llm(text: str, gender: str = "MAN", lang: str = Language.ENGLISH) -> str:
    """Use OpenAI LLM to rewrite text as a standup comedian performance with Bark-compatible stage effects, in the specified language."""
    if not text:
        return ""
    if lang == Language.POLISH:
        prompt = (
            f"Przepisz poniższy tekst tak, jakby był wykonywany przez stand-upowego komika na scenie. "
            f"Dodaj didaskalia i efekty sceniczne używając tych tagów: [laughs], [laughter], [sighs], [gasps], [clears throat], —, ..., DUŻE LITERY dla podkreślenia oraz [{gender}] na początku. "
            f"Używaj wyłącznie powyższych tagów i efektów. Nie wymyślaj ani nie dodawaj innych didaskaliów, tagów ani efektów. "
            f"Spraw, aby brzmiał żywo i naturalnie dla publiczności klubu komediowego. "
            f"Tekst: {text}"
        )
    else:
        prompt = (
            f"Rewrite the following text as if performed by a standup comedian on stage. "
            f"Add stage directions and effects using these tags: [laughs], [laughter], [sighs], [gasps], [clears throat], —, ..., CAPITALIZATION for emphasis, and [{gender}] at the start. "
            f"Only use the tags and effects listed above. Do not invent or add any other stage directions, tags, or effects. "
            f"Make it sound lively and natural for a comedy club audience. "
            f"Text: {text}"
        )
    try:
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=settings.DEFAULT_MAX_TOKENS,
            temperature=settings.DEFAULT_TEMPERATURE,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error comedianifying text: {e}")
        return text
