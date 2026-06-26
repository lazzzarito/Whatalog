# Whatalog Guide — Online WhatsApp Catalog Template

## What is Whatalog?

Whatalog is a free, open-source template for creating a WhatsApp-based online catalog. It loads product data from Markdown files, lets customers browse and add items to a cart, and sends the complete order as a formatted WhatsApp message.

Built with Next.js 16 + React 19, gray-matter + marked for Markdown-based products. Lightweight, no backend, no database. All UI text is in English.

---

## Quick Start

```bash
npm install
npm run dev
```

Edit `content/store-config.json` with your store info, add products as `.md` files in `content/products/`, and you're live.

---

## Project Structure

```
whatalog/
├── app/
│   ├── api/images/
│   │   ├── products/[filename]/route.js   → Serves product images
│   │   └── promos/[filename]/route.js      → Serves promo images
│   ├── product/[id]/
│   │   ├── page.js                          → Product detail page (SSG + ISR)
│   │   └── ProductPageClient.jsx            → Product page client component
│   ├── globals.css                          → Global styles (colors, fonts, layout)
│   ├── layout.js                            → Root layout (meta tags, fonts)
│   ├── page.js                              → Home page (server component)
│   └── CatalogContainer.jsx                 → Main client component
├── components/
│   ├── Cart.jsx                             → Shopping cart & checkout form
│   ├── FilterHeader.jsx                     → Header, search, categories, filters, store info modal
│   ├── LegalInfoModal.jsx                   → Legal / cookies popup
│   ├── MasonryGrid.jsx                      → CSS multi-column masonry wrapper
│   ├── OfferModal.jsx                       → Flash Offers expanded popup (all offer products)
│   ├── Preloader.jsx                        → Loading spinner shown on first render
│   ├── ProductCard.jsx                      → Product card with image, price, add-to-cart
│   ├── ProductModal.jsx                     → Product detail modal with gallery, attributes, sharing
│   ├── QuickBuyModal.jsx                    → Direct buy / quick checkout form
│   ├── Skeleton.jsx                         → Shimmer skeleton loader
│   └── CustomerInfoModal.jsx                → Onboarding form (name, phone, delivery, payment)
├── content/
│   ├── store-config.json                    → Store configuration (name, WhatsApp number, promo banners, links, Google Sheets config)
│   ├── products/                            → Product .md files + image files
│   ├── promos/                              → Promotional images (landscape + 2 squares)
│   ├── products.csv                         → Local CSV product catalog sheet
│   └── products.xlsx                        → Local Excel product catalog sheet
├── lib/
│   ├── popup-history.js                     → Centralized popup back-navigation stack + double-back-to-exit
│   ├── products.js                          → Server helpers: getStoreConfig(), getProducts(), getProductById(), getAllProductIds()
│   ├── sheets.js                            → Google Sheets fetcher (dual-source product loading)
│   ├── scroll-lock.js                       → Body scroll lock utility (counter-based)
│   └── use-history-popup.js                 → React hook wrapping popup-history registerPopup
├── public/
│   └── images/logo.webp                     → Store logo (displayed in header)
├── next.config.mjs                          → Next.js configuration
├── package.json                             → Dependencies and scripts
├── postcss.config.mjs                       → PostCSS config
├── eslint.config.mjs                        → ESLint flat config
├── jsconfig.json                            → Path aliases (@/ → .)
├── README.md                                → Brief project overview
└── GUIDE.md                                 → This file
```

---

## Products

Each product is a `.md` file inside `content/products/`. The filename (without `.md`) becomes the default product ID if no `id` field is provided in the frontmatter.

### Creating a Product

Create a new `.md` file in `content/products/` with YAML frontmatter between `---` delimiters. After the frontmatter, you can write Markdown content that appears in the product detail modal.

### Editing a Product

Open the `.md` file, modify any frontmatter field or the Markdown body, and save. The changes appear on the next page refresh (development) or after a rebuild (production).

### Deleting a Product

Delete the `.md` file from `content/products/`. The product disappears from the catalog on next load.

### Frontmatter Fields

```yaml
---
# ── REQUIRED ──────────────────────────────────────────────
id: "perfume-rose"            # Unique identifier. Used as cart key and sorting seed.
name: "Floral Rose Perfume"   # Product name displayed on card, modal, cart, and WhatsApp.
priceUSD: 18.00               # Price in USD (numeric). Displayed with currency symbol.
category: "Perfumery"         # Category name. Auto-created in the category filter.

# ── IMAGE (pick one pattern) ──────────────────────────────
image: "perfume_rose.png"     # Single image (string path).
# OR
images:                       # Multiple images (array of strings).
  - "perfume_rose.png"        #   First image is used on the product card.
  - "perfume_rose_2.png"      #   All images shown in product modal gallery.
# OR use a full Unsplash URL:
# image: "https://images.unsplash.com/photo-...?q=80&w=600&auto=format&fit=crop"

# ── OPTIONAL ──────────────────────────────────────────────
description: "Wild rose and..."   # Short text shown on the product card (clamped to 2 lines).
originalPrice: 25.00              # Original/higher price. Shows strikethrough + OFFER badge.
offer: true                       # Boolean. Shows product in "Flash Offers" section (only if originalPrice > priceUSD).
stock: 25                         # Number. Available inventory. Defaults to Infinity if omitted.
status: "coming-soon"             # String. "coming-soon" blocks all purchase actions; null/omitted means available.
featured: true                    # Boolean. Featured products sort first.
attributes:                       # Key-value pairs displayed in modal & sent in WhatsApp.
  Size: "50 ml"
  Color: "Gold"
options:                          # Dictionary of options (size, color, etc.) displaying option pills, custom prices, and images.
  Size:
    - name: "20 oz"
      priceUSD: 15.00
    - name: "32 oz"
      priceUSD: 20.00
  Color:
    - name: "Sage Green"
      image: "insulated_tumbler_sage_green.png"
    - name: "Matte Black"
      image: "insulated_tumbler_matte_black.png"
promo: "summer-fragrances"        # String. Groups product into a promo modal (matches promoLinks target).
---
```

### Complete Product Example

```yaml
---
id: "perfume-rose"
name: "Floral Rose Perfume"
priceUSD: 18.00
originalPrice: 25.00
category: "Perfumery"
images:
  - "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop"
  - "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=600&auto=format&fit=crop"
description: "Wild rose and premium jasmine fragrance. Long-lasting with a delicate aroma perfect for daily wear."
featured: true
offer: true
attributes:
  Size: "1.7 fl oz (50 ml)"
  Longevity: "12 hours"
  Type: "Eau de Parfum"
promo: "summer-fragrances"
---
This perfume is crafted with the finest floral notes. Its minimalist, elegant bottle fits perfectly on any vanity.
- **Top notes:** Rose petals and jasmine.
- **Heart notes:** Violet and white sandalwood.
- **Longevity:** Over 12 hours on skin.
```

### Product without Discount or Extra Fields

```yaml
---
id: "vintage-leather-handbag"
name: "Vintage Leather Handbag"
priceUSD: 35.00
category: "Accessories"
image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop"
description: "Elegant camel-color shoulder bag."
featured: false
---
```

### Product with External Image URL

```yaml
---
id: "retro-round-sunglasses"
name: "Retro Round Sunglasses"
priceUSD: 16.00
category: "Accessories"
image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop"
description: "Retro-style round sunglasses with gold metal frame and dark lenses with full UV400 protection."
featured: false
---
```

---

## CSV and Excel Catalogs

Whatalog supports loading products from local CSV (`content/products.csv`) or Excel (`content/products.xlsx`) sheets, alongside Google Sheets. 

### Data Source Priority

When the catalog loads, it checks for data sources in the following order:
1. **Google Sheets:** If a `googleSheets` config is present in `content/store-config.json` with a valid `sheetId`.
2. **Local Excel:** If `content/products.xlsx` exists.
3. **Local CSV:** If `content/products.csv` exists.
4. **Markdown (.md):** Fallback to reading `.md` files from `content/products/` if no other sources are found.

### Catalog Columns (Headers)

Both `.csv` and `.xlsx` sheets must have the following column headers in the first row (headers are case-insensitive):

