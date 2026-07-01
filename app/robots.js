export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || "https://whatalog.vercel.app"}/sitemap.xml`,
  };
}
