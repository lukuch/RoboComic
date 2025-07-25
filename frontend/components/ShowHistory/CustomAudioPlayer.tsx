import { useRef, useState, useEffect } from "react";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiDownload,
  FiMoreVertical,
} from "react-icons/fi";

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

interface CustomAudioPlayerProps {
  src: string;
  onEnded?: () => void;
  autoPlay?: boolean;
  className?: string;
}

export default function CustomAudioPlayer({
  src,
  onEnded,
  autoPlay,
  className,
}: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, src]);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play();
      setPlaying(true);
    }
  }, [autoPlay, src]);

  useEffect(() => {
    if (!showSpeedMenu) {
      return;
    }
    function handleClickOutside(event: MouseEvent) {
      if (
        speedMenuRef.current &&
        !speedMenuRef.current.contains(event.target as Node) &&
        moreBtnRef.current &&
        !moreBtnRef.current.contains(event.target as Node)
      ) {
        setShowSpeedMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSpeedMenu]);

  const togglePlay = () => {
    if (!audioRef.current) {
      return;
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "audio.wav";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch {
      // Optionally handle error
    }
  };

  const formatTime = (s: number) => {
    if (isNaN(s)) {
      return "0:00";
    }
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div
      className={`w-full rounded-2xl bg-gradient-to-r from-blue-200/80 to-purple-200/80 dark:from-gray-800 dark:to-blue-900 p-2 flex flex-col gap-1 shadow-lg border border-gray-200 dark:border-gray-700 relative ${className || ""}`}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setPlaying(false);
          if (onEnded) {
            onEnded();
          }
        }}
        autoPlay={autoPlay}
        className="hidden"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow transition"
        >
          {playing ? (
            <FiPause className="w-5 h-5" />
          ) : (
            <FiPlay className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1 flex flex-col">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-blue-500 h-1 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mt-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <button
          onClick={toggleMute}
          className="ml-1 text-blue-500 hover:text-blue-700"
        >
          {muted || volume === 0 ? (
            <FiVolumeX className="w-4 h-4" />
          ) : (
            <FiVolume2 className="w-4 h-4" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={handleVolume}
          className="w-12 accent-blue-500 ml-1"
        />
        <button
          onClick={handleDownload}
          className="ml-1 text-blue-500 hover:text-blue-700"
        >
          <FiDownload className="w-4 h-4" />
        </button>
        <button
          ref={moreBtnRef}
          className="ml-1 text-gray-400 hover:text-gray-600 relative"
          onClick={() => setShowSpeedMenu((v) => !v)}
        >
          <FiMoreVertical className="w-4 h-4" />
          {showSpeedMenu && (
            <div
              ref={speedMenuRef}
              className="absolute z-50 right-0 mt-2 w-24 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1"
            >
              {SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    setPlaybackSpeed(speed);
                    setShowSpeedMenu(false);
                  }}
                  className={`w-full text-left px-4 py-1 text-sm hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl transition ${playbackSpeed === speed ? "font-bold text-blue-600 dark:text-blue-300" : "text-gray-700 dark:text-gray-200"}`}
                >
                  {speed}x{" "}
                  {playbackSpeed === speed && <span className="ml-1">✓</span>}
                </button>
              ))}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