| Column Header | Description |
|---|---|
| `id` | Unique product identifier (e.g. `insulated-tumbler`). |
| `name` | Display name of the product. |
| `priceUSD` | Numeric product price. |
| `category` | Product category for filtering. |
| `image` | Primary image file name or URL. |
| `images` | Comma-separated list of secondary images. |
| `description` | Product short description. |
| `featured` | `true` or `false` (featured products appear first). |
| `originalPrice` | Numeric original price (optional, triggers SALE badge). |
| `stock` | Numeric stock quantity (optional, defaults to `Infinity`). |
| `status` | Set to `coming-soon` to disable purchase actions (optional). |
| `promo` | Promotion group identifier (optional). |
| `seoTitle` | SEO Page Title (optional). |
| `seoDescription` | SEO Page Description (optional). |
| `options` | JSON string representing product variations (options, colors, sizes, variable pricing) (optional). |
| `attributes` | JSON string of custom key-value specifications (optional). |

### Serializing Options & Attributes in Cells

Since CSV and Excel are flat spreadsheets, nested data structures like `options` and `attributes` are stored as JSON strings inside their respective cells.

#### options Column Example
For a product with size variations and color variations with variation-specific images, write the following JSON string in the cell:
```json
{
  "Size": [
    { "name": "20 oz", "priceUSD": 15.00 },
    { "name": "32 oz", "priceUSD": 20.00 }
  ],
  "Color": [
    { "name": "Sage Green", "image": "insulated_tumbler_sage_green.png" },
    { "name": "Matte Black", "image": "insulated_tumbler_matte_black.png" }
  ]
}
```

#### attributes Column Example
For key-value specifications, write the following JSON string in the cell:
```json
{
  "Material": "18/8 Food-Grade Stainless Steel",
  "Insulation": "24 hours cold / 12 hours hot"
}
```

### Generating Sheets from Markdown

You can automatically compile all markdown product files into `products.csv` and `products.xlsx` by running the helper script:
```bash
node scripts/generate-samples.js
```
This is useful if you prefer to maintain markdown files but need to export your catalog to a spreadsheet.

---

## Product Images

### Location

Product image files go in the same directory as the product `.md` files: `content/products/`. They are served via the API route at `/api/images/products/[filename]`.

### Image Path Resolution

The `image` / `images` frontmatter values are resolved by `lib/products.js` with three possible patterns:

| Value pattern                                | Resolution                                   | Example                                                        |
| -------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------- |
| Relative filename (no leading `/` or `http`) | Served via `/api/images/products/[filename]` | `"perfume_rose.png"` → `/api/images/products/perfume_rose.png` |
| Absolute path (starts with `/`)              | Served as static file from `public/`         | `"/images/logo.webp"` → `/images/logo.webp`                    |
| Full URL (starts with `http`)                | Used directly as the image `src`             | `"https://example.com/photo.jpg"` → used as-is                 |

### Supported Formats

`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`, `.avif`

### Sizing

Product images are displayed in a CSS multi-column masonry grid with three aspect ratios:

- **Tall** (`ratio-tall`): padding-top 130% (portrait orientation)
- **Square** (`ratio-square`): padding-top 100% (1:1)
- **Wide** (`ratio-wide`): padding-top 80% (landscape orientation)

The aspect ratio is assigned deterministically based on the product ID length (`id.length % 3`). This ensures each product always gets the same ratio while creating a visually diverse masonry layout.

- `id.length % 3 === 0` → `ratio-tall`
- `id.length % 3 === 1` → `ratio-square`
- `id.length % 3 === 2` → `ratio-wide`

Images use `object-fit: cover` and scale on hover (1.08×) with a smooth CSS transition.

### Image API Route

File: `app/api/images/products/[filename]/route.js`

- Reads the file from `content/products/`
- Returns the correct `Content-Type` based on file extension
- Sets `Cache-Control: public, max-age=31536000, immutable` for long-term caching
- Blocks directory traversal (rejects paths containing `..` or `/`)
- Returns 403 for forbidden paths, 404 for missing files

---

## Promotional Images

### Location

Promotional images go in `content/promos/`. They are served via `/api/images/promos/[filename]` (same logic as product images, reading from `content/promos/`).

### Configuration

In `content/store-config.json`, the `promoBanners` array defines which images are displayed:

```json
{
  "promoBanners": [
    "/api/images/promos/landscape-promo.webp",
    "/api/images/promos/square-promo-1.webp",
    "/api/images/promos/square-promo-2.webp"
  ]
}
```

Maximum 3 images:

| Index | Position     | Aspect Ratio     | Desktop layout                   | Mobile layout    |
| ----- | ------------ | ---------------- | -------------------------------- | ---------------- |
| `[0]` | Left / top   | 16:9 (landscape) | Left column (`1fr auto`)         | Full width, 16:9 |
| `[1]` | Right top    | 1:1 (square)     | Right column, stacked vertically | 50% width, 1:1   |
| `[2]` | Right bottom | 1:1 (square)     | Right column, stacked vertically | 50% width, 1:1   |

### Grid Layout

**Desktop (≥769px):** The promo grid is a `1fr auto` two-column layout using CSS `container-type: inline-size` for responsive inner sizing. The landscape image fills the left column; the two squares stack vertically in the right column.

**Mobile (≤768px):** The grid becomes a single column. The landscape image is full-width with 16:9 aspect ratio. The two squares are side-by-side in a `1fr 1fr` grid, each with 1:1 aspect ratio.

If `promoBanners` is empty or undefined, the promo section is not rendered.

### Promo Click Behavior (promoLinks)

Each promo banner can be configured to open a promo modal popup showing related products. Configure this in `store-config.json` via the `promoLinks` array:

```json
"promoLinks": [
    { "type": "promo", "target": "summer-fragrances", "title": "Summer Fragrances", "subtitle": "Light & fresh scents" },
    { "type": "promo", "target": "accessories-edit", "title": "Accessories Edit", "subtitle": "Complete your look" },
    { "type": "promo", "target": "leather-essentials", "title": "Leather Essentials", "subtitle": "Timeless pieces" }
]
```

Each entry corresponds to the banner at the same index (0 = landscape, 1 = first square, 2 = second square).

| Field      | Type      | Description                                                                                                            |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| `type`     | `"promo"` | Always set to `"promo"` for modal popups.                                                                              |
| `target`   | string    | Matches the `promo` field in product `.md` frontmatter. All products with the same `promo` value appear in that popup. |
| `title`    | string    | Bold heading displayed at the top of the modal.                                                                        |
| `subtitle` | string    | Smaller text below the title (optional).                                                                               |

**To associate a product with a promo**, add `promo: "target-name"` to its frontmatter:

```yaml
---
id: "perfume-rose"
name: "Floral Rose Perfume"
promo: "summer-fragrances"
---
```

Products with no `promo` field (or `null`) are not shown in any promo modal.

Each promo group should contain 2–4 products for optimal display.

**Legacy behavior** (still supported):  
- `{ "type": "product", "target": "product-id" }` — clicking the banner opens the product detail modal.
- `{ "type": "section", "target": "offers" }` — clicking the banner scrolls to the Flash Offers section.

---

## Store Configuration

File: `content/store-config.json`

```json
{
  "name": "Whatalog Demo Store",
  "location": "Miami, Florida, United States",
  "whatsappNumber": "+15551234567",
  "logoUrl": "/images/logo.webp",
  "currency": {
    "code": "USD",
    "symbol": "$"
  },
  "promoBanners": [
    "/api/images/promos/landscape-promo.webp",
    "/api/images/promos/square-promo-1.webp",
    "/api/images/promos/square-promo-2.webp"
  ],
  "promoLinks": [
    { "type": "promo", "target": "summer-fragrances", "title": "Summer Fragrances", "subtitle": "Light & fresh scents" },
    { "type": "promo", "target": "accessories-edit", "title": "Accessories Edit", "subtitle": "Complete your look" },
    { "type": "promo", "target": "leather-essentials", "title": "Leather Essentials", "subtitle": "Timeless pieces" }
  ]
}
```

| Field             | Type   | Required | Description                                                                                                                                   |
| ----------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            | string | Yes      | Store name. Displayed in the Store Info modal, WhatsApp message header, and as the page title prefix.                                         |
| `location`        | string | Yes      | Physical address. Shown in the Store Info modal and used as the pickup address in the WhatsApp message.                                       |
| `whatsappNumber`  | string | Yes      | WhatsApp number in international format (`+15551234567`). Used to generate the checkout WhatsApp link.                                        |
| `logoUrl`         | string | Yes      | Path to the store logo image. Displayed in the header as a 32×32 rounded circle. Supports `/images/...`, `/api/images/...`, or external URLs. |
| `currency.code`   | string | Yes      | ISO 4217 currency code (e.g., `"USD"`, `"EUR"`). Displayed next to prices.                                                                    |
| `currency.symbol` | string | Yes      | Currency symbol (e.g., `"$"`, `"€"`). Displayed before prices.                                                                                |
| `promoBanners`    | array  | No       | Array of up to 3 image paths for the hero promotional grid. See Promotional Images section above.                                             |
| `promoLinks`      | array  | No       | Array of up to 3 promo link configs, one per promo banner. Controls what happens when each banner is tapped.                                  |
| `donationUrl`     | string | No       | Optional URL for a donation/support link (e.g., Buy Me a Coffee, PayPal, Ko-fi). When set, shows a "Support this template" button in the Store Info modal. |

