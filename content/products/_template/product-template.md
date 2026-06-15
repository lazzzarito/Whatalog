---
# ═══════════════════════════════════════════════════════════
#  PRODUCT TEMPLATE — Whatalog
#  All supported fields are documented below.
#  Copy this file into content/products/, rename it, and
#  fill in your data.  Delete any fields you don't need.
# ═══════════════════════════════════════════════════════════

# ── REQUIRED FIELDS ──────────────────────────────────────

# Unique identifier for the product. Use only letters, numbers, and hyphens.
# If omitted, the filename (without .md) is used automatically.
id: "my-product"

# Product name — shown on cards, modals, cart, and WhatsApp orders.
name: "My Product Name"

# Current selling price in USD (decimal). Always required.
# The template supports any currency symbol defined in store-config.json.
priceUSD: 19.99

# ── DISPLAY & SORTING ────────────────────────────────────

# Category name for filtering. Products with the same category
# are grouped together in the catalog filter.
category: "General"

# Short description — shown on the product card and in the product modal.
description: "A brief one-line description of the product."

# Featured products always appear FIRST in the catalog, before
# alphabetical sorting.  Set to true to highlight important products.
# Default: false
featured: true

# ── PROMOTIONS ───────────────────────────────────────────

# Original (higher) price — enables the "OFFER" strikethrough display
# and the discount badge.  Only shown if originalPrice > priceUSD.
# Omit this field if the product is not on sale.
originalPrice: 29.99

# Flash Offer flag.  When true AND originalPrice is set AND
# originalPrice > priceUSD, the product appears in the
# "Flash Offers" section at the top of the catalog.
# Default: false
offer: true

# ── INVENTORY & AVAILABILITY ─────────────────────────────

# Available stock quantity. Controls the maximum value of the
# quantity stepper in the product modal.
#   - stock < 10    → shows "Only N left" message
#   - stock === 0   → shows "Out of Stock", buttons disabled
#   - Omitted        → no limit (max stepper = 99)
# Default: unlimited
stock: 25

# Product availability status.  Overrides stock behavior:
#   "coming-soon"   → shows "Coming Soon" badge, buttons disabled
#   Omitted          → normal behavior based on stock
# Default: (none)
status: "coming-soon"

# Promo group identifier.  Products with the same promo value
# are grouped together in a promo banner modal.
# Must match the `target` field in a promoLink inside store-config.json.
# Omit if the product is not part of a promo group.
promo: "summer-sale"

# ── IMAGES ───────────────────────────────────────────────

# Single product image (string).  You can use either:
#   - A local file name (placed in content/products/)
#   - A full URL (https://...)
# The image is used on the product card and as the first gallery image.
image: "my-product.webp"

# Multiple images for the gallery modal (array of strings).
# If omitted but `image` is set, the gallery shows only that image.
# Supports the same formats as `image` (local filenames or URLs).
images:
  - "my-product-angle-1.webp"
  - "my-product-angle-2.webp"
  - "my-product-detail.webp"

# ── OPTIONS / VARIANTS ───────────────────────────────────

# Product variants like size, color, material, etc.
# Each key is a variant group name (e.g., "Size", "Color").
# Each value is a list of options.  Each option can have:
#   name       : Display name (required)
#   priceUSD   : Override the base price for this option (optional)
#   originalPrice: Override the original price for this option (optional)
#   image      : Override the product image when this option is selected (optional)
#
# When options exist, the product card shows an "Add to Cart" button
# that opens the product modal for option selection instead of adding
# directly.  The first option value in each group is pre-selected.
#
# Omit the entire `options` block for simple products with no variants.
options:
  Size:
    - name: "Small"
      priceUSD: 19.99
    - name: "Medium"
      priceUSD: 24.99
    - name: "Large"
      priceUSD: 29.99
  Color:
    - name: "Midnight Black"
      image: "my-product-black.webp"
    - name: "Pearl White"
      image: "my-product-white.webp"

# ── ATTRIBUTES / SPECS ───────────────────────────────────

# Key-value pairs displayed as a spec sheet in the product modal.
# Use this for technical details, materials, dimensions, etc.
attributes:
  Material: "Premium brushed aluminum"
  Weight: "1.2 lbs (540 g)"
  Dimensions: "10 × 6 × 2 in"
  Warranty: "2-year limited"

# ── BODY (Markdown) ──
# Everything below the second `---` is the product description.
# It is rendered as HTML inside the product modal, below the short
# description.  Use Markdown syntax for rich formatting.
#
# TIPS:
#   - Use `- **Bold**` for key-value lists
#   - Keep paragraphs short for mobile readability
#   - Add line breaks between sections for clean Markdown
---
Write your full product description here. You can use **bold**, *italic*, and other Markdown formatting.

- **Feature 1:** Explain the first key benefit.
- **Feature 2:** Explain the second key benefit.
- **Feature 3:** Explain the third key benefit.

Additional paragraphs, usage instructions, or care tips go here.
