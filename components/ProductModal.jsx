"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { lockBodyScroll } from "@/lib/scroll-lock";

export default function ProductModal({ product, onClose, onAddToCart }) {
  // ── Track active image index for gallery ──
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      return lockBodyScroll();
    }
  }, [product]);

  if (!product) return null;

  const { name, priceUSD, originalPrice, category, images, description, contentHtml, attributes } = product;
  const productImages = images && images.length > 0 ? images : [product.image];
  const hasDiscount = originalPrice && originalPrice > priceUSD;
  const hasAttributes = attributes && Object.keys(attributes).length > 0;

  // ── Share buttons: WhatsApp, Facebook, Twitter, copy link ──
  const shareProduct = (platform) => {
    const text = `Check this out: ${name} - $${priceUSD} USD`;
    const url = window.location.href;

    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      copy: () => {
        navigator.clipboard.writeText(text + ' ' + url);
        alert("Link copied to clipboard");
      }
    };

    if (platform === 'copy') {
      shareLinks.copy();
    } else {
      window.open(shareLinks[platform], '_blank');
    }
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
                  <Image
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
                  {hasDiscount && <span className="price-original">${originalPrice.toFixed(2)} USD</span>}
                  <span className="price-primary">${priceUSD.toFixed(2)} USD</span>
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

                <div className="product-modal-share-buttons">
                  <button className="share-btn" title="Share on WhatsApp" onClick={() => shareProduct('whatsapp')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </button>
                  <button className="share-btn" title="Share on Facebook" onClick={() => shareProduct('facebook')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </button>
                  <button className="share-btn" title="Share on Twitter" onClick={() => shareProduct('twitter')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 4l6.5 8.5L4 20h2l5.5-7 4.5 7h5l-7-9.5L20 4h-2l-5 6.5L9 4H4z" />
                    </svg>
                  </button>
                  <button className="share-btn" title="Copy link" onClick={() => shareProduct('copy')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>

                {description && <p className="product-modal-brief">{description}</p>}

                <div className="product-modal-details-html" dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </div>
            </div>
          </div>

          <div className="product-modal-footer">
            <button className="btn-checkout" onClick={() => { onAddToCart(product); onClose(); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.4rem" }}>
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </button>
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
          max-height: 90vh;
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
          padding: 2.5rem 2.5rem 1.5rem 2.5rem;
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

        .product-modal-share-buttons {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-start;
          margin-bottom: 1rem;
        }

        .share-btn {
          background: #1a1a1a;
          border: 1.5px solid #333333;
          color: #ffffff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .share-btn:hover {
          background: #2a2a2a;
          border-color: #444444;
          transform: scale(1.05);
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
          padding: 1.5rem 2.5rem 2.5rem 2.5rem;
          border-top: none;
          background: transparent;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-shrink: 0;
          position: relative;
          z-index: 5;
        }

        .product-modal-footer .btn-checkout { width: 100%; }
      `}</style>
    </>
  );
}
