import axios, { AxiosError } from "axios";
import {
  GenerateShowParams,
  GenerateShowResponse,
  Personas,
  ApiError,
  TemperaturePreset,
  LLMConfig,
  VoiceIdsResponse,
  JudgeShowRequest,
  JudgeShowResponse,
} from "../types";
import { API_CONFIG, ERROR_MESSAGES } from "../constants";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handler
function handleApiError(error: AxiosError): ApiError {
  if (error.response) {
    const responseData = error.response.data as any;
    if (error.response.status === 429) {
      return {
        message:
          "You have reached the usage limit. Please wait before trying again.",
        status: 429,
      };
    }
    return {
      message:
        responseData?.message ||
        `HTTP ${error.response.status}: ${error.response.statusText}`,
      status: error.response.status,
    };
  } else if (error.request) {
    // Network error
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
    };
  } else {
    // Other error
    return {
      message: error.message || ERROR_MESSAGES.UNEXPECTED_ERROR,
    };
  }
}

// Generic API request wrapper
async function apiRequest<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

export async function generateShow(
  params: GenerateShowParams,
): Promise<GenerateShowResponse> {
  return apiRequest(async () => {
    const { data } = await api.post<GenerateShowResponse>(
      "/generate-show",
      params,
    );
    return data;
  });
}

export async function tts(
  text: string,
  lang: string,
  voiceId?: string,
): Promise<string> {
  return apiRequest(async () => {
    const response = await api.post<Blob>(
      "/tts",
      { text, lang, voice_id: voiceId },
      {
        responseType: "blob",
        timeout: API_CONFIG.TTS_TIMEOUT,
      },
    );
    return URL.createObjectURL(response.data);
  });
}

export async function fetchPersonas(): Promise<Personas> {
  return apiRequest(async () => {
    const { data } = await api.get<{ personas: Personas }>("/personas");
    return data.personas;
  });
}

export async function fetchVoiceIds(): Promise<VoiceIdsResponse> {
  return apiRequest(async () => {
    const { data } = await api.get<VoiceIdsResponse>("/voice-ids");
    return data;
  });
}

export async function judgeShow(
  params: JudgeShowRequest,
): Promise<JudgeShowResponse> {
  return apiRequest(async () => {
    const { data } = await api.post<JudgeShowResponse>("/judge-show", params);
    return data;
  });
}

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    await api.get("/health");
    return true;
  } catch (error) {
    return false;
  }
}

// Temperature configuration functions
export async function getDefaultLLMConfig(): Promise<LLMConfig> {
  return apiRequest(async () => {
    const { data } = await api.get<LLMConfig>("/llm-config");
    return data;
  });
}

export async function getTemperaturePresets(): Promise<TemperaturePreset[]> {
  return apiRequest(async () => {
    const { data } = await api.get<TemperaturePreset[]>("/temperature-presets");
    return data;
  });
}
