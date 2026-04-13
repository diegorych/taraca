"use client";

import { useLayoutEffect, useRef, useState } from "react";

const CURSOR_CLASS = "use-custom-cursor";

function closestInteractive(el: Element | null): Element | null {
  if (!el || !(el instanceof Element)) return null;
  return el.closest(
    [
      "a[href]",
      "button",
      '[role="button"]',
      '[role="link"]',
      "[data-cursor-interactive]",
      "summary",
      "label",
      'input:not([type="hidden"])',
      "select",
      "textarea",
    ].join(", "),
  );
}

function isLightCursorZone(el: Element | null): boolean {
  if (!el || !(el instanceof Element)) return false;
  return el.closest("[data-cursor-light-bg]") != null;
}

function isInteractiveTarget(el: Element | null): boolean {
  const t = closestInteractive(el);
  if (!t) return false;
  if (t.hasAttribute("data-cursor-skip")) return false;

  if (t instanceof HTMLAnchorElement) {
    const href = t.getAttribute("href");
    if (href == null || href === "") return false;
  }
  if (t instanceof HTMLButtonElement && t.disabled) return false;
  if (t instanceof HTMLInputElement) {
    if (t.disabled) return false;
    if (t.type === "hidden") return false;
  }
  if (t instanceof HTMLSelectElement && t.disabled) return false;
  if (t instanceof HTMLTextAreaElement && t.disabled) return false;
  if (t.getAttribute("aria-disabled") === "true") return false;

  return true;
}

/**
 * Cursor personalizado: anillo; sobre elemento cliqueable → círculo pequeño relleno.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const filledRef = useRef(false);
  const lightBgRef = useRef(false);
  const [live, setLive] = useState(false);
  const [visible, setVisible] = useState(true);
  const [filled, setFilled] = useState(false);
  const [lightBg, setLightBg] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    const { body } = document;
    root.classList.add(CURSOR_CLASS);
    body.classList.add(CURSOR_CLASS);

    const flush = () => {
      raf.current = 0;
      const ring = ringRef.current;
      const { x, y } = pos.current;
      if (ring) {
        ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      const hit = document.elementFromPoint(x, y);
      const nextFilled = isInteractiveTarget(hit);
      if (nextFilled !== filledRef.current) {
        filledRef.current = nextFilled;
        setFilled(nextFilled);
      }
      const nextLight = isLightCursorZone(hit);
      if (nextLight !== lightBgRef.current) {
        lightBgRef.current = nextLight;
        setLightBg(nextLight);
      }
    };

    pos.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    flush();
    setLive(true);

    const onMove = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      setVisible(true);
      if (raf.current === 0) {
        raf.current = requestAnimationFrame(flush);
      }
    };

    const onHide = () => setVisible(false);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onHide);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      root.classList.remove(CURSOR_CLASS);
      body.classList.remove(CURSOR_CLASS);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const ringPalette = lightBg
    ? filled
      ? "h-3.5 w-3.5 border-0 bg-black/85 md:h-4 md:w-4"
      : "h-9 w-9 border-2 border-black/55 bg-transparent md:h-10 md:w-10"
    : filled
      ? "h-3.5 w-3.5 border-0 bg-white/90 md:h-4 md:w-4"
      : "h-9 w-9 border-2 border-white/75 bg-transparent md:h-10 md:w-10";

  return (
    <div
      ref={ringRef}
      className={[
        "pointer-events-none fixed left-0 top-0 z-[10050] rounded-full will-change-transform",
        "transition-[width,height,opacity,border-width,background-color,border-color]",
        "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        ringPalette,
        live && visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
      aria-hidden
    />
  );
}
