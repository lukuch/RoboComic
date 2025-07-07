import { useState } from "react";
import { tts } from "../../services/apiService";
import { ChatBubble } from "./ChatBubble";
import { ManagerBubble } from "./ManagerBubble";
import { ErrorDisplay } from "../../app/Home/ErrorDisplay";

interface ShowHistoryProps {
  history: { role: string; content: string }[];
  lang: string;
  ttsMode: boolean;
  comedian1Persona: string;
  comedian2Persona: string;
  personas: {
    [key: string]: { description: string; description_pl: string };
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

export default function ShowHistory({
  history,
  lang,
  ttsMode,
  comedian1Persona,
  comedian2Persona,
  personas,
}: ShowHistoryProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [ttsCache, setTtsCache] = useState<{ [key: string]: string }>({});
  const [ttsError, setTtsError] = useState<string | null>(null); // Add error state

  async function handlePlay(text: string, idx: number) {
    setLoadingIdx(idx);
    setPlayingIdx(null);
    setAudioUrl(null);
    setTtsError(null); // Reset error on new play
    const cacheKey = text + "|" + lang;
    if (ttsCache[cacheKey]) {
      setAudioUrl(ttsCache[cacheKey]);
      setPlayingIdx(idx);
      setLoadingIdx(null);
      return;
    }
    try {
      const url = await tts(text, lang);
      setTtsCache((prev) => ({ ...prev, [cacheKey]: url }));
      setAudioUrl(url);
      setPlayingIdx(idx);
    } catch {
      setTtsError(
        "Text-to-speech is temporarily unavailable (likely out of credits). Please try again later or contact support.",
      );
    } finally {
      setLoadingIdx(null);
    }
  }

  if (!history.length) {
    return null;
  }

  // Find the first chat manager message and the rest
  const managerIdx = history.findIndex((msg) =>
    msg.role.toLowerCase().includes("manager"),
  );
  const managerMsg = managerIdx !== -1 ? history[managerIdx] : null;
  const rest = history.filter((msg, i) => i !== managerIdx);

  // Group chat bubbles by round (4 bubbles per round)
  const bubblesPerRound = 4;
  const rounds = [];
  for (let i = 0; i < rest.length; i += bubblesPerRound) {
    rounds.push(rest.slice(i, i + bubblesPerRound));
  }

  return (
    <section className="w-full flex flex-col items-center mt-12">
      <ErrorDisplay error={ttsError} onDismiss={() => setTtsError(null)} />
      <div className="w-full max-w-4xl flex flex-col gap-8 items-center">
        {/* Chat manager bubble center-aligned above the rest */}
        {managerMsg && <ManagerBubble message={managerMsg} />}
        {/* Grouped chat bubbles by round */}
        {rounds.map((round, roundIdx) => (
          <div
            key={roundIdx}
            className="w-full flex flex-col items-center mb-2"
          >
            <div className="flex items-center w-full mb-7 -mt-1">
              <div className="flex-grow border-t border-gray-700 opacity-50"></div>
              <span className="mx-4 px-4 py-1 rounded-full bg-gradient-to-r from-blue-800/80 to-purple-800/80 text-blue-100 text-xs font-bold shadow border border-blue-700 tracking-wide">
                🥊 Round {roundIdx + 1}
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
                    ? comedian1Persona
                    : comedian2Persona;
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
                    onPlayTTS={handlePlay}
                    playingIdx={playingIdx}
                    loadingIdx={loadingIdx}
                    audioUrl={audioUrl}
                    onAudioEnd={() => setPlayingIdx(null)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
