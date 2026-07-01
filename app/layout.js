import "./globals.css";
import Preloader from "@/components/Preloader";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://whatalog.vercel.app";

export const metadata = {
  metadataBase: new URL(baseUrl),
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
    images: [{ url: "/images/logo.webp", width: 512, height: 512, alt: "Whatalog" }],
  },
  alternates: { canonical: baseUrl },
};

export const viewport = {
  themeColor: "#00a884",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <link rel="preconnect" href="https://wa.me" />
      <body>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <Preloader>
          {children}
        </Preloader>
      </body>
    </html>
  );
}
