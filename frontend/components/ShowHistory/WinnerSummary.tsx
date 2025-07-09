import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { toTitleCase } from "../../utils/stringUtils";
import type { TranslationStrings } from "../../types";

interface WinnerSummaryProps {
  winner: string;
  summary: string;
  t: TranslationStrings;
}

export default function WinnerSummary({
  winner,
  summary,
  t,
}: WinnerSummaryProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 7000); // 7 seconds
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    return () => clearTimeout(timer);
  }, [winner]);

  const formattedWinner = toTitleCase(winner.replace(/_/g, " "));
  const winnerRegex = new RegExp(winner.replace(/_/g, "[_ ]"), "gi");
  const formattedSummary = summary.replace(winnerRegex, formattedWinner);

  return (
    <div
      className="mt-10 w-full flex flex-col items-center justify-center"
      style={{ position: "relative" }}
    >
      {showConfetti && typeof window !== "undefined" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={400}
            initialVelocityY={15}
            run={showConfetti}
          />
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-4 animate-bounce-in">
        <div className="text-5xl font-extrabold mb-2 flex items-center justify-center gap-3 text-yellow-400 drop-shadow-lg">
          <span role="img" aria-label="trophy">
            🏆
          </span>
          {formattedWinner}
          <span role="img" aria-label="trophy">
            🏆
          </span>
        </div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-300 mb-2 animate-fade-in">
          {t.congratulations}
        </div>
      </div>
      <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-2xl px-8 py-6 shadow-lg text-lg font-semibold max-w-xl mx-auto border-2 border-yellow-400 dark:border-yellow-700 mt-4 animate-fade-in">
        {formattedSummary}
      </div>
    </div>
  );
}
