import { useEffect, useState } from "react";
import WinnerSummary from "./WinnerSummary";
import { judgeShow } from "../../services/apiService";
import { ChatMessage } from "../../types";
import type { TranslationStrings } from "../../types";
import type { Persona } from "../../types";

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
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200"
          onClick={() => setTriggered(true)}
        >
          <span role="img" aria-label="trophy">
            🏆
          </span>{" "}
          {t.judgeDuel}
        </button>
      </div>
    );
  }
  if (judging) {
    return (
      <div className="mt-10 text-center text-xl font-bold animate-pulse">
        {t.judgingDuel}
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
