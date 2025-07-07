export const TRANSLATIONS = {
  en: {
    customize: "Customize Your Comedy Duel",
    comedian1: "Comedian 1 Style",
    comedian2: "Comedian 2 Style",
    language: "Language",
    topic: "Topic",
    numRounds: "Number of Rounds",
    roastMode: "Roast Mode",
    ttsMode: "TTS Mode",
    generate: "Generate Show",
    generating: "Generating...",
    placeholder: "Enter topic...",
    roastModeTooltip:
      "In Roast Mode, comedians roast each other with witty, funny insults instead of topical jokes.",
    ttsModeTooltip:
      "TTS Mode enables text-to-speech playback for each joke, letting you listen to the comedians.",
    numRoundsTooltip:
      "Each round consists of 2 jokes from each comedian. More rounds mean a longer, more detailed comedy duel.",
    // AI Creativity Settings
    aiCreativitySettings: "AI Creativity Settings",
    adjustCreativity: "Adjust Creativity Level",
    quickPresets: "Quick Presets",
    conservative: "Conservative",
    balanced: "Balanced",
    creative: "Creative",
    experimental: "Experimental",
    sliderConservative: "Conservative (0.0)",
    sliderCreative: "Creative (1.0)",
    temperatureHelp:
      "Temperature controls how creative and unpredictable the AI responses are. Lower values (0.0-0.5) produce more focused, consistent responses. Higher values (0.7-1.0) create more creative, varied, and sometimes unexpected content.",
    errorPresets: "Failed to load AI presets. Please try again later.",
    noPresets:
      "No AI presets available. Please contact support or try again later.",
    conservativeDesc: "More predictable, focused responses",
    balancedDesc: "Good balance of creativity and coherence",
    creativeDesc: "More creative and varied responses",
    experimentalDesc: "Highly creative, unexpected responses",
    roastModeTopicDisabledExplanation:
      "Topic selection is disabled in roast mode because the comedians will roast each other.",
    buildContext: "Build Context",
    buildContextTooltip:
      "When enabled, the AI will research and build background context about the selected topic to create more informed and relevant jokes.",
  },
  pl: {
    customize: "Dostosuj pojedynek komików",
    comedian1: "Styl Komika 1",
    comedian2: "Styl Komika 2",
    language: "Język",
    topic: "Temat",
    numRounds: "Liczba rund",
    roastMode: "Tryb roast",
    ttsMode: "Tryb TTS",
    generate: "Rozpocznij pojedynek",
    generating: "Generowanie...",
    placeholder: "Wpisz temat...",
    roastModeTooltip:
      "W trybie roast komicy prześmiewają się nawzajem z dowcipnymi, zabawnymi obelgami zamiast żartów tematycznych.",
    ttsModeTooltip:
      "Tryb TTS umożliwia odtwarzanie tekstu na mowę dla każdego żartu, pozwalając słuchać komików.",
    numRoundsTooltip:
      "Każda runda składa się z 2 żartów od każdego komika. Więcej rund oznacza dłuższy, bardziej szczegółowy pojedynek komików.",
    // AI Creativity Settings
    aiCreativitySettings: "Ustawienia kreatywności AI",
    adjustCreativity: "Dostosuj poziom kreatywności",
    quickPresets: "Szybkie ustawienia",
    conservative: "Zachowawczy",
    balanced: "Zrównoważony",
    creative: "Kreatywny",
    experimental: "Eksperymentalny",
    sliderConservative: "Zachowawczy (0.0)",
    sliderCreative: "Kreatywny (1.0)",
    temperatureHelp:
      "Temperatura kontroluje, jak kreatywne i nieprzewidywalne są odpowiedzi AI. Niższe wartości (0.0-0.5) dają bardziej spójne, przewidywalne odpowiedzi. Wyższe wartości (0.7-1.0) generują bardziej kreatywne, zróżnicowane i czasem nieoczekiwane treści.",
    errorPresets:
      "Nie udało się załadować ustawień AI. Spróbuj ponownie później.",
    noPresets:
      "Brak dostępnych ustawień AI. Skontaktuj się z pomocą techniczną lub spróbuj ponownie później.",
    conservativeDesc: "Bardziej przewidywalne, spójne odpowiedzi",
    balancedDesc: "Dobry balans kreatywności i spójności",
    creativeDesc: "Bardziej kreatywne i zróżnicowane odpowiedzi",
    experimentalDesc: "Wysoce kreatywne, nieoczekiwane odpowiedzi",
    roastModeTopicDisabledExplanation:
      "W trybie roast wybór tematu jest wyłączony, ponieważ komicy będą roastować siebie nawzajem.",
    buildContext: "Buduj kontekst",
    buildContextTooltip:
      "Gdy włączone, AI będzie badać i budować tło kontekstowe dla wybranego tematu, aby tworzyć bardziej świadome i trafne żarty.",
  },
} as const;

export const LANGUAGES = [
  { code: "en", label: "English", flag: "GB" },
  { code: "pl", label: "Polski", flag: "PL" },
] as const;
