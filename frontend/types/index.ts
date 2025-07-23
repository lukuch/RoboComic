// API Types
export interface Persona {
  name: string;
  style?: string;
  description: string;
  description_pl: string;
}

export interface GenerateShowParams {
  comedian1_persona: Persona;
  comedian2_persona: Persona;
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

export interface Personas {
  [key: string]: Persona;
}

export interface TemperaturePreset {
  name: string;
  temperature: number;
  description: string;
}

export interface LLMConfig {
  temperature: number;
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
  t: TranslationStrings;
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
  personas: Record<string, Persona>;
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

export interface ShowFormParams {
  comedian1_persona: Persona;
  comedian2_persona: Persona;
  lang: string;
  topic: string;
  num_rounds: number;
  roast_mode: boolean;
  tts_mode: boolean;
  build_context: boolean;
  temperature?: number;
}
