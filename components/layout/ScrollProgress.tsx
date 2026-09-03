"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed left-4 md:left-6 top-[15vh] bottom-[15vh] w-[3px] z-[9999] bg-white/10 pointer-events-none rounded-full overflow-hidden mix-blend-difference">
      <motion.div
        className="w-full h-full bg-white/40 origin-top"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}
