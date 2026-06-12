<p align="center"><img src="logo.webp" alt="Whatalog" width="100%"></p>

<h1 align="center">Whatalog — Online WhatsApp Catalog</h1>

<p align="center">
  <strong>Turn your products into WhatsApp orders — no backend, no database, no hassle.</strong>
</p>

<p align="center">
  Whatalog is a free, open-source Next.js template that turns a folder of Markdown files into a beautiful, fully functional online store. Customers browse your catalog, add items to their cart, and send the complete order as a formatted WhatsApp message — directly from your site. Zero backend, zero database, zero monthly fees.
</p>

---

## Why Whatalog?

Most small businesses don't need a full e‑commerce platform. They need a **catalog that looks great** and a **checkout that feels like chatting**. Whatalog bridges the gap between "just a photo album" and "overkill e‑commerce". You get a true masonry storefront, dark mode, browser-native translation, and WhatsApp checkout — all from static Markdown files.

**What you get:**
- A premium‑looking storefront in under 30 seconds
- Zero backend to maintain (no database, no API, no server logic)
- Orders delivered straight to your WhatsApp — warm leads, not abandoned carts
- Full control: your products are simple `.md` files, your images are local, your config is JSON
- Smart popup stacking: press back once per popup, double-back-to-exit from the home page
- Free forever, open source, MIT licensed

---

## Features

| Feature                             | What it does                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Markdown-based products**         | Write products as `.md` files with YAML frontmatter. No CMS, no admin panel.                                  |
| **CSS multi-column masonry grid**   | True Pinterest-style waterfall layout with varied aspect ratios (tall / square / wide). No gaps below cards.  |
| **Search & filters**                | Real‑time search, category filtering, and multiple sort modes.                                                |
| **Shopping cart with localStorage** | Persists across sessions. Add, remove, update quantities — works offline.                                     |
| **WhatsApp checkout**               | One tap generates a structured order message with all items, prices, and totals.                              |
| **Browser-native translation**      | The UI is in English; visitors can use their browser's built-in translate feature to view it in any language. |
| **Dark mode**                       | Automatic based on system preference. Easy to customize.                                                      |
| **Fully responsive**                | Mobile‑first design, looks flawless on phones, tablets, and desktops.                                         |
| **Popup back-navigation stack**     | Each popup closes one at a time via browser back. Nested popups (Promo → Product → QuickBuy) stay layered.   |
| **Double-back-to-exit**             | Shows an exit warning toast on first back press. Second press within 3 seconds leaves the site.              |
| **Flash Offers section**            | Products with `offer: true` appear in a hero grid. A + button opens all offers in a popup.                   |
| **Promo groups**                    | Products with matching `promo` field are grouped into promo modals (2–4 products per group).                  |
| **Toast notifications**             | Non-blocking feedback for cart actions (green) and exit warnings (orange).                                    |

---

## Quick Start

Get your store running in seconds.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your catalog is live.

> 📖 **Full documentation available in [`guide.md`](guide.md)** — covers project structure, product format, configuration, customization, translation, and deployment.

---

## Customize

Everything is designed to be edited without touching code.

- **Store info** — edit `content/store-config.json` (name, phone, currency, promo banners, promo links)
- **Products** — add `.md` files to `content/products/` with frontmatter (title, price, category, image)
- **Images** — place product images in `content/products/` and promos in `content/promos/`, or use Unsplash URLs directly
- **Colors & fonts** — adjust CSS variables in `app/globals.css`
- **Manual translation** — to customize any UI string, edit the component files directly (all text is hardcoded in English)
- **Logo** — swap `logo.webp` in the root with your own

---

## Deploy

Build for production and deploy anywhere Node.js runs:

```bash
npm run build
npm start
```

Works seamlessly with Vercel, Netlify, Railway, or your own VPS. No extra configuration needed.

---

## License

[MIT](LICENSE) — free to use, modify, and distribute. No strings attached.

---

<p align="center">
  <strong>Built with Next.js, ☕, and ❤️‍🔥 by <a href="https://1azarito.vercel.app">1azarito</a></strong><br>
  <em>From catalog to WhatsApp in one click.</em>
</p>
