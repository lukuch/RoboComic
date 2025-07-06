import { FormLabel } from './FormLabel';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export function FormInput({ label, value, onChange, placeholder, disabled }: FormInputProps) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <input 
        className="w-full rounded-xl bg-white/10 dark:bg-gray-800/40 border border-gray-400 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition px-4 py-2 text-base placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 disabled:cursor-not-allowed" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        disabled={disabled}
      />
    </div>
  );
} 