interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  submitText: string;
}

export function SubmitButton({ loading, loadingText, submitText }: SubmitButtonProps) {
  return (
    <button 
      type="submit" 
      className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-xl font-bold text-lg shadow hover:from-blue-700 hover:to-blue-500 transition disabled:opacity-50" 
      disabled={loading}
    >
      {loading ? loadingText : submitText}
    </button>
  );
} 