import { useState } from "react";
import {
  generateShow,
  healthCheck,
  fetchPersonas,
  fetchVoiceIds,
} from "../services/apiService";
import { ChatMessage, ShowFormParams, ApiError } from "../types";
import { DEFAULTS, ERROR_MESSAGES, MODES } from "../constants";

export function useShowGeneration(
  setPersonas?: (p: any) => void,
  setVoiceIds?: (v: any) => void,
) {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ttsMode, setTtsMode] = useState(false);
  const [comedian1, setComedian1] = useState<string>(DEFAULTS.COMEDIAN1);
  const [comedian2, setComedian2] = useState<string>(DEFAULTS.COMEDIAN2);

  const generateShowHandler = async (params: ShowFormParams) => {
    setLoading(true);
    setError(null);
    setTtsMode(params.tts_mode);
    setComedian1(params.comedian1_style);
    setComedian2(params.comedian2_style);

    // Lazy fetch personas/voiceIds if missing
    if (setPersonas) {
      try {
        setPersonas(await fetchPersonas());
      } catch {}
    }
    if (setVoiceIds) {
      try {
        setVoiceIds(await fetchVoiceIds());
      } catch {}
    }

    // Quick health check before actual request
    const healthy = await healthCheck();
    if (!healthy) {
      setError(
        "The backend is currently unavailable. Please try again in a moment.",
      );
      setLoading(false);
      return;
    }

    try {
      const data = await generateShow({
        comedian1_style: params.comedian1_style,
        comedian2_style: params.comedian2_style,
        lang: params.lang,
        mode: params.roast_mode ? MODES.ROAST : MODES.TOPICAL,
        topic: params.topic,
        num_rounds: params.num_rounds,
        build_context: params.build_context,
        temperature: params.temperature,
      });
      setHistory(data.history);
    } catch (e: unknown) {
      const error = e as ApiError;
      setError(error.message || ERROR_MESSAGES.GENERATE_SHOW_FAILED);
      // Only clear history if not a rate limit error
      if (error.status !== 429) {
        setHistory([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearHistory = () => setHistory([]);

  return {
    history,
    loading,
    error,
    ttsMode,
    comedian1,
    comedian2,
    generateShow: generateShowHandler,
    clearError,
    clearHistory,
  };
}
