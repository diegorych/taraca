import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Oculta el pill rojo “N Issue(s)” del overlay de desarrollo (solo afecta a `next dev`). */
  devIndicators: false,
};

export default nextConfig;
