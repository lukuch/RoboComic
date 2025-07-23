import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import {
  ChevronLeftIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";

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
  t: any;
  lang: string;
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
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <aside
      className="w-72 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white flex flex-col h-screen border-r border-zinc-200 dark:border-zinc-800 relative"
      style={{ minWidth: 260 }}
    >
      {onCloseSidebar && (
        <button
          className="absolute top-4 right-4 z-30 bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors rounded-full p-2 shadow border border-zinc-300 dark:border-zinc-700"
          onClick={onCloseSidebar}
          aria-label="Hide sidebar"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-900 dark:text-white" />
        </button>
      )}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-2">{t.showHistory}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {loading ? (
          <div className="text-zinc-400 dark:text-zinc-500 text-sm">
            {t.noShowsYet}
          </div>
        ) : shows.length === 0 ? (
          <div className="text-zinc-400 dark:text-zinc-500 text-sm">
            {t.noShowsYet}
          </div>
        ) : (
          <ul className="space-y-1">
            {shows.map((show) => {
              const isSelected = selectedShowId === show.id;
              return (
                <li
                  key={show.id}
                  className={`rounded px-3 py-2 cursor-pointer flex flex-col transition-all duration-150
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/60 dark:to-purple-900/60 border-2 border-blue-500 shadow-lg scale-[1.03]"
                        : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-transparent"
                    }
                  `}
                  onClick={() => onSelectShow?.(show)}
                >
                  <span className="font-medium text-sm truncate">
                    {trimShowTitle(show.title)}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(show.created_at).toLocaleString(lang)}
                  </span>
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
        <div className="mt-8 text-zinc-400 dark:text-zinc-500 text-xs text-center">
          {t.endOfHistory}
        </div>
      </div>
      <div className="py-2 px-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
        <span className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 inline-block"></span>
        <span className="text-sm font-medium">{user.email || t.guest}</span>
      </div>
    </aside>
  );
}