### Fallback Values

The `getStoreConfig()` function in `lib/products.js` has a fallback configuration that is used if the JSON file cannot be read:

```json
{
  "name": "Whatalog Demo Store",
  "location": "Miami, Florida, United States",
  "whatsappNumber": "+15551234567",
  "currency": { "code": "USD", "symbol": "$" }
}
```

---

## Page Sections Layout

The page is organized top-to-bottom as follows:

```
┌──────────────────────────────────────────────┐
│  HEADER (fixed, glassmorphism)               │
│  [Logo] [Category: All | Cat1 | Cat2 | ... ] │
│  [Search bar] [Info icon] [Cart button]      │
├──────────────────────────────────────────────┤
│  PROMO GRID (if banners configured)          │
│  ┌──────────┐ ┌───────────┐                   │
│  │ Landscape│ │ Square #1 │                   │
│  │  (16:9)  │ ├───────────┤                   │
│  │          │ │ Square #2 │                   │
│  └──────────┘ └───────────┘                   │
├──────────────────────────────────────────────┤
│  FLASH OFFERS (if any product has offer:true) │
│  ┌──────┬──────┬──────┬──────┐                │
│  │ Card │ Card │ Card │ Card │  [+ button]    │
│  └──────┴──────┴──────┴──────┘                │
│  (2-col mobile, 4-col desktop, max 4 shown)   │
├──────────────────────────────────────────────┤
│  AVAILABLE PRODUCTS                      [f] │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │Card  │ │Card  │ │Card  │ │Card  │          │
│  │(tall)│ │(sqr) │ │(wide)│ │(tall)│          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
│  CSS multi-column masonry                     │
│  2-col mobile, 4-col desktop                  │
│                                               │
│  ... [Infinite scroll loader] ...             │
├──────────────────────────────────────────────┤
│  FOOTER                                       │
│  ┌──────────────────────────────────────┐     │
│  │  Store Card: logo + name + badge     │     │
│  │  [social icons]                      │     │
│  │  3-col grid: Location, WhatsApp,     │     │
│  │  Hours, Deliveries, Store Info,      │     │
│  │  Template Info (clickable)           │     │
│  └──────────────────────────────────────┘     │
│  ┌──────────────────────────────────────┐     │
│  │  Map Card: "Where to find us?" +     │     │
│  │  Google Maps iframe + Trustpilot     │     │
│  └──────────────────────────────────────┘     │
│  Bottom row: social | copyright | info buttons│
└──────────────────────────────────────────────┘

  ┌─────────────────────┐
  │ 🛒 My Cart      [3] │ ← Floating cart button
  └─────────────────────┘    (fixed, bottom-right)
                            ↓ scrolls to footer
  ┌─────────────────────┐
  │    ↑ Scroll to top  │ ← Transforms into circular
  └─────────────────────┘    up-arrow button

  ┌─────────────────────┐
  │ Product Modal       │ ← Slides up on card tap
  │ [Image gallery]     │
  │ [Category]          │
  │ [Name]              │
  │ [Price / Discount]  │
  │ [Attributes table]  │
  │ [Share button]      │
  │ [Buy] [Add to Cart] │
  └─────────────────────┘

  ┌─────────────────────┐
  │ QuickBuy Modal      │ ← Slides up on "Buy" tap
  │ (direct checkout)   │     (nested, keeps ProductModal open)
  └─────────────────────┘

  ┌─────────────────────┐
  │ Promo / Offer Modal │ ← Opens on promo banner or [+]
  │ [Products grid]     │
  │ [Add to cart]       │
  │                     │ ← Product tap opens ProductModal
  │                     │     (keeps PromoModal open)
  └─────────────────────┘
```

### Popup Stacking Behavior

Popups use a centralized back-navigation stack (`lib/popup-history.js`):

- Each popup is pushed onto a stack when it opens.
- Pressing the browser back button (or swipe gesture) closes only the **topmost** popup.
- A second back press closes the next popup, and so on.
- When no popups are open, pressing back shows a **"Press back again to exit"** warning toast (orange). A second back press within 3 seconds exits the site.
- Close buttons (X) and overlay taps close only that popup and never cascade.

Nested popup scenarios:

| Scenario                     | Behavior                                           |
| ---------------------------- | -------------------------------------------------- |
| PromoModal → ProductModal    | Both remain open. Back closes ProductModal first.  |
| ProductModal → QuickBuyModal | Both remain open. Back closes QuickBuyModal first. |
| Back with no popups          | Shows exit warning toast (double-back-to-exit).    |

---

## Colors and Design System

All colors are defined as CSS custom properties in `app/globals.css`. The design uses a WhatsApp-inspired green color palette with glassmorphism effects.

### Light Mode (`:root`)

| Variable           | Value                                | Purpose                                     |
| ------------------ | ------------------------------------ | ------------------------------------------- |
| `--bg-primary`     | `#ffffff`                            | Main background                             |
| `--bg-secondary`   | `#f0f2f5`                            | Secondary background (cards, inputs)        |
| `--text-primary`   | `#111b21`                            | Main text color                             |
| `--text-secondary` | `#667781`                            | Secondary/label text                        |
| `--accent-green`   | `#00a884`                            | WhatsApp brand green (primary action)       |
| `--accent-green2`  | `#25d366`                            | WhatsApp vibrant green (badges, highlights) |
| `--accent-light`   | `#d9fdd3`                            | Light green tint (active chip background)   |
| `--accent-hover`   | `#06cf9c`                            | Hover state for green elements              |
| `--border-color`   | `#e9edef`                            | Borders and dividers                        |
| `--glass-bg`       | `rgba(255, 255, 255, 0.9)`           | Glassmorphism header background             |
| `--glass-border`   | `rgba(17, 27, 33, 0.08)`             | Glassmorphism border                        |
| `--shadow-sm`      | `0 2px 8px rgba(17, 27, 33, 0.06)`   | Small card shadow                           |
| `--shadow-md`      | `0 10px 30px rgba(17, 27, 33, 0.08)` | Medium elevated shadow                      |
| `--shadow-lg`      | `0 20px 50px rgba(17, 27, 33, 0.14)` | Large modal shadow                          |
| `--radius-sm`      | `8px`                                | Small border radius                         |
| `--radius-md`      | `16px`                               | Medium border radius                        |
| `--radius-lg`      | `24px`                               | Large border radius                         |

### Dark Mode (`@media (prefers-color-scheme: dark)`)

| Variable           | Value                            |
| ------------------ | -------------------------------- |
| `--bg-primary`     | `#0b141a`                        |
| `--bg-secondary`   | `#111b21`                        |
| `--text-primary`   | `#e9edef`                        |
| `--text-secondary` | `#8696a0`                        |
| `--accent-green`   | `#00a884`                        |
| `--accent-green2`  | `#25d366`                        |
| `--accent-light`   | `#005c4b`                        |
| `--accent-hover`   | `#06cf9c`                        |
| `--border-color`   | `#313d45`                        |
| `--glass-bg`       | `rgba(11, 20, 26, 0.9)`          |
| `--glass-border`   | `rgba(233, 237, 239, 0.08)`      |
| `--shadow-sm`      | `0 2px 8px rgba(0, 0, 0, 0.3)`   |
| `--shadow-md`      | `0 10px 30px rgba(0, 0, 0, 0.4)` |
| `--shadow-lg`      | `0 20px 50px rgba(0, 0, 0, 0.5)` |

### Color Usage Notes

- The "OFFER" badge on product cards uses `--accent-green2` (`#25d366`) as background.
- The "OFFER" badge inside the product modal uses a hardcoded `#e74c3c` (red) background.
- The "Coming Soon" badge uses amber/ocher (`#b8860b`) background.
- The "Out of Stock" badge uses red (`#c0392b`) background.
- Share buttons use hardcoded dark colors (`#1a1a1a` background, `#333` border).
- The floating cart button uses a hardcoded `#008a72` with `#007a63` hover.
- The active category pill uses `--text-primary` as background and `--accent-light` as text color.
- Toast notifications: green (`var(--accent-green)`) for cart actions, orange (`#e67e22`) for exit warning.
- Section titles have a decorative line created with an explicit `<span className="featured-title-line">` element, NOT a `::after` pseudo-element.

