import Tooltip from "../shared/Tooltip";
import { FaRegQuestionCircle } from "react-icons/fa";

interface CheckboxWithTooltipProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  tooltip: string;
}

export function CheckboxWithTooltip({
  checked,
  onChange,
  label,
  tooltip,
}: CheckboxWithTooltipProps) {
  return (
    <label className="flex items-center gap-3 font-semibold text-gray-700 dark:text-gray-200 cursor-pointer select-none">
      <span className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer appearance-none w-6 h-6 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 checked:bg-gradient-to-br checked:from-blue-500 checked:to-blue-400 transition-colors duration-200 focus:outline-none shadow-sm"
        />
        <span className="pointer-events-none absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M4 8.5L7 11.5L12 5.5"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <span className="relative flex items-center">
        {label}
        <Tooltip content={tooltip}>
          <FaRegQuestionCircle
            className="ml-2 text-blue-500 hover:text-blue-600 transition cursor-pointer align-middle"
            size={16}
          />
        </Tooltip>
      </span>
    </label>
  );
}
