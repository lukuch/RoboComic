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
        <div className="relative text-5xl font-extrabold mb-2 flex items-center justify-center gap-3 text-yellow-400 drop-shadow-lg">
          <span role="img" aria-label="trophy">
            🏆
          </span>
          <span className="winner-glow">{formattedWinner}</span>
          <span role="img" aria-label="trophy">
            🏆
          </span>
        </div>
      </div>
      <div
        className="winner-summary-card rounded-3xl px-10 py-8 shadow-2xl text-lg font-semibold max-w-2xl mx-auto border border-yellow-300 dark:border-yellow-600 mt-8 animate-fade-in backdrop-blur-md bg-gradient-to-br from-yellow-100/80 via-yellow-200/90 to-orange-200/80 dark:from-yellow-900/70 dark:via-yellow-800/80 dark:to-orange-900/70 relative"
        style={{
          color: "#5a3e1b",
          boxShadow: "0 8px 32px 0 rgba(255, 167, 81, 0.25)",
        }}
      >
        <div
          className="text-3xl font-extrabold text-green-600 dark:text-green-300 mb-4 text-center tracking-wide drop-shadow-sm"
          style={{ letterSpacing: "0.03em" }}
        >
          {t.congratulations}
        </div>
        <div
          className="text-base md:text-xl font-medium text-brown-900 dark:text-yellow-100 text-center"
          style={{ lineHeight: 1.6 }}
        >
          {formattedSummary}
        </div>
      </div>
    </div>
  );
}