### Transitions

All elements have:
```css
transition: background-color 0.3s ease, border-color 0.3s ease;
```
for smooth dark/light mode switching. Product cards have additional transform/shadow transitions.

---

## Fonts and Typography

The project uses a local font stack (no Google Fonts dependency) inspired by WhatsApp Web's system fonts.

### Font Stacks

- **Sans-serif** (`--font-sans`): `"Segoe UI", "Helvetica Neue", Helvetica, "Lucida Grande", Arial, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", sans-serif`
- **Serif** (`--font-serif`): `Georgia, "Times New Roman", serif`

### Typography Usage

| Class / Element          | Font           | Size                      | Weight          |
| ------------------------ | -------------- | ------------------------- | --------------- |
| Body text                | `--font-sans`  | 16px (default)            | 400             |
| `.featured-title`        | `--font-sans`  | 1.5rem                    | 700             |
| `.category-title-header` | `--font-sans`  | 1.5rem                    | 700             |
| `.cart-header h2`        | `--font-sans`  | 1.4rem                    | 700             |

| `.store-info-title`      | `--font-sans`  | 1.6rem                    | 700             |
| `.product-modal-title`   | `--font-serif` | 1.8rem                    | 700             |
| `.cart-checkout-title`   | `--font-serif` | 1rem                      | 600             |
| `.product-card-title`    | `--font-sans`  | 0.85rem (0.95rem desktop) | 600             |
| `.product-card-category` | `--font-sans`  | 0.65rem (0.7rem desktop)  | 600 (uppercase) |
| `.price-primary`         | `--font-sans`  | 0.95rem (1.05rem desktop) | 700             |
| `.category-btn`          | `--font-sans`  | 0.8rem                    | 500             |
| `.search-input`          | `--font-sans`  | 0.82rem                   | 400             |

The `.store-info-title` has a gradient text effect:
```css
background: linear-gradient(45deg, var(--text-primary), var(--accent-green));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## All Editable Texts (Reference Table)

Below is every user-facing string in Whatalog, where it lives, and its default English value. You can edit any of these directly in the corresponding file.

### Header & Filters (`components/FilterHeader.jsx`)

| String                 | File Location                      |
| ---------------------- | ---------------------------------- |
| `"Search products..."` | Mobile search input `placeholder`  |
| `"Search..."`          | Desktop search input `placeholder` |
| `"All"`                | Category "All" button text         |
| `"Back"`               | Back button `title`                |
| `"Clear"`              | Clear button `title`               |
| `"Filters"`            | Filter icon `title`                |
| `"Open filters"`       | Sort toggle `aria-label`           |
| `"Store Info"`         | Info icon `title`                  |
| `"Filters"`            | Filter modal title                 |
| `"Adjust your search"` | Filter modal subtitle              |
| `"Categories"`         | Filter modal section heading       |
| `"Sort by"`            | Filter modal section heading       |
| `"Featured First"`     | Sort option                        |
| `"Price: Low to High"` | Sort option                        |
| `"Price: High to Low"` | Sort option                        |
| `"Name: A-Z"`          | Sort option                        |

### Store Info Modal (`components/FilterHeader.jsx`)

| String                                              | Context                |
| --------------------------------------------------- | ---------------------- |
| `"Online Catalog"`                                  | Badge below store name |
| `"Location"`                                        | Label                  |
| `"WhatsApp"`                                        | Label                  |
| `"Hours"`                                           | Label                  |
| `"Monday - Saturday, 9:00 AM – 6:00 PM"`            | Hours value            |
| `"Deliveries"`                                      | Label                  |
| `"Coordinated shipping in Miami area"`              | Deliveries value       |
| `"How to buy?"`                                     | Section title          |
| `"Browse the catalog and tap + to add products."`   | Step 1                 |
| `"Open My Cart (floating button below)."`           | Step 2                 |
| `"Tap Confirm via WhatsApp to send us your order."` | Step 3                 |
| `"Contact us on WhatsApp"`                          | CTA button             |

### Cart (`components/Cart.jsx`)

| String                                                                                     | Context                         |
| ------------------------------------------------------------------------------------------ | ------------------------------- |
| `"My Cart"`                                                                                | Floating button label           |
| `"Your Cart"`                                                                              | Cart drawer title               |
| `"Your cart is empty."`                                                                    | Empty state                     |
| `"Back to store"`                                                                          | Empty state button              |
| `"Order Details"`                                                                          | Checkout form title             |
| `"Name *"`                                                                                 | Form field label                |
| `"Your name"`                                                                              | Name input placeholder          |
| `"Phone *"`                                                                                | Form field label                |
| `"+1 555 XXX XXXX"`                                                                        | Phone input placeholder         |
| `"Pickup / Delivery *"`                                                                    | Form field label                |
| `"Pick up at store"`                                                                       | Radio option                    |
| `"Home delivery"`                                                                          | Radio option                    |
| `"Your address"`                                                                           | Address input placeholder       |
| `"Payment method *"`                                                                       | Form field label                |
| `"Specify payment method"`                                                                 | Other payment input placeholder |
| `"Remove product"`                                                                         | Remove button `title`           |
| `"Total:"`                                                                                 | Total label                     |
| `"Confirm order via WhatsApp"`                                                             | Checkout button                 |
| `"Cash USD"`, `"Credit Card"`, `"Debit Card"`, `"Zelle"`, `"PayPal"`, `"Venmo"`, `"Other"` | Payment method chips            |

### Product Card (`components/ProductCard.jsx`)

| String           | Context              |
| ---------------- | -------------------- |
| `"OFFER"`        | Discount badge       |
| `"Coming Soon"`  | Status badge (amber) |
| `"Out of Stock"` | Stock badge (red)    |
| `"Add to cart"`  | "+" button `title`   |

### Product Modal (`components/ProductModal.jsx`)

| String             | Context                       |
| ------------------ | ----------------------------- |
| `"Previous image"` | Image nav button `aria-label` |
| `"Next image"`     | Image nav button `aria-label` |
| `"OFFER"`          | Discount badge                |
| `"Coming Soon"`    | Status badge (amber)          |
| `"Out of Stock"`   | Stock badge (red)             |
| `"Share"`          | Share button `title`          |
| `"Buy"`            | Direct buy button             |
| `"Add to Cart"`    | CTA button                    |

### Catalog (`app/CatalogContainer.jsx`)

| String                                             | Context                           |
| -------------------------------------------------- | --------------------------------- |
| `"Flash Offers"`                                   | Section heading                   |
| `"Available Products"`                             | Section heading                   |
| `"No products found"`                              | Empty results title               |
| `"Try different search terms or change category."` | Empty results hint                |
| `"Clear Filters"`                                  | Reset button                      |
| `"Added: {name}"`                                  | Toast notification (cart add)     |
| `"Quantity updated"`                               | Toast notification (cart update)  |
| `"Removed: {name}"`                                | Toast notification (cart remove)  |
| `"Press back again to exit"`                       | Toast notification (exit warning) |
| `"All rights reserved."`                           | Footer text                       |
| `"Store Info"`                                     | Footer info button                |
| `"Template Info"`                                  | Footer info button                |

### Customer Info Onboarding (`components/CustomerInfoModal.jsx`)

| String                            | Context        |
| --------------------------------- | -------------- |
| `"Welcome to {storeConfig.name}"` | Modal title    |
| `"Tell us about yourself"`        | Badge          |
| `"Fill in your details once..."`  | Body text      |
| `"Start shopping"`                | Confirm button |

---

## Cart and Checkout

### Floating Cart Button & Scroll-to-Top

The floating cart button (fixed bottom-right) has a dual role:
- **Default state**: Shows cart icon + "My Cart" label + item count badge. Opens the cart drawer on tap.
- **Scroll-to-top state**: When the footer enters the viewport (detected via `IntersectionObserver`), the button smoothly transforms into a circular up-arrow button. Text and badge fade out; `max-width` transitions from `300px` to `56px`. On tap, the page scrolls to top.

### How the Cart Works

The cart is managed entirely on the client side in `CatalogContainer.jsx`:

1. **State:** `cartItems` is an array of product objects, each with a `quantity` property.
2. **Persistence:** Cart is saved to `localStorage` under the key `whatalog_cart` on every change. It survives page reloads.
3. **Adding:** Clicking "+" on a product card or "Add to Cart" in the modal adds/updates the item. A green toast notification appears for 2.7 seconds.
4. **Updating:** In the cart drawer, +/- buttons change quantity. If quantity reaches 0, the item is removed.
5. **Removing:** The trash icon removes the item and shows a toast with an **Undo** button. You have 4 seconds to bring it back — after that, the removal is permanent.
6. **Editing:** Tap any product image or name inside the cart to open the ProductModal with that item. Change variants, options, or quantity and re-add it — the old version is replaced automatically.
7. **Steps:** The cart has two steps — **Cart** (review items) and **Details** (checkout form). Switch between them using the pill tabs in the header. A fade-slide animation makes the transition feel smooth.
8. **Order summary:** On the Details step, a collapsible "Your items (N)" accordion shows everything you're about to buy — images, quantities, and per-item totals. Handy for a last check before confirming.
9. **Total:** The grand total lives inside the **Continue** button, so you always see the amount before moving forward.

### Cart Reset

The cart is cleared (via `onClearCart()`) 500ms **after** the user clicks the WhatsApp checkout button. This happens inside the checkout click handler:

```js
setTimeout(() => onClearCart(), 500);
```

This ensures the order is sent before the cart resets. The cart can also be cleared programmatically by removing the `whatalog_cart` key from localStorage.

### Checkout Form

The checkout form in the cart drawer collects:

| Field           | Required              | Validation                                  |
| --------------- | --------------------- | ------------------------------------------- |
| Name            | Yes                   | Non-empty string                            |
| Phone           | Yes                   | Non-empty string                            |
| Delivery method | Yes                   | "pickup" or "delivery" (radio buttons)      |
| Address         | No (only if delivery) | Text input                                  |
| Payment method  | Yes                   | One of 7 options (chip-style radio buttons) |

The checkout button is disabled (opacity 0.5, pointer-events none) until all required fields are filled. The validation check:
```js
const canConfirm = customer.name && customer.phone && customer.payment
  && (customer.delivery === "pickup" || customer.delivery === "delivery");
```

### Payment Methods

Seven payment options are available (all editable via translation keys):

1. Cash USD
2. Credit Card
3. Debit Card
4. Zelle
5. PayPal
6. Venmo
7. Other (opens a text field to specify)

### Delivery Options

- **Pick up at store:** Shows the store's location from `storeConfig.location`
- **Home delivery:** Shows a text input for the shipping address

---

## WhatsApp Message Structure

When the user taps "Confirm order via WhatsApp", the `getWhatsAppLink()` function in `components/Cart.jsx` generates a WhatsApp deep link with a formatted message.

### Generated Message Template

```
🛒 *New Order - {storeConfig.name}*
──────────────────────────

👤 *Customer:* {customer.name}
📞 *Phone:* {customer.phone}
📍 *Pickup:* At store
   *Address:* {storeConfig.location}
💳 *Payment:* {payment method}

──────────────────────────
*Products:*
• *2x* Floral Rose Perfume
  _Size: 50 ml | Color: Gold_
  $18.00 USD → *$36.00 USD*

• *1x* Vintage Leather Handbag
  $35.00 USD → *$35.00 USD*

──────────────────────────
*Total:* $71.00 USD

Thank you! We'll confirm shortly.
```

### Message Structure Breakdown

- **Header:** Store name with 🛒 emoji and a divider line
- **Customer info:** Name, phone (only if filled in)
- **Delivery method:** "Pickup: At store" or "Home delivery" with address
- **Payment:** Selected payment method
- **Product list:** Each item with quantity (bold), name, attributes in italics (if any), unit price, and line total
- **Total:** Sum of all line totals
- **Footer:** Thank you message

### How It's Generated

```javascript
const getWhatsAppLink = () => {
  const number = storeConfig.whatsappNumber.replace(/[^0-9+]/g, "");
  let message = `🛒 *New Order - ${storeConfig.name}*\n`;
  message += `──────────────────────────\n\n`;
  // ... customer info, products, total ...
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
```

The WhatsApp link opens in a new tab. If WhatsApp Web is installed on the device, it opens directly in the app.

### WhatsApp Number

The number is read from `storeConfig.whatsappNumber` and sanitized to only include digits and the `+` sign before being used in the URL.

---

## Custom Attributes

The `attributes` frontmatter field allows you to add arbitrary key-value pairs to any product.

### Defining Attributes

In the product's frontmatter:

```yaml
attributes:
  Size: "50 ml"
  Color: "Gold"
  Material: "Stainless Steel"
  Longevity: "12 hours"
  Type: "Eau de Parfum"
```

### How They Are Displayed

**In the product modal:** Attributes are rendered as a two-column table with the key on the left (gray, bold) and value on the right (primary text color), separated by a bottom border:

```
Size:          50 ml
Color:         Gold
Longevity:     12 hours
```

**In the WhatsApp message:** Attributes are appended to each product line in italics, separated by pipes:

```
• *2x* Floral Rose Perfume
  _Size: 50 ml | Color: Gold_
  $18.00 USD → *$36.00 USD*
```

**On the product card:** Attributes are NOT shown (only visible in modal and WhatsApp).

### Technical Details

- The `attributes` field is parsed as a plain object in `lib/products.js`:
  ```js
  attributes: data.attributes ? { ...data.attributes } : {},
  ```
- An empty object `{}` is used if no attributes are defined.
- The `hasAttributes` check in `ProductModal.jsx`:
  ```js
  const hasAttributes = attributes && Object.keys(attributes).length > 0;
  ```
- Attribute keys and values are rendered directly — they are not translated. Edit them directly in the product `.md` frontmatter.

---

## Discounts / Offers

There are two independent mechanisms for marking discounts:

### 1. `originalPrice` Field

```yaml
priceUSD: 18.00
originalPrice: 25.00
```

When `originalPrice` is set AND is greater than `priceUSD`:
- The original price appears with a strikethrough on the product card and in the modal.
- An "OFFER" badge appears on the product card image (green background, `--accent-green2`).
- In the product modal, an "OFFER" badge appears next to the prices (red background, `#e74c3c`).

The check in `lib/products.js`:
```js
originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
```

The display check in components:
```js
const hasDiscount = originalPrice && originalPrice > priceUSD;
```

### 2. `offer` Field

```yaml
offer: true
```

When `offer: true` AND `originalPrice` is set and greater than `priceUSD`:
- The product appears in the "Flash Offers" featured section at the top of the catalog (right below the promo grid).
- The first 24 offer products are shown in a CSS multi-column masonry grid (same as the main catalog, **not** a forced square grid).
- A **+ button** (circular, green, at the end of the title row) opens an `OfferModal` popup showing ALL offer products in a `<MasonryGrid>` with natural aspect ratios.
- Products without `originalPrice > priceUSD` are excluded even if `offer: true`.

The title row layout:
```
Flash Offers ────────────────────── [+]
```
The separator line is an explicit `<span className="featured-title-line">`, and the + button is pushed to the far right with `margin-left: auto`.

The filtering logic in `CatalogContainer.jsx`:
```js
const offerProducts = useMemo(() => {
  return initialProducts.filter((p) => p.offer && p.originalPrice && p.originalPrice > p.priceUSD);
}, [initialProducts]);
```

### 3. `flashOfferDetails` Field

Optional. When set, overrides the subtitle/description shown in the OfferModal popup:

```yaml
flashOfferDetails: "Limited time deal — 30% off selected items!"
```

If not provided, a default message is used: _"Grab these exclusive deals before they are gone!"_

### Combining Both

You can use both fields together:
```yaml
priceUSD: 18.00
originalPrice: 25.00
offer: true
```

This shows the product with a strikethrough original price AND places it in the Flash Offers section. The two fields are independent — you can use `offer` without `originalPrice` and vice versa.

---

## Stock & Inventory

Each product can optionally define `stock` and `status` in its frontmatter:

```yaml
stock: 25                    # Available units. Defaults to Infinity if omitted.
status: "coming-soon"        # "coming-soon" blocks all purchase actions.
```

### How Stock Works

1. **Effective stock** is computed at runtime: `effectiveStock = frontmatterStock - soldCount`, where `soldCount` is read from `localStorage` (key `whatalog_sold`).
2. When an order is completed (via QuickBuy or Cart checkout), `recordSale(productId, qty)` is called to persist sold quantities.
3. `toEffectiveProduct()` in `lib/products.js` creates new product objects with adjusted stock on every render.

### Stock UI Behavior

| State                   | Card                                            | Product Modal                                   |
| ----------------------- | ----------------------------------------------- | ----------------------------------------------- |
| `stock` > 0 or omitted  | Normal card; "Add to Cart" button visible       | Normal; quantity stepper max = `effectiveStock` |
| `stock` ≤ 0             | "Out of Stock" badge (red), add-to-cart hidden  | "Out of Stock" badge, buttons disabled          |
| `status: "coming-soon"` | "Coming Soon" badge (amber), add-to-cart hidden | "Coming Soon" badge, purchase buttons disabled  |

### Stock Badge Priority

When multiple badges apply, priority is: **Coming Soon > Out of Stock > OFFER**.

### Stock Persistence

Since `.md` files are read-only at build time (static export), runtime stock deduction is handled entirely on the client side via `localStorage` (`whatalog_sold`). This means stock resets when the user clears their browser data. For persistent inventory tracking across users, a backend or third-party service would be needed.

---

## Categories

### Auto-creation

Categories are automatically created from the `category` field in each product's frontmatter. There is no predefined category list — any string value becomes a category.

In `CatalogContainer.jsx`, categories are extracted when products are loaded:
```js
const categories = Array.from(new Set(initialProducts.map((p) => p.category)));
```

### How Categories Work

1. **Filter pills:** Each unique category becomes a button in the header's horizontal scrollable nav. The first button is always "All" (shows all products).
2. **Filtering:** Clicking a category pill filters the product grid to only show products with that category. The filter is applied client-side in `CatalogContainer.jsx`.
3. **Auto-scroll:** When a category is selected, the catalog section scrolls into view smoothly.
4. **Available Products title:** Includes a circular filter icon button (`.btn-filter-catalog`, 50% border-radius) at the far right of the title row that opens the sort/filter popup.

### Renaming a Category

To rename a category, edit the `category` field in all product `.md` files that use the old name. For example, to rename "Perfumery" to "Fragrances":
1. Open `perfume-rose.md`
2. Change `category: "Perfumery"` to `category: "Fragrances"`
3. Repeat for all other products in that category

### Deleting a Category

A category is automatically removed when no products use it. To delete a category:
1. Remove all products in that category (delete the `.md` files) OR
2. Change the `category` field of all products in that category to a different value

### Category Display

- Category name is shown on each product card (uppercase, small, green — `--accent-green`).
- In the product modal, the category appears above the product name.
- Categories use the exact string from the frontmatter — edit the `category` field in the `.md` file to change it.

---

## Popup & Modal System

### All Modals

Every modal/popup in Whatalog follows a consistent pattern:

- **Max height:** `max-height: 90svh` (uses `svh` units, not `vh` or `dvh`).
- **Scrollbar hiding:** Inner scroll containers hide scrollbars:
  ```css
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
  ```
- **Close button:** Positioned `absolute` at top-right, outside the scrollable content area.
- **Scroll wrapper:** Content is wrapped in a scrollable `<div>` (`.store-info-scroll`, `.quickbuy-scroll`, `.product-modal-scroll-content`) so the close button stays fixed.
- **Backdrop:** A semi-transparent overlay that closes the modal on tap.
- **Body scroll lock:** Uses `lockBodyScroll()` from `@/lib/scroll-lock` (counter-based, handles multiple simultaneous modals).
- **Back navigation:** Uses the centralized popup history stack (see below).

### Popup History & Back Navigation

File: `lib/popup-history.js`

A centralized module manages ALL popup back-navigation:

- `initPopupHistory(showExitToastFn)` — Called once from `CatalogContainer.jsx`. Sets up a single global `popstate` listener.
- `registerPopup(onClose)` — Called by each popup via the `useHistoryPopup` hook. Pushes the popup onto a stack and creates a history entry.

The `popstate` handler:
1. If the stack has popups, it pops the **topmost** one and calls its `onClose`.
2. If the stack is empty but there are stale history entries (from popups closed via button), it silently consumes them.
3. If genuinely no popups and no stale entries remain, it handles **double-back-to-exit**:
   - First back press: shows orange exit warning toast, pushes a new history entry to intercept the next back.
   - Second back press within 3 seconds: allows the browser to navigate away.
   - If 3 seconds pass without a second back press, the counter resets.

Nested popup preservation:
- When a popup opens another from within (e.g., PromoModal → ProductModal → QuickBuyModal), the parent popup's `onClose` is NOT called.
- This is implemented by removing `onClose()` calls from the opening handlers (e.g., in PromoModal's product click and ProductModal's `handleDirectBuy`).

### Modal Components Reference

| Component | File | Triggered by | Notes |
| --------- | ---- | ------------ | ----- ||
| ProductModal      | `components/ProductModal.jsx`      | Product card tap, promo product tap                                      | Slides up, z-index 210; quantity stepper + stock/status UI                             |
| QuickBuyModal     | `components/QuickBuyModal.jsx`     | "Buy" button in ProductModal                                             | Stays on top of ProductModal; inline qty stepper synced with ProductModal              |
| PromoModal        | `components/PromoModal.jsx`        | Promo banner tap                                                         | Shows related products (promo field match)                                             |
| OfferModal        | `components/OfferModal.jsx`        | + button in Flash Offers title                                           | Shows all offer products in MasonryGrid                                                |
| Store Info        | Inside `FilterHeader.jsx`          | Info icon, footer "Store Info" button                                    | Opens via custom event `open-store-info`                                               |
| Sort / Filter     | Inside `FilterHeader.jsx`          | Filter icon, title filter button                                         | Opens via custom event `open-sort-menu`                                                |
| TemplateInfoModal | `components/CustomerInfoModal.jsx` | Auto on first visit (no delay) if no `whatalog_customer` in localStorage | Shows onboarding form; saves to localStorage on confirm                                |
| LegalInfoModal    | `components/LegalInfoModal.jsx`    | Via Store Info modal, footer, or header                                  | Accordion-style with collapsible sections; listens for `open-legal-modal` custom event |

### Custom Events

Cross-component popup triggers use custom DOM events:

| Event              | Dispatched by                           | Listened by          |
| ------------------ | --------------------------------------- | -------------------- |
| `open-store-info`  | Footer "Store Info" button, footer grid | `FilterHeader.jsx`   |
| `open-sort-menu`   | Catalog filter button, sort button      | `FilterHeader.jsx`   |
| `open-legal-modal` | Footer grid, Store Info modal           | `LegalInfoModal.jsx` |

These avoid lifting state up through multiple component layers.

---

## Masonry Grid

File: `components/MasonryGrid.jsx`

The product grid uses **CSS multi-column layout** (`column-count`), NOT CSS Grid or Flexbox. This creates a true Pinterest-style waterfall masonry where each product has its natural aspect ratio and items flow into the shortest column automatically.

```css
.pinterest-masonry {
  column-count: 2;
  column-gap: 0.75rem;
  width: 100%;
}

@media (min-width: 768px) {
  .pinterest-masonry {
    column-count: 4;
    column-gap: 1rem;
  }
}
```

Product cards use `break-inside: avoid` and `display: inline-block` to prevent items from being split across columns. Each card has `width: 100%` and `margin-bottom` for spacing.

**Multi-column vs CSS Grid tradeoff:** Multi-column fills items top-to-bottom in the first column before moving to the next. This means filtered results with very few products may appear stacked in a single column. CSS Grid was tested but produced gaps below shorter items (due to equal row heights), so the multi-column approach was kept for its superior visual masonry effect with no gaps.

---

## Footer

File: `app/CatalogContainer.jsx` (JSX + `app/globals.css` for responsive styles)

The footer is structured in two main cards:

### 1. Footer Store Card (`.footer-store-card`)

Displays store identity and key information:
- **Header row**: Circular store logo (32×32) + store name + "Online Catalog" badge — social links (GitHub, Instagram, Facebook, WhatsApp as SVG icons) at the end of the row (same line on desktop, new line on mobile).
- **Info grid**: A 3-column grid with icon-labeled entries:
  - **Location** — `storeConfig.location`
  - **WhatsApp** — WhatsApp number link
  - **Hours** — "Monday - Saturday, 9:00 AM – 6:00 PM"
  - **Deliveries** — "Coordinated shipping in Miami area"
  - **Store Info** — button that dispatches `open-store-info`
  - **Legal Info** — button that dispatches `open-legal-modal`

### 2. Footer Map Card (`.footer-map-card`)

Displays a Google Maps embed:
- **Title row**: Pin SVG icon + "Where to find us?" — Trustpilot button on the far right.
- **Map iframe**: Embedded with a CSS filter (`hue-rotate(80deg) saturate(0.8)`) for brand consistency.

### Bottom Row (`.footer-bottom-row`)

Three elements arranged horizontally on desktop, vertically on mobile:
- **Social links** (same as header row) — `order: 0`
- **Copyright** — `© {year} Whatalog. All rights reserved. | Made with ❤️‍🔥 by 1azarito` — `order: 1`
- **Info buttons** (Legal Info) — `order: 1`

On mobile (≤768px), CSS `order` reorders to: social → info → copyright.

### Scroll-to-Top Button

When the footer enters the viewport (detected via `IntersectionObserver` in `CatalogContainer.jsx`), the floating cart button smoothly transitions into a circular up-arrow button:
- **Max-width** animates from `300px` → `56px`
- **Padding** and **border-radius** adjust to make it circular
- The cart text and badge fade out (`opacity: 0`)
- On tap, the page scrolls to top smoothly (`window.scrollTo({ top: 0, behavior: "smooth" })`)
- When scrolling back up, the cart button returns to its original state

The same "Made with ❤️‍🔥 by 1azarito" text also appears in:
- The Store Info modal (`FilterHeader.jsx`).
- The footer copyright text.

---

## Toast Notifications

File: `app/CatalogContainer.jsx` + `app/globals.css`

A toast notification system provides brief, non-blocking feedback:

- **Position:** Fixed at top-right (`top: 4.5rem; right: 1rem`).
- **Duration:** 2.7 seconds, auto-dismiss.
- **Animation:** Slides in from the right (`toast-slide-in` keyframe).
- **Types:**
  - **Success** (green, `var(--accent-green)`): Cart actions ("Added: ...", "Quantity updated", "Removed: ...").
  - **Warning** (orange, `#e67e22`): Exit warning ("Press back again to exit").
- **Max width:** `calc(100% - 2rem)` on mobile, `360px` on desktop.
- **Z-index:** 210 (above most content, below modals).

The `showToast` function in `CatalogContainer.jsx`:
```js
const showToast = (message, type = "success") => {
  setToast(message);
  setToastType(type);
  // auto-dismiss after 2700ms
};
```

---

## Scroll Lock Utility

File: `lib/scroll-lock.js`

A counter-based scroll lock utility that prevents background scrolling when modals or the cart are open.

```js
import { lockBodyScroll } from "@/lib/scroll-lock";

useEffect(() => {
  if (isOpen) {
    return lockBodyScroll();
  }
}, [isOpen]);
```

Key features:
- Handles multiple simultaneous locks (each call increments a counter).
- Prevents wheel and touch events outside modal content (checked via `.closest()` selectors).
- Restores scroll when the last lock is released.
- Used by `Cart.jsx`, `ProductModal.jsx`, `QuickBuyModal.jsx`, `PromoModal.jsx`, `OfferModal.jsx`, `FilterHeader.jsx`, `LegalInfoModal.jsx`, `CustomerInfoModal.jsx`, and all info modals.

---

## Customer Info Onboarding

File: `components/CustomerInfoModal.jsx`

The project includes an onboarding modal that appears automatically on first visit. It collects the customer's details (name, phone, delivery preference, payment method) once and persists them in `localStorage` under the key `whatalog_customer`.

### How it works

- On first load, if no `whatalog_customer` entry exists in localStorage, the modal opens **immediately** (no delay).
- The form contains the same fields as the cart checkout: Name, Phone, Pickup/Delivery, Address (if delivery), Payment method.
- On confirm, the data is saved to `whatalog_customer` and the modal closes.
- Both **Cart.jsx** and **QuickBuyModal.jsx** read `whatalog_customer` on mount to pre-fill their checkout forms, so the customer never has to re-enter their details.

### Fields

| Field             | Required         | Description                                            |
| ----------------- | ---------------- | ------------------------------------------------------ |
| Name              | Yes              | Customer name                                          |
| Phone             | Yes              | Phone number                                           |
| Pickup / Delivery | Yes              | Radio buttons: "Pick up at store" or "Home delivery"   |
| Address           | Only if delivery | Shipping address                                       |
| Payment method    | Yes              | Chip-style radio buttons (7 options, same as checkout) |

### How to clear saved data

Remove the `whatalog_customer` key from localStorage in the browser's dev tools, or call:
```js
localStorage.removeItem("whatalog_customer");
```

---

## Legal Info Modal

File: `components/LegalInfoModal.jsx`

The Legal Info Modal is an accordion-style popup that displays legal, technical, and licensing information. It is triggered via the `open-legal-modal` custom event (dispatched from the footer grid and the Store Info modal).

### Accordion Sections

The modal contains 8 collapsible sections. Each section has a clickable header with an icon, title, and chevron indicator. Clicking a header toggles the section open/closed with a smooth CSS `grid-template-rows` transition.

| Section                  | Content                                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Cookies Policy**       | Essential cookies, localStorage usage, embedded Google Maps cookies, no tracking/advertising                                             |
| **Privacy Policy**       | No backend server, no data collection, localStorage-only persistence, WhatsApp direct messaging                                          |
| **Data Usage**           | How customer info (name, phone, address, payment) flows through the order process                                                        |
| **Terms of Use**         | Template purpose, store operator responsibilities, intellectual property, no Meta affiliation                                            |
| **About This Template**  | Whatalog overview, full tech stack (Next.js 16, Tailwind CSS v4, localStorage, WhatsApp API), key features, version, GitHub link, author |
| **Disclaimer**           | "As-is" warranty disclaimer, operator liability, third-party service limitations                                                         |
| **License**              | Full MIT License text displayed in a styled code block                                                                                   |
| **Third-Party Services** | List of integrated services (WhatsApp, Google Maps, Trustpilot, Vercel, GitHub) with links to their privacy policies                     |

### Technical Implementation

- Uses a `SECTIONS` constant array defined outside the component to keep the JSX clean.
- Each section has an `id`, `title`, `icon` (SVG path), and `content` (JSX element).
- Open/closed state is tracked in `openSections` (object mapping section IDs to booleans).
- The accordion animation uses `display: grid` + `grid-template-rows: 0fr / 1fr` for a smooth height transition (no fixed max-height needed).
- The chevron rotates 90 degrees when a section is open.
- All content is written in English.

### Custom Event

| Event              | Dispatched by                 | Listened by          |
| ------------------ | ----------------------------- | -------------------- |
| `open-legal-modal` | Footer grid, Store Info modal | `LegalInfoModal.jsx` |

---

## Skeleton Loaders

File: `components/Skeleton.jsx`

A lightweight shimmer skeleton component used during image and content loading.

- CSS-only shimmer animation via `::after` pseudo-element with `linear-gradient`
- Props: `width`, `height`, `borderRadius`, `className`, `style`
- Integrated into `SafeImage.jsx` — shows skeleton until image `onLoad` fires
- The skeleton slides out as the image fades in (`opacity` transition)

---

## Animations (Framer Motion)

Package: `framer-motion` (v11+)

### Micro-interactions

- **ProductCard**: wrapped in `motion.div` with `whileHover={{ y: -5, boxShadow }}` and `whileTap={{ scale: 0.98 }}`
- The CSS `:hover { transform: translateY(-5px) }` was replaced by framer-motion's inline style for smoother JS-driven animation

### Staggered Card Entrance

- Each `ProductCard` receives an `index` prop used in `transition.delay = index * 0.04`
- The `MasonryGrid` container key changes (`key={\`${activeCategory}-${searchQuery}-${sortBy}\`}`) when filters update, causing React to re-mount the grid and replay entrance animations
- Each card animates: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}` with a cubic-bezier ease

---

## Google Sheets Integration

File: `lib/sheets.js`

Products can be loaded from a **Google Sheets document** instead of `.md` files, or fall back to `.md` when no sheet is configured.

### How it works

1. `lib/products.js:getProducts()` checks `store-config.json` for a `googleSheets` config block
2. If `sheetId` is present, `fetchSheetProducts()` is called via the **Google Sheets v4 API**
3. If the API call succeeds and returns products, those are used; otherwise it falls back to `.md` files
4. Both paths normalize to the same product schema

### Configuration

Add to `content/store-config.json`:

```json
{
  "googleSheets": {
    "sheetId": "your-google-sheet-id",
    "apiKey": "your-google-api-key",
    "range": "Sheet1!A:Z"
  }
}
```

- `sheetId`: The ID from your Google Sheet URL (`https://docs.google.com/spreadsheets/d/{ID}/edit`)
- `apiKey`: A Google Cloud API key with Sheets API enabled
- `range`: Optional, defaults to `Sheet1!A:Z`

