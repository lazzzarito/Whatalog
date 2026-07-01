export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://whatalog.vercel.app/sitemap.xml",
  };
}
