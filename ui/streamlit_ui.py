import streamlit as st
from config.personas import COMEDIAN_PERSONAS
from config import settings
from config.translations import TRANSLATIONS
import re
import openai

def clean_response(role, content):
    pattern = rf"^{re.escape(role)}\s*:\s*"
    return re.sub(pattern, "", content, flags=re.IGNORECASE)

def generate_topic_context_llm(topic, lang):
    if not topic:
        return ""
    if lang == "pl":
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
            max_tokens=1000,
            temperature=0.8,
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return ""

def remove_bracketed_actions(text):
    # Remove [bracketed] or (bracketed) actions, e.g. [Laughter], [Śmiech], (applause)
    return re.sub(r"[\[(][^\])\]]+[\])\]]", "", text).strip()

def run_ui(agent_manager, tts_service):
    lang = st.selectbox("Language / Język", ["en", "pl"], index=1)
    t = TRANSLATIONS[lang]
    st.title(t["title"])
    persona_options = list(COMEDIAN_PERSONAS.keys())
    comedian1_style = st.selectbox(t["comedian1_style"], persona_options, index=persona_options.index("relatable"))
    comedian2_style = st.selectbox(t["comedian2_style"], persona_options, index=persona_options.index("relatable"))
    topic = st.text_input(t["topic"])
    num_rounds = st.number_input(t["num_rounds"], min_value=1, max_value=10, value=2, step=1)
    roast_mode = st.checkbox(t["roast_mode"])
    voice_mode = st.checkbox(t["voice_mode"])

    if st.button(t["start_show"]):
        agent_manager.set_personas(comedian1_style, comedian2_style, lang=lang)
        mode = "roast" if roast_mode else "topical"
        for k in list(st.session_state.keys()):
            if k.startswith("audio_"):
                del st.session_state[k]
        context = generate_topic_context_llm(topic, lang) if mode == "topical" else ""
        history = agent_manager.run_duel(mode, topic, max_rounds=num_rounds, lang=lang, context=context)
        for msg in history:
            msg["content"] = clean_response(msg["role"], msg["content"])
        st.session_state["history"] = history

    history = st.session_state.get("history", [])
    role_to_voice = {
        agent_manager.comedian1.agent.name: settings.COMEDIAN1_VOICE_ID,
        agent_manager.comedian2.agent.name: settings.COMEDIAN2_VOICE_ID,
        agent_manager.audience1.agent.name: settings.AUDIENCE_VOICE_ID,
        agent_manager.audience2.agent.name: settings.AUDIENCE_VOICE_ID,
    }
    for i, msg in enumerate(history):
        if msg["role"].lower() in {"chat_manager", "manager", "system"}:
            continue
        if msg["role"] in ["Audience_1", "Audience_2"]:
            display_role = t["audience"]
        elif msg["role"] == "Comedian_1":
            display_role = t["comedian1"]
        elif msg["role"] == "Comedian_2":
            display_role = t["comedian2"]
        else:
            display_role = msg["role"].replace("_", " ")
        content = clean_response(msg["role"], msg["content"])
        # Remove bracketed actions for comedians only
        if msg["role"] in ["Comedian_1", "Comedian_2"]:
            content = remove_bracketed_actions(content)
        st.markdown(f"**{display_role}**: {content}")
        if voice_mode and msg['role'] in [agent_manager.comedian1.agent.name, agent_manager.comedian2.agent.name]:
            play_key = f"play_tts_{i}"
            audio_key = f"audio_{i}"
            if st.button(f"{t['play_tts']} {i}", key=play_key):
                audio_bytes = tts_service.speak(content, role_to_voice[msg['role']])
                st.session_state[audio_key] = audio_bytes
            if audio_key in st.session_state:
                st.audio(st.session_state[audio_key], format="audio/wav")
