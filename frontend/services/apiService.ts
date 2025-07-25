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
import { supabase } from "../utils/supabaseClient";

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
): Promise<Blob> {
  return apiRequest(async () => {
    const response = await api.post(
      "/tts",
      { text, lang, voice_id: voiceId },
      {
        responseType: "blob",
        timeout: API_CONFIG.TTS_TIMEOUT,
      },
    );
    return response.data; // Return the actual Blob
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
    await api.get("/health", { timeout: 2000 }); // 2 second timeout for quick health check
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

// Helper to get TTS audio from Supabase cache
export async function getCachedTTS(hash: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("tts_audio")
    .select("audio_url")
    .eq("cache_key", hash)
    .single();
  if (data && data.audio_url) {
    return data.audio_url;
  }
  return null;
}

// Helper to upload TTS audio to Supabase Storage and return the public URL
export async function uploadTTSAudio(
  hash: string,
  blob: Blob,
): Promise<string | null> {
  const filePath = `tts/${hash}.wav`;
  const { data, error } = await supabase.storage
    .from("tts-audio")
    .upload(filePath, blob, { upsert: true, contentType: "audio/wav" });
  if (error) {
    // If file already exists, get the public URL anyway
    const { data: urlData } = supabase.storage
      .from("tts-audio")
      .getPublicUrl(filePath);
    return urlData?.publicUrl || null;
  }
  const { data: urlData } = supabase.storage
    .from("tts-audio")
    .getPublicUrl(filePath);
  return urlData?.publicUrl || null;
}

// Helper to insert TTS audio metadata into the tts_audio table
export async function insertTTSMetadata(
  hash: string,
  audioUrl: string,
): Promise<void> {
  await supabase
    .from("tts_audio")
    .upsert([{ cache_key: hash, audio_url: audioUrl }], {
      onConflict: "cache_key",
    });
}
