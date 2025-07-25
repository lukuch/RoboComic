import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`mt-12 py-1 pl-3 pr-3 sm:py-2 sm:pl-4 sm:pr-4 mx-auto max-w-[calc(100vw-1rem)] sm:max-w-full bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 shadow-inner flex flex-row items-center justify-between gap-1 sm:gap-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap overflow-x-auto sm:whitespace-normal sm:overflow-visible ${className}`}
    >
      <div className="flex items-center gap-2">
        {/* Mobile: Only RoboComic 2025 */}
        <span className="font-bold text-gray-900 dark:text-white block sm:hidden">
          RoboComic {new Date().getFullYear()}
        </span>
        {/* Desktop: RoboComic + All rights reserved. */}
        <span className="font-bold text-gray-900 dark:text-white hidden sm:block">
          RoboComic
        </span>
        <span className="opacity-60 hidden sm:block">
          {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
      <div className="flex items-center gap-3">
        {/* Mobile: Only 'Made by lukuch' */}
        <span className="opacity-70 block sm:hidden">Made by lukuch</span>
        {/* Desktop: Full name */}
        <span className="opacity-70 hidden sm:block">
          Made by lukuch (Łukasz Ucher)
        </span>
        <a
          href="https://github.com/lukuch/RoboComic"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-lg"
          aria-label="GitHub Repository"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/lukasz-ucher/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
          aria-label="LinkedIn Profile"
        >
          <FaLinkedin />
        </a>
      </div>
    </footer>
  );
}
