import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      type="button"
      className="flex items-center pl-2 pr-2 py-2 rounded-full bg-white/30 dark:bg-gray-800/60 shadow-md border-none focus:ring-2 focus:ring-blue-400 text-sm font-semibold transition hover:bg-white/50 dark:hover:bg-gray-700/80 outline-none min-w-[56px] text-gray-800 dark:text-gray-100"
      style={{ width: "90px", height: "40px" }}
    >
      <div className="relative w-16 h-7 flex items-center">
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors" />
        {/* Knob */}
        <span
          className={`absolute top-0 left-0 w-7 h-7 rounded-full transition-transform duration-300 flex items-center justify-center shadow-md bg-white dark:bg-gray-900 ${theme === "dark" ? "translate-x-9" : "translate-x-0"}`}
          style={{ top: 0 }}
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 text-gray-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 text-yellow-400"
            >
              <circle cx="12" cy="12" r="5" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </g>
            </svg>
          )}
        </span>
      </div>
    </button>
  );
}
