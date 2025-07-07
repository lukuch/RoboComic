# <img src="frontend/public/icon-192x192.png" alt="RoboComic Icon" width="32" style="vertical-align:middle;"/> RoboComic

RoboComic is an AI-powered standup comedy duel app where virtual comedians battle it out with jokes, roasts, and text-to-speech performances. Users can generate comedy duels and listen to jokes.

## Features
- AI-generated standup comedy duels powered by agent orchestration (AutoGen)
- Multiple comedian personas and styles
- Text-to-Speech (TTS) playback for jokes
- Bilingual support (English & Polish) with project-wide internationalization
- Progressive Web App (PWA): installable on desktop and mobile
- Modern, responsive UI
- **Extensible backend:** Easily add new TTS providers or AI agents
- **Modular architecture:** Clean separation of backend services, models, and utilities
- **Automated dependency management:** Dependabot for backend (Poetry) and frontend (npm)
- **CI/CD:** Automated testing, linting, formatting, and security checks via GitHub Actions
- **Docker support:** Production-ready Dockerfile for backend deployment
- **Pre-commit hooks:** Enforced code quality and requirements sync

## Customization

- **Add new comedian personas or styles:**
  - Edit or add entries in `backend/config/personas.py`.
  - Each persona can have a unique description, style, and language support.
- **Add new TTS providers or AI agents:**
  - Implement a new service in `backend/tts/` or `backend/agents/`.
  - Register new services in `backend/container.py`.
  - The backend uses the `injector` library for Inversion of Control (IoC) to manage dependencies and service injection.

## Technologies Used
- **Frontend:** Next.js 15, React 19, Tailwind CSS 3.4+, next-pwa
- **Backend:** FastAPI (Python 3.11+), AutoGen for agent orchestration, TTS services (ElevenLabs, Bark)
- **Other:** TypeScript, Service Workers, PWA Manifest, Docker, GitHub Actions, Dependabot

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Python 3.11+

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
- Backend: Run with a production uvicorn server or use the provided Dockerfile:
  ```bash
  cd backend
  docker build -t robocomic-backend:latest .
  docker run -p 8000:8000 robocomic-backend:latest
  ```

## Automation & Quality
- **Dependabot:** Automated dependency updates for both backend and frontend
- **Pre-commit hooks:** Formatting (Black), import sorting (isort), linting (flake8), and requirements export
- **CI/CD:**
  - Linting, formatting, and type checks for both backend and frontend
  - Automated tests with coverage
  - Security scanning (Snyk, Trivy)
  - Docker build validation

## PWA Installation
- Visit the app in Chrome, Edge, or Safari.
- Click the install icon in the address bar or use "Add to Home Screen" on mobile.
- Enjoy RoboComic as a native-like app!

## Troubleshooting

### TTS Issues
**Text-to-Speech not working:**
- Verify ElevenLabs API key is valid
- Check voice IDs exist in your ElevenLabs account
- Ensure internet connection for API calls
- **Free plan users**: You may have run out of monthly credits - check your ElevenLabs dashboard

## Project Structure (and crucial files)
```
RoboComic/
  backend/                        # FastAPI backend, TTS services, AutoGen orchestration
    main.py                       # Entry point for API/Streamlit
    container.py                  # Dependency injection setup (injector)
    config/
      personas.py                 # Comedian persona definitions
      settings.py                 # Environment variables and config
      translations.py             # Translation/internationalization support
    agents/
      comedian_agent.py           # Comedian agent implementation
    services/
      agent_manager.py            # Agent orchestration management
      api_service.py              # API service layer
      llm_utils.py                # LLM utility functions
      prompt_templates.py         # Prompt templates for LLMs
    models/
      api_models.py               # API request/response models
    tts/
      tts_service.py              # TTS service base/utility
      eleven_tts_service.py       # ElevenLabs TTS service
      bark_tts_service.py         # Bark TTS service
    utils/                        # Error handling, logging, exceptions
    ui/
      streamlit_ui.py             # Streamlit app (optional)
    tests/
      test_api_endpoints.py       # API endpoint tests
      test_integration.py         # Integration tests
      test_models.py              # Model tests
      test_services.py            # Service tests
      test_utils.py               # Utility tests
      conftest.py                 # Pytest fixtures
    Dockerfile                    # Production Dockerfile
    .flake8                       # Flake8 config
    pyproject.toml                # Poetry and tool config
    requirements.txt              # Exported requirements

  frontend/                       # Next.js frontend, PWA config, UI
    app/
      layout.tsx                  # Root layout and metadata
      page.tsx                    # Main page
      Home/                       # Home page components
        AppHeader.tsx
        ErrorDisplay.tsx
        LanguageSelector.tsx
        LoadingOverlay.tsx
        translations.ts
        index.tsx                 # Home page main component
    components/
      Footer.tsx                  # App footer
      shared/
        Tooltip.tsx               # Shared tooltip component
      ShowForm/                   # Show generation form
        CheckboxWithTooltip.tsx
        ComedianSelector.tsx
        FormInput.tsx
        FormLabel.tsx
        NumberInput.tsx
        SubmitButton.tsx
        TemperatureConfig.tsx
        index.tsx                 # Show form main component
      ShowHistory/                # Show history display
        Avatar.tsx
        ChatBubble.tsx
        ManagerBubble.tsx
        TTSButton.tsx
        index.tsx                 # Show history main component
    hooks/
      useShowGeneration.ts        # Show generation hook
      useKeepAlive.ts             # Keep-alive hook
      useLanguage.ts              # Language management hook
    services/
      apiService.ts               # API service layer
    types/
      index.ts                    # TypeScript type definitions
      next-pwa.d.ts               # PWA type definitions
    utils/
      toTitleCase.ts              # Utility function
    public/
      manifest.json               # PWA manifest
      icon-192x192.png            # PWA icons
      icon-512x512.png
      sw.js                       # Service worker
      favicon.ico
    next.config.ts                # Next.js config
    tailwind.config.js            # Tailwind CSS config
    tsconfig.json                 # TypeScript config
    postcss.config.js             # PostCSS config
    package.json                  # NPM dependencies and scripts
    package-lock.json
    vercel.json                   # Vercel deployment config

.github/
  workflows/
    ci.yml                        # Full CI/CD pipeline
    quick-test.yml                # Fast test workflow
  dependabot.yml                  # Automated dependency updates

LICENSE
README.md

```

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it.

## Author
Created by lukuch (Łukasz Ucher)

---
Enjoy the show! 🤖🎤

