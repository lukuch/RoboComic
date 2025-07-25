"use client";

import ShowForm from "../../components/ShowForm/index";
import ShowHistory from "../../components/ShowHistory/index";
import type { TranslationStrings } from "../../types";
import { LanguageSelector } from "./LanguageSelector";
import { LoadingOverlay } from "./LoadingOverlay";
import { AppHeader } from "./AppHeader";
import { ErrorDisplay } from "./ErrorDisplay";
import { useShowGeneration } from "../../hooks/useShowGeneration";
import { useState, useEffect, useRef } from "react";
import { fetchVoiceIds } from "../../services/apiService";
import { usePersonas } from "../../hooks/usePersonas";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import UserShowHistorySidebar from "../../components/UserShowHistorySidebar";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Footer from "./Footer";
import { supabase } from "../../utils/supabaseClient";
import type { ChatMessage } from "../../types";
import type { ShowFormParams } from "../../types";

// Show type for sidebar selection
interface Show {
  id: string;
  title: string;
  created_at: string;
}

interface HomeProps {
  lang: string;
  setLang: (lang: string) => void;
  t: TranslationStrings;
}

export type { HomeProps };

export default function Home({ lang, setLang, t }: HomeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
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
    generateShow: handleGenerateShowRaw,
    clearError,
  } = useShowGeneration(undefined, setVoiceIds);

  // Wrap the generateShow handler to trigger sidebar refresh after show is saved
  const handleGenerateShow = async (params: ShowFormParams) => {
    const newShowId = await handleGenerateShowRaw(params);
    setSidebarRefreshKey((k) => k + 1);
    if (newShowId) {
      // Fetch the new show and select it
      const { data, error } = await supabase
        .from("shows")
        .select("id, title, created_at")
        .eq("id", newShowId)
        .single();
      if (!error && data) {
        await handleSelectShow(data);
      }
    }
  };

  // --- New state for selected show ---
  const [selectedShowHistory, setSelectedShowHistory] = useState<
    ChatMessage[] | null
  >(null);
  const [selectedShowLoading, setSelectedShowLoading] = useState(false);
  const [selectedComedian1, setSelectedComedian1] = useState("");
  const [selectedComedian2, setSelectedComedian2] = useState("");
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [selectedShowTtsMode, setSelectedShowTtsMode] =
    useState<boolean>(false);
  const showHistoryRef = useRef<HTMLDivElement | null>(null);

  // --- Handler to select a show from sidebar ---
  async function handleSelectShow(show: Show) {
    setSelectedShowLoading(true);
    setSelectedShowHistory(null);
    setSelectedComedian1("");
    setSelectedComedian2("");
    setSelectedShowId(show.id);
    setSelectedShowTtsMode(false);
    const { data, error } = await supabase
      .from("shows")
      .select("data, title, created_at")
      .eq("id", show.id)
      .single();
    if (!error && data) {
      let parsed = null;
      try {
        parsed = JSON.parse(data.data);
      } catch {}
      setSelectedShowHistory(parsed?.history || []);
      setSelectedComedian1(parsed?.params?.comedian1_persona?.name || "");
      setSelectedComedian2(parsed?.params?.comedian2_persona?.name || "");
      setSelectedShowTtsMode(!!parsed?.params?.tts_mode);
    }
    setSelectedShowLoading(false);
  }

  function handleDeselectShow() {
    setSelectedShowHistory(null);
    setSelectedComedian1("");
    setSelectedComedian2("");
    setSelectedShowId(null);
  }

  useEffect(() => {
    fetchVoiceIds()
      .then(setVoiceIds)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      refetchPersonas();
    }
  }, [user, refetchPersonas]);

  useEffect(() => {
    if (selectedShowHistory && showHistoryRef.current) {
      showHistoryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedShowHistory]);

  const comedian1Name = comedian1 ? comedian1.name : "";
  const comedian2Name = comedian2 ? comedian2.name : "";

  return (
    <>
      <div className="min-h-screen flex flex-row w-full relative pb-16">
        {/* Sidebar for desktop (md and up) */}
        {user && sidebarOpen && (
          <>
            {/* Overlay for mobile only */}
            <div
              className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
            {/* Sidebar drawer for mobile, fixed panel for desktop */}
            <div
              className="fixed top-0 left-0 h-full z-50 md:z-20 transition-transform duration-300 md:translate-x-0"
              style={{
                width: 288,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
              }}
            >
              <UserShowHistorySidebar
                onCloseSidebar={() => setSidebarOpen(false)}
                onSelectShow={handleSelectShow}
                onDeselectShow={handleDeselectShow}
                showSelected={selectedShowHistory !== null}
                selectedShowId={selectedShowId}
                t={t}
                lang={lang}
                isMobile={true}
                refreshKey={sidebarRefreshKey}
              />
            </div>
          </>
        )}

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col items-center py-12 px-2 transition-all duration-300 ${user ? "mt-8 md:mt-0" : "-mt-4 md:-mt-8"}`}
        >
          {!user && <div className="mb-8" />}
          {!sidebarOpen && user && (
            <button
              className="fixed top-6 left-6 z-50 bg-zinc-900/80 hover:bg-zinc-800 transition-colors rounded-full p-2 shadow-lg border border-zinc-700"
              onClick={() => setSidebarOpen(true)}
              aria-label="Show sidebar"
            >
              <ChevronRightIcon className="h-6 w-6 text-white transition-transform duration-300" />
            </button>
          )}
          <LoadingOverlay
            isLoading={loading || personasLoading || selectedShowLoading}
          />
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
          {selectedShowHistory ? (
            <>
              <ShowHistory
                ref={showHistoryRef}
                history={selectedShowHistory}
                lang={lang}
                ttsMode={selectedShowTtsMode}
                comedian1Persona={selectedComedian1}
                comedian2Persona={selectedComedian2}
                personas={personas}
                t={t}
                loading={selectedShowLoading}
                voiceIds={voiceIds}
              />
            </>
          ) : (
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
          )}
        </div>
      </div>
      <Footer
        className={`fixed bottom-0 z-40 transition-all duration-300 ${
          user && sidebarOpen
            ? "md:left-72 left-0 right-0 w-auto rounded-tr-2xl"
            : "left-0 right-0 w-full rounded-tl-2xl rounded-tr-2xl"
        }`}
      />
    </>
  );
}
