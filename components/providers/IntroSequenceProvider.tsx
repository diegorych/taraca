"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface IntroSequenceContextValue {
  showHeader: boolean;
  setShowHeader: (value: boolean) => void;
  preloaderFinished: boolean;
  setPreloaderFinished: (value: boolean) => void;
}

const IntroSequenceContext = createContext<IntroSequenceContextValue | null>(null);

export function IntroSequenceProvider({ children }: { children: React.ReactNode }) {
  const [showHeader, setShowHeader] = useState(false);
  const [preloaderFinished, setPreloaderFinished] = useState(false);

  const value = useMemo(
    () => ({
      showHeader,
      setShowHeader,
      preloaderFinished,
      setPreloaderFinished,
    }),
    [showHeader, preloaderFinished],
  );

  return (
    <IntroSequenceContext.Provider value={value}>
      {children}
    </IntroSequenceContext.Provider>
  );
}

export function useIntroSequence() {
  const context = useContext(IntroSequenceContext);
  if (!context) {
    throw new Error("useIntroSequence must be used within IntroSequenceProvider");
  }

  return context;
}
