import type { TourEvent } from "@/lib/domain";
import type { TourEventsProvider } from "./types";

/** Respuesta mínima del endpoint REST de Bandsintown (artists/.../events). */
type BandsintownVenue = {
  name?: string;
  city?: string;
  country?: string;
  region?: string;
};

type BandsintownOffer = {
  type?: string;
  url?: string;
};

type BandsintownEventPayload = {
  id?: string | number;
  datetime?: string;
  url?: string;
  venue?: BandsintownVenue;
  offers?: BandsintownOffer[];
  lineup?: string[];
};

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  argentina: "AR",
  uruguay: "UY",
  spain: "ES",
  chile: "CL",
  colombia: "CO",
  mexico: "MX",
  brazil: "BR",
  paraguay: "PY",
  peru: "PE",
  "united states": "US",
  usa: "US",
  canada: "CA",
  "united kingdom": "GB",
  france: "FR",
  germany: "DE",
};

function countryToCode(country: string | undefined): string {
  if (!country?.trim()) return "XX";
  const key = country.trim().toLowerCase();
  if (COUNTRY_NAME_TO_CODE[key]) return COUNTRY_NAME_TO_CODE[key];
  if (country.trim().length === 2) return country.trim().toUpperCase();
  return country.trim().slice(0, 2).toUpperCase();
}

function pickTicketUrl(event: BandsintownEventPayload): string | undefined {
  const fromOffers = event.offers?.find((o) =>
    /ticket/i.test(o.type ?? "")
  )?.url;
  return fromOffers ?? event.url;
}

function mapPayloadToTourEvent(raw: BandsintownEventPayload): TourEvent | null {
  if (raw.id == null || !raw.datetime || !raw.venue) return null;
  const venue = raw.venue;
  const city = venue.city?.trim() || venue.name?.trim() || "TBA";
  const datePart = raw.datetime.slice(0, 10);
  const artistName = raw.lineup?.[0]?.trim() || "Artist";

  return {
    id: `bit-${raw.id}`,
    artistName,
    city,
    countryCode: countryToCode(venue.country),
    venue: venue.name?.trim() || city,
    localDate: datePart,
    ticketUrl: pickTicketUrl(raw),
    rsvpUrl: raw.url,
  };
}

/**
 * Carga eventos desde la API REST pública de Bandsintown.
 * Requiere `BANDSINTOWN_APP_ID`. Opcional: `BANDSINTOWN_ARTIST_NAME` (default "Jorge Drexler").
 * @see https://help.artists.bandsintown.com/en/articles/9516493-api-usage-guidelines
 */
export class BandsintownApiProvider implements TourEventsProvider {
  async listUpcomingEvents(): Promise<TourEvent[]> {
    const appId = process.env.BANDSINTOWN_APP_ID?.trim();
    const artistName =
      process.env.BANDSINTOWN_ARTIST_NAME?.trim() || "Jorge Drexler";

    if (!appId) {
      return [];
    }

    const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(
      artistName
    )}/events?app_id=${encodeURIComponent(appId)}`;

    try {
      const res = await fetch(url, {
        next: { revalidate: 300 },
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        console.error(
          `[Bandsintown] HTTP ${res.status} fetching events for "${artistName}"`
        );
        return [];
      }

      const data = (await res.json()) as unknown;
      if (!Array.isArray(data)) {
        return [];
      }

      const events: TourEvent[] = [];
      for (const item of data) {
        const mapped = mapPayloadToTourEvent(item as BandsintownEventPayload);
        if (mapped) events.push(mapped);
      }
      return events;
    } catch (e) {
      console.error("[Bandsintown] fetch failed:", e);
      return [];
    }
  }
}
