import { NextResponse } from "next/server";
import { getNewsletterProvider } from "@/lib/integrations/newsletter";
import type { NewsletterPayload } from "@/lib/domain";

function isValidPayload(input: unknown): input is NewsletterPayload {
  if (typeof input !== "object" || input === null) return false;
  const { email } = input as NewsletterPayload;
  return typeof email === "string" && email.length > 3;
}

export async function POST(request: Request) {
  const payload: unknown = await request.json();
  if (!isValidPayload(payload)) {
    return NextResponse.json(
      { success: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const provider = getNewsletterProvider();
  const result = await provider.subscribe(payload);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
