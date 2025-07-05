// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  TTS_TIMEOUT: 60000,
  BASE_URL: process.env.PUBLIC_BACKEND_URL || 'http://localhost:8000',
} as const;

// Default Values
export const DEFAULTS = {
  LANGUAGE: 'pl',
  COMEDIAN1: 'uncle_heniek',
  COMEDIAN2: 'gen_z',
  NUM_ROUNDS: 1,
  ROAST_MODE: true,
  TTS_MODE: true,
} as const;

// UI Constants
export const UI = {
  MAX_ROUNDS: 10,
  MIN_ROUNDS: 1,
  LOADING_SPINNER_SIZE: 64,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error: Unable to connect to server',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  GENERATE_SHOW_FAILED: 'Failed to generate show',
  TTS_FAILED: 'Failed to generate audio',
  PERSONAS_FAILED: 'Failed to load comedian personas',
} as const; 