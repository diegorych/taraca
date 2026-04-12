"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

const TRACKS = [
  { id: 0, src: "/audio/que-sera-que-es.mp3", title: "¿Qué será que es?" },
  { id: 1, src: "/audio/Te-llevo-tatuad.mp3", title: "Te llevo tatuada" },
];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const AudioPlayerBar = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = TRACKS[currentTrack];

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const goBack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
    } else {
      const prev = currentTrack === 0 ? TRACKS.length - 1 : currentTrack - 1;
      setCurrentTrack(prev);
    }
  }, [currentTime, currentTrack]);

  const goForward = useCallback(() => {
    const next = (currentTrack + 1) % TRACKS.length;
    setCurrentTrack(next);
  }, [currentTrack]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const value = parseFloat(e.target.value);
    if (audio && Number.isFinite(value)) {
      audio.currentTime = value;
      setCurrentTime(value);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      const next = (currentTrack + 1) % TRACKS.length;
      setCurrentTrack(next);
      setCurrentTime(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.src;
    audio.load();
    audio.currentTime = 0;
  }, [currentTrack, track.src]);

  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md border-t border-white/10"
        style={{ height: "48px" }}
      >
        {/* Controles */}
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            className="p-1.5 text-white/70 hover:text-white transition-colors"
            aria-label="Anterior"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="p-1.5 text-white/90 hover:text-white transition-colors"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
          <button
            onClick={goForward}
            className="p-1.5 text-white/70 hover:text-white transition-colors"
            aria-label="Siguiente"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Progreso */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-white/60 text-xs tabular-nums shrink-0 w-8">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-0.5 accent-white/60 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="text-white/60 text-xs tabular-nums shrink-0 w-8">
            {formatTime(duration)}
          </span>
        </div>

        {/* Título (opcional, sutil) */}
        <span className="text-white/50 text-xs truncate max-w-[120px] hidden sm:block" title={track.title}>
          {track.title}
        </span>
      </div>
    </>
  );
};
