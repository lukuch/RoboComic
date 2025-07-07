import { useState } from "react";
import CountryFlag from "react-country-flag";
import { LANGUAGES } from "./translations";

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

export function LanguageSelector({
  currentLang,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentLanguage = LANGUAGES.find((l) => l.code === currentLang)!;

  return (
    <div className="w-full max-w-2xl flex justify-end mb-6 relative z-10">
      <div className="relative">
        <button
          className="flex items-center gap-2 pl-4 pr-6 py-2 rounded-full bg-white/30 dark:bg-gray-800/60 shadow-md border-none focus:ring-2 focus:ring-blue-400 text-sm font-semibold transition hover:bg-white/50 dark:hover:bg-gray-700/80 outline-none min-w-[110px]"
          onClick={() => setDropdownOpen((v) => !v)}
          type="button"
        >
          <CountryFlag
            countryCode={currentLanguage.flag}
            svg
            style={{ width: "1.5em", height: "1.5em" }}
          />
          {currentLanguage.label}
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 ring-1 ring-black/10 z-20">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-blue-100 dark:hover:bg-blue-900 transition ${currentLang === l.code ? "font-bold" : ""}`}
                onClick={() => {
                  onLanguageChange(l.code);
                  setDropdownOpen(false);
                }}
                type="button"
              >
                <CountryFlag
                  countryCode={l.flag}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
