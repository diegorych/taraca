"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { AnimatedLogo } from "./AnimatedLogo";
import { HeroMusicPlayer } from "./HeroMusicPlayer";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIntroSequence } from "@/components/providers/IntroSequenceProvider";

/** Parallax del cursor: logo y fondo en direcciones opuestas; fondo más suave para no destapar bordes. */
const LOGO_MOUSE_X_PX = 14;
const LOGO_MOUSE_Y_PX = 11;
const BG_MOUSE_X_PX = 5;
const BG_MOUSE_Y_PX = 4;
const MOUSE_SPRING = { stiffness: 220, damping: 28, mass: 0.35 } as const;

export const Hero = () => {
  const [showBg, setShowBg] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showDecor, setShowDecor] = useState(false);
  const { setShowHeader } = useIntroSequence();
  const containerRef = useRef<HTMLElement>(null);
  const heroInViewRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const mouseNormX = useMotionValue(0);
  const mouseNormY = useMotionValue(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        heroInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.08, rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      if (!heroInViewRef.current) return;
      mouseNormX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseNormY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion, mouseNormX, mouseNormY]);

  const logoMouseX = useSpring(
    useTransform(mouseNormX, [-1, 1], [-LOGO_MOUSE_X_PX, LOGO_MOUSE_X_PX]),
    MOUSE_SPRING,
  );
  const logoMouseY = useSpring(
    useTransform(mouseNormY, [-1, 1], [-LOGO_MOUSE_Y_PX, LOGO_MOUSE_Y_PX]),
    MOUSE_SPRING,
  );
  const bgMouseX = useSpring(
    useTransform(mouseNormX, [-1, 1], [BG_MOUSE_X_PX, -BG_MOUSE_X_PX]),
    MOUSE_SPRING,
  );
  const bgMouseY = useSpring(
    useTransform(mouseNormY, [-1, 1], [BG_MOUSE_Y_PX, -BG_MOUSE_Y_PX]),
    MOUSE_SPRING,
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  /**
   * Parallax en Y por capa (mismo scroll 0→1, distintas magnitudes = profundidad).
   * Fondo más lento; logo medio; decor con valores propios cada uno.
   */
  const heroImgY = useTransform(scrollYProgress, [0, 1], [0, -105]);
  /** Curvatura sutil con el scroll: ligera inclinación 3D + esquinas que redondean un poco. */
  const heroImgRotateX = useTransform(scrollYProgress, [0, 1], [0, 1.85]);
  const heroImgBorderRadius = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -198]);
  const logoYWithMouse = useTransform(
    [logoY, logoMouseY],
    ([sy, my]) => Number(sy) + Number(my),
  );
  /** Encoge suave con el scroll (menos agresivo que antes). */
  const logoScrollScale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.45],
    [1, 1, 0.86],
    { clamp: true },
  );
  const decorTintaY = useTransform(scrollYProgress, [0, 1], [0, -368]);
  const decorLineasY = useTransform(scrollYProgress, [0, 1], [0, -248]);
  const decorAmarilloY = useTransform(scrollYProgress, [0, 1], [0, -492]);
  const decorCuadradoY = useTransform(scrollYProgress, [0, 1], [0, -312]);

  const heroImgYWithMouse = useTransform(
    [heroImgY, bgMouseY],
    ([sy, my]) => Number(sy) + Number(my),
  );

  useEffect(() => {
    setShowHeader(false);

    const bgTimer = window.setTimeout(() => setShowBg(true), 60);
    const logoTimer = window.setTimeout(() => setShowLogo(true), 410);
    const decorTimer = window.setTimeout(() => setShowDecor(true), 860);
    const headerTimer = window.setTimeout(() => setShowHeader(true), 1210);

    return () => {
      window.clearTimeout(bgTimer);
      window.clearTimeout(logoTimer);
      window.clearTimeout(decorTimer);
      window.clearTimeout(headerTimer);
      setShowHeader(true);
    };
  }, [setShowHeader]);

  return (
    <section ref={containerRef} className="relative z-20 w-full h-[150vh] bg-[#0A0A0A]">
      <div className="sticky top-0 h-dvh min-h-0 w-full">
        {/* Reproductor de música arriba en el centro */}
        <HeroMusicPlayer show={showDecor} />

        {/* Foto Drexler: ventana exactamente 1× viewport (dvh); el hijo más alto + overflow recorta para parallax. */}
        <div className="absolute inset-x-0 top-0 z-0 h-dvh w-full overflow-hidden [perspective:min(90rem,150vw)] [perspective-origin:50%_38%] md:[perspective-origin:50%_36%]">
          <motion.div
            style={{
              x: bgMouseX,
              y: heroImgYWithMouse,
              rotateX: heroImgRotateX,
              borderRadius: heroImgBorderRadius,
              transformOrigin: "50% 56%",
            }}
            className="absolute inset-x-0 -top-[7%] h-[114%] overflow-hidden will-change-transform [transform-style:preserve-3d] [backface-visibility:hidden]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showBg ? 1 : 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 origin-center scale-[1.06] will-change-transform"
            >
              <Image
                src="/images/drexler-hero-v2.png"
                alt="Jorge Drexler"
                fill
                priority
                unoptimized
                className="object-cover object-center md:object-[center_38%]"
              />
            </motion.div>
          </motion.div>
          <div className="absolute inset-x-0 top-0 z-[1] h-dvh w-full bg-black/30 pointer-events-none" />
        </div>

        {/* Logo Layer: parallax + escala (sin fade por scroll) */}
        <motion.div
          style={{
            x: logoMouseX,
            y: logoYWithMouse,
            scale: logoScrollScale,
          }}
          className="absolute inset-x-0 top-0 z-20 flex h-dvh min-h-0 origin-center items-center justify-center px-4 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showLogo ? 1 : 0, y: showLogo ? 0 : 10 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="scale-[0.98] md:scale-[1.06] lg:scale-[1.1]"
          >
            <AnimatedLogo />
          </motion.div>
        </motion.div>

        {/* Decor: cada asset con su propio valor de parallax en Y */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showDecor ? 1 : 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-x-0 top-0 z-30 h-dvh min-h-0 pointer-events-none"
        >
          <motion.div
            style={{ y: decorTintaY }}
            className="absolute -left-5 md:-left-[17%] lg:-left-[15%] top-[1%] w-[80px] md:w-[106px] lg:w-[300px] xl:w-[335px]"
          >
            <motion.img
              src="/images/deco-tinta.png"
              alt=""
              aria-hidden="true"
              className="w-full h-full opacity-100 rotate-[10deg] [filter:brightness(1.22)_saturate(1.15)_contrast(1.05)] drop-shadow-[0_4px_24px_rgba(250,204,21,0.18)]"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </motion.div>

          <motion.div
            style={{ y: decorLineasY }}
            className="absolute -right-[21%] md:-right-[15%] lg:-right-[7%] top-[12%] w-[238px] md:w-[258px] lg:w-[276px]"
          >
            <motion.img
              src="/images/deco-lineas.png"
              alt=""
              aria-hidden="true"
              className="w-full h-full opacity-100 [filter:brightness(1.12)_contrast(1.12)] drop-shadow-[0_2px_20px_rgba(255,255,255,0.12)]"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
            />
          </motion.div>

          <motion.div
            style={{ y: decorAmarilloY }}
            className="absolute -left-16 md:-left-[6.25rem] lg:-left-[5.5rem] bottom-[1%] md:bottom-[1%] w-[160px] md:w-[206px] lg:w-[248px]"
          >
            <motion.img
              src="/images/deco-amarillo.png"
              alt=""
              aria-hidden="true"
              className="w-full h-full opacity-100 rotate-[20deg] [filter:brightness(1.18)_saturate(1.2)] drop-shadow-[0_6px_28px_rgba(234,179,8,0.35)]"
              animate={{ y: [0, -3, 0], rotate: [-23, -22, -23] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
            />
          </motion.div>

          <motion.div
            style={{ y: decorCuadradoY }}
            className="absolute -right-1 md:-right-3 lg:-right-[-2%] bottom-[-3%] md:bottom-[-3%] w-[104px] md:w-[132px] lg:w-[186px]"
          >
            <motion.img
              src="/images/deco-cuadrado.png"
              alt=""
              aria-hidden="true"
              className="w-full h-full opacity-100 [filter:brightness(1.1)_contrast(1.08)] drop-shadow-[0_4px_18px_rgba(255,255,255,0.1)]"
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
