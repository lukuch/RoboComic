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
            className={`rounded-2xl px-6 py-4 shadow-md bg-blue-200 dark:bg-blue-900 max-w-2xl w-[32rem] border border-gray-200 dark:border-gray-700 text-left font-medium text-gray-900 dark:text-gray-100 z-30 absolute top-1/2 -translate-y-1/2 ${popupLeft ? 'right-full mr-4 left-auto' : 'left-full ml-4 right-auto'}`}
          >
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
} 