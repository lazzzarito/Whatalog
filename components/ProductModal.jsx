"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/SafeImage";
import { lockBodyScroll } from "@/lib/scroll-lock";
import { useHistoryPopup } from "@/lib/use-history-popup";

export default function ProductModal({ product, onClose, onAddToCart, storeConfig, onQuickBuy }) {
  // ── Track active image index for gallery ──
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      return lockBodyScroll();
    }
  }, [product]);

  useHistoryPopup(!!product, onClose);

  if (!product) return null;

  const { name, priceUSD, originalPrice, category, images, description, contentHtml, attributes } = product;
  const productImages = images && images.length > 0 ? images : [product.image];
  const hasDiscount = originalPrice && originalPrice > priceUSD;
  const hasAttributes = attributes && Object.keys(attributes).length > 0;

  const handleShare = async () => {
    const text = `Check this out: ${name} - $${priceUSD}`;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: name, text, url }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    }
  };

  const handleDirectBuy = () => {
    onQuickBuy(product);
  };

  return (
    <>
      <div className="cart-overlay open" onClick={onClose} style={{ zIndex: 200 }} />
      <div className="product-modal-container">
        <div className="product-modal-card">
          <button className="product-modal-close" onClick={onClose}>&times;</button>

          <div className="product-modal-scroll-content">
            <div className="product-modal-content">
              <div className="product-modal-image-col">
                <div className="product-modal-image-wrapper">
                  <SafeImage
                    src={productImages[activeImage]}
                    alt={name}
                    fill
                    className="product-modal-image-element"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {productImages.length > 1 && (
                  <div className="product-modal-image-nav">
                    <button
                      className="product-modal-image-arrow"
                      onClick={() => setActiveImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                      aria-label="Previous image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <span className="product-modal-image-counter">{activeImage + 1} / {productImages.length}</span>
                    <button
                      className="product-modal-image-arrow"
                      onClick={() => setActiveImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                      aria-label="Next image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="product-modal-info-col">
                <span className="product-card-category">{category}</span>
                <h2 className="product-modal-title">{name}</h2>

                <div className="product-modal-prices">
                  {hasDiscount && <span className="price-original">${originalPrice.toFixed(2)}</span>}
                  <span className="price-primary">${priceUSD.toFixed(2)}</span>
                  {hasDiscount && <span className="product-modal-badge">OFFER</span>}
                </div>

                {hasAttributes && (
                  <div className="product-modal-attributes">
                    {Object.entries(attributes).map(([key, val]) => (
                      <div className="product-modal-attr-row" key={key}>
                        <span className="product-modal-attr-label">{key}</span>
                        <span className="product-modal-attr-value">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {description && <p className="product-modal-brief">{description}</p>}

                <div className="product-modal-details-html" dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </div>
            </div>
          </div>

          <div className="product-modal-footer">
            <div className="product-modal-footer-row">
              <button className="btn-share" onClick={handleShare} title="Share">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
              <button className="btn-direct-buy" onClick={handleDirectBuy}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Buy
              </button>
              <button className="btn-add-cart" onClick={() => { onAddToCart(product); onClose(); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .product-modal-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 210;
          padding: 0;
          pointer-events: none;
        }

        .product-modal-card {
          pointer-events: auto;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          width: 100%;
          max-width: 100%;
          max-height: 90svh;
          box-shadow: var(--shadow-lg);
          position: relative;
          animation: modal-slide-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 1024px) {
          .product-modal-container {
            justify-content: flex-end;
            padding: 0 1.5rem 0 0;
          }

          .product-modal-card {
            width: min(32vw, 420px);
            max-width: 420px;
            border-radius: 24px 24px 0 0;
          }
        }

        @keyframes modal-slide-up {
          from { transform: translateY(100%); opacity: 1; }
          to { transform: translateY(0); opacity: 1; }
        }

        .product-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--bg-secondary);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 1.5rem;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.2s;
        }

        .product-modal-close:hover {
          color: var(--text-primary);
          background: var(--border-color);
        }

        .product-modal-scroll-content {
          flex: 1;
          overflow-y: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .product-modal-scroll-content::-webkit-scrollbar { display: none; }

        .product-modal-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
        }

        .product-modal-image-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .product-modal-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .product-modal-image-element { object-fit: cover; }

        .product-modal-image-nav {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: center;
        }

        .product-modal-image-arrow {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .product-modal-image-arrow:hover {
          background: var(--border-color);
        }

        .product-modal-image-counter {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          min-width: 3rem;
          text-align: center;
        }

        .product-modal-info-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .product-modal-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .product-modal-prices {
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .product-modal-badge {
          display: inline-block;
          align-self: flex-start;
          margin-top: 0.35rem;
          background: #e74c3c;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .product-modal-attributes {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .product-modal-attr-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }

        .product-modal-attr-label {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .product-modal-attr-value {
          font-weight: 500;
          color: var(--text-primary);
        }

        .product-modal-brief {
          font-size: 1rem;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        .product-modal-details-html {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-primary);
        }

        .product-modal-details-html ul {
          padding-left: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .product-modal-details-html li { list-style-type: disc; }

        .product-modal-footer {
          padding: 1rem 1.5rem calc(1rem + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid var(--border-color);
          background: var(--bg-primary);
          flex-shrink: 0;
          position: relative;
          z-index: 5;
        }

        .product-modal-footer-row {
          display: flex;
          gap: 0.5rem;
        }

        .product-modal-footer-row button {
          flex: 1;
          padding: 0.65rem 0.75rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          white-space: nowrap;
        }

        .product-modal-footer-row .btn-share {
          flex: 0 0 auto;
          width: 2.5rem;
          height: 2.5rem;
          padding: 0;
          border-radius: 50%;
        }

        .product-modal-footer-row .btn-direct-buy {
          flex: 0 0 auto;
          padding: 0.65rem 0.9rem;
        }

        .product-modal-footer-row button:hover {
          background: var(--border-color);
        }

        .product-modal-footer-row .btn-add-cart {
          background: var(--text-primary) !important;
          color: var(--accent-light) !important;
          border-color: var(--text-primary) !important;
        }

        .product-modal-footer-row .btn-add-cart:hover {
          opacity: 0.9;
        }

        .product-modal-footer-row .btn-direct-buy svg,
        .product-modal-footer-row .btn-share svg {
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}
