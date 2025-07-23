import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`w-full mt-12 py-2 px-4 bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-700 dark:text-gray-300 text-sm ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-900 dark:text-white">
          RoboComic
        </span>
        <span className="opacity-60">
          {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="opacity-70">Made by lukuch (Łukasz Ucher)</span>
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
