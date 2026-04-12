import type { TourEvent } from "@/lib/domain";
import { BandsintownApiProvider } from "./api-provider";
import { getMockTourEvents } from "./mock";
import type { TourEventsProvider } from "./types";

class MockTourEventsProvider implements TourEventsProvider {
  async listUpcomingEvents(): Promise<TourEvent[]> {
    return getMockTourEvents();
  }
}

/**
 * API Bandsintown; si la respuesta viene vacía (artista sin fechas, error silencioso, etc.),
 * se muestran las fechas mock para que el sitio no quede sin listado.
 */
class BandsintownWithMockFallbackProvider implements TourEventsProvider {
  async listUpcomingEvents(): Promise<TourEvent[]> {
    const api = new BandsintownApiProvider();
    const fromApi = await api.listUpcomingEvents();
    if (fromApi.length > 0) return fromApi;
    return getMockTourEvents();
  }
}

/**
 * Si existe `BANDSINTOWN_APP_ID`, se intenta la API REST; sin eventos, fallback al mock.
 * Sin app id, solo mock.
 */
export function getTourEventsProvider(): TourEventsProvider {
  if (process.env.BANDSINTOWN_APP_ID?.trim()) {
    return new BandsintownWithMockFallbackProvider();
  }
  return new MockTourEventsProvider();
}

export type { TourEventsProvider } from "./types";
