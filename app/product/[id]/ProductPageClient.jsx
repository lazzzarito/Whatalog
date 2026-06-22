"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

export default function ProductPageClient({ product, storeConfig }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("whatalog_cart");
        return stored ? JSON.parse(stored) : [];
      } catch (e) {}
    }
    return [];
  });
  const [toast, setToast] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2700);
  }, []);

  const saveCart = useCallback((items) => {
    setCartItems(items);
    try { localStorage.setItem("whatalog_cart", JSON.stringify(items)); } catch (e) {}
  }, []);

  const handleAddToCart = useCallback(() => {
    const options = Object.keys(selectedOptions).length > 0 ? selectedOptions : null;
    const cartItemId = options
      ? `${product.id}-${Object.entries(options).sort().map(([k, v]) => `${k}:${v}`).join("-")}`
      : product.id;

    const existing = cartItems.find((item) => item.id === cartItemId);
    if (existing) {
      saveCart(cartItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity + qty } : item
      ));
    } else {
      saveCart([...cartItems, { ...product, id: cartItemId, productId: product.id, selectedOptions: options, quantity: qty }]);
    }
    showToast(`Added: ${product.name}`);
  }, [product, cartItems, qty, selectedOptions, saveCart, showToast]);

  const handleShare = useCallback(async () => {
    const text = `Check this out: ${product.name} - $${product.priceUSD.toFixed(2)}`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    try { await navigator.clipboard.writeText(url); } catch (e) {}
    if (navigator.share) {
      await navigator.share({ title: product.name, text, url }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    }
  }, [product]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    const msg = `Hi! I'd like to buy *${product.name}* ($${product.priceUSD.toFixed(2)}) × ${qty}.`;
    const url = `https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }, [product, qty, storeConfig.whatsappNumber, handleAddToCart]);

  const hasOptions = product.options && Object.keys(product.options).length > 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.priceUSD;
  const stock = product.stock;
  const isComingSoon = product.status === "coming-soon";
  const isOutOfStock = !isComingSoon && stock === 0;
  const canInteract = !isComingSoon && !isOutOfStock;

  return (
    <div className="product-page-layout">
      {toast && (
        <div className="toast-notification" style={{ position: "fixed", top: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 210 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{toast}</span>
        </div>
      )}

      <div className="product-page-back">
        <Link href="/" className="product-page-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to catalog
        </Link>
      </div>

      <div className="product-page-card">
        <div className="product-page-image-section">
          <div className="product-page-image-wrapper">
            <SafeImage src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" priority />
          </div>
          {product.images?.length > 1 && (
            <div className="product-page-thumbs">
              {product.images.slice(1, 4).map((img, i) => (
                <div key={i} className="product-page-thumb">
                  <SafeImage src={img} alt={`${product.name} ${i + 2}`} fill sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-page-info">
          <span className="product-page-category">{product.category}</span>
          <h1 className="product-page-title">{product.name}</h1>

          <div className="product-page-price-row">
            {hasDiscount && <span className="price-original">${product.originalPrice.toFixed(2)}</span>}
            <span className="price-primary" style={{ fontSize: "1.5rem" }}>${product.priceUSD.toFixed(2)}</span>
          </div>

          {isComingSoon ? (
            <span className="product-card-badge coming-soon" style={{ position: "static", display: "inline-block", marginTop: "0.5rem" }}>Coming Soon</span>
          ) : isOutOfStock ? (
            <span className="product-card-badge out-of-stock" style={{ position: "static", display: "inline-block", marginTop: "0.5rem" }}>Out of Stock</span>
          ) : null}

          {product.description && <p className="product-page-desc">{product.description}</p>}

          {hasOptions && canInteract && (
            <div className="product-page-options">
              {Object.entries(product.options).map(([optionKey, values]) => (
                <div key={optionKey} className="product-page-option-group">
                  <label className="product-page-option-label">{optionKey}</label>
                  <div className="product-page-option-values">
                    {values.map((opt) => (
                      <button
                        key={opt.name}
                        className={`product-page-option-btn${selectedOptions[optionKey] === opt.name ? " active" : ""}`}
                        onClick={() => setSelectedOptions((prev) => ({ ...prev, [optionKey]: opt.name }))}
                      >
                        {opt.name}
                        {opt.priceUSD && <span style={{ display: "block", fontSize: "0.7rem", opacity: 0.75 }}>${opt.priceUSD.toFixed(2)}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {canInteract && (
            <div className="product-page-actions">
              <div className="product-page-qty">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button className="btn-add-to-cart-page" onClick={handleAddToCart}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Cart
              </button>
              <button className="btn-buy-now-page" onClick={handleBuyNow}>Buy Now</button>
              <button className="btn-share-page" onClick={handleShare}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
            </div>
          )}

          {product.contentHtml && (
            <div className="product-page-details" dangerouslySetInnerHTML={{ __html: product.contentHtml }} />
          )}
        </div>
      </div>

      <style jsx>{`
        .product-page-layout {
          max-width: 960px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
          min-height: 100svh;
        }
        .product-page-back {
          margin-bottom: 1.5rem;
        }
        .product-page-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .product-page-back-link:hover { color: var(--accent-green); }
        .product-page-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem;
        }
        @media (max-width: 768px) {
          .product-page-card { grid-template-columns: 1fr; padding: 1.25rem; }
        }
        .product-page-image-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .product-page-image-wrapper {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-secondary);
        }
        .product-page-thumbs { display: flex; gap: 0.5rem; }
        .product-page-thumb {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--bg-secondary);
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }
        .product-page-thumb:hover { border-color: var(--accent-green); }
        .product-page-info { display: flex; flex-direction: column; gap: 1rem; }
        .product-page-category {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent-green);
        }
        .product-page-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .product-page-price-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .product-page-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .product-page-options { display: flex; flex-direction: column; gap: 1rem; }
        .product-page-option-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .product-page-option-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-secondary);
        }
        .product-page-option-values { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .product-page-option-btn {
          padding: 0.4rem 0.8rem;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          background: transparent;
          color: var(--text-primary);
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .product-page-option-btn:hover { border-color: var(--accent-green); }
        .product-page-option-btn.active {
          background: var(--accent-green);
          color: #fff;
          border-color: var(--accent-green);
        }
        .product-page-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .product-page-qty {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          overflow: hidden;
          background: var(--bg-secondary);
        }
        .btn-add-to-cart-page, .btn-buy-now-page, .btn-share-page {
          padding: 0.65rem 1.25rem;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s;
          border: none;
        }
        .btn-add-to-cart-page {
          background: var(--accent-green);
          color: #fff;
        }
        .btn-add-to-cart-page:hover { background: var(--accent-hover); transform: translateY(-2px); }
        .btn-buy-now-page {
          background: #008a72;
          color: #fff;
        }
        .btn-buy-now-page:hover { background: #007a63; transform: translateY(-2px); }
        .btn-share-page {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }
        .btn-share-page:hover { background: var(--border-color); color: var(--text-primary); }
        .product-page-details {
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .product-page-details h1, .product-page-details h2, .product-page-details h3 {
          color: var(--text-primary);
          margin: 1rem 0 0.5rem;
        }
        .product-page-details p { margin-bottom: 0.75rem; }
        .product-page-details ul, .product-page-details ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
      `}</style>
    </div>
  );
}
