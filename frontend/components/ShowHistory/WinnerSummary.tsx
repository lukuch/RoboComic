import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { toTitleCase } from "../../utils/stringUtils";
import { LuSparkles } from "react-icons/lu";
import type { TranslationStrings } from "../../types";
import type { Persona } from "../../types";

interface WinnerSummaryProps {
  winner: string;
  summary: string;
  t: TranslationStrings;
  personas?: Record<string, Persona> | null;
}

export default function WinnerSummary({
  winner,
  summary,
  t,
  personas,
}: WinnerSummaryProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 7000);
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    return () => clearTimeout(timer);
  }, [winner]);

  const displayWinner =
    personas && personas[winner]?.description
      ? personas[winner].description
      : toTitleCase(winner.replace(/_/g, " "));
  const winnerRegex = new RegExp(winner.replace(/_/g, "[_ ]"), "gi");
  const formattedSummary = summary.replace(winnerRegex, displayWinner);

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
        <div className="relative text-5xl font-extrabold mb-2 flex items-center justify-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x drop-shadow-xl winner-animated-text">
          <LuSparkles className="text-yellow-300 drop-shadow-lg animate-sparkle-slow w-10 h-10" />
          <span className="winner-glow winner-gradient-text animate-gradient-x px-2">
            {displayWinner}
          </span>
          <LuSparkles className="text-yellow-300 drop-shadow-lg animate-sparkle-slow w-10 h-10" />
          {/* Floating sparkles */}
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
            <LuSparkles className="text-blue-400 animate-float-slow w-7 h-7 opacity-70" />
          </span>
          <span className="absolute right-8 bottom-0 pointer-events-none z-20">
            <LuSparkles className="text-pink-400 animate-float-slow w-6 h-6 opacity-60" />
          </span>
          <span className="absolute left-8 bottom-0 pointer-events-none z-20">
            <LuSparkles className="text-purple-400 animate-float-slow w-5 h-5 opacity-60" />
          </span>
        </div>
      </div>
      <div
        className="winner-summary-card supercool-glass-border relative rounded-3xl px-10 py-8 shadow-2xl text-lg font-semibold max-w-2xl mx-auto mt-8 animate-fade-in backdrop-blur-xl bg-white/20 dark:bg-gray-900/40 border-0 overflow-hidden"
        style={{
          color: "#5a3e1b",
          boxShadow:
            "0 8px 32px 0 rgba(59, 130, 246, 0.18), 0 1.5px 8px 0 rgba(139, 92, 246, 0.10)",
        }}
      >
        {/* Animated border overlay */}
        <span className="pointer-events-none absolute inset-0 rounded-3xl z-10 supercool-animated-border"></span>
        <div
          className="text-3xl font-extrabold text-green-600 dark:text-green-300 mb-4 text-center tracking-wide drop-shadow-sm animate-gradient-x winner-gradient-text"
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
