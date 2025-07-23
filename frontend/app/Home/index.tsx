"use client";

import ShowForm from "../../components/ShowForm/index";
import ShowHistory from "../../components/ShowHistory/index";
import type { TranslationStrings } from "../../types";
import { LanguageSelector } from "./LanguageSelector";
import { LoadingOverlay } from "./LoadingOverlay";
import { AppHeader } from "./AppHeader";
import { ErrorDisplay } from "./ErrorDisplay";
import { useShowGeneration } from "../../hooks/useShowGeneration";
import { useState, useEffect } from "react";
import { fetchVoiceIds } from "../../services/apiService";
import { usePersonas } from "../../hooks/usePersonas";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

interface HomeProps {
  lang: string;
  setLang: (lang: string) => void;
  t: TranslationStrings;
}

export type { HomeProps };

export default function Home({ lang, setLang, t }: HomeProps) {
  const [voiceIds, setVoiceIds] = useState<{
    comedian1_voice_id: string;
    comedian2_voice_id: string;
  } | null>(null);

  const {
    personas,
    loading: personasLoading,
    error: personasError,
    refetch: refetchPersonas,
  } = usePersonas();

  const { user } = useAuth();

  const {
    history,
    loading,
    error,
    ttsMode,
    comedian1,
    comedian2,
    generateShow: handleGenerateShow,
    clearError,
  } = useShowGeneration(undefined, setVoiceIds);

  useEffect(() => {
    fetchVoiceIds()
      .then(setVoiceIds)
      .catch(() => {});
  }, []);

  useEffect(() => {
    refetchPersonas();
  }, [user]);

  const comedian1Name = comedian1 ? comedian1.name : "";
  const comedian2Name = comedian2 ? comedian2.name : "";

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-2">
      <LoadingOverlay isLoading={loading || personasLoading} />
      <div className="flex w-full max-w-2xl justify-end gap-4 mb-6">
        <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
        <ThemeToggle />
      </div>
      <AppHeader />
      <ShowForm
        onSubmit={handleGenerateShow}
        loading={loading}
        lang={lang}
        t={t}
        personas={personas}
        personasError={personasError}
        refetchPersonas={refetchPersonas}
      />
      <ErrorDisplay error={error} onDismiss={clearError} />
      <ShowHistory
        history={history}
        lang={lang}
        ttsMode={ttsMode}
        comedian1Persona={comedian1Name}
        comedian2Persona={comedian2Name}
        personas={personas}
        t={t}
        loading={loading}
        voiceIds={voiceIds}
      />
    </div>
  );
}
