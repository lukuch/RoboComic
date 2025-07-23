"use client";

import { useState, useRef } from "react";
import Home from "./Home";
import AuthForm from "../components/Auth/AuthForm";
import { useAuth } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";
import Tooltip from "../components/shared/Tooltip";
import { TRANSLATIONS } from "./Home/translations";
import { DEFAULTS } from "../constants";
import { useLanguage } from "../hooks/useLanguage";
import type { TranslationStrings } from "../types";

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const { user, signOut } = useAuth();
  const { lang, setLang } = useLanguage(DEFAULTS.LANGUAGE);
  const t: TranslationStrings = TRANSLATIONS[lang as "en" | "pl"];
  const modalRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut();
    setShowAuth(false);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {user ? (
          <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 px-5 py-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <Tooltip content={user.email || ""}>
              <span className="text-gray-900 dark:text-gray-100 font-semibold truncate max-w-[160px] cursor-pointer">
                {user.email}
              </span>
            </Tooltip>
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-red-600 hover:to-pink-600 transition"
            >
              {t.logoutButton}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-2"
          >
            <FaUser className="text-xl" />
            {t.loginButton}
          </button>
        )}
      </div>
      <Home lang={lang} setLang={setLang} t={t} />
      {showAuth && !user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onMouseDown={(e) => {
            // Only close if clicking the overlay, not the modal content
            if (
              modalRef.current &&
              !modalRef.current.contains(e.target as Node)
            ) {
              setShowAuth(false);
            }
          }}
        >
          <div className="relative" ref={modalRef}>
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <AuthForm lang={lang} t={t} />
          </div>
        </div>
      )}
    </>
  );
}
