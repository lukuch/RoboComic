import { useRef, useEffect, useState } from 'react';
import { Avatar } from './Avatar';

interface ManagerBubbleProps {
  message: { role: string; content: string };
}

export function ManagerBubble({ message }: ManagerBubbleProps) {
  const [showManagerMsg, setShowManagerMsg] = useState(false);
  const [popupLeft, setPopupLeft] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col items-center mb-1">
      <div
        className="flex flex-col items-center cursor-pointer relative"
        onMouseEnter={() => setShowManagerMsg(true)}
        onMouseLeave={() => setShowManagerMsg(false)}
      >
        <div ref={avatarRef} className="mb-2 -mt-12">
          <Avatar role={message.role} size="lg" />
        </div>
        {showManagerMsg && (
          <div
            ref={popupRef}
            className={`absolute left-1/2 -translate-x-1/2 bottom-full z-30 rounded-2xl px-6 py-4 shadow-xl bg-gray-900/90 max-w-2xl w-[32rem] border border-gray-700 text-left font-medium text-gray-100 text-sm backdrop-blur transition-all duration-200
              ${showManagerMsg ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
            style={{ minWidth: '20rem', bottom: 'calc(100% + 3.75rem)' }}
          >
            {/* Arrow */}
            <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2">
              <svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,0 28,0 14,14" fill="#23272f" />
              </svg>
            </div>
            <div className="font-bold mb-1">Chat Manager</div>
            <div> {message.content.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}</div>
          </div>
        )}
      </div>
    </div>
  );
} 