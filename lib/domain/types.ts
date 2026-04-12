export type ISODateString = string;

export interface HeroContent {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  backgroundImageSrc: string;
  logoImageSrc: string;
}

export interface ManifestoContent {
  title: string;
  lines: string[];
  drumPerformanceVideoSrc: string;
}

export interface Track {
  id: string;
  number: string;
  title: string;
  /** Línea secundaria (p. ej. ft. artista), tipografía itálica */
  feature?: string;
  duration?: string;
  previewVideoSrc?: string;
  /** ID del vídeo de YouTube (embed), p. ej. dQw4w9WgXcQ */
  youtubeVideoId?: string;
}

export interface TourEvent {
  id: string;
  artistName: string;
  city: string;
  countryCode: string;
  venue: string;
  localDate: ISODateString;
  ticketUrl?: string;
  rsvpUrl?: string;
}

export interface MerchProduct {
  id: string;
  handle: string;
  title: string;
  /** Precio mostrado tal cual (p. ej. "24,95" o "35.00"). */
  price: string;
  currencyCode: string;
  /** Ruta bajo /public; si falta, se muestra placeholder. */
  imageSrc?: string;
  /** URL de compra (p. ej. Apparell). */
  productUrl: string;
}

export interface BiographyContent {
  title: string;
  paragraphs: string[];
}

export interface NewsletterPayload {
  email: string;
  locale?: string;
  source?: string;
}

export interface NewsletterResult {
  success: boolean;
  message: string;
}
