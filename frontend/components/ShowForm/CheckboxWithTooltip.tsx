import { Tooltip } from '../shared/Tooltip';

interface CheckboxWithTooltipProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  tooltip: string;
}

const COMMON_CLASSES = {
  checkbox: "form-checkbox h-5 w-5 text-blue-600",
  checkboxContainer: "flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200",
} as const;

export function CheckboxWithTooltip({ checked, onChange, label, tooltip }: CheckboxWithTooltipProps) {
  return (
    <div className={COMMON_CLASSES.checkboxContainer}>
      <input 
        type="checkbox" 
        className={COMMON_CLASSES.checkbox} 
        checked={checked} 
        onChange={e => onChange(e.target.checked)} 
      />
      <span className="relative flex items-center">
        {label}
        <Tooltip tooltipText={tooltip} />
      </span>
    </div>
  );
} 