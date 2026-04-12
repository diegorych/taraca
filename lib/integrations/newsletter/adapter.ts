import type { NewsletterPayload, NewsletterResult } from "@/lib/domain";

export interface NewsletterProvider {
  subscribe(payload: NewsletterPayload): Promise<NewsletterResult>;
}

class MockNewsletterProvider implements NewsletterProvider {
  async subscribe(payload: NewsletterPayload): Promise<NewsletterResult> {
    if (!payload.email.includes("@")) {
      return { success: false, message: "Invalid email address." };
    }

    return { success: true, message: "Subscribed successfully." };
  }
}

export function getNewsletterProvider(): NewsletterProvider {
  return new MockNewsletterProvider();
}
