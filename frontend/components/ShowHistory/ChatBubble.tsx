import { Avatar } from "./Avatar";
import { TTSButton } from "./TTSButton";
import { toTitleCase } from "../../utils/stringUtils";
import { useState, useRef, useEffect } from "react";

interface ChatBubbleProps {
  message: { role: string; content: string };
  index: number;
  personaKey: string;
  personas: {
    [key: string]: { description: string; description_pl: string };
  } | null;
  lang: string;
  bubbleColor: string;
  align: string;
  ttsMode: boolean;
  onPlayTTS: (text: string, idx: number) => void;
  playingIdx: number | null;
  loadingIdx: number | null;
  audioUrl: string | null;
  onAudioEnd: () => void;
}

export function ChatBubble({
  message,
  index,
  personaKey,
  personas,
  lang,
  bubbleColor,
  align,
  ttsMode,
  onPlayTTS,
  playingIdx,
  loadingIdx,
  audioUrl,
  onAudioEnd,
}: ChatBubbleProps) {
  const isComedian = !["manager", "chat_manager", "system"].includes(
    message.role.toLowerCase(),
  );
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<
    "left" | "center" | "right"
  >("center");
  const popupRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const persona = personas?.[personaKey];

  useEffect(() => {
    if (showPopup && popupRef.current && avatarRef.current) {
      const avatarRect = avatarRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Check if popup would go outside viewport
      const spaceLeft = avatarRect.left;
      const spaceRight = viewportWidth - avatarRect.right;
      const popupWidth = 256; // w-64 = 16rem = 256px

      if (spaceLeft < popupWidth / 2) {
        setPopupPosition("left");
      } else if (spaceRight < popupWidth / 2) {
        setPopupPosition("right");
      } else {
        setPopupPosition("center");
      }
    }
  }, [showPopup]);

  function stripQuotes(text: string) {
    return text.replace(/^[„"']+|[”"']+$/g, "");
  }

  return (
    <div className={`flex ${align} w-full`}>
      <div
        className={`flex gap-3 ${align === "items-end" ? "flex-row-reverse" : ""} w-fit`}
      >
        <div className={`relative flex ${align} mb-2`}>
          <div
            onMouseEnter={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}
            className="mr-2"
          >
            <div
              className={`relative flex flex-col items-center`}
              ref={avatarRef}
            >
              <Avatar role={personaKey} />
              {isComedian && showPopup && persona && (
                <div
                  ref={popupRef}
                  className={`absolute bottom-full mb-3 z-40 bg-gray-900/90 text-gray-100 rounded-2xl shadow-xl border border-gray-700 px-6 py-4 w-64 text-sm backdrop-blur ${
                    popupPosition === "left"
                      ? "left-0"
                      : popupPosition === "right"
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2"
                  }`}
                >
                  <div
                    className={`absolute bottom-[-14px] ${
                      popupPosition === "left"
                        ? "left-4"
                        : popupPosition === "right"
                          ? "right-4"
                          : "left-1/2 -translate-x-1/2"
                    }`}
                  >
                    <svg
                      width="28"
                      height="14"
                      viewBox="0 0 28 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon points="0,0 28,0 14,14" fill="#23272f" />
                    </svg>
                  </div>
                  <div className="font-bold mb-1">
                    {toTitleCase(personaKey.replace(/_/g, " "))}
                  </div>
                  <div>
                    {lang === "pl"
                      ? persona.description_pl
                      : persona.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`rounded-2xl px-6 py-4 shadow-md ${bubbleColor} max-w-[80vw] md:max-w-[70%] w-fit border border-gray-200 dark:border-gray-700`}
        >
          <div className="font-semibold mb-1 text-xs text-gray-500 dark:text-gray-300">
            {toTitleCase(personaKey)}
          </div>
          <div className="mb-3 whitespace-pre-line text-base leading-relaxed text-gray-900 dark:text-gray-100 font-medium">
            {stripQuotes(message.content)}
          </div>
          {ttsMode && !message.role.toLowerCase().includes("manager") && (
            <TTSButton
              onClick={() => onPlayTTS(message.content, index)}
              disabled={playingIdx === index || loadingIdx === index}
              loading={loadingIdx === index}
            />
          )}
          {audioUrl && playingIdx === index && (
            <audio
              src={audioUrl}
              controls
              autoPlay
              className="mt-2 w-full"
              onEnded={onAudioEnd}
            />
          )}
        </div>
      </div>
    </div>
  );
}
