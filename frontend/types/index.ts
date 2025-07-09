// API Types
export interface GenerateShowParams {
  comedian1_style: string;
  comedian2_style: string;
  lang: string;
  mode: string;
  topic: string;
  num_rounds: number;
  build_context: boolean;
  temperature?: number;
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
  build_context: boolean;
  temperature?: number;
}

export interface ShowFormData {
  comedian1_style: string;
  comedian2_style: string;
  lang: string;
  mode: string;
  topic: string;
  num_rounds: number;
  temperature?: number;
}

export interface TemperaturePreset {
  name: string;
  temperature: number;
  description: string;
}

export interface LLMConfig {
  temperature: number;
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
  judgingDuel: string;
  roundsLabel: string;
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

export interface TTSRequest {
  text: string;
  lang: string;
}

export interface PersonasResponse {
  personas: Record<string, Record<string, string>>;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

export type VoiceIdsResponse = {
  comedian1_voice_id: string;
  comedian2_voice_id: string;
};

export interface JudgeShowRequest {
  comedian1_name: string;
  comedian2_name: string;
  history: ChatMessage[];
  lang: string;
}

export interface JudgeShowResponse {
  winner: string;
  summary: string;
}

export type TranslationStrings =
  | (typeof import("../app/Home/translations").TRANSLATIONS)["en"]
  | (typeof import("../app/Home/translations").TRANSLATIONS)["pl"];
