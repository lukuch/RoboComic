'use client';

import ShowForm from '../components/ShowForm';
import ShowHistory from '../components/ShowHistory';
import { generateShow } from '../components/Api';
import { useState } from 'react';
import CountryFlag from 'react-country-flag';

const TRANSLATIONS = {
  en: {
    customize: 'Customize Your Comedy Duel',
    comedian1: 'Comedian 1 Style',
    comedian2: 'Comedian 2 Style',
    language: 'Language',
    topic: 'Topic',
    numRounds: 'Number of Rounds',
    roastMode: 'Roast Mode',
    ttsMode: 'TTS Mode',
    generate: 'Generate Show',
    generating: 'Generating...',
    placeholder: 'Enter topic...',
    roastModeTooltip: 'In Roast Mode, comedians roast each other with witty, funny insults instead of topical jokes.',
    ttsModeTooltip: 'TTS Mode enables text-to-speech playback for each joke, letting you listen to the comedians.',
    numRoundsTooltip: 'Each round consists of 2 jokes from each comedian. More rounds mean a longer, more detailed comedy duel.',
  },
  pl: {
    customize: 'Dostosuj pojedynek komików',
    comedian1: 'Styl Komika 1',
    comedian2: 'Styl Komika 2',
    language: 'Język',
    topic: 'Temat',
    numRounds: 'Liczba rund',
    roastMode: 'Tryb roast',
    ttsMode: 'Tryb TTS',
    generate: 'Rozpocznij pojedynek',
    generating: 'Generowanie...',
    placeholder: 'Wpisz temat...',
    roastModeTooltip: 'W trybie roast komicy prześmiewają się nawzajem z dowcipnymi, zabawnymi obelgami zamiast żartów tematycznych.',
    ttsModeTooltip: 'Tryb TTS umożliwia odtwarzanie tekstu na mowę dla każdego żartu, pozwalając słuchać komików.',
    numRoundsTooltip: 'Każda runda składa się z 2 żartów od każdego komika. Więcej rund oznacza dłuższy, bardziej szczegółowy pojedynek komików.',
  },
};

const LANGUAGES = [
  { code: 'en', label: 'English', flag: 'GB' },
  { code: 'pl', label: 'Polski', flag: 'PL' },
];

export default function Home() {
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ttsMode, setTtsMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleGenerateShow(params: any) {
    setLoading(true);
    setError(null);
    setTtsMode(params.tts_mode);
    try {
      const data = await generateShow({
        comedian1_style: params.comedian1_style,
        comedian2_style: params.comedian2_style,
        lang: lang,
        mode: params.roast_mode ? 'roast' : 'topical',
        topic: params.topic,
        num_rounds: params.num_rounds,
      });
      setHistory(data.history);
    } catch (e: any) {
      setError(e.message || 'Failed to generate show');
      setHistory([]);
    }
    setLoading(false);
  }

  const t = TRANSLATIONS[lang as 'en' | 'pl'];
  const currentLang = LANGUAGES.find(l => l.code === lang)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-2xl flex justify-end mb-6 relative z-10">
        <div className="relative">
          <button
            className="flex items-center gap-2 pl-4 pr-6 py-2 rounded-full bg-white/30 dark:bg-gray-800/60 shadow-md border-none focus:ring-2 focus:ring-blue-400 text-sm font-semibold transition hover:bg-white/50 dark:hover:bg-gray-700/80 outline-none min-w-[110px]"
            onClick={() => setDropdownOpen(v => !v)}
            type="button"
          >
            <CountryFlag countryCode={currentLang.flag} svg style={{ width: '1.5em', height: '1.5em' }} />
            {currentLang.label}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 ring-1 ring-black/10 z-20">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-blue-100 dark:hover:bg-blue-900 transition ${lang === l.code ? 'font-bold' : ''}`}
                  onClick={() => { setLang(l.code); setDropdownOpen(false); }}
                  type="button"
                >
                  <CountryFlag countryCode={l.flag} svg style={{ width: '1.5em', height: '1.5em' }} />
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-900 dark:text-white drop-shadow-lg">
        RoboComic AI
      </h1>
      <ShowForm onSubmit={handleGenerateShow} loading={loading} lang={lang} t={t} />
      {error && <div className="text-red-600 text-center mt-4 font-semibold">{error}</div>}
      <ShowHistory history={history} lang={lang} ttsMode={ttsMode} />
    </div>
  );
}
