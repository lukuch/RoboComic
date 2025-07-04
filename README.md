# <img src="frontend/public/icon-192x192.png" alt="RoboComic Icon" width="32" style="vertical-align:middle;"/> RoboComic

RoboComic is an AI-powered standup comedy duel app where virtual comedians battle it out with jokes, roasts, and text-to-speech performances. Users can generate comedy duels and listen to jokes.

## Features
- AI-generated standup comedy duels powered by agent orchestration (AutoGen)
- Multiple comedian personas and styles
- Text-to-Speech (TTS) playback for jokes
- Bilingual support (English & Polish)
- Progressive Web App (PWA): installable on desktop and mobile
- Modern, responsive UI
- **Extensible backend:** Easily add new TTS providers or AI agents

## Customization

- **Add new comedian personas or styles:**
  - Edit or add entries in `backend/config/personas.py`.
  - Each persona can have a unique description, style, and language support.
- **Add new TTS providers or AI agents:**
  - Implement a new service in `backend/tts/` or `backend/agents/`.
  - Register new services in `backend/container.py`.
  - The backend uses the `injector` library for Inversion of Control (IoC) to manage dependencies and service injection.

## Technologies Used
- **Frontend:** Next.js, React, Tailwind CSS, next-pwa
- **Backend:** FastAPI (Python), AutoGen for agent orchestration, TTS services (ElevenLabs, Bark)
- **Other:** TypeScript, Service Workers, PWA Manifest

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Python 3.8+

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/lukuch/RoboComic.git
   cd RoboComic
   ```
2. **Backend:**
   The backend uses [Poetry](https://python-poetry.org/) for dependency management.
   Before installing dependencies, set up your environment variables:
   - Copy `.env.example` to `.env` in the `backend` directory.
   - Fill in all required values (e.g., API keys for ElevenLabs, OpenAI).

   Example `.env`:
   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   ELEVENLABS_API_KEY=your-elevenlabs-api-key-here

   ### Voice IDs for comedians (from ElevenLabs)
   COMEDIAN1_VOICE_ID=your-voice-id-1
   COMEDIAN2_VOICE_ID=your-voice-id-2

   ### LLM model (use gpt-4o for optimal performance - previous models can make mistakes even with the right prompting)
   LLM_MODEL=gpt-4o
   ```

   If you don't have Poetry installed, run:
   ```bash
   pip install poetry
   ```
   ```bash
   cd backend
   poetry install
   poetry run python main.py api
   ```
   > **Note:** The `api` argument is required. If omitted, the Streamlit app will run instead of the API server.
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
- Frontend: `npm run build && npm start`
- Backend: Run with a production uvicorn server

## PWA Installation
- Visit the app in Chrome, Edge, or Safari.
- Click the install icon in the address bar or use "Add to Home Screen" on mobile.
- Enjoy RoboComic as a native-like app!

## Project Structure
```
RoboComic/
  backend/                        # FastAPI backend, TTS services, AutoGen orchestration
    main.py                       # Entry point for API/Streamlit
    container.py                  # Dependency injection setup (injector)
    pyproject.toml                # Poetry project config
    config/
      settings.py                 # Loads environment variables
      personas.py                 # Comedian persona definitions
      translations.py             # UI and API translations
    agents/                       # AI agent logic (AutoGen, etc.)
    services/                     # LLM and prompt utilities
    tts/                          # TTS service implementations (ElevenLabs, Bark, etc.)
    tts_output/                   # (Optional) Directory for generated TTS files
    ui/
      streamlit_ui.py             # Streamlit app (optional)
      style.css                   # Streamlit UI styles
    tests/                        # Backend tests
    .env.example                  # Example environment variables

  frontend/                       # Next.js frontend, PWA config, UI
    app/
      layout.tsx                  # Root layout and metadata
      page.tsx                    # Main page
      globals.css                 # Global styles
    components/                   # React components (ShowForm, ShowHistory, Api, etc.)
    public/
      manifest.json               # PWA manifest
      icon-192x192.png            # PWA icon
      icon-512x512.png            # PWA icon
      favicon.ico                 # Browser tab icon
    next.config.js                # Next.js and next-pwa config
    package.json                  # Frontend dependencies
    tailwind.config.js            # Tailwind CSS config
    tsconfig.json                 # TypeScript config
```

## Author
Created by lukuch (Łukasz Ucher)

---
Enjoy the show! 🤖🎤

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it.