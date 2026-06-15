"use client";

import { useState, useCallback } from "react";
import SafeImage from "@/components/SafeImage";

export default function ProductCard({ product, onAddToCart, onOpenDetails, priority }) {
  const { name, priceUSD, originalPrice, category, image, description, ratioClass } = product;
  const hasDiscount = originalPrice && originalPrice > priceUSD;
  const hasOptions = product.options && Object.keys(product.options).length > 0;
  const stock = product.stock;
  const productStatus = product.status;
  const isComingSoon = productStatus === "coming-soon";
  const isOutOfStock = !isComingSoon && stock === 0;
  const canInteract = !isComingSoon && !isOutOfStock;

  const [showPlus, setShowPlus] = useState(false);

  const handleAdd = useCallback((e) => {
    e.stopPropagation();
    if (!canInteract) return;
    if (hasOptions) {
      onOpenDetails(product);
    } else {
      onAddToCart(product);
      setShowPlus(true);
      setTimeout(() => setShowPlus(false), 900);
    }
  }, [canInteract, hasOptions, onOpenDetails, product, onAddToCart]);

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
        {isComingSoon ? (
          <span className="product-card-badge coming-soon">Coming Soon</span>
        ) : isOutOfStock ? (
          <span className="product-card-badge out-of-stock">Out of Stock</span>
        ) : hasDiscount ? (
          <span className="product-card-badge">OFFER</span>
        ) : null}
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
          {canInteract && (
            <button
              className="btn-add-to-cart"
              aria-label={hasOptions ? "Select options" : "Add to cart"}
              title={hasOptions ? "Select options" : "Add to cart"}
              onClick={handleAdd}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {showPlus && <span className="plus-badge">+1</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
