const avatars: Record<string, string> = {
  // Comedian personas
  'sarcastic': '😏',
  'absurd': '🤪',
  'simple': '😊',
  'relatable': '🤗',
  'dark': '😈',
  'observational': '👁️',
  'self_deprecating': '😅',
  'satirical': '🎭',
  'storyteller': '📖',
  'boomer': '👴',
  'gen_z': '🤙',
  'janusz': '🧔',
  
  // System roles
  'chat_manager': '🤖',
  'manager': '🤖',
  'system': '💡',
};

interface AvatarProps {
  role: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ role, size = 'md', className = '' }: AvatarProps) {
  const getAvatar = (role: string) => {
    return avatars[role] || '👤';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-2xl',
    lg: 'w-12 h-12 text-3xl'
  };

  return (
    <div className={`flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 dark:from-blue-700 dark:to-purple-800 flex items-center justify-center shadow-md ${sizeClasses[size]} ${className}`}>
      {getAvatar(role)}
    </div>
  );
} 