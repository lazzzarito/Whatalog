import "./globals.css";
import Preloader from "@/components/Preloader";

export const metadata = {
  title: "Whatalog | Online WhatsApp Catalog",
  description: "Whatalog — A modern, ready-to-use WhatsApp-based online catalog template. Browse products, add to cart, and order directly via WhatsApp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Preloader>
          {children}
        </Preloader>
      </body>
    </html>
  );
}
