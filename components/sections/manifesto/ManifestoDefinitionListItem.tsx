"use client";

import { motion, type MotionStyle } from "framer-motion";
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
  /** false: sin fade de entrada propio (la entrada la maneja quien lo contiene). */
  revealOnMount?: boolean;
  /** Frase del texto que se anima aparte del resto (puede quedar partida entre líneas). */
  highlight?: string;
  /** Estilo del número y del texto que no es `highlight`. */
  restStyle?: MotionStyle;
  /** Estilo de la frase `highlight`. */
  highlightStyle?: MotionStyle;
};

type Range = [start: number, end: number];
type Segment = { text: string; bold: boolean; highlighted: boolean };

const inRange = (i: number, [start, end]: Range) => i >= start && i < end;

/**
 * Parte una línea (que empieza en `lineStart` dentro del texto) en tramos según caigan
 * dentro de la entrada en negrita y/o de la frase resaltada.
 */
function splitLine(line: string, lineStart: number, bold: Range, highlight: Range): Segment[] {
  const lineEnd = lineStart + line.length;
  const cuts = new Set([lineStart, lineEnd]);
  for (const edge of [...bold, ...highlight]) {
    if (edge > lineStart && edge < lineEnd) cuts.add(edge);
  }
  const points = [...cuts].sort((a, b) => a - b);
  return points.slice(0, -1).map((start, i) => ({
    text: line.slice(start - lineStart, points[i + 1] - lineStart),
    bold: inRange(start, bold),
    highlighted: inRange(start, highlight),
  }));
}

export function ManifestoDefinitionListItem({
  num,
  plainText,
  boldWord,
  active,
  numClassName,
  bodyClassName,
  baseDelay = 0,
  revealOnMount = true,
  highlight,
  restStyle,
  highlightStyle,
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
    if (!revealOnMount || !active || !frozenLines || frozenLines.length === 0) return;
    
    // Número y líneas aparecen juntos con un fade (sin desplazamiento)
    gsap.fromTo(
      ".manifesto-num, .manifesto-line-text",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.1,
        ease: "power2.out",
        delay: baseDelay,
      }
    );
  }, { dependencies: [active, frozenLines, revealOnMount], scope: containerRef });

  if (!active) return null;

  const displayLines = frozenLines ?? [];

  // Cada línea es un tramo del texto (palabras unidas por un espacio): se ubica en orden.
  const lineStarts = displayLines.reduce<number[]>((starts, line, i) => {
    const from = i === 0 ? 0 : starts[i - 1] + displayLines[i - 1].length;
    const found = plainText.indexOf(line, from);
    starts.push(found >= 0 ? found : from);
    return starts;
  }, []);
  // La entrada en negrita es el comienzo del texto (p. ej. «Sonido del Tambor Chico:»).
  const boldRange: Range =
    boldWord && plainText.startsWith(boldWord) ? [0, boldWord.length] : [-1, -1];
  const hlStart = highlight ? plainText.indexOf(highlight) : -1;
  const highlightRange: Range =
    hlStart >= 0 && highlight ? [hlStart, hlStart + highlight.length] : [-1, -1];

  const renderLineContent = (line: string, lineIdx: number) =>
    splitLine(line, lineStarts[lineIdx], boldRange, highlightRange).map((seg, i) => (
      <motion.span
        key={i}
        className={seg.bold ? "font-bold" : undefined}
        data-manifesto-highlight={seg.highlighted || undefined}
        style={seg.highlighted ? highlightStyle : restStyle}
      >
        {seg.text}
      </motion.span>
    ));

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
            {/* La entrada (GSAP) anima .manifesto-num; el fundido por scroll va en el envoltorio. */}
            <motion.div style={restStyle}>
              <div className={`manifesto-num ${numClassName}`}>{num}</div>
            </motion.div>
          </div>

          {displayLines.map((line, lineIdx) => (
            <div
              key={`line-${lineIdx}-${line.slice(0, 20)}`}
              className="min-w-0 overflow-hidden"
              style={{ gridColumn: 2, gridRow: lineIdx + 1 }}
            >
              <p className={`manifesto-line-text ${bodyClassName}`}>{renderLineContent(line, lineIdx)}</p>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}
