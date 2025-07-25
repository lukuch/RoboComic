import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Tooltip from "../shared/Tooltip";

interface TTSButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  cached?: boolean;
}

export function TTSButton({
  onClick,
  disabled,
  loading,
  cached,
}: TTSButtonProps) {
  return (
    <button
      data-testid="tts-button"
      className="relative bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold p-2 rounded-full shadow transition disabled:opacity-50 flex items-center justify-center group"
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? (
        <Tooltip content="Play TTS">
          <span className="flex items-center justify-center h-5 w-7">
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
          </span>
        </Tooltip>
      ) : (
        <>
          <Tooltip content="Play TTS">
            <span className="flex items-end justify-center gap-[1.5px] h-5 w-7">
              <span className="block w-[2px] h-2 bg-white rounded-full group-hover:h-5 transition-all duration-200"></span>
              <span className="block w-[2px] h-4 bg-white rounded-full group-hover:h-3 transition-all duration-200"></span>
              <span className="block w-[2px] h-3 bg-white rounded-full group-hover:h-4 transition-all duration-200"></span>
              <span className="block w-[2px] h-5 bg-white rounded-full group-hover:h-2 transition-all duration-200"></span>
              <span className="block w-[2px] h-3 bg-white rounded-full group-hover:h-5 transition-all duration-200"></span>
              <span className="block w-[2px] h-2 bg-white rounded-full group-hover:h-4 transition-all duration-200"></span>
              <span className="block w-[2px] h-4 bg-white rounded-full group-hover:h-3 transition-all duration-200"></span>
            </span>
          </Tooltip>
          {cached && (
            <CheckCircleIcon className="h-4 w-4 text-green-300 ml-1" />
          )}
        </>
      )}
    </button>
  );
}
