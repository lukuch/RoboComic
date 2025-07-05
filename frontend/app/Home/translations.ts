export const TRANSLATIONS = {
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
} as const;

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: 'GB' },
  { code: 'pl', label: 'Polski', flag: 'PL' },
] as const; 