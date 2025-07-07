import { FormLabel } from "./FormLabel";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  tooltip?: string;
}

const COMMON_CLASSES = {
  numberButton:
    "flex items-center justify-center w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-500 text-slate-600 dark:text-slate-300 font-semibold text-lg transition-all duration-300 ease-out hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
} as const;

export function NumberInput({
  value,
  onChange,
  min,
  max,
  label,
  tooltip,
}: NumberInputProps) {
  return (
    <div>
      <FormLabel tooltip={tooltip}>{label}</FormLabel>
      <div className="relative">
        <div className="flex items-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-800/50 dark:via-blue-900/20 dark:to-indigo-900/10 border border-slate-200/60 dark:border-slate-600/40 rounded-3xl shadow-xl shadow-blue-500/10 dark:shadow-blue-500/5 overflow-hidden backdrop-blur-sm">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            className={`${COMMON_CLASSES.numberButton} rounded-r-2xl`}
            disabled={value <= min}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
          <div className="flex-1 flex items-center justify-center py-6 px-8">
            <div className="text-center">
              <span className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 dark:from-slate-200 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent leading-none">
                {value}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 tracking-wide">
                ROUNDS
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            className={`${COMMON_CLASSES.numberButton} rounded-l-2xl`}
            disabled={value >= max}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