### Column Mapping

| Sheet Column Header | Product Field    | Type                                       |
| ------------------- | ---------------- | ------------------------------------------ |
| `id`                | `id`             | string (auto-generated from name if empty) |
| `name`              | `name`           | required                                   |
| `priceUSD`          | `priceUSD`       | number                                     |
| `category`          | `category`       | string                                     |
| `image`             | `image`          | string (URL or path)                       |
| `images`            | `images`         | comma-separated URLs                       |
| `description`       | `description`    | string                                     |
| `featured`          | `featured`       | boolean ("true"/"yes"/"1")                 |
| `originalPrice`     | `originalPrice`  | number (triggers OFFER badge)              |
| `stock`             | `stock`          | number                                     |
| `status`            | `status`         | string ("coming-soon")                     |
| `promo`             | `promo`          | string (matches promoLinks target)         |
| `seoTitle`          | `seoTitle`       | string (overrides meta title)              |
| `seoDescription`    | `seoDescription` | string (overrides meta description)        |

### Sync Behavior

- With `revalidate: 60` on the home page and product pages, changes to the Sheet reflect on the site within **~1 minute**
- For instant updates during development, the cache is bypassed

---

## Product Detail Pages

Route: `/product/[id]`

Each product gets its own dedicated page with full SEO metadata.

### Features

- **SSG pre-rendered** — all product pages are generated at build time via `generateStaticParams`
- **ISR** — pages revalidate every 60 seconds (`revalidate: 60`) so Sheet changes propagate
- **Per-product meta tags** — `generateMetadata` dynamically sets `<title>`, OG image, Twitter Card
- **JSON-LD structured data** — products are marked up as `schema.org/Product` for rich search results
- **Full product page** — back-to-catalog link, image gallery, price, options, Add to Cart, Buy Now, Share

### Share URLs

The Share button in **ProductModal** now copies a link to `/product/{productId}` instead of the homepage:

```
https://yourstore.com/product/perfume-rose
```

When opened, this link shows:
- Product image and details
- Add to Cart / Buy Now buttons (with localStorage cart state)
- Full meta tags for social previews (Facebook, WhatsApp, Twitter)

### 404 Handling

If a product ID doesn't exist, the page shows "Product Not Found" with a link back to the catalog.

---

## Manual Translation (How to Customize UI Text)

All user-facing text is hardcoded in English directly in the component files. There is no separate translation system in the free version — this keeps the template simple and dependency-free.

### How to Change Any Text

1. **Find the text** in one of these files:
   - `components/FilterHeader.jsx` — header, search, categories, sort, store info modal
   - `components/Cart.jsx` — cart drawer and checkout form
   - `components/ProductModal.jsx` — product detail modal
   - `components/ProductCard.jsx` — product card badges
    - `components/CustomerInfoModal.jsx` — customer onboarding form
   - `components/LegalInfoModal.jsx` — legal information, privacy, template info, license
   - `app/CatalogContainer.jsx` — section titles, toast messages, footer
   - `components/OfferModal.jsx` — Flash Offers popup

