import { Avatar } from './Avatar';
import { TTSButton } from './TTSButton';
import { toTitleCase } from '../../utils/toTitleCase';

interface ChatBubbleProps {
  message: { role: string; content: string };
  index: number;
  personaKey: string;
  bubbleColor: string;
  align: 'items-start' | 'items-end';
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
  bubbleColor, 
  align, 
  ttsMode, 
  onPlayTTS, 
  playingIdx, 
  loadingIdx, 
  audioUrl, 
  onAudioEnd 
}: ChatBubbleProps) {
  return (
    <div className={`flex ${align} w-full`}>
      <div className={`flex gap-3 ${align === 'items-end' ? 'flex-row-reverse' : ''} w-fit`}>
        <Avatar role={personaKey} />
        <div className={`rounded-2xl px-6 py-4 shadow-md ${bubbleColor} max-w-[80vw] md:max-w-[70%] w-fit border border-gray-200 dark:border-gray-700`}>
          <div className="font-semibold mb-1 text-xs text-gray-500 dark:text-gray-300">
            {toTitleCase(personaKey)}
          </div>
          <div className="mb-3 whitespace-pre-line text-base leading-relaxed text-gray-900 dark:text-gray-100 font-medium">
            {message.content}
          </div>
          {ttsMode && !message.role.toLowerCase().includes('manager') && (
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