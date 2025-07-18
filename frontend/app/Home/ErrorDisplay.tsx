import { useState, useEffect } from "react";

interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(100);
  const AUTO_CLOSE_MS = 10000;

  useEffect(() => {
    let closeTimer: NodeJS.Timeout | null = null;
    let progressTimer: NodeJS.Timeout | null = null;
    if (error) {
      setIsVisible(true);
      setIsAnimating(true);
      setProgress(100);
      // Animate progress bar
      const start = Date.now();
      progressTimer = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.max(0, 100 - (elapsed / AUTO_CLOSE_MS) * 100);
        setProgress(percent);
      }, 50);
      // Auto-close after 10s
      closeTimer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, 300);
      }, AUTO_CLOSE_MS);
    } else {
      setIsAnimating(false);
      closeTimer = setTimeout(() => setIsVisible(false), 300);
    }
    return () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
      }
      if (progressTimer) {
        clearInterval(progressTimer);
      }
    };
  }, [error, onDismiss]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      data-testid="error-display"
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 transition-all duration-300 ease-in-out ${
        isAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
        <div className="flex items-start p-4">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {error}
            </p>
          </div>
          {onDismiss && (
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={handleDismiss}
                className="inline-flex text-red-400 hover:text-red-600 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-md transition-colors"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-red-100 dark:bg-red-800">
          <div
            className="h-1 bg-red-400 dark:bg-red-500 transition-all duration-100 linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
