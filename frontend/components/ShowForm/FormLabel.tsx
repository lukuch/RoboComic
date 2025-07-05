import { Tooltip } from '../shared/Tooltip';

interface FormLabelProps {
  children: React.ReactNode;
  tooltip?: string;
}

export function FormLabel({ children, tooltip }: FormLabelProps) {
  return (
    <label className={`block mb-2 font-semibold text-gray-700 dark:text-gray-200 ${tooltip ? 'relative' : ''}`}>
      {children}
      {tooltip && <Tooltip tooltipText={tooltip} />}
    </label>
  );
} 