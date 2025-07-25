import { useState, useEffect, forwardRef } from "react";
import {
  tts,
  getCachedTTS,
  uploadTTSAudio,
  insertTTSMetadata,
} from "../../services/apiService";
import { ChatBubble } from "./ChatBubble";
import { ManagerBubble } from "./ManagerBubble";
import { ErrorDisplay } from "../../app/Home/ErrorDisplay";
import JudgingSection from "./JudgingSection";
import type { TranslationStrings } from "../../types";
import { SkeletonBubble } from "./SkeletonBubble";
import type { Persona } from "../../types";
import { supabase } from "../../utils/supabaseClient";

interface ShowHistoryProps {
  history: { role: string; content: string }[];
  lang: string;
  ttsMode: boolean;
  comedian1Persona: string;
  comedian2Persona: string;
  personas: {
    [key: string]: { description: string; description_pl: string };
  } | null;
  t: TranslationStrings;
  loading?: boolean;
  voiceIds?: {
    comedian1_voice_id: string;
    comedian2_voice_id: string;
  } | null;
}

const bubbleColors = [
  "bg-blue-100 dark:bg-blue-800",
  "bg-green-100 dark:bg-green-800",
  "bg-purple-100 dark:bg-purple-800",
  "bg-pink-100 dark:bg-pink-800",
  "bg-yellow-100 dark:bg-yellow-800",
  "bg-gray-100 dark:bg-gray-700",
];

// Helper to get persona name from string or object
function getPersonaName(persona: Persona | string | undefined): string {
  if (!persona) {
    return "";
  }
  if (typeof persona === "string") {
    return persona;
  }
  if (typeof persona === "object" && "name" in persona) {
    return persona.name;
  }
  return "";
}

// Helper to generate a SHA-256 hash for TTS cache key
async function getTTSCacheKeyHash(
  text: string,
  lang: string,
  voiceId: string | undefined,
): Promise<string> {
  const msg = `${text}|${lang}|${voiceId ?? ""}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(msg);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const ShowHistory = forwardRef<HTMLDivElement, ShowHistoryProps>(
  function ShowHistory(
    {
      history,
      lang,
      ttsMode,
      comedian1Persona,
      comedian2Persona,
      personas,
      t,
      loading = false,
      voiceIds,
    },
    ref,
  ) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [playingIdx, setPlayingIdx] = useState<number | null>(null);
    const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
    const [activeAudioIdx, setActiveAudioIdx] = useState<number | null>(null);
    const [ttsError, setTtsError] = useState<string | null>(null);
    const [judged, setJudged] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [cachedTTS, setCachedTTS] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
      setJudged(false);
      setWinner(null);
      setSummary(null);
      setAudioUrl(null);
      setPlayingIdx(null);
    }, [history]);

    // Check Supabase for cached TTS for all messages when history/lang/voiceIds change
    useEffect(() => {
      if (!ttsMode || !voiceIds) {
        return;
      }
      let isMounted = true;
      const checkAll = async () => {
        const newCache: { [key: string]: boolean } = {};
        const rest = history.filter(
          (msg) => !msg.role.toLowerCase().includes("manager"),
        );
        const cacheKeyPairs: { key: string; hash: string }[] = [];
        for (let i = 0; i < rest.length; i++) {
          const msg = rest[i];
          const voiceId =
            i % 2 === 0
              ? voiceIds.comedian1_voice_id
              : voiceIds.comedian2_voice_id;
          const hash = await getTTSCacheKeyHash(msg.content, lang, voiceId);
          cacheKeyPairs.push({
            key: `${msg.content}|${lang}|${voiceId ?? ""}`,
            hash,
          });
        }
        const hashes = cacheKeyPairs.map((pair) => pair.hash);
        if (hashes.length === 0) {
          if (isMounted) {
            setCachedTTS({});
          }
          return;
        }
        // Batch query Supabase for all cacheKey hashes
        const { data } = await supabase
          .from("tts_audio")
          .select("cache_key")
          .in("cache_key", hashes);
        const foundKeys = new Set(
          (data || []).map((row: { cache_key: string }) => row.cache_key),
        );
        for (const pair of cacheKeyPairs) {
          newCache[pair.hash] = foundKeys.has(pair.hash);
        }
        if (isMounted) {
          setCachedTTS(newCache);
        }
      };
      checkAll();
      return () => {
        isMounted = false;
      };
    }, [history, ttsMode, voiceIds, lang]);

    async function handlePlay(
      text: string,
      idx: number,
      voiceId: string,
    ): Promise<void> {
      setLoadingIdx(idx);
      setPlayingIdx(null);
      setAudioUrl(null);
      setTtsError(null); // Reset error on new play
      setActiveAudioIdx(idx);
      const cacheKeyHash = await getTTSCacheKeyHash(text, lang, voiceId);
      // 2. Check Supabase persistent cache
      const supabaseUrl = await getCachedTTS(cacheKeyHash);
      if (supabaseUrl) {
        setAudioUrl(supabaseUrl);
        setPlayingIdx(idx);
        setLoadingIdx(null);
        return;
      }
      // 3. Generate TTS, upload to Supabase, and cache
      try {
        // Generate TTS (returns a Blob)
        const blob = await tts(text, lang, voiceId);
        // For instant playback, create a local URL
        const blobUrl = URL.createObjectURL(blob);
        // Upload to Supabase Storage
        const publicUrl = await uploadTTSAudio(cacheKeyHash, blob);
        if (publicUrl) {
          await insertTTSMetadata(cacheKeyHash, publicUrl);
          setAudioUrl(publicUrl);
          setPlayingIdx(idx);
          setCachedTTS((prev: { [key: string]: boolean }) => ({
            ...prev,
            [cacheKeyHash]: true,
          }));
        } else {
          // Fallback to blobUrl if upload fails
          setAudioUrl(blobUrl);
          setPlayingIdx(idx);
        }
      } catch (err) {
        if ((err as { status?: number }).status === 429) {
          setTtsError(
            "You have reached the TTS usage limit. Please wait before trying again.",
          );
        } else {
          setTtsError(
            "Text-to-speech is temporarily unavailable (likely out of credits). Please try again later or contact support.",
          );
        }
      } finally {
        setLoadingIdx(null);
      }
    }

    const [cacheKeyHashes, setCacheKeyHashes] = useState<string[]>([]);
    useEffect(() => {
      let isMounted = true;
      const computeHashes = async () => {
        const rest = history.filter(
          (msg) => !msg.role.toLowerCase().includes("manager"),
        );
        const hashes: string[] = [];
        for (let i = 0; i < rest.length; i++) {
          const msg = rest[i];
          const voiceId =
            i % 2 === 0
              ? voiceIds?.comedian1_voice_id
              : voiceIds?.comedian2_voice_id;
          const hash = await getTTSCacheKeyHash(msg.content, lang, voiceId);
          hashes.push(hash);
        }
        if (isMounted) {
          setCacheKeyHashes(hashes);
        }
      };
      computeHashes();
      return () => {
        isMounted = false;
      };
    }, [history, ttsMode, voiceIds, lang]);

    if (loading && (!history || history.length === 0)) {
      // Hide the main spinner in LoadingOverlay when skeletons are shown
      const skeletonAligns = ["right", "left", "right", "left"];
      return (
        <section className="w-full h-[60vh] flex flex-col justify-center items-center mt-6">
          <div className="flex flex-col gap-6 items-center w-full max-w-md">
            {skeletonAligns.map((align, idx) => {
              return (
                <SkeletonBubble
                  key={idx}
                  align={align as "left" | "right"}
                  isFirst={idx === 0}
                />
              );
            })}
          </div>
        </section>
      );
    }

    if (!history.length || (ttsMode && !voiceIds)) {
      return null;
    }

    // Find the first chat manager message and the rest
    const managerIdx = history.findIndex((msg) =>
      msg.role.toLowerCase().includes("manager"),
    );
    const managerMsg = managerIdx !== -1 ? history[managerIdx] : null;
    const rest = history.filter((msg, i) => i !== managerIdx);
    const bubblesPerRound = 4;
    const rounds = [];
    for (let i = 0; i < rest.length; i += bubblesPerRound) {
      rounds.push(rest.slice(i, i + bubblesPerRound));
    }

    return (
      <section className="w-full flex flex-col items-center mt-12">
        <ErrorDisplay error={ttsError} onDismiss={() => setTtsError(null)} />
        <div className="w-full max-w-4xl flex flex-col gap-8 items-center">
          {managerMsg && (
            <div ref={ref}>
              <ManagerBubble message={managerMsg} />
            </div>
          )}
          {rounds.map((round, roundIdx) => (
            <div
              key={roundIdx}
              className="w-full flex flex-col items-center mb-2"
            >
              <div className="flex items-center w-full mb-7 -mt-1">
                <div className="flex-grow border-t border-gray-700 opacity-50"></div>
                <span className="mx-4 px-4 py-1 rounded-full bg-gradient-to-r from-blue-800/80 to-purple-800/80 text-blue-100 text-xs font-bold shadow border border-blue-700 tracking-wide">
                  🥊 {t.round} {roundIdx + 1}
                </span>
                <div className="flex-grow border-t border-gray-700 opacity-50"></div>
              </div>
              <div className="flex flex-col gap-5 w-full">
                {round.map((msg, i) => {
                  const align =
                    (roundIdx * bubblesPerRound + i) % 2 === 0
                      ? "items-start"
                      : "items-end";
                  const bubbleColor =
                    bubbleColors[
                      (roundIdx * bubblesPerRound + i) % bubbleColors.length
                    ];
                  const personaKey =
                    (roundIdx * bubblesPerRound + i) % 2 === 0
                      ? getPersonaName(comedian1Persona)
                      : getPersonaName(comedian2Persona);
                  const voiceId =
                    (roundIdx * bubblesPerRound + i) % 2 === 0
                      ? voiceIds?.comedian1_voice_id
                      : voiceIds?.comedian2_voice_id;
                  const hashIdx = roundIdx * bubblesPerRound + i;
                  const cacheKeyHash = cacheKeyHashes[hashIdx] || "";
                  const isCached = !!cachedTTS[cacheKeyHash];
                  const comedianType =
                    (roundIdx * bubblesPerRound + i) % 2 === 0
                      ? "comedian1"
                      : "comedian2";
                  return (
                    <ChatBubble
                      key={i}
                      message={msg}
                      index={roundIdx * bubblesPerRound + i}
                      personaKey={personaKey}
                      personas={personas}
                      lang={lang}
                      bubbleColor={bubbleColor}
                      align={align}
                      ttsMode={ttsMode}
                      onPlayTTS={(text, idx) =>
                        handlePlay(text, idx, voiceId ?? "")
                      }
                      playingIdx={playingIdx}
                      loadingIdx={loadingIdx}
                      audioUrl={audioUrl}
                      onAudioEnd={() => setPlayingIdx(null)}
                      cached={isCached}
                      comedianType={comedianType}
                      t={t}
                      activeAudioIdx={activeAudioIdx}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <JudgingSection
            comedian1Name={getPersonaName(comedian1Persona)}
            comedian2Name={getPersonaName(comedian2Persona)}
            history={rest}
            judged={judged}
            setJudged={setJudged}
            winner={winner}
            setWinner={setWinner}
            summary={summary}
            setSummary={setSummary}
            lang={lang}
            t={t}
          />
        </div>
      </section>
    );
  },
);

export default ShowHistory;
