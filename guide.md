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
│   ├── ProInfoModal.jsx                     → Whatalog Pro features popup
│   ├── PromoModal.jsx                       → Promo group popup (linked products from promoBanners)
│   ├── QuickBuyModal.jsx                    → Direct buy / quick checkout form
│   └── TemplateInfoModal.jsx                → Template info popup (auto-shows on first visit)
├── content/
│   ├── store-config.json                    → Store configuration (name, WhatsApp number, promo banners, links)
│   ├── products/                            → Product .md files + image files
│   └── promos/                              → Promotional images (landscape + 2 squares)
├── lib/
│   ├── popup-history.js                     → Centralized popup back-navigation stack + double-back-to-exit
│   ├── products.js                          → Server helpers: getStoreConfig(), getProducts()
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
└── guide.md                                 → This file
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
featured: true                    # Boolean. Featured products sort first.
offer: true                       # Boolean. Shows product in "Flash Offers" hero section.
attributes:                       # Key-value pairs displayed in modal & sent in WhatsApp.
  Size: "50 ml"
  Color: "Gold"
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
id: "bolso-cuero"
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
id: "gafas-sol"
name: "Retro Round Sunglasses"
priceUSD: 16.00
category: "Accessories"
image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop"
description: "Retro-style round sunglasses with gold metal frame and dark lenses with full UV400 protection."
featured: false
---
```

---

## Product Images

### Location

Product image files go in the same directory as the product `.md` files: `content/products/`. They are served via the API route at `/api/images/products/[filename]`.

### Image Path Resolution

The `image` / `images` frontmatter values are resolved by `lib/products.js` with three possible patterns:

| Value pattern | Resolution | Example |
|---|---|---|
| Relative filename (no leading `/` or `http`) | Served via `/api/images/products/[filename]` | `"perfume_rose.png"` → `/api/images/products/perfume_rose.png` |
| Absolute path (starts with `/`) | Served as static file from `public/` | `"/images/logo.webp"` → `/images/logo.webp` |
| Full URL (starts with `http`) | Used directly as the image `src` | `"https://example.com/photo.jpg"` → used as-is |

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

| Index | Position | Aspect Ratio | Desktop layout | Mobile layout |
|---|---|---|---|---|
| `[0]` | Left / top | 16:9 (landscape) | Left column (`1fr auto`) | Full width, 16:9 |
| `[1]` | Right top | 1:1 (square) | Right column, stacked vertically | 50% width, 1:1 |
| `[2]` | Right bottom | 1:1 (square) | Right column, stacked vertically | 50% width, 1:1 |

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

| Field | Type | Description |
|---|---|---|
| `type` | `"promo"` | Always set to `"promo"` for modal popups. |
| `target` | string | Matches the `promo` field in product `.md` frontmatter. All products with the same `promo` value appear in that popup. |
| `title` | string | Bold heading displayed at the top of the modal. |
| `subtitle` | string | Smaller text below the title (optional). |

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

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Store name. Displayed in the Store Info modal, WhatsApp message header, and as the page title prefix. |
| `location` | string | Yes | Physical address. Shown in the Store Info modal and used as the pickup address in the WhatsApp message. |
| `whatsappNumber` | string | Yes | WhatsApp number in international format (`+15551234567`). Used to generate the checkout WhatsApp link. |
| `logoUrl` | string | Yes | Path to the store logo image. Displayed in the header as a 32×32 rounded circle. Supports `/images/...`, `/api/images/...`, or external URLs. |
| `currency.code` | string | Yes | ISO 4217 currency code (e.g., `"USD"`, `"EUR"`). Displayed next to prices. |
| `currency.symbol` | string | Yes | Currency symbol (e.g., `"$"`, `"€"`). Displayed before prices. |
| `promoBanners` | array | No | Array of up to 3 image paths for the hero promotional grid. See Promotional Images section above. |
| `promoLinks` | array | No | Array of up to 3 promo link configs, one per promo banner. Controls what happens when each banner is tapped. |

### Fallback Values

The `getStoreConfig()` function in `lib/products.js` has a fallback configuration that is used if the JSON file cannot be read:

```json
{
  "name": "F&L Essentials",
  "location": "Cotorro, La Habana",
  "whatsappNumber": "+5355555555",
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
│  │  Google Maps iframe                  │     │
│  └──────────────────────────────────────┘     │
│  [Social icons: GitHub, Instagram,             │
│   Facebook, WhatsApp]                         │
│  [Store Info] [Template Info]                  │
│  © 2026 Whatalog. All rights reserved.         │
│  Made with ❤️‍🔥 by 1azarito                     │
└──────────────────────────────────────────────┘

  ┌─────────────────────┐
  │ 🛒 My Cart      [3] │ ← Floating cart button
  └─────────────────────┘    (fixed, bottom-right)

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

| Scenario | Behavior |
|---|---|
| PromoModal → ProductModal | Both remain open. Back closes ProductModal first. |
| ProductModal → QuickBuyModal | Both remain open. Back closes QuickBuyModal first. |
| Back with no popups | Shows exit warning toast (double-back-to-exit). |

---

## Colors and Design System

All colors are defined as CSS custom properties in `app/globals.css`. The design uses a WhatsApp-inspired green color palette with glassmorphism effects.

### Light Mode (`:root`)

| Variable | Value | Purpose |
|---|---|---|
| `--bg-primary` | `#ffffff` | Main background |
| `--bg-secondary` | `#f0f2f5` | Secondary background (cards, inputs) |
| `--text-primary` | `#111b21` | Main text color |
| `--text-secondary` | `#667781` | Secondary/label text |
| `--accent-green` | `#00a884` | WhatsApp brand green (primary action) |
| `--accent-green2` | `#25d366` | WhatsApp vibrant green (badges, highlights) |
| `--accent-light` | `#d9fdd3` | Light green tint (cart footer background) |
| `--accent-hover` | `#06cf9c` | Hover state for green elements |
| `--border-color` | `#e9edef` | Borders and dividers |
| `--glass-bg` | `rgba(255, 255, 255, 0.9)` | Glassmorphism header background |
| `--glass-border` | `rgba(17, 27, 33, 0.08)` | Glassmorphism border |
| `--shadow-sm` | `0 2px 8px rgba(17, 27, 33, 0.06)` | Small card shadow |
| `--shadow-md` | `0 10px 30px rgba(17, 27, 33, 0.08)` | Medium elevated shadow |
| `--shadow-lg` | `0 20px 50px rgba(17, 27, 33, 0.14)` | Large modal shadow |
| `--radius-sm` | `8px` | Small border radius |
| `--radius-md` | `16px` | Medium border radius |
| `--radius-lg` | `24px` | Large border radius |

### Dark Mode (`@media (prefers-color-scheme: dark)`)

| Variable | Value |
|---|---|
| `--bg-primary` | `#0b141a` |
| `--bg-secondary` | `#111b21` |
| `--text-primary` | `#e9edef` |
| `--text-secondary` | `#8696a0` |
| `--accent-green` | `#00a884` |
| `--accent-green2` | `#25d366` |
| `--accent-light` | `#005c4b` |
| `--accent-hover` | `#06cf9c` |
| `--border-color` | `#313d45` |
| `--glass-bg` | `rgba(11, 20, 26, 0.9)` |
| `--glass-border` | `rgba(233, 237, 239, 0.08)` |
| `--shadow-sm` | `0 2px 8px rgba(0, 0, 0, 0.3)` |
| `--shadow-md` | `0 10px 30px rgba(0, 0, 0, 0.4)` |
| `--shadow-lg` | `0 20px 50px rgba(0, 0, 0, 0.5)` |

### Color Usage Notes

- The "OFFER" badge on product cards uses `--accent-green2` (`#25d366`) as background.
- The "OFFER" badge inside the product modal uses a hardcoded `#e74c3c` (red) background.
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

| Class / Element | Font | Size | Weight |
|---|---|---|---|
| Body text | `--font-sans` | 16px (default) | 400 |
| `.featured-title` | `--font-sans` | 1.5rem | 700 |
| `.category-title-header` | `--font-sans` | 1.5rem | 700 |
| `.cart-header h2` | `--font-sans` | 1.4rem | 700 |
| `.cart-total-primary` | `--font-sans` | 1.4rem | 700 |
| `.store-info-title` | `--font-sans` | 1.6rem | 700 |
| `.product-modal-title` | `--font-serif` | 1.8rem | 700 |
| `.cart-checkout-title` | `--font-serif` | 1rem | 600 |
| `.product-card-title` | `--font-sans` | 0.85rem (0.95rem desktop) | 600 |
| `.product-card-category` | `--font-sans` | 0.65rem (0.7rem desktop) | 600 (uppercase) |
| `.price-primary` | `--font-sans` | 0.95rem (1.05rem desktop) | 700 |
| `.category-btn` | `--font-sans` | 0.8rem | 500 |
| `.search-input` | `--font-sans` | 0.82rem | 400 |

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

| String | File Location |
|---|---|
| `"Search products..."` | Mobile search input `placeholder` |
| `"Search..."` | Desktop search input `placeholder` |
| `"All"` | Category "All" button text |
| `"Back"` | Back button `title` |
| `"Clear"` | Clear button `title` |
| `"Filters"` | Filter icon `title` |
| `"Open filters"` | Sort toggle `aria-label` |
| `"Store Info"` | Info icon `title` |
| `"Filters"` | Filter modal title |
| `"Adjust your search"` | Filter modal subtitle |
| `"Categories"` | Filter modal section heading |
| `"Sort by"` | Filter modal section heading |
| `"Featured First"` | Sort option |
| `"Price: Low to High"` | Sort option |
| `"Price: High to Low"` | Sort option |
| `"Name: A-Z"` | Sort option |

### Store Info Modal (`components/FilterHeader.jsx`)

| String | Context |
|---|---|
| `"Online Catalog"` | Badge below store name |
| `"Location"` | Label |
| `"WhatsApp"` | Label |
| `"Hours"` | Label |
| `"Monday - Saturday, 9:00 AM – 6:00 PM"` | Hours value |
| `"Deliveries"` | Label |
| `"Coordinated shipping in Miami area"` | Deliveries value |
| `"How to buy?"` | Section title |
| `"Browse the catalog and tap + to add products."` | Step 1 |
| `"Open My Cart (floating button below)."` | Step 2 |
| `"Tap Confirm via WhatsApp to send us your order."` | Step 3 |
| `"Contact us on WhatsApp"` | CTA button |

### Cart (`components/Cart.jsx`)

| String | Context |
|---|---|
| `"My Cart"` | Floating button label |
| `"Your Cart"` | Cart drawer title |
| `"Your cart is empty."` | Empty state |
| `"Back to store"` | Empty state button |
| `"Order Details"` | Checkout form title |
| `"Name *"` | Form field label |
| `"Your name"` | Name input placeholder |
| `"Phone *"` | Form field label |
| `"+1 555 XXX XXXX"` | Phone input placeholder |
| `"Pickup / Delivery *"` | Form field label |
| `"Pick up at store"` | Radio option |
| `"Home delivery"` | Radio option |
| `"Your address"` | Address input placeholder |
| `"Payment method *"` | Form field label |
| `"Specify payment method"` | Other payment input placeholder |
| `"Remove product"` | Remove button `title` |
| `"Total:"` | Total label |
| `"Confirm order via WhatsApp"` | Checkout button |
| `"Cash USD"`, `"Credit Card"`, `"Debit Card"`, `"Zelle"`, `"PayPal"`, `"Venmo"`, `"Other"` | Payment method chips |

### Product Card (`components/ProductCard.jsx`)

| String | Context |
|---|---|
| `"OFFER"` | Discount badge |
| `"Add to cart"` | "+" button `title` |

### Product Modal (`components/ProductModal.jsx`)

| String | Context |
|---|---|
| `"Previous image"` | Image nav button `aria-label` |
| `"Next image"` | Image nav button `aria-label` |
| `"OFFER"` | Discount badge |
| `"Share"` | Share button `title` |
| `"Buy"` | Direct buy button |
| `"Add to Cart"` | CTA button |

### Catalog (`app/CatalogContainer.jsx`)

| String | Context |
|---|---|
| `"Flash Offers"` | Section heading |
| `"Available Products"` | Section heading |
| `"No products found"` | Empty results title |
| `"Try different search terms or change category."` | Empty results hint |
| `"Clear Filters"` | Reset button |
| `"Added: {name}"` | Toast notification (cart add) |
| `"Quantity updated"` | Toast notification (cart update) |
| `"Removed: {name}"` | Toast notification (cart remove) |
| `"Press back again to exit"` | Toast notification (exit warning) |
| `"All rights reserved."` | Footer text |
| `"Store Info"` | Footer info button |
| `"Template Info"` | Footer info button |

### Template Info Modal (`components/TemplateInfoModal.jsx`)

| String | Context |
|---|---|
| `"Whatalog — Open Source WhatsApp Catalog"` | Modal title |
| `"Free Template"` | Badge |
| `"This is a free, open-source template..."` | Body text |
| `"Download template ZIP"` | Download button |
| `"View on GitHub"` | GitHub link |
| `"Got it!"` | Dismiss button |

---

## Cart and Checkout

### How the Cart Works

The cart is managed entirely on the client side in `CatalogContainer.jsx`:

1. **State:** `cartItems` is an array of product objects, each with a `quantity` property.
2. **Persistence:** Cart is saved to `localStorage` under the key `whatalog_cart` on every change. It survives page reloads.
3. **Adding:** Clicking "+" on a product card or "Add to Cart" in the modal adds/updates the item. A green toast notification appears for 2.7 seconds.
4. **Updating:** In the cart drawer, +/- buttons change quantity. If quantity reaches 0, the item is removed.
5. **Removing:** The trash icon removes the item entirely. A toast confirms the removal.

### Cart Reset

The cart is cleared (via `onClearCart()`) 500ms **after** the user clicks the WhatsApp checkout button. This happens inside the checkout click handler:

```js
setTimeout(() => onClearCart(), 500);
```

This ensures the order is sent before the cart resets. The cart can also be cleared programmatically by removing the `whatalog_cart` key from localStorage.

### Checkout Form

The checkout form in the cart drawer collects:

| Field | Required | Validation |
|---|---|---|
| Name | Yes | Non-empty string |
| Phone | Yes | Non-empty string |
| Delivery method | Yes | "pickup" or "delivery" (radio buttons) |
| Address | No (only if delivery) | Text input |
| Payment method | Yes | One of 7 options (chip-style radio buttons) |

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

When `offer: true`:
- The product appears in the "Flash Offers" featured section at the top of the catalog (right below the promo grid).
- Only the first 4 offer products are shown in the grid; all offers can be viewed by tapping the **+ button** (circular, green, at the end of the title row).
- The "+ button" opens an `OfferModal` popup showing ALL offer products in a promo-style grid.
- The offer section uses a 2-column (mobile) / 4-column (desktop) grid layout, NOT the masonry layout.
- Products in this section always use `ratio-square` aspect ratio.

The title row layout:
```
Flash Offers ────────────────────── [+]
```
The separator line is an explicit `<span className="featured-title-line">`, and the + button is pushed to the far right with `margin-left: auto`.

The filtering logic in `CatalogContainer.jsx`:
```js
const offerProducts = useMemo(() => {
  return initialProducts.filter((p) => p.offer)
    .map((p) => ({ ...p, ratioClass: "ratio-square" }));
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
4. **Available Products title:** Includes a filter icon button (`.btn-filter-catalog`) at the far right of the title row that opens the sort/filter popup.

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
|---|---|---|---|
| ProductModal | `components/ProductModal.jsx` | Product card tap, promo product tap | Slides up, z-index 210 |
| QuickBuyModal | `components/QuickBuyModal.jsx` | "Buy" button in ProductModal | Stays on top of ProductModal |
| PromoModal | `components/PromoModal.jsx` | Promo banner tap | Shows related products (promo field match) |
| OfferModal | `components/OfferModal.jsx` | + button in Flash Offers title | Shows ALL offer products |
| Store Info | Inside `FilterHeader.jsx` | Info icon, footer "Store Info" button | Opens via custom event `open-store-info` |
| Sort / Filter | Inside `FilterHeader.jsx` | Filter icon, title filter button | Opens via custom event `open-sort-menu` |
| TemplateInfoModal | `components/TemplateInfoModal.jsx` | Auto on first visit, footer button | Uses `open-template-modal` custom event |
| LegalInfoModal | `components/LegalInfoModal.jsx` | Via Store Info modal | Nested popup inside Store Info |
| ProInfoModal | `components/ProInfoModal.jsx` | Via Store Info modal | Nested popup inside Store Info |

### Custom Events

Cross-component popup triggers use custom DOM events:

| Event | Dispatched by | Listened by |
|---|---|---|
| `open-store-info` | Footer "Store Info" button | `FilterHeader.jsx` |
| `open-sort-menu` | Catalog filter button, sort button | `FilterHeader.jsx` |
| `open-template-modal` | Footer "Template Info" button | `TemplateInfoModal.jsx` |

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

File: `app/CatalogContainer.jsx` (scoped `<style jsx global>`)

The footer is structured top-to-bottom:

1. **Google Maps iframe** — Embedded map location.
2. **Social icons row** — GitHub, Instagram, Facebook, WhatsApp (each as an SVG icon link).
3. **Info buttons row** — Two buttons side by side:
   - "Store Info" — dispatches `open-store-info` custom event.
   - "Template Info" — dispatches `open-template-modal` custom event.
4. **Copyright** — `© {year} Whatalog. All rights reserved.`
5. **"Made with ❤️‍🔥 by 1azarito"** — Links to `https://1azarito.vercel.app`.

The same "Made with ❤️‍🔥 by 1azarito" text also appears in:
- The Store Info modal (`FilterHeader.jsx`).
- The Template Info modal (`TemplateInfoModal.jsx`).

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
- Used by `Cart.jsx`, `ProductModal.jsx`, `QuickBuyModal.jsx`, `PromoModal.jsx`, `OfferModal.jsx`, `FilterHeader.jsx`, `TemplateInfoModal.jsx`, and all info modals.

---

## Template Info Popup

The project includes a modal popup (`components/TemplateInfoModal.jsx`) that appears automatically on first visit. It explains that this is a template and provides a download ZIP + link to the GitHub repo.

### How it works

- A `localStorage` flag (`whatalog_template_seen`) controls whether the popup has been dismissed.
- On first visit (no flag found), the popup appears after a 600ms delay.
- Once dismissed, the flag is set and the popup won't auto-show again.
- Users can re-open it anytime via the **"Template Info"** button in the footer (dispatches `open-template-modal`).

### Disable the auto-popup entirely

In `components/TemplateInfoModal.jsx`, remove or comment out the first `useEffect`:

```js
// Remove or comment this block to disable auto-show on first visit
// useEffect(() => {
//   const seen = localStorage.getItem("whatalog_template_seen");
//   if (!seen) {
//     const timer = setTimeout(show, 600);
//     return () => clearTimeout(timer);
//   }
// }, [show]);
```

### Re-purpose as a promo / announcement popup

Since the popup uses the same modal pattern as the store info modal, you can easily adapt it:

1. Edit the content inside `components/TemplateInfoModal.jsx` — replace the text, links, and buttons with your own promo message.
2. Change the `localStorage` key from `"whatalog_template_seen"` to something like `"promo_spring2026_seen"` to reset visibility.
3. Adjust the auto-show delay (currently 600ms) or remove it to show instantly on page load.

### Remove the popup entirely

1. Delete `components/TemplateInfoModal.jsx`.
2. Remove the import and `<TemplateInfoModal />` from `app/CatalogContainer.jsx`.
3. Remove the footer button that dispatches `open-template-modal` (inside `app/CatalogContainer.jsx`).
4. Remove the associated CSS from `app/globals.css` (`.template-info-modal`, `.template-info-actions`, `.template-btn-download`, `.template-btn-got-it`, `.footer-template-link`).

---

## Manual Translation (How to Customize UI Text)

All user-facing text is hardcoded in English directly in the component files. There is no separate translation system in the free version — this keeps the template simple and dependency-free.

### How to Change Any Text

1. **Find the text** in one of these files:
   - `components/FilterHeader.jsx` — header, search, categories, sort, store info modal
   - `components/Cart.jsx` — cart drawer and checkout form
   - `components/ProductModal.jsx` — product detail modal
   - `components/ProductCard.jsx` — product card badges
   - `components/TemplateInfoModal.jsx` — template info popup
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

### Pro Version

The **Whatalog Pro** version will include automatic translation via DeepL / Google Cloud Translation API, covering both UI strings and product descriptions.

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
