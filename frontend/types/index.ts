// API Types
export interface GenerateShowParams {
  comedian1_style: string;
  comedian2_style: string;
  lang: string;
  mode: string;
  topic: string;
  num_rounds: number;
}

export interface GenerateShowResponse {
  history: ChatMessage[];
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface Persona {
  description: string;
  description_pl: string;
}

export interface Personas {
  [key: string]: Persona;
}

export interface TTSResponse {
  audioUrl: string;
}

// Form Types
export interface ShowFormParams {
  comedian1_style: string;
  comedian2_style: string;
  lang: string;
  topic: string;
  num_rounds: number;
  roast_mode: boolean;
  tts_mode: boolean;
}

// Translation Types
export interface Translations {
  customize: string;
  comedian1: string;
  comedian2: string;
  language: string;
  topic: string;
  numRounds: string;
  roastMode: string;
  ttsMode: string;
  generate: string;
  generating: string;
  placeholder: string;
  roastModeTooltip: string;
  ttsModeTooltip: string;
  numRoundsTooltip: string;
}

export interface Language {
  code: string;
  label: string;
  flag: string;
}

// Component Props Types
export interface ShowFormProps {
  onSubmit: (params: ShowFormParams) => void;
  loading: boolean;
  lang: string;
  t: Translations;
}

export interface ShowHistoryProps {
  history: ChatMessage[];
  lang: string;
  ttsMode: boolean;
  comedian1Persona: string;
  comedian2Persona: string;
}

export interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

export interface LoadingOverlayProps {
  isLoading: boolean;
}

export interface ErrorDisplayProps {
  error: string | null;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
} 