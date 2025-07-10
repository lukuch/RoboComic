import React from "react";

export function SkeletonBubble({ align }: { align: "left" | "right" }) {
  return (
    <div className={`mb-4 ${align === "left" ? "self-start" : "self-end"}`}>
      <div
        className={`animate-pulse bg-gray-200 dark:bg-blue-900/60 rounded-2xl shadow-md px-12 py-10 w-[36rem] max-w-full h-36 flex flex-col gap-6`}
        style={{ minWidth: 330 }}
        data-testid="skeleton-bubble"
      >
        <div className="h-7 w-11/12 bg-gray-300 dark:bg-blue-800/80 rounded mb-3" />
        <div className="h-7 w-full bg-gray-300 dark:bg-blue-800/80 rounded mb-3" />
        <div className="h-7 w-3/4 bg-gray-300 dark:bg-blue-800/80 rounded" />
      </div>
    </div>
  );
}
