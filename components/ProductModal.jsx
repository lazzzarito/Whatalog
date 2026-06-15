"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/SafeImage";
import { lockBodyScroll } from "@/lib/scroll-lock";
import { useHistoryPopup } from "@/lib/use-history-popup";

export default function ProductModal({ product, onClose, onAddToCart, storeConfig, onQuickBuy, productQty = 1, onQtyChange }) {
  // ── Track active image index for gallery ──
  const [activeImage, setActiveImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showPlusBadge, setShowPlusBadge] = useState(false);
  const [lastAddedQty, setLastAddedQty] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    if (product) {
      const defaults = {};
      if (product.options) {
        Object.entries(product.options).forEach(([key, values]) => {
          if (values && values.length > 0) {
            defaults[key] = values[0].name;
          }
        });
      }
      setSelectedOptions(defaults);
      setActiveImage(0);
      return lockBodyScroll();
    }
  }, [product]);

  useHistoryPopup(!!product, onClose);

  if (!product) return null;

  const { name, priceUSD, originalPrice, category, images, description, contentHtml, attributes, options } = product;
  const stock = product.stock;
  const productStatus = product.status;
  const isComingSoon = productStatus === "coming-soon";
  const isOutOfStock = !isComingSoon && stock === 0;
  const isLowStock = !isComingSoon && !isOutOfStock && stock > 0 && stock < 10;
  const maxQty = isComingSoon || isOutOfStock ? 0 : (isFinite(stock) ? stock : 99);
  const canInteract = !isComingSoon && !isOutOfStock;

  // Build image list dynamically, including any option-specific images that aren't already present
  let baseImages = images && images.length > 0 ? [...images] : [product.image];
  if (options) {
    Object.values(options).forEach((values) => {
      if (Array.isArray(values)) {
        values.forEach((val) => {
          if (val && val.image && !baseImages.includes(val.image)) {
            baseImages.push(val.image);
          }
        });
      }
    });
  }
  const productImages = baseImages;

  // Compute dynamic price and original price based on selected options
  let activePrice = priceUSD;
  let activeOriginalPrice = originalPrice;

  if (options && Object.keys(selectedOptions).length > 0) {
    Object.entries(selectedOptions).forEach(([optionKey, selectedValName]) => {
      const optGroup = options[optionKey];
      if (optGroup) {
        const matchedVal = optGroup.find((o) => o.name === selectedValName);
        if (matchedVal && matchedVal.priceUSD !== undefined) {
          activePrice = matchedVal.priceUSD;
          activeOriginalPrice = matchedVal.originalPrice !== undefined ? matchedVal.originalPrice : null;
        }
      }
    });
  }

  const hasDiscount = activeOriginalPrice && activeOriginalPrice > activePrice;
  const hasAttributes = attributes && Object.keys(attributes).length > 0;

  const handleOptionSelect = (optionKey, valName) => {
    setSelectedOptions((prev) => {
      const updated = { ...prev, [optionKey]: valName };
      if (options && options[optionKey]) {
        const optionObj = options[optionKey].find((o) => o.name === valName);
        if (optionObj && optionObj.image) {
          const imgIndex = productImages.findIndex((img) => img === optionObj.image);
          if (imgIndex !== -1) {
            setActiveImage(imgIndex);
          }
        }
      }
      return updated;
    });
  };

  const handleShare = async () => {
    const text = `Check this out: ${name} - $${activePrice.toFixed(2)}`;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: name, text, url }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    }
  };

  const handleDirectBuy = () => {
    onQuickBuy({ ...product, selectedOptions, quantity: productQty });
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
                  {hasDiscount && (
                    <div className="price-original-row">
                      <span className="product-modal-badge">OFFER</span>
                      <span className="price-original">${activeOriginalPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="price-current-row">
                    <span className="price-primary">${(activePrice * productQty).toFixed(2)}</span>
                    {productQty > 1 && <span className="price-mult">${activePrice.toFixed(2)} × {productQty}</span>}
                  </div>
                  {isComingSoon && <div className="product-status-badge coming-soon">Coming Soon</div>}
                  {isOutOfStock && <div className="product-status-badge out-of-stock">Out of Stock</div>}
                  {isLowStock && <div className="product-status-badge low-stock">Only {stock} left in stock</div>}
                </div>

                {options && Object.keys(options).length > 0 && (
                  <div className="product-modal-options">
                    {Object.entries(options).map(([optionKey, values]) => (
                      <div className="product-modal-option-group" key={optionKey}>
                        <span className="product-modal-option-label">{optionKey}</span>
                        <div className="product-modal-option-values">
                          {values.map((val) => {
                            const isSelected = selectedOptions[optionKey] === val.name;
                            const hasPriceOverride = val.priceUSD !== undefined;
                            return (
                              <button
                                key={val.name}
                                className={`product-modal-option-pill${isSelected ? " active" : ""}`}
                                onClick={() => handleOptionSelect(optionKey, val.name)}
                              >
                                {val.name}
                                {hasPriceOverride && (
                                  <span className="product-modal-option-price-badge">
                                    (${val.priceUSD.toFixed(2)})
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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
              <button className="btn-share" onClick={handleShare} title="Share" aria-label="Share">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
              <div className={`btn-add-cart-wrap${addingToCart ? ' added' : ''}`}>
                <div className="btn-add-cart-stepper">
                  <button
                    onClick={(e) => { e.stopPropagation(); onQtyChange(Math.max(1, productQty - 1)); }}
                    aria-label="Decrease quantity"
                    disabled={productQty <= 1 || !canInteract}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span>{productQty}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onQtyChange(Math.min(maxQty, productQty + 1)); }}
                    aria-label="Increase quantity"
                    disabled={productQty >= maxQty || !canInteract}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
                <button
                  className="btn-add-cart"
                  onClick={() => {
                    const qty = productQty;
                    onAddToCart(product, selectedOptions, qty);
                    setLastAddedQty(qty);
                    setAddingToCart(true);
                    setShowPlusBadge(true);
                    setTimeout(() => setAddingToCart(false), 2000);
                    setTimeout(() => setShowPlusBadge(false), 900);
                  }}
                  aria-label="Add to cart"
                  disabled={!canInteract}
                >
                  {addingToCart ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Added
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                  {showPlusBadge && <span className="cart-plus-badge">+{lastAddedQty}</span>}
                </button>
              </div>
              <button className="btn-direct-buy" onClick={handleDirectBuy} aria-label="Buy now" disabled={!canInteract}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Buy Now
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
          gap: 0.15rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .price-original-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-current-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.25rem 0.5rem;
        }

        .product-modal-badge {
          background: #e74c3c;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .product-modal-prices .price-mult {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-left: auto;
        }

        .product-status-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          display: inline-block;
          margin-top: 0.15rem;
        }

        .product-status-badge.coming-soon {
          background: #f59e0b;
          color: #fff;
        }

        .product-status-badge.out-of-stock {
          background: #ef4444;
          color: #fff;
        }

        .product-status-badge.low-stock {
          background: transparent;
          color: var(--text-secondary);
          padding: 0.2rem 0;
        }

        .btn-add-cart:disabled,
        .btn-direct-buy:disabled {
          opacity: 0.4;
          cursor: default;
          pointer-events: none;
        }

        .product-modal-options {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-bottom: 1.25rem;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-color);
        }

        .product-modal-option-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .product-modal-option-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .product-modal-option-values {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .product-modal-option-pill {
          background: var(--bg-secondary);
          border: 1.5px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .product-modal-option-pill:hover {
          border-color: var(--text-secondary);
          background: var(--border-color);
        }

        .product-modal-option-pill.active {
          background: var(--text-primary) !important;
          color: var(--bg-primary) !important;
          border-color: var(--text-primary) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .product-modal-option-price-badge {
          font-size: 0.72rem;
          opacity: 0.85;
          font-weight: 500;
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
          align-items: center;
        }

        .product-modal-footer-row .btn-share {
          flex: 0 0 auto;
          width: 2.75rem;
          height: 2.75rem;
          padding: 0;
          border-radius: 50%;
          border: 1.5px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .product-modal-footer-row .btn-share:hover {
          background: var(--border-color);
        }

        .btn-add-cart-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          border-radius: 30px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-secondary);
          transition: all 0.2s;
          min-width: 0;
        }

        .btn-add-cart-wrap.added {
          background: var(--accent-green);
          border-color: var(--accent-green);
        }

        .btn-add-cart-wrap.added .btn-add-cart-stepper {
          pointer-events: none;
        }

        .btn-add-cart-wrap.added .btn-add-cart-stepper button,
        .btn-add-cart-wrap.added .btn-add-cart-stepper span {
          color: #fff;
        }

        .btn-add-cart-stepper {
          display: flex;
          align-items: center;
          padding: 0 0.1rem;
          flex-shrink: 0;
          border-right: 1px solid var(--border-color);
          transition: all 0.2s;
        }

        .btn-add-cart-wrap.added .btn-add-cart-stepper {
          border-right-color: rgba(255,255,255,0.3);
        }

        .btn-add-cart-stepper button {
          background: transparent;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-primary);
          transition: background 0.15s;
        }

        .btn-add-cart-stepper button:hover:not(:disabled) {
          background: var(--border-color);
        }

        .btn-add-cart-stepper button:disabled {
          opacity: 0.25;
          cursor: default;
        }

        .btn-add-cart-stepper span {
          padding: 0 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .btn-add-cart-wrap .btn-add-cart {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          padding: 0.65rem 0.4rem;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          position: relative;
        }

        .btn-add-cart-wrap.added .btn-add-cart {
          color: #fff;
          font-weight: 700;
          pointer-events: none;
        }

        .btn-add-cart-wrap .btn-add-cart svg {
          flex-shrink: 0;
        }

        .btn-add-cart-wrap .btn-add-cart .cart-plus-badge {
          position: absolute;
          top: -10px;
          right: -8px;
          background: #ff3b30;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 700;
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          box-shadow: 0 2px 8px rgba(255,59,48,0.45);
          z-index: 10;
          animation: badge-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.5);
        }

        .product-modal-footer-row .btn-direct-buy {
          flex: 0 0 auto;
          padding: 0.65rem 1.1rem;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--accent-green);
          color: #fff;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }

        .product-modal-footer-row .btn-direct-buy svg {
          display: block;
        }

        .product-modal-footer-row .btn-direct-buy:hover {
          background: var(--accent-hover);
        }

        .product-modal-footer-row .btn-direct-buy:active {
          transform: scale(0.97);
        }
      `}</style>
    </>
  );
}
