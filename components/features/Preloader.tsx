"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntroSequence } from "@/components/providers/IntroSequenceProvider";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { setPreloaderFinished } = useIntroSequence();

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = "hidden";

    let currentProgress = 0;
    const duration = 2000; // 2 seconds total for the counter
    const interval = 20; // update every 20ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      currentProgress += step;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
        
        // Wait a tiny bit at 100% before fading out
        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = "";
          
          // Wait for fade out animation to finish before signaling hero
          setTimeout(() => {
            setPreloaderFinished(true);
          }, 800);
        }, 300);
      } else {
        setProgress(Math.floor(currentProgress));
      }
    }, interval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, [setPreloaderFinished]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0A]"
        >
          <div 
            className="text-white text-5xl md:text-7xl tracking-tighter tabular-nums italic"
            style={{ fontFamily: 'Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, "Times New Roman", serif' }}
          >
            {progress}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
