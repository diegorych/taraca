"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EB_Garamond } from "next/font/google";

const ebGaramondItalic = EB_Garamond({
  subsets: ["latin"],
  style: "italic",
  weight: "400",
});

export function HeroMusicPlayer({ show }: { show: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-6 left-6 z-[60] flex items-center gap-4 md:bottom-8 md:left-8 md:gap-5 rounded-full border border-[#D2D0CE]/20 bg-[#050505] px-5 py-2 text-[#D2D0CE] md:px-6 md:py-2.5"
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      {/* Controles */}
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Anterior"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20"></polygon>
            <line x1="5" y1="19" x2="5" y2="5"></line>
          </svg>
        </button>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#D2D0CE]/30 bg-[#111] hover:bg-[#222] transition-colors text-[#D2D0CE]"
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        
        <button 
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Siguiente"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4"></polygon>
            <line x1="19" y1="5" x2="19" y2="19"></line>
          </svg>
        </button>
      </div>

      {/* Separador */}
      <div className="w-px h-5 bg-[#D2D0CE]/20" />

      {/* Info de la canción */}
      <div className="flex flex-col justify-center min-w-[90px] md:min-w-[110px]">
        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] opacity-50 leading-none mb-1">
          Escuchando
        </span>
        <span className={`text-[13px] md:text-[15px] leading-none text-[#E8E6E3] ${ebGaramondItalic.className}`}>
          Taracá
        </span>
      </div>
    </motion.div>
  );
}
