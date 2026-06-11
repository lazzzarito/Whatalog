# Whatalog Guide — Online WhatsApp Catalog Template

## What is Whatalog?

Whatalog is a free, open-source template for creating a WhatsApp-based online catalog. It loads product data from Markdown files, lets customers browse and add items to a cart, and sends the complete order as a formatted WhatsApp message.

Built with Next.js 16 + React 19, Tailwind CSS 4, and gray-matter + marked for Markdown-based products. All UI text is in English.

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
│   ├── FilterHeader.jsx                     → Header, search, categories, filters, language switcher
│   ├── MasonryGrid.jsx                      → Pinterest-style masonry grid wrapper
│   ├── Preloader.jsx                        → Loading spinner shown on first render
│   ├── ProductCard.jsx                      → Product card with image, price, add-to-cart
│   ├── ProductModal.jsx                     → Product detail modal with gallery, attributes, sharing
│   └── PromoBanner.jsx                      → Standalone promo banner (16:9)
├── content/
│   ├── store-config.json                    → Store configuration (name, WhatsApp number, etc.)
│   ├── products/                            → Product .md files + image files
│   ├── promos/                              → Promotional images (landscape + 2 squares)
└── lib/
    ├── products.js                          → Server helpers: getStoreConfig(), getProducts()
    ├── scroll-lock.js                       → Body scroll lock utility (counter-based)
├── messages/                                → *(Not present in free version)*
├── public/
│   └── images/logo.webp                     → Store logo (displayed in header)
├── next.config.mjs                          → Next.js configuration
├── package.json                             → Dependencies and scripts
├── postcss.config.mjs                       → PostCSS config (Tailwind CSS)
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
# OR omit both → no image shown.

# ── OPTIONAL ──────────────────────────────────────────────
description: "Wild rose and..."   # Short text shown on the product card (clamped to 2 lines).
originalPrice: 25.00              # Original/higher price. Shows strikethrough + OFFER badge.
featured: true                    # Boolean. Featured products sort first.
offer: true                       # Boolean. Shows product in "Flash Offers" hero section.
attributes:                       # Key-value pairs displayed in modal & sent in WhatsApp.
  Size: "50 ml"
  Color: "Gold"
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
  - "perfume_rose.png"
  - "perfume_rose_2.png"
description: "Wild rose and premium jasmine fragrance. Long-lasting with a delicate aroma perfect for daily wear."
featured: true
offer: true
attributes:
  Size: "1.7 fl oz (50 ml)"
  Longevity: "12 hours"
  Type: "Eau de Parfum"
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
image: "bolso_cuero.png"
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

Product images are displayed in a Pinterest-style masonry grid with three aspect ratios:

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
| `[0]` | Left / top | 16:9 (landscape) | Left column (`2fr`) | Full width, 16:9 |
| `[1]` | Right top | 1:1 (square) | Right column, stacked | 50% width, 1:1 |
| `[2]` | Right bottom | 1:1 (square) | Right column, stacked | 50% width, 1:1 |

### Grid Layout

**Desktop (≥769px):** The promo grid is a `2fr 1fr` two-column layout with a fixed height of 512px. The landscape image fills the left column; the two squares stack vertically in the right column.

**Mobile (≤768px):** The grid becomes a single column. The landscape image is full-width with 16:9 aspect ratio. The two squares are side-by-side in a `1fr 1fr` grid, each with 1:1 aspect ratio.

If `promoBanners` is empty or undefined, the promo section is not rendered.

You can also use the standalone `<PromoBanner />` component (in `components/PromoBanner.jsx`) which renders a single 16:9 full-width banner.

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
│  [Search (desktop)] [🔍(mobile)] [ℹ️]         │
├──────────────────────────────────────────────┤
│  PROMO GRID (if banners configured)           │
│  ┌──────────┐ ┌───────────┐                   │
│  │ Landscape│ │ Square #1 │                   │
│  │  (16:9)  │ ├───────────┤                   │
│  │          │ │ Square #2 │                   │
│  └──────────┘ └───────────┘                   │
├──────────────────────────────────────────────┤
│  FLASH OFFERS (if any product has offer:true) │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ Card │ │ Card │ │ Card │ │ Card │          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
│  (2-column mobile, 4-column desktop)          │
├──────────────────────────────────────────────┤
│  AVAILABLE PRODUCTS                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │Card  │ │Card  │ │Card  │ │Card  │          │
│  │(tall)│ │(sqr) │ │(wide)│ │(tall)│          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
│  Masonry grid (Pinterest-style)               │
│  2-col mobile, 4-col desktop                  │
│                                               │
│  ... [Infinite scroll loader] ...             │
├──────────────────────────────────────────────┤
│  FOOTER                                       │
│  ┌──────────────────────────────────────┐     │
│  │  Google Maps iframe                  │     │
│  └──────────────────────────────────────┘     │
│  © 2026 Whatalog. All rights reserved.        │
│  [Instagram] [Facebook] [Telegram] [WhatsApp] │
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
  │ [Share buttons]     │
  │ [Description HTML]  │
  │ [Add to Cart  🛒]   │
  └─────────────────────┘
