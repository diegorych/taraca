import { NextResponse } from "next/server";
import { getTourEventsProvider } from "@/lib/integrations/bandsintown";

export async function GET() {
  const provider = getTourEventsProvider();
  const events = await provider.listUpcomingEvents();

  return NextResponse.json({ events });
}
