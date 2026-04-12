import type {
  BiographyContent,
  HeroContent,
  ManifestoContent,
  MerchProduct,
  Track,
} from "@/lib/domain";

/** URL de la tienda (CTA «Ver todo»). Sustituir por colección concreta si aplica. */
export const MERCH_STORE_URL = "https://apparell.com";

/**
 * Productos oficiales — `productUrl` debe apuntar a la ficha en Apparell.
 * Imágenes en `/public/images/merch/`.
 */
export const merchProducts: MerchProduct[] = [
  {
    id: "1",
    handle: "taraca-vinilo",
    title: "Taracá (Edición en Vinilo)",
    price: "24,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/taraca-vinilo.png",
    productUrl: "https://apparell.com/products/taraca-vinilo",
  },
  {
    id: "2",
    handle: "amar-la-trama-vinilo",
    title: "Amar la trama (Vinilo)",
    price: "24,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/amar-la-trama-vinilo.png",
    productUrl: "https://apparell.com/products/amar-la-trama-vinilo",
  },
  {
    id: "3",
    handle: "sea-vinilo",
    title: "Sea (Vinilo)",
    price: "24,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/sea-vinilo.png",
    productUrl: "https://apparell.com/products/sea-vinilo",
  },
  {
    id: "4",
    handle: "eco-vinilo",
    title: "Eco (Vinilo)",
    price: "24,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/eco-vinilo.png",
    productUrl: "https://apparell.com/products/eco-vinilo",
  },
  {
    id: "5",
    handle: "frontera-vinilo",
    title: "Frontera (Vinilo)",
    price: "24,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/frontera-vinilo.png",
    productUrl: "https://apparell.com/products/frontera-vinilo",
  },
  {
    id: "6",
    handle: "llueve-vinilo",
    title: "Llueve (Vinilo)",
    price: "24,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/llueve-vinilo.png",
    productUrl: "https://apparell.com/products/llueve-vinilo",
  },
  {
    id: "7",
    handle: "vaiven-vinilo",
    title: "Vaivén (Vinilo)",
    price: "24,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/vaiven-vinilo.png",
    productUrl: "https://apparell.com/products/vaiven-vinilo",
  },
  {
    id: "8",
    handle: "camiseta-me-haces-bien",
    title: "Camiseta «me haces bien»",
    price: "29,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/camiseta-me-haces-bien.png",
    productUrl: "https://apparell.com/products/camiseta-me-haces-bien",
  },
  {
    id: "9",
    handle: "camiseta-silencio",
    title: "Camiseta silencio (unisex)",
    price: "29,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/camiseta-silencio.png",
    productUrl: "https://apparell.com/products/camiseta-silencio-unisex",
  },
  {
    id: "10",
    handle: "tote-bag-silencio",
    title: "Tote bag silencio",
    price: "24,95",
    currencyCode: "EUR",
    imageSrc: "/images/merch/tote-bag-silencio.png",
    productUrl: "https://apparell.com/products/tote-bag-silencio",
  },
];

export const heroContent: HeroContent = {
  headline: "Taraca",
  subheadline: "Immersive album experience",
  backgroundImageSrc: "/images/drexler-hero-v2.png",
  logoImageSrc: "/images/logo.png",
};

export const manifestoContent: ManifestoContent = {
  title: "Manifesto",
  lines: [],
  drumPerformanceVideoSrc: "/video/drum.mp4",
};

/** Preview por defecto para temas sin clip dedicado en /video */
export const TRACKLIST_PREVIEW_VIDEO = "/video/publico.mp4";

export const TRACKLIST_VIDEO_TOCO_MADERA = "/video/toco-madera.mp4";
export const TRACKLIST_VIDEO_TE_LLEVO_TATUADA = "/video/te-llevo-tatuada.mp4";
export const TRACKLIST_VIDEO_QUE_SERA_QUE_ES = "/video/que-sera.mp4";

/** Placeholder hasta asignar el vídeo oficial por tema */
export const TRACKLIST_YOUTUBE_PLACEHOLDER_ID = "dQw4w9WgXcQ";

export const tracklistContent: Track[] = [
  {
    id: "01",
    number: "01.",
    title: "Toco madera",
    duration: "3:17",
    previewVideoSrc: TRACKLIST_VIDEO_TOCO_MADERA,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "02",
    number: "02.",
    title: "¿Cómo se ama?",
    duration: "3:38",
    previewVideoSrc: TRACKLIST_PREVIEW_VIDEO,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "03",
    number: "03.",
    title: "El tambor chico",
    feature: "ft. Rueda de Candombe",
    duration: "3:26",
    previewVideoSrc: TRACKLIST_PREVIEW_VIDEO,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "04",
    number: "04.",
    title: "Ante la duda, baila",
    duration: "3:59",
    previewVideoSrc: TRACKLIST_PREVIEW_VIDEO,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "05",
    number: "05.",
    title: "Te llevo tatuada",
    feature: "ft. Young Miko",
    duration: "3:52",
    previewVideoSrc: TRACKLIST_VIDEO_TE_LLEVO_TATUADA,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "06",
    number: "06.",
    title: "¿Qué será que es?",
    feature: "ft. Rueda de Candombe",
    duration: "3:10",
    previewVideoSrc: TRACKLIST_VIDEO_QUE_SERA_QUE_ES,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "07",
    number: "07.",
    title: "Amar y ser amado",
    feature: "ft. Meritxell Neddermann",
    duration: "3:49",
    previewVideoSrc: TRACKLIST_PREVIEW_VIDEO,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "08",
    number: "08.",
    title: "¿Hay alguien A.I?",
    duration: "3:23",
    previewVideoSrc: TRACKLIST_PREVIEW_VIDEO,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "09",
    number: "09.",
    title: "Cuando cantaba Morente",
    feature: "ft. Ángeles Toledano, Julio Cabelli",
    duration: "3:09",
    previewVideoSrc: TRACKLIST_PREVIEW_VIDEO,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "10",
    number: "10.",
    title: "Nuestro trabajo / Los puentes",
    feature: "ft. Américo Young",
    duration: "3:51",
    previewVideoSrc: TRACKLIST_PREVIEW_VIDEO,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
  {
    id: "11",
    number: "11.",
    title: "Las palabras",
    feature: "ft. Falta y Resto",
    duration: "2:58",
    previewVideoSrc: TRACKLIST_PREVIEW_VIDEO,
    youtubeVideoId: TRACKLIST_YOUTUBE_PLACEHOLDER_ID,
  },
];

/** Textos de la sección Gira (cabecera). `followHref`: newsletter o redes cuando esté definido. */
export const tourSectionContent = {
  titleLine1: "Gira",
  titleLine2: "Taracá 2026",
  ctaLinkLabel: "Síguenos",
  /** Tras el enlace; el salto de línea va en el componente. */
  ctaAfterLine1: " para recibir novedades",
  ctaAfterLine2: "sobre espectáculos",
  followHref: "#",
} as const;

export const biographyContent: BiographyContent = {
  title: "Biography",
  paragraphs: [],
};
