"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { useWrapPlainTextToLines } from "@/hooks/useWrapPlainTextToLines";

/** Fade por párrafo: las líneas aparecen juntas (encadenado con ManifestoSection). */
export const MANIFESTO_LINE_STAGGER_S = 0;
export const MANIFESTO_LINE_FADE_S = 0.28;

/**
 * Estima líneas de cuerpo (~ancho columna manifiesto) para calcular cuándo empieza la siguiente definición.
 */
function estimateParagraphLineCountByChars(paragraph: string): number {
  const words = paragraph.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  let lines = 0;
  let current = 0;
  const maxChars = 36;
  for (const w of words) {
    const need = w.length + (current > 0 ? 1 : 0);
    if (current + need > maxChars && current > 0) {
      lines++;
      current = w.length;
    } else {
      current += need;
    }
  }
  lines++;
  return lines;
}

/** Alineado con `wrapPlainTextToLines`: cada `\n` cuenta como bloque aparte. */
export function estimateManifestoDefinitionLineCount(plainText: string): number {
  const parts = plainText
    .trim()
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return 1;
  let total = 0;
  for (const part of parts) {
    total += estimateParagraphLineCountByChars(part);
  }
  return Math.max(1, total);
}

type Props = {
  num: string;
  plainText: string;
  boldWord: string;
  active: boolean;
  numClassName: string;
  bodyClassName: string;
  /** Retraso de la primera línea (y del número) */
  baseDelay?: number;
};

export function ManifestoDefinitionListItem({
  num,
  plainText,
  boldWord,
  active,
  numClassName,
  bodyClassName,
  baseDelay = 0,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const lines = useWrapPlainTextToLines(measureRef, plainText, active);
  const [frozenLines, setFrozenLines] = useState<string[] | null>(null);

  useLayoutEffect(() => {
    if (!active) {
      setFrozenLines(null);
      return;
    }
    if (lines.length === 0) return;
    setFrozenLines((prev) => {
      if (prev === null) return [...lines];
      if (prev.join("\u0001") === lines.join("\u0001")) return prev;
      return [...lines];
    });
  }, [active, lines]);

  useGSAP(() => {
    if (!active || !frozenLines || frozenLines.length === 0) return;
    
    // Animate the number and the text lines together (Text Masking)
    gsap.fromTo(
      ".manifesto-num, .manifesto-line-text",
      { y: "100%" },
      {
        y: "0%",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay: baseDelay,
      }
    );
  }, { dependencies: [active, frozenLines], scope: containerRef });

  if (!active) return null;

  const displayLines = frozenLines ?? [];

  const renderLineContent = (line: string) => {
    if (boldWord && line.trimStart().startsWith(boldWord)) {
      return (
        <>
          <span className="font-bold">{boldWord}</span>
          <span>{line.slice(boldWord.length)}</span>
        </>
      );
    }
    return line;
  };

  return (
    <div ref={containerRef} className="relative grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-4 md:gap-x-5 text-left text-[#ffffff]">
      <div
        ref={measureRef}
        className={`col-start-2 row-start-1 h-0 min-w-0 overflow-hidden opacity-0 ${bodyClassName}`}
        aria-hidden
      />

      {displayLines.length > 0 ? (
        <>
          <div
            className="self-start pt-[0.08em] overflow-hidden"
            style={{ gridColumn: 1, gridRow: `1 / span ${displayLines.length}` }}
          >
            <div className={`manifesto-num will-change-transform ${numClassName}`}>{num}</div>
          </div>

          {displayLines.map((line, lineIdx) => (
            <div
              key={`line-${lineIdx}-${line.slice(0, 20)}`}
              className="min-w-0 overflow-hidden"
              style={{ gridColumn: 2, gridRow: lineIdx + 1 }}
            >
              <p className={`manifesto-line-text will-change-transform ${bodyClassName}`}>{renderLineContent(line)}</p>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}
