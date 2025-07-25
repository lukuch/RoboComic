import { useEffect, useState } from "react";
import WinnerSummary from "./WinnerSummary";
import { judgeShow } from "../../services/apiService";
import { ChatMessage } from "../../types";
import type { TranslationStrings } from "../../types";
import type { Persona } from "../../types";
import { LuSparkles } from "react-icons/lu";

interface JudgingSectionProps {
  comedian1Name: string;
  comedian2Name: string;
  history: ChatMessage[];
  judged: boolean;
  setJudged: (v: boolean) => void;
  winner: string | null;
  setWinner: (v: string) => void;
  summary: string | null;
  setSummary: (v: string) => void;
  lang: string;
  t: TranslationStrings;
  personas?: Record<string, Persona> | null;
}

export default function JudgingSection({
  comedian1Name,
  comedian2Name,
  history,
  judged,
  setJudged,
  winner,
  setWinner,
  summary,
  setSummary,
  lang,
  t,
  personas,
}: JudgingSectionProps) {
  const [judging, setJudging] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [shinePos, setShinePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const buttonRef = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setTriggered(false);
  }, [history]);

  useEffect(() => {
    if (!triggered || !history.length || judged) {
      return;
    }
    setJudging(true);
    judgeShow({
      comedian1_name: comedian1Name,
      comedian2_name: comedian2Name,
      history,
      lang,
    })
      .then((res) => {
        setWinner(res.winner);
        setSummary(res.summary);
        setJudged(true);
      })
      .finally(() => setJudging(false));
  }, [
    comedian1Name,
    comedian2Name,
    history,
    triggered,
    judged,
    setWinner,
    setSummary,
    setJudged,
    lang,
  ]);

  const showWinnerSummary = winner && summary;

  if (judged && showWinnerSummary) {
    return (
      <WinnerSummary
        winner={winner}
        summary={summary}
        t={t}
        personas={personas}
      />
    );
  }

  if (!triggered && !judged) {
    return (
      <div
        className="mt-10 flex flex-col items-center"
        data-testid="judging-section"
      >
        <button
          ref={buttonRef[1]}
          className="judge-duel-button-cyberpunk relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white text-xl font-bold py-4 px-10 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-cyan-400/50 overflow-hidden group"
          onClick={() => setTriggered(true)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setShinePos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
          onMouseLeave={() => setShinePos(null)}
        >
          {/* Cyberpunk animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-cyberpunk-gradient rounded-full"></div>
          {/* Neon border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          {/* Scanning line effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-out rounded-full"></div>
          {/* Electric pulse effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-pulse"></div>
          {/* Cursor-following shine */}
          {shinePos && (
            <div
              className="pointer-events-none absolute inset-0 rounded-full z-20 transition-opacity duration-200"
              style={{
                background: `radial-gradient(600px circle at ${shinePos.x}px ${shinePos.y}px, rgba(255,255,255,0.18) 0%, rgba(59,130,246,0.10) 40%, transparent 80%)`,
                opacity: 1,
              }}
            />
          )}
          {/* Content */}
          <div className="relative z-10 flex items-center gap-3 drop-shadow-lg">
            <LuSparkles className="w-7 h-7 text-yellow-300 drop-shadow-sm animate-sparkle-slow" />
            <span className="font-extrabold tracking-wider text-shadow-neon">
              {t.judgeDuel}
            </span>
          </div>
        </button>
      </div>
    );
  }
  if (judging) {
    return (
      <div className="mt-10 text-center text-xl font-bold flex flex-col items-center gap-4 animate-pulse text-gray-800 dark:text-gray-100">
        <span className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 mr-3 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          {t.judgingDuel}
        </span>
      </div>
    );
  }
  if (showWinnerSummary) {
    return (
      <WinnerSummary
        winner={winner}
        summary={summary}
        t={t}
        personas={personas}
      />
    );
  }
  return null;
}
