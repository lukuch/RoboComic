"use client";
import React, { useState } from "react";

export default function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 whitespace-nowrap rounded-lg bg-gray-900 text-white text-xs px-3 py-1 shadow-lg border border-gray-700">
          {content}
        </span>
      )}
    </span>
  );
}
