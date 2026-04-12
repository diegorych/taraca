import { NextResponse } from "next/server";
import { getMerchProvider } from "@/lib/integrations/shopify";

export async function GET() {
  const provider = getMerchProvider();
  const products = await provider.listProducts();

  return NextResponse.json({ products });
}
