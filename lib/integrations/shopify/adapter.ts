import type { MerchProduct } from "@/lib/domain";
import { getMockProducts } from "./mock";

export interface MerchProvider {
  listProducts(): Promise<MerchProduct[]>;
}

class MockMerchProvider implements MerchProvider {
  async listProducts(): Promise<MerchProduct[]> {
    return getMockProducts();
  }
}

export function getMerchProvider(): MerchProvider {
  return new MockMerchProvider();
}
