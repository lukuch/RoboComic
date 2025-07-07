// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  TIMEOUT: 120000, // 2 minutes
  TTS_TIMEOUT: 60000, // 1 minute (if you want to increase this too, adjust here)
};

// Default Values
export const DEFAULTS = {
  LANGUAGE: "pl",
  COMEDIAN1: "janusz",
  COMEDIAN2: "gen_z",
  NUM_ROUNDS: 1,
  ROAST_MODE: true,
  TTS_MODE: true,
} as const;

// UI Constants
export const UI = {
  MIN_ROUNDS: 1,
  MAX_ROUNDS: 5,
  LOADING_SPINNER_SIZE: 64,
} as const;

// Mode Constants
export const MODES = {
  TOPICAL: "topical",
  ROAST: "roast",
} as const;

// Language Constants
export const LANGUAGES = {
  ENGLISH: "en",
  POLISH: "pl",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error: Unable to connect to server",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  GENERATE_SHOW_FAILED: "Failed to generate show",
  TTS_FAILED: "Failed to generate audio",
  PERSONAS_FAILED: "Failed to load comedian personas",
} as const;
