import { useRef, useEffect, useState } from 'react';
import { Avatar } from './Avatar';

interface ManagerBubbleProps {
  message: { role: string; content: string };
}

export function ManagerBubble({ message }: ManagerBubbleProps) {
  const [showManagerMsg, setShowManagerMsg] = useState(false);
  const [popupPosition, setPopupPosition] = useState<'left' | 'center' | 'right'>('center');
  const popupRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showManagerMsg && popupRef.current && avatarRef.current) {
      const avatarRect = avatarRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Check if popup would go outside viewport
      const spaceLeft = avatarRect.left;
      const spaceRight = viewportWidth - avatarRect.right;
      const popupWidth = 512; // w-[32rem] = 32rem = 512px
      
      if (spaceLeft < popupWidth / 2) {
        setPopupPosition('left');
      } else if (spaceRight < popupWidth / 2) {
        setPopupPosition('right');
      } else {
        setPopupPosition('center');
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
        <div ref={avatarRef} className="mb-2 -mt-14">
          <Avatar role={message.role} size="lg" />
        </div>
        {showManagerMsg && (
          <div
            ref={popupRef}
            className={`absolute 
              md:${popupPosition === 'left' ? 'left-0' : popupPosition === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'}
              left-1/2 -translate-x-1/2
              bottom-full z-30 rounded-2xl px-6 py-4 shadow-xl bg-gray-900/90 max-w-2xl w-[32rem] max-w-[90vw] md:w-[32rem] border border-gray-700 text-left font-medium text-gray-100 text-sm backdrop-blur
              ${showManagerMsg ? '' : 'hidden'}`}
            style={{ minWidth: '16rem', bottom: 'calc(100% + 4.2rem)' }}
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