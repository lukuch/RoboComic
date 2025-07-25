import React from "react";

export function SkeletonBubble({
  align,
  isFirst = false,
}: {
  align: "left" | "right";
  isFirst?: boolean;
}) {
  // Shimmer animation keyframes
  const shimmerStyle = {
    background:
      "linear-gradient(90deg, rgba(200,200,200,0.1) 25%, rgba(200,200,200,0.3) 50%, rgba(200,200,200,0.1) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite linear",
  };

  return (
    <div
      className={`w-full flex ${align === "left" ? "justify-start" : "justify-end"} mb-4 ${isFirst ? "mt-8" : "mt-0"}`}
    >
      <div
        className={`flex items-end gap-2 max-w-[95vw] sm:max-w-[36rem] w-full`}
      >
        {/* Avatar Placeholder */}
        {align === "left" && (
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-blue-900/60 animate-pulse flex-shrink-0" />
        )}
        {/* Bubble Skeleton */}
        <div
          className={`relative flex flex-col gap-2 px-4 py-3 sm:px-8 sm:py-6 rounded-2xl ${align === "left" ? "rounded-bl-md" : "rounded-br-md"} bg-gray-200 dark:bg-blue-900/60 shadow-md box-border w-full max-w-[80vw] sm:max-w-[40rem] animate-pulse`}
          data-testid="skeleton-bubble"
        >
          {/* Shimmer overlay */}
          <style>{`
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `}</style>
          <div
            className="h-4 w-3/4 rounded bg-gray-300 dark:bg-blue-800/80 mb-2"
            style={shimmerStyle}
          />
          <div
            className="h-4 w-full rounded bg-gray-300 dark:bg-blue-800/80 mb-2"
            style={shimmerStyle}
          />
          <div
            className="h-4 w-2/5 rounded bg-gray-300 dark:bg-blue-800/80"
            style={shimmerStyle}
          />
        </div>
        {/* Avatar Placeholder for right alignment */}
        {align === "right" && (
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-blue-900/60 animate-pulse flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
