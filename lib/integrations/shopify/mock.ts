import type { MerchProduct } from "@/lib/domain";

export function getMockProducts(): MerchProduct[] {
  return [
    {
      id: "tee-black-taraca",
      handle: "tee-black-taraca",
      title: "Taraca Tee - Black",
      price: "35.00",
      currencyCode: "USD",
      imageSrc: "/images/drexler-hero-v2.png",
      productUrl: "#",
    },
    {
      id: "vinyl-taraca",
      handle: "vinyl-taraca",
      title: "Taraca Vinyl",
      price: "45.00",
      currencyCode: "USD",
      imageSrc: "/images/logo.png",
      productUrl: "#",
    },
  ];
}
