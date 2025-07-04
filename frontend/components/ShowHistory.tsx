import { useState, useRef, useEffect } from 'react';
import { tts } from '../services/apiService';
import { toTitleCase } from '../utils/toTitleCase';

interface ShowHistoryProps {
  history: { role: string; content: string }[];
  lang: string;
  ttsMode: boolean;
  comedian1Persona: string;
  comedian2Persona: string;
}

const bubbleColors = [
  'bg-blue-100 dark:bg-blue-800',
  'bg-green-100 dark:bg-green-800',
  'bg-purple-100 dark:bg-purple-800',
  'bg-pink-100 dark:bg-pink-800',
  'bg-yellow-100 dark:bg-yellow-800',
  'bg-gray-100 dark:bg-gray-700',
];

const avatars: Record<string, string> = {
  'Comedian 1': '🎤',
  'Comedian 2': '😂',
  'chat manager': '🤖',
  'manager': '🤖',
  'system': '💡',
};

function getAvatar(role: string) {
  const key = role.replace('_', ' ').trim();
  return avatars[key] || '👤';
}

export default function ShowHistory({ history, lang, ttsMode, comedian1Persona, comedian2Persona }: ShowHistoryProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [showManagerMsg, setShowManagerMsg] = useState(false);
  const [popupLeft, setPopupLeft] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [ttsCache, setTtsCache] = useState<{ [key: string]: string }>({});

  async function handlePlay(text: string, idx: number) {
    setLoadingIdx(idx);
    setPlayingIdx(null); // Stop any currently playing audio immediately
    setAudioUrl(null);   // Remove current audio
    const cacheKey = text + '|' + lang;
    if (ttsCache[cacheKey]) {
      setAudioUrl(ttsCache[cacheKey]);
      setPlayingIdx(idx);
      setLoadingIdx(null);
      return;
    }
    const url = await tts(text, lang);
    setTtsCache(prev => ({ ...prev, [cacheKey]: url }));
    setAudioUrl(url);
    setPlayingIdx(idx);
    setLoadingIdx(null);
  }

  useEffect(() => {
    if (showManagerMsg && popupRef.current && avatarRef.current) {
      const popupRect = popupRef.current.getBoundingClientRect();
      const avatarRect = avatarRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - avatarRect.right;
      if (spaceRight < popupRect.width + 16) {
        setPopupLeft(true);
      } else {
        setPopupLeft(false);
      }
    }
  }, [showManagerMsg]);

  if (!history.length) return null;

  // Find the first chat manager message and the rest
  const managerIdx = history.findIndex(msg => msg.role.toLowerCase().includes('manager'));
  const managerMsg = managerIdx !== -1 ? history[managerIdx] : null;
  const rest = history.filter((msg, i) => i !== managerIdx);

  return (
    <section className="w-full flex flex-col items-center mt-12">
      <div className="w-full max-w-4xl flex flex-col gap-8 items-center">
        {/* Chat manager bubble center-aligned above the rest */}
        {managerMsg && (
          <div className="flex flex-col items-center mb-1">
            <div
              className="flex flex-col items-center cursor-pointer relative"
              onMouseEnter={() => setShowManagerMsg(true)}
              onMouseLeave={() => setShowManagerMsg(false)}
            >
              <div ref={avatarRef} className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 dark:from-blue-700 dark:to-purple-800 flex items-center justify-center text-3xl shadow-md mb-2 -mt-12">
                {getAvatar(managerMsg.role)}
              </div>
              {showManagerMsg && (
                <div
                  ref={popupRef}
                  className={`rounded-2xl px-6 py-4 shadow-md bg-blue-200 dark:bg-blue-900 max-w-2xl w-[32rem] border border-gray-200 dark:border-gray-700 text-left font-medium text-gray-900 dark:text-gray-100 z-30 absolute top-1/2 -translate-y-1/2 ${popupLeft ? 'right-full mr-4 left-auto' : 'left-full ml-4 right-auto'}`}
                >
                  {managerMsg.content}
                </div>
              )}
            </div>
          </div>
        )}
        {/* The rest of the chat bubbles, first one is Comedian 1 */}
        {rest.map((msg, i) => {
          const align = i % 2 === 0 ? 'items-start' : 'items-end';
          const bubbleColor = bubbleColors[i % bubbleColors.length];
          const personaKey = i % 2 === 0 ? comedian1Persona : comedian2Persona;
          return (
            <div key={i} className={`flex ${align} w-full`}>
              <div className={`flex gap-3 ${align === 'items-end' ? 'flex-row-reverse' : ''} w-fit`}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 dark:from-blue-700 dark:to-purple-800 flex items-center justify-center text-2xl shadow-md">
                  {getAvatar(personaKey)}
                </div>
                <div className={`rounded-2xl px-6 py-4 shadow-md ${bubbleColor} max-w-[80vw] md:max-w-[70%] w-fit border border-gray-200 dark:border-gray-700`}>
                  <div className="font-semibold mb-1 text-xs text-gray-500 dark:text-gray-300">Comedian {toTitleCase(personaKey)}</div>
                  <div className="mb-3 whitespace-pre-line text-base leading-relaxed text-gray-900 dark:text-gray-100 font-medium">{msg.content}</div>
                  {ttsMode && !msg.role.toLowerCase().includes('manager') && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold p-2 rounded-full shadow transition disabled:opacity-50 flex items-center justify-center group"
                      onClick={() => handlePlay(msg.content, i)}
                      disabled={playingIdx === i || loadingIdx === i}
                      title="Play TTS"
                    >
                      {loadingIdx === i ? (
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
                  )}
                  {audioUrl && playingIdx === i && (
                    <audio src={audioUrl} controls autoPlay className="mt-2 w-full" onEnded={() => setPlayingIdx(null)} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
} 