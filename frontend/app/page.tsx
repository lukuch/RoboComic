"use client";

import { useState, useRef } from "react";
import Home from "./Home";
import AuthForm from "../components/Auth/AuthForm";
import { useAuth } from "../context/AuthContext";
import { FiLogIn, FiLogOut } from "react-icons/fi";
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
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    await signOut();
    setShowAuth(false);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {user ? (
          <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 dark:bg-gray-900/60 backdrop-blur-md border border-white/20 shadow-lg min-h-[48px]">
            <Tooltip content={user.email || ""}>
              <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base drop-shadow-sm tracking-wide select-all">
                {user.email ? (
                  <>
                    <span className="block sm:hidden">
                      {user.email.split("@")[0]}@
                    </span>
                    <span className="hidden sm:block">{user.email}</span>
                  </>
                ) : (
                  ""
                )}
              </span>
            </Tooltip>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-150 text-xs sm:text-sm"
            >
              <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              {t.logoutButton}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 dark:bg-gray-900/60 backdrop-blur-md border border-white/20 shadow-lg min-h-[48px]">
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-150 text-xs sm:text-sm"
            >
              <FiLogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              {t.loginButton}
            </button>
          </div>
        )}
      </div>
      <div
        className={`min-h-screen flex flex-row w-full relative pb-16 ${!isLoggedIn ? "mt-4 sm:mt-0" : ""}`}
      >
        <Home lang={lang} setLang={setLang} t={t} />
      </div>
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
