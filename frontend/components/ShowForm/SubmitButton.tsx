import { FaMicrophone } from 'react-icons/fa';

interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  submitText: string;
}

export function SubmitButton({ loading, loadingText, submitText }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 focus:outline-none hover:scale-105 active:scale-95 overflow-hidden transition-all duration-200 group"
      disabled={loading}
    >
      {/* Animated shimmer gradient overlay */}
      <span className="absolute inset-0 rounded-xl pointer-events-none group-hover:before:opacity-100 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:blur-sm before:animate-shimmer" />
      {loading ? (
        <span className="flex items-center gap-2 z-10">
          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        <>
          <span className="text-xl z-10 group-hover:animate-pulse">
            <FaMicrophone />
          </span>
          <span className="z-10">{submitText}</span>
        </>
      )}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .before\:animate-shimmer::before {
          animation: shimmer 1.5s linear infinite;
        }
      `}</style>
    </button>
  );
} 