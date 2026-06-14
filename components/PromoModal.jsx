"use client";

import { useEffect } from "react";
import SafeImage from "@/components/SafeImage";
import { lockBodyScroll } from "@/lib/scroll-lock";
import { useHistoryPopup } from "@/lib/use-history-popup";

export default function PromoModal({ promo, products, onClose, onAddToCart, onOpenDetails }) {
  useEffect(() => {
    if (promo) {
      const unlock = lockBodyScroll();
      const handler = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", handler);
      return () => {
        document.removeEventListener("keydown", handler);
        unlock();
      };
    }
  }, [promo, onClose]);

  useHistoryPopup(!!promo, onClose);

  if (!promo) return null;

  return (
    <div className="store-info-overlay" onClick={onClose}>
      <div className="store-info-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
        <button className="store-info-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="store-info-scroll">
          {promo.image && (
            <div className="promo-modal-banner">
              <SafeImage src={promo.image} alt={promo.title || "Promotion"} width={0} height={0} sizes="100vw" className="promo-modal-banner-img" />
            </div>
          )}

          <div className="store-info-header">
            <h2 className="store-info-title">{promo.title}</h2>
            {promo.subtitle && <span className="store-info-badge">{promo.subtitle}</span>}
          </div>

          <div className="store-info-body">
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
              Browse the products included in this promotion and add them to your cart.
            </p>

            {products.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", padding: "1rem 0" }}>
                No products in this promotion yet.
              </p>
            ) : (
              <div className="promo-modal-grid">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="promo-modal-product"
                    onClick={() => onOpenDetails(product)}
                  >
                    <div className="promo-modal-image-wrapper">
                      <SafeImage src={product.image} alt={product.name} width={80} height={80} className="promo-modal-image" />
                    </div>
                    <div className="promo-modal-info">
                      <span className="promo-modal-category">{product.category}</span>
                      <strong className="promo-modal-name">{product.name}</strong>
                      <span className="promo-modal-price">${product.priceUSD.toFixed(2)}</span>
                    </div>
                    <button
                      className="promo-modal-add"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.options && Object.keys(product.options).length > 0) {
                          onOpenDetails(product);
                          onClose();
                        } else {
                          onAddToCart(product);
                        }
                      }}
                      title={product.options && Object.keys(product.options).length > 0 ? "Select options" : "Add to cart"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
