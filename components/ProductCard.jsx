"use client";

import SafeImage from "@/components/SafeImage";

export default function ProductCard({ product, onAddToCart, onOpenDetails, priority }) {
  // ── Extract product data + check for discount ──
  const { name, priceUSD, originalPrice, category, image, description, ratioClass } = product;
  const hasDiscount = originalPrice && originalPrice > priceUSD;

  return (
    <div
      className="product-card"
      onClick={() => onOpenDetails(product)}
    >
      <div className={`product-card-image-wrapper ${ratioClass}`}>
        <SafeImage
          src={image}
          alt={name}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="product-card-image"
          priority={priority}
        />
        {hasDiscount && <span className="product-card-badge">OFFER</span>}
      </div>
      <div className="product-card-info">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-title">{name}</h3>
        {description && <p className="product-card-desc">{description}</p>}

        <div className="product-card-price-row">
          <div className="product-price-container">
            {hasDiscount && <span className="price-original">${originalPrice.toFixed(2)}</span>}
            <span className="price-primary">${priceUSD.toFixed(2)}</span>
          </div>
          <button
            className="btn-add-to-cart"
            title="Add to cart"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
