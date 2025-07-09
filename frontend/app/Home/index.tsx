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
import { useKeepAlive } from "../../hooks/useKeepAlive";
import { DEFAULTS } from "../../constants";
import { useState, useEffect } from "react";
import { fetchPersonas } from "../../services/apiService";
import { Personas } from "../../types";

export default function Home() {
  const { lang, setLang } = useLanguage(DEFAULTS.LANGUAGE);
  const {
    history,
    loading,
    error,
    ttsMode,
    comedian1,
    comedian2,
    generateShow: handleGenerateShow,
    clearError,
  } = useShowGeneration();

  // Keep backend alive on Render.com free tier
  useKeepAlive();

  const t: TranslationStrings = TRANSLATIONS[lang as "en" | "pl"];

  const [personas, setPersonas] = useState<Personas | null>(null);
  useEffect(() => {
    fetchPersonas()
      .then(setPersonas)
      .catch(() => setPersonas(null));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex flex-col items-center py-12 px-2">
      <LoadingOverlay isLoading={loading} />
      <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
      <AppHeader />
      <ShowForm
        onSubmit={handleGenerateShow}
        loading={loading}
        lang={lang}
        t={t}
      />
      <ErrorDisplay error={error} onDismiss={clearError} />
      <ShowHistory
        history={history}
        lang={lang}
        ttsMode={ttsMode}
        comedian1Persona={comedian1}
        comedian2Persona={comedian2}
        personas={personas}
        t={t}
      />
    </div>
  );
}
