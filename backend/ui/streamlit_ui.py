import streamlit as st
from config.personas import COMEDIAN_PERSONAS
from config import settings
from config.translations import TRANSLATIONS
import re
from services.llm_utils import generate_topic_context_llm

def clean_response(_, content):
    """
    Remove any leading non-sentence junk (role labels, numbers, colons, dashes, etc.)
    and strip leading/trailing quotes from the main message text.
    """
    # Remove everything up to and including the first colon, dash, or similar separator
    cleaned = re.sub(r'^(?:[A-Za-zĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż0-9 _-]{2,20})[:\-–—]\s*', '', content)
    cleaned = cleaned.lstrip()
    # Remove leading and trailing straight or curly quotes
    cleaned = re.sub(r'^[\"""„]+|[\"""„]+$', '', cleaned)
    return cleaned.strip()


def remove_bracketed_actions(text):
    """Remove [bracketed] or (bracketed) actions from the text."""
    return re.sub(r"[\[(][^\])\]]+[\])\]]", "", text).strip()


def render_inputs(t, persona_options):
    """Render the input controls and return user selections."""
    comedian1_style = st.selectbox(t["comedian1_style"], persona_options, index=persona_options.index("relatable"))
    comedian2_style = st.selectbox(t["comedian2_style"], persona_options, index=persona_options.index("relatable"))
    topic = st.text_input(t["topic"])
    num_rounds = st.number_input(t["num_rounds"], min_value=1, max_value=10, value=1, step=1)
    roast_mode = st.checkbox(t["roast_mode"])
    voice_mode = st.checkbox(t["voice_mode"])
    return comedian1_style, comedian2_style, topic, num_rounds, roast_mode, voice_mode


def generate_show(agent_manager, comedian1_style, comedian2_style, lang, mode, topic, num_rounds):
    """Generate the show and update session state."""
    agent_manager.set_personas(comedian1_style, comedian2_style, lang=lang)
    for k in list(st.session_state.keys()):
        if k.startswith("audio_"):
            del st.session_state[k]
    with st.spinner(TRANSLATIONS[lang].get("please_wait", "Generating show, please wait...")):
        context = generate_topic_context_llm(topic, lang) if mode == "topical" else ""
        history = agent_manager.run_duel(mode, topic, max_rounds=num_rounds, lang=lang, context=context)
    for msg in history:
        msg["content"] = clean_response(msg["role"], msg["content"])
    st.session_state["history"] = history


def render_message(msg, i, tts_service, voice_mode, lang):
    content = clean_response(msg["role"], msg["content"])
    content = remove_bracketed_actions(content)
    alignment = "left" if i % 2 == 0 else "right"
    bubble_class = "bubble-left" if alignment == "left" else "bubble-right"

    audio_key = f"audio_{i}"
    play_key = f"play_tts_{i}"

    # Use columns for alignment
    if alignment == "left":
        col_bubble, col_spacer = st.columns([7, 3])
    else:
        col_spacer, col_bubble = st.columns([3, 7])
    with col_bubble:
        st.markdown(f'<div class="{bubble_class}">{content}</div>', unsafe_allow_html=True)
        if voice_mode:
            if st.button("Play ⏵", key=play_key):
                audio_result = tts_service.speak(content, lang=lang)
                st.session_state[audio_key] = audio_result
            if audio_key in st.session_state:
                audio_result = st.session_state[audio_key]
                # Handle Bark: (audio_array, sample_rate), ElevenLabs: bytes
                if isinstance(audio_result, tuple) and len(audio_result) == 2:
                    audio_array, sample_rate = audio_result
                    st.audio(audio_array, format="audio/wav", sample_rate=sample_rate)
                else:
                    st.audio(audio_result, format="audio/wav")


def run_ui(agent_manager, tts_service):
    import os
    css_path = os.path.join(os.path.dirname(__file__), 'style.css')
    with open(css_path) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
    
    """Main entry point for the Streamlit UI."""
    lang = st.selectbox("Language / Język", ["en", "pl"], index=1)
    t = TRANSLATIONS[lang]
    st.markdown(
        f"""
        <h1 style="margin-bottom: 0.2em; display: flex; align-items: center;">
            AI Standup
            <span class='powered-by-info'>
                (powered by <span style=\"color:#1e90ff;\">{settings.LLM_MODEL}</span>)
            </span>
        </h1>
        """,
        unsafe_allow_html=True
    )
    persona_options = list(COMEDIAN_PERSONAS.keys())
    comedian1_style, comedian2_style, topic, num_rounds, roast_mode, voice_mode = render_inputs(t, persona_options)

    if st.button(t["start_show"]):
        mode = "roast" if roast_mode else "topical"
        generate_show(agent_manager, comedian1_style, comedian2_style, lang, mode, topic, num_rounds)

    history = st.session_state.get("history", [])

    for i, msg in enumerate(history):
        if msg["role"].lower() in {"chat_manager", "manager", "system"}:
            continue
        render_message(msg, i, tts_service, voice_mode, lang)