```

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
- The "OFFER" badge inside the product modal uses a hardcoded `#e74c3c` (red) background instead of a CSS variable.
- Share buttons (`share-btn`) use hardcoded dark colors (`#1a1a1a` background, `#333` border) — they do NOT use CSS variables.
- The floating cart button uses a hardcoded `#008a72` with `#007a63` hover instead of `--accent-green`. This is intentional for the darker, more prominent bottom button.
- The active category pill uses `--text-primary` as background and `--accent-light` as text color (inverted from normal).
- The featured title and category titles have a line after them created with `::after` pseudo-element using `--border-color`.

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
| `"Share on WhatsApp"` | Share button `title` |
| `"Share on Facebook"` | Share button `title` |
| `"Share on Twitter"` | Share button `title` |
| `"Copy link"` | Share button `title` |
| `"Link copied to clipboard"` | Alert text |
| `"Add to Cart"` | CTA button |

### Catalog (`app/CatalogContainer.jsx`)

| String | Context |
|---|---|
| `"Flash Offers"` | Section heading |
| `"Available Products"` | Section heading |
| `"No products found"` | Empty results title |
| `"Try different search terms or change category."` | Empty results hint |
| `"Clear Filters"` | Reset button |
| `"Added: {name}"` | Toast notification |
| `"Quantity updated"` | Toast notification |
| `"Removed: {name}"` | Toast notification |
| `"All rights reserved."` | Footer text |

---

## Cart and Checkout

### How the Cart Works

The cart is managed entirely on the client side in `CatalogContainer.jsx`:

1. **State:** `cartItems` is an array of product objects, each with a `quantity` property.
2. **Persistence:** Cart is saved to `localStorage` under the key `whatalog_cart` on every change. It survives page reloads.
3. **Adding:** Clicking "+" on a product card or "Add to Cart" in the modal adds/updates the item. A toast notification appears for 2.7 seconds.
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
- The offer section uses a 2-column (mobile) / 4-column (desktop) grid layout, NOT the masonry layout.
- Products in this section always use `ratio-square` aspect ratio.

The filtering logic in `CatalogContainer.jsx`:
```js
const offerProducts = useMemo(() => {
  return initialProducts.filter((p) => p.offer)
    .map((p) => ({ ...p, ratioClass: "ratio-square" }));
}, [initialProducts]);
```

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

In `lib/products.js`, categories are extracted when products are loaded:
```js
const categories = Array.from(new Set(initialProducts.map((p) => p.category)));
```

### How Categories Work

1. **Filter pills:** Each unique category becomes a button in the header's horizontal scrollable nav. The first button is always "All" (shows all products).
2. **Filtering:** Clicking a category pill filters the product grid to only show products with that category. The filter is applied client-side in `CatalogContainer.jsx`.
3. **Auto-scroll:** When a category is selected, the catalog section scrolls into view smoothly.

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

## Manual Translation (How to Customize UI Text)

All user-facing text is hardcoded in English directly in the component files. There is no separate translation system in the free version — this keeps the template simple and dependency-free.

### How to Change Any Text

1. **Find the text** in one of these files:
   - `components/FilterHeader.jsx` — header, search, categories, sort, store info modal
   - `components/Cart.jsx` — cart drawer and checkout form
   - `components/ProductModal.jsx` — product detail modal
   - `components/ProductCard.jsx` — product card badges
   - `app/CatalogContainer.jsx` — section titles, toast messages, footer

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
- Maintains the scroll position using `position: fixed` + `top: -{scrollY}px`.
- Restores scroll position when the last lock is released.
- Used by `Cart.jsx`, `ProductModal.jsx`, and `FilterHeader.jsx` (for Store Info and Sort modals).

---

## Template Info Popup

The project includes a modal popup (`components/TemplateInfoModal.jsx`) that appears automatically on first visit. It explains that this is a template and provides a download ZIP + link to the GitHub repo.

### How it works

- A `localStorage` flag (`whatalog_template_seen`) controls whether the popup has been dismissed.
- On first visit (no flag found), the popup appears after a 600ms delay.
- Once dismissed, the flag is set and the popup won't auto-show again.
- Users can re-open it anytime via the **"What is this? — Template info"** link in the footer.

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
