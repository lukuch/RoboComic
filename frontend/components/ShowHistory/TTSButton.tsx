interface TTSButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function TTSButton({ onClick, disabled, loading }: TTSButtonProps) {
  return (
    <button
      data-testid="tts-button"
      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold p-2 rounded-full shadow transition disabled:opacity-50 flex items-center justify-center group"
      onClick={onClick}
      disabled={disabled}
      title="Play TTS"
    >
      {loading ? (
        <span className="flex items-center justify-center h-5 w-7">
          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
        </span>
      ) : (
        <span className="flex items-end justify-center gap-[1.5px] h-5 w-7">
          <span className="block w-[2px] h-2 bg-white rounded-full group-hover:h-5 transition-all duration-200"></span>
          <span className="block w-[2px] h-4 bg-white rounded-full group-hover:h-3 transition-all duration-200"></span>
          <span className="block w-[2px] h-3 bg-white rounded-full group-hover:h-4 transition-all duration-200"></span>
          <span className="block w-[2px] h-5 bg-white rounded-full group-hover:h-2 transition-all duration-200"></span>
          <span className="block w-[2px] h-3 bg-white rounded-full group-hover:h-5 transition-all duration-200"></span>
          <span className="block w-[2px] h-2 bg-white rounded-full group-hover:h-4 transition-all duration-200"></span>
          <span className="block w-[2px] h-4 bg-white rounded-full group-hover:h-3 transition-all duration-200"></span>
        </span>
      )}
    </button>
  );
}
