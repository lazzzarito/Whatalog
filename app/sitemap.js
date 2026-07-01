import { getAllProductIds, getStoreConfig } from "@/lib/products";

export default async function sitemap() {
  const baseUrl = "https://whatalog.vercel.app";
  const config = getStoreConfig();

  const productIds = await getAllProductIds();
  const productUrls = productIds.map((id) => ({
    url: `${baseUrl}/product/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...productUrls,
  ];
}
