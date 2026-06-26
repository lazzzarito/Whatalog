import "./globals.css";
import Preloader from "@/components/Preloader";

export const metadata = {
  title: "Whatalog | Online WhatsApp Catalog",
  description: "Whatalog — A modern, ready-to-use WhatsApp-based online catalog template. Browse products, add to cart, and order directly via WhatsApp.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Whatalog",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport = {
  themeColor: "#00a884",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Whatalog" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <Preloader>
          {children}
        </Preloader>
      </body>
    </html>
  );
}
