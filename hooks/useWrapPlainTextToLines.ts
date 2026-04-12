"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

function measureTextWidth(text: string, font: string): number {
  if (typeof document === "undefined") return 0;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
}

/** Una frase sin saltos explícitos → líneas por ancho (canvas). */
function wrapParagraphToLines(text: string, maxWidth: number, font: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (measureTextWidth(trial, font) <= maxWidth) {
      current = trial;
    } else {
      if (current) lines.push(current);
      if (measureTextWidth(word, font) <= maxWidth) {
        current = word;
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Parte un texto en líneas que caben en maxWidth (px).
 * Los `\n` en el texto fuerzan un salto de párrafo (nueva línea) antes de ajustar por ancho.
 */
export function wrapPlainTextToLines(text: string, maxWidth: number, font: string): string[] {
  if (maxWidth <= 4) return [];
  const paragraphs = text.trim().split(/\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return [];

  const out: string[] = [];
  for (const para of paragraphs) {
    const paraLines = wrapParagraphToLines(para, maxWidth, font);
    if (paraLines.length) out.push(...paraLines);
  }
  return out.length ? out : [text.trim()];
}

/**
 * Mide el ancho del contenedor y devuelve líneas envueltas.
 * `enabled` en false devuelve [] para no pintar texto antes de tiempo.
 */
export function useWrapPlainTextToLines(
  containerRef: RefObject<HTMLElement | null>,
  plainText: string,
  enabled: boolean,
): string[] {
  const [width, setWidth] = useState(0);
  const [font, setFont] = useState("16px system-ui, sans-serif");

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const update = () => {
      const w = el.getBoundingClientRect().width;
      setWidth(w);
      const cs = getComputedStyle(el);
      setFont(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`);
    };

    update();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(update);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, enabled]);

  const [lines, setLines] = useState<string[]>([]);

  useLayoutEffect(() => {
    if (!enabled || width < 8) {
      setLines([]);
      return;
    }
    setLines(wrapPlainTextToLines(plainText, width, font));
  }, [enabled, width, font, plainText]);

  useLayoutEffect(() => {
    if (!enabled) setLines([]);
  }, [enabled]);

  return lines;
}
