import { useState } from "react";
import {
  generateShow,
  healthCheck,
  fetchPersonas,
  fetchVoiceIds,
} from "../services/apiService";
import type { Personas, Persona } from "../types";
import { ChatMessage, ShowFormParams, ApiError } from "../types";
import { ERROR_MESSAGES, MODES } from "../constants";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { toTitleCase } from "../utils/stringUtils";

function formatDateForTitle(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

export function useShowGeneration(
  setPersonas?: (p: Personas) => void,
  setVoiceIds?: (v: any) => void, // TODO: Replace 'any' with a specific type for setVoiceIds if available
) {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ttsMode, setTtsMode] = useState(false);
  const [comedian1, setComedian1] = useState<Persona | null>(null);
  const [comedian2, setComedian2] = useState<Persona | null>(null);
  const { user } = useAuth();

  const generateShowHandler = async (params: ShowFormParams) => {
    setLoading(true);
    setError(null);
    setTtsMode(params.tts_mode);
    setComedian1(params.comedian1_persona);
    setComedian2(params.comedian2_persona);

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
        comedian1_persona: params.comedian1_persona,
        comedian2_persona: params.comedian2_persona,
        lang: params.lang,
        mode: params.roast_mode ? MODES.ROAST : MODES.TOPICAL,
        topic: params.topic,
        num_rounds: params.num_rounds,
        build_context: params.build_context,
        temperature: params.temperature,
      });
      setHistory(data.history);

      // Save to Supabase if user is logged in
      if (user && data.history && data.history.length > 0) {
        const showTitle = `${toTitleCase(params.comedian1_persona.name)} vs. ${toTitleCase(params.comedian2_persona.name)} - ${formatDateForTitle(new Date())}`;
        try {
          await supabase.from("shows").insert([
            {
              user_id: user.id,
              title: showTitle,
              data: JSON.stringify({ history: data.history, params }),
            },
          ]);
        } catch (e) {
          // Optionally handle/log error
          console.error("Failed to save show to Supabase", e);
        }
      }
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
