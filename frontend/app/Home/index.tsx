"use client";

import ShowForm from "../../components/ShowForm/index";
import ShowHistory from "../../components/ShowHistory/index";
import { TRANSLATIONS } from "./translations";
import type { TranslationStrings } from "../../types";
import { LanguageSelector } from "./LanguageSelector";
import { LoadingOverlay } from "./LoadingOverlay";
import { AppHeader } from "./AppHeader";
import { ErrorDisplay } from "./ErrorDisplay";
import { useShowGeneration } from "../../hooks/useShowGeneration";
import { useLanguage } from "../../hooks/useLanguage";
import { DEFAULTS } from "../../constants";
import { useState, useEffect } from "react";
import { fetchVoiceIds } from "../../services/apiService";
import { usePersonas } from "../../hooks/usePersonas";

export default function Home() {
  const { lang, setLang } = useLanguage(DEFAULTS.LANGUAGE);
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

  const t: TranslationStrings = TRANSLATIONS[lang as "en" | "pl"];

  const comedian1Name = comedian1 ? comedian1.name : "";
  const comedian2Name = comedian2 ? comedian2.name : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex flex-col items-center py-12 px-2">
      <LoadingOverlay isLoading={loading || personasLoading} />
      <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
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
