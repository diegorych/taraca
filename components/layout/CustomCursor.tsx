"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Interpolación hacia el puntero real (más bajo = más “retraso”). */
const FOLLOW_LERP = 0.16;
const FOLLOW_STOP_DIST_SQ = 0.25;

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
 * Punto que acompaña al cursor: no sustituye al puntero del sistema y va con ligero retraso (lerp).
 * Sobre elemento cliqueable → punto más chico.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const follower = useRef({ x: 0, y: 0 });
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

    const tick = () => {
      raf.current = 0;
      const ring = ringRef.current;
      const p = pointer.current;
      const f = follower.current;
      f.x += (p.x - f.x) * FOLLOW_LERP;
      f.y += (p.y - f.y) * FOLLOW_LERP;
      if (ring) {
        ring.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) translate(-50%, -50%)`;
      }
      const hit = document.elementFromPoint(p.x, p.y);
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
      const dx = p.x - f.x;
      const dy = p.y - f.y;
      if (dx * dx + dy * dy > FOLLOW_STOP_DIST_SQ) {
        raf.current = requestAnimationFrame(tick);
      }
    };

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    pointer.current = { x: cx, y: cy };
    follower.current = { x: cx, y: cy };
    tick();
    setLive(true);

    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      setVisible(true);
      if (raf.current === 0) {
        raf.current = requestAnimationFrame(tick);
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
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const ringPalette = lightBg
    ? filled
      ? "h-2.5 w-2.5 border-0 bg-black/90 md:h-3 md:w-3"
      : "h-4 w-4 border-0 bg-black/80 md:h-[18px] md:w-[18px]"
    : filled
      ? "h-2.5 w-2.5 border-0 bg-white/92 md:h-3 md:w-3"
      : "h-4 w-4 border-0 bg-white/85 md:h-[18px] md:w-[18px]";

  return (
    <div
      ref={ringRef}
      className={[
        "pointer-events-none fixed left-0 top-0 z-[10050] rounded-full will-change-transform",
        "transition-[width,height,opacity,background-color]",
        "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        ringPalette,
        live && visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
      aria-hidden
    />
  );
}
