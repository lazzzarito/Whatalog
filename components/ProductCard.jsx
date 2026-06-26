"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import SafeImage from "@/components/SafeImage";

export default function ProductCard({ product, onAddToCart, onOpenDetails, priority, isFavorited = false, onToggleFavorite, index = 0 }) {
  const { name, priceUSD, originalPrice, category, image, description, ratioClass } = product;
  const hasDiscount = originalPrice != null && originalPrice > priceUSD;
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
    <motion.div
      className="product-card"
      onClick={() => onOpenDetails(product)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(17, 27, 33, 0.08)" }}
      whileTap={{ scale: 0.98 }}
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
        <button
          className={`product-card-fav${isFavorited ? " favorited" : ""}`}
          onClick={(e) => { e.stopPropagation(); if (onToggleFavorite) onToggleFavorite(product.id); }}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          )}
        </button>
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
    </motion.div>
  );
}
