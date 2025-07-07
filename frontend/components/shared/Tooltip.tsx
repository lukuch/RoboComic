interface TooltipProps {
  tooltipText: string;
}

export function Tooltip({ tooltipText }: TooltipProps) {
  return (
    <span className="relative group">
      <span className="ml-2 text-blue-500 cursor-pointer">
        ?
        <span className="absolute left-1/2 -translate-x-1/2 mb-2 bottom-full w-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs rounded-lg shadow-lg px-3 py-2 z-30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none">
          {tooltipText}
        </span>
      </span>
    </span>
  );
}
