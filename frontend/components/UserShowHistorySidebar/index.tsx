import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import {
  ChevronLeftIcon,
  ArrowUturnLeftIcon,
  SparklesIcon,
  UserCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Tooltip from "../shared/Tooltip";
import type { TranslationStrings } from "../../types";

interface Show {
  id: string;
  title: string;
  created_at: string;
}

interface UserShowHistorySidebarProps {
  onCloseSidebar?: () => void;
  onSelectShow?: (show: Show) => void;
  onDeselectShow?: () => void;
  showSelected?: boolean;
  selectedShowId?: string | null;
  t: TranslationStrings;
  lang: string;
  isMobile?: boolean;
  refreshKey?: number | string;
}

function trimShowTitle(title: string) {
  const idx = title.lastIndexOf(" - ");
  return idx !== -1 ? title.slice(0, idx) : title;
}

export default function UserShowHistorySidebar({
  onCloseSidebar,
  onSelectShow,
  onDeselectShow,
  showSelected,
  selectedShowId,
  t,
  lang,
  refreshKey,
}: UserShowHistorySidebarProps) {
  const { user } = useAuth();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    setLoading(true);
    supabase
      .from("shows")
      .select("id, title, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setShows(data);
        }
        setLoading(false);
      });
  }, [user, refreshKey]);

  const handleRemoveShow = async (showId: string) => {
    setShows((prev) => prev.filter((s) => s.id !== showId));
    await supabase.from("shows").delete().eq("id", showId);
  };

  if (!user) {
    return null;
  }

  return (
    <aside
      className="w-72 bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ef] dark:from-[#232946] dark:to-[#121629] text-gray-900 dark:text-gray-100 flex flex-col h-screen border-r border-zinc-200 dark:border-zinc-800/60 shadow-2xl relative"
      style={{ minWidth: 260 }}
    >
      {onCloseSidebar && (
        <button
          className="absolute top-4 right-4 z-30 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 transition-colors rounded-full p-2 shadow border border-zinc-300 dark:border-zinc-700"
          onClick={onCloseSidebar}
          aria-label="Hide sidebar"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
        </button>
      )}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-700/60 flex items-center gap-2">
        <SparklesIcon className="h-6 w-6 text-purple-500 dark:text-purple-400" />
        <h2 className="text-xl font-bold tracking-tight drop-shadow-sm">
          {t.showHistory}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-900 scrollbar-rounded-lg hover:scrollbar-thumb-zinc-400 dark:hover:scrollbar-thumb-zinc-500">
        {loading ? (
          <div className="text-zinc-400 dark:text-zinc-500 text-sm flex flex-col items-center gap-2 animate-pulse">
            <SparklesIcon className="h-8 w-8 text-blue-500/60 dark:text-blue-400/60 animate-spin" />
            {t.noShowsYet}
          </div>
        ) : shows.length === 0 ? (
          <div className="text-zinc-400 dark:text-zinc-500 text-sm flex flex-col items-center gap-2 mt-10">
            <SparklesIcon className="h-10 w-10 text-purple-500/60 dark:text-purple-400/60 mb-2" />
            <span className="font-semibold">{t.noShowsYet}</span>
            <span className="text-xs opacity-80">{t.endOfHistory}</span>
          </div>
        ) : (
          <ul className="space-y-3">
            {shows.map((show) => {
              const isSelected = selectedShowId === show.id;
              return (
                <li
                  key={show.id}
                  className={`group rounded-2xl px-4 py-3 cursor-pointer flex items-center gap-3 transition-all duration-150 shadow-sm border-2
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/80 dark:to-purple-900/80 border-blue-400 dark:border-blue-500/80 shadow-xl scale-[1.04] ring-2 ring-purple-300/40 dark:ring-purple-400/40"
                        : "bg-white/80 hover:bg-zinc-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 border-transparent hover:scale-[1.02] hover:shadow-lg"
                    }
                  `}
                  onClick={() => {
                    if (!isSelected) {
                      onSelectShow?.(show);
                    }
                  }}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/80 to-blue-400/80 dark:from-purple-500/80 dark:to-blue-500/80 text-white shadow group-hover:scale-110 transition-transform">
                    <SparklesIcon className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-base truncate drop-shadow-sm">
                      {trimShowTitle(show.title)}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {new Date(show.created_at).toLocaleString(lang)}
                    </span>
                  </div>
                  <Tooltip content={t.deleteShow}>
                    <button
                      className="ml-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/60 text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
                      style={{ pointerEvents: "auto" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveShow(show.id);
                      }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        )}
        {showSelected && onDeselectShow && (
          <button
            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:brightness-110 hover:scale-[1.03] transition-all duration-150"
            onClick={onDeselectShow}
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
            {t.backToCurrentSession}
          </button>
        )}
        <div className="mt-4 text-zinc-400 dark:text-zinc-500 text-xs text-center select-none opacity-70">
          <span className="inline-flex items-center gap-1">
            <SparklesIcon className="h-4 w-4 text-purple-400/80" />
            {t.endOfHistory}
          </span>
        </div>
      </div>
      <div className="py-0.5 px-2 sm:py-0.5 sm:px-2 border-t border-zinc-200 dark:border-zinc-700/60 flex flex-row items-center gap-3 text-gray-700 dark:text-gray-200 text-xs sm:text-sm bg-white/80 dark:bg-zinc-900/80">
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 dark:from-purple-400 dark:to-blue-400 flex items-center justify-center shadow">
          {user.email ? user.email[0].toUpperCase() : <UserCircleIcon />}
        </span>
        <span className="text-base font-semibold truncate max-w-[200px]">
          {user.email || t.guest}
        </span>
      </div>
    </aside>
  );
}