2. **Edit the string directly** — for example, change `"My Cart"` to `"Mi Carrito"` in `components/Cart.jsx`.

3. **Save the file** — the change appears immediately in development mode.

### Example: Translating the Cart to Spanish

In `components/Cart.jsx`, replace:
```
"Your Cart"              → "Tu Carrito"
"Your cart is empty."    → "Tu carrito está vacío."
"Confirm order via WhatsApp" → "Confirmar pedido por WhatsApp"
```

### Example: Translating the Header

In `components/FilterHeader.jsx`, replace:
```
"All"                    → "Todos"
"Filters"                → "Filtros"
"Store Info"             → "Información de la Tienda"
"Search products..."     → "Buscar productos..."
```

### Handling Browser-Native Translation

Because all UI text is plain English, visitors who speak other languages can use their browser's built-in translate feature (available in Chrome, Edge, Safari, and Firefox). This requires no code changes on your part.

---

## Dark Mode

Dark mode is implemented using a CSS media query: `@media (prefers-color-scheme: dark)`. There is NO manual toggle — it follows the user's operating system preference automatically.

### How It Works

All CSS custom properties in `:root` are overridden inside the dark mode media query block in `app/globals.css`. When the OS switches to dark mode, the variables change, and the `transition` property on all elements ensures smooth color transitions:

```css
* {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
```

### Dark Mode Color Palette

See the "Colors and Design System" section above for the full dark mode color variable table. Key differences from light mode:

- Backgrounds become dark (`#0b141a` / `#111b21`) instead of white/light gray.
- Text becomes light (`#e9edef` / `#8696a0`) instead of dark.
- The accent green (`--accent-green`) stays the same (`#00a884`), but the light green tint (`--accent-light`) becomes darker (`#005c4b` instead of `#d9fdd3`).
- Shadows become stronger (more opacity) to stand out against the dark background.

### What Is NOT Affected by Dark Mode

- Product images (they are loaded as-is)
- Share buttons (hardcoded dark colors `#1a1a1a`)
- The OFFER badge in product modal (hardcoded `#e74c3c`)
- Toast warning (`#e67e22` orange is hardcoded)

---

## PWA / Progressive Web App

Whatalog works as an installable PWA. On Android, Chrome shows an "Add to Home Screen" prompt. On iOS, users can tap **Share → Add to Home Screen** from Safari. The app opens in standalone mode (no browser UI) with a custom splash screen.

### What's included

- **`public/manifest.json`** — defines app name, icons, theme color (`#00a884`), and standalone display mode.
- **`public/sw.js`** — a service worker that caches assets for faster repeat visits and basic offline support.
- **`public/icons/`** — PWA icons at 192×192 and 512×512, generated from the store logo.
- **`app/layout.js`** — includes `manifest.json`, `theme-color`, `apple-touch-icon`, and Apple PWA meta tags.
- **`components/Preloader.jsx`** — registers the service worker on the client side.

### Customize

To change the PWA appearance:

1. **Theme color** — edit the `themeColor` value in the `viewport` export of `app/layout.js`. The default is `#00a884` (WhatsApp green).
2. **App name** — edit `name` and `short_name` in `public/manifest.json`.
3. **Icons** — replace the PNG files in `public/icons/` with your own. Minimum sizes: 192×192 and 512×512. To regenerate from the logo, run:

```bash
node -e "
const sharp = require('sharp');
sharp('public/images/logo.webp').resize(192, 192).png().toFile('public/icons/icon-192x192.png');
sharp('public/images/logo.webp').resize(512, 512).png().toFile('public/icons/icon-512x512.png');
"
```

4. **Service worker** — edit `public/sw.js` to change caching behavior. The current strategy is **network-first with cache fallback**: always try the network first, fall back to cache if offline.

### Verify PWA

Build the project and run it:

```bash
npm run build
npm start
```

Then open Chrome DevTools → **Application** → **Manifest** and **Service Workers** to verify everything is registered correctly. On a mobile device (or Chrome DevTools mobile emulation), you should see the "Add to Home Screen" prompt.

---

## Useful Commands

```bash
npm run dev       # Start development server on http://localhost:3000
npm run build     # Production build (generates .next/)
npm start         # Start production server (after build)
npm run lint      # Run ESLint
```

### Next.js Commands (via npx)

```bash
npx next build          # Build with debug output
npx next lint           # Run ESLint (same as npm run lint)
```

### Vercel Deployment Notes

1. Push your repository to GitHub (or GitLab/Bitbucket).
2. Import the project in [Vercel](https://vercel.com/new).
3. Vercel auto-detects Next.js — no additional configuration needed.
4. Default settings work out of the box:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm install`
5. Environment variables: none required.
6. All content files (products, config, images) must be committed to the repository — there is no admin panel or CMS.

### Important Notes for Production

- The image API routes (`/api/images/products/[filename]` and `/api/images/promos/[filename]`) read files from the filesystem at runtime. On Vercel, these files are part of the deployment and are available in the serverless function's filesystem.
- For the best performance, consider using an external image hosting service (CDN) and using full URLs in the `image` / `images` frontmatter fields instead of relying on the API routes.
- The cart uses `localStorage` — it works on the client side only. Server-side rendering will show an empty cart until the client hydrates.
- The `revalidate = 60` in `app/page.js` means the page is statically generated and revalidated every 60 seconds (Incremental Static Regeneration). In development, changes appear instantly.

---

## License

MIT — Free for personal and commercial use.
