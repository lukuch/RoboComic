import { Avatar } from "./Avatar";
import { TTSButton } from "./TTSButton";
import { toTitleCase } from "../../utils/stringUtils";
import { useState, useRef, useEffect } from "react";
import CustomAudioPlayer from "./CustomAudioPlayer";
import "./ChatBubble.css";
import type { TranslationStrings } from "../../types";
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
  cached?: boolean;
  comedianType?: "comedian1" | "comedian2";
  t: TranslationStrings;
  activeAudioIdx: number | null;
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
  cached,
  comedianType = "comedian1",
  t,
  activeAudioIdx,
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
                  className={`absolute bottom-full mb-3 z-40 bg-gray-900/90 text-gray-100 rounded-2xl shadow-xl px-6 py-4 w-64 text-sm backdrop-blur ${
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
          className={`${comedianType === "comedian2" ? "bubble-animated-border-c2" : "bubble-animated-border-c1"} bubble-animated-border relative rounded-2xl px-7 py-5 shadow-2xl max-w-[80vw] md:max-w-[70%] w-fit transition-transform duration-150 ${bubbleColor} bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg hover:scale-[1.008] hover:brightness-105 border-0`}
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(80, 0, 200, 0.10)",
          }}
        >
          {/* Glass reflection overlay */}
          <span className="bubble-glass-reflection pointer-events-none absolute left-0 top-0 w-full h-full rounded-2xl overflow-hidden z-10">
            <span className="absolute left-0 top-0 w-2/3 h-1/3 bg-gradient-to-br from-white/30 to-transparent rotate-12" />
          </span>
          <div className="relative z-20 font-semibold mb-1 text-xs text-gray-500 dark:text-gray-300">
            {toTitleCase(personaKey)}
          </div>
          <div className="relative z-20 mb-3 whitespace-pre-line text-base leading-relaxed text-gray-900 dark:text-gray-100 font-medium">
            {stripQuotes(message.content)}
          </div>
          {ttsMode && !message.role.toLowerCase().includes("manager") && (
            <div className="relative z-20 flex flex-row items-center gap-2">
              <TTSButton
                onClick={() => onPlayTTS(message.content, index)}
                disabled={playingIdx === index || loadingIdx === index}
                loading={loadingIdx === index}
                cached={cached}
              />
              {audioUrl && activeAudioIdx === index && (
                <CustomAudioPlayer
                  className="ml-2"
                  src={audioUrl}
                  onEnded={onAudioEnd}
                  autoPlay
                  t={t}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
