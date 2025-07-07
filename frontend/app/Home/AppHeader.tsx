import Image from 'next/image';

export function AppHeader() {
  return (
    <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-900 dark:text-white drop-shadow-lg flex items-center justify-center gap-4">
      <Image src="/icon-192x192.png" alt="RoboComic Icon" width={48} height={48} className="inline-block align-middle" />
      RoboComic AI
    </h1>
  );
} 