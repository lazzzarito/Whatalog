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
  openGraph: {
    locale: "en_US",
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
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <Preloader>
          {children}
        </Preloader>
      </body>
    </html>
  );
}
