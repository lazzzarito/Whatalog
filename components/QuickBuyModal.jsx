"use client";

import { useState, useEffect } from "react";
import SafeImage from "@/components/SafeImage";
import { lockBodyScroll } from "@/lib/scroll-lock";
import { useHistoryPopup } from "@/lib/use-history-popup";

const CUSTOMER_KEY = "whatalog_customer";

const defaultCustomer = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CUSTOMER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
  }
  return { name: "", phone: "", delivery: "pickup", address: "", payment: "", paymentOther: "" };
};

export default function QuickBuyModal({ product, onClose, onOrderComplete, storeConfig }) {
  const [customer, setCustomer] = useState(defaultCustomer);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedItem, setConfirmedItem] = useState(null);

  useEffect(() => {
    if (product) {
      const unlock = lockBodyScroll();
      const handler = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", handler);
      return () => {
        document.removeEventListener("keydown", handler);
        unlock();
      };
    }
  }, [product, onClose]);

  useHistoryPopup(!!product, onClose);

  if (!product) return null;

  const update = (field, value) => setCustomer((prev) => ({ ...prev, [field]: value }));

  const PAYMENT_OPTIONS = [
    "Cash USD",
    "Credit Card",
    "Debit Card",
    "Zelle",
    "PayPal",
    "Venmo",
    "Other",
  ];

  const canConfirm = customer.name && customer.phone && customer.payment && (customer.delivery === "pickup" || customer.delivery === "delivery");

  const handleConfirm = () => {
    if (!canConfirm) return;
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    setConfirmedItem({ ...product, quantity: 1 });

    const number = storeConfig.whatsappNumber.replace(/[^0-9+]/g, "");
    const price = product.priceUSD.toFixed(2);
    let message = [
      `🛒 *New Order - ${storeConfig.name}*`,
      `──────────────────────────`,
      ``,
      customer.name ? `👤 *Customer:* ${customer.name}` : null,
      customer.phone ? `📞 *Phone:* ${customer.phone}` : null,
      customer.delivery === "delivery"
        ? `📍 *Delivery:* Home delivery\n   *Address:* ${customer.address}`
        : `📍 *Pickup:* At store\n   *Address:* ${storeConfig.location}`,
      customer.payment ? `💳 *Payment:* ${customer.payment}${customer.paymentOther ? ` (${customer.paymentOther})` : ""}` : null,
      ``,
      `──────────────────────────`,
      `*Products:*`,
      `• *1x* ${product.name}`,
      `  $${product.priceUSD.toFixed(2)} → *$${price}*`,
      ``,
      `──────────────────────────`,
      `*Total:* $${price}`,
      ``,
      `Thank you! We'll confirm shortly.`,
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setConfirmed(true);
    if (onOrderComplete) onOrderComplete();
  };

  return (
    <>
      <div className="quickbuy-overlay" onClick={onClose} />
      <div className="quickbuy-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickbuy-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="quickbuy-scroll">
          {confirmed && confirmedItem ? (
            <>
              <div className="quickbuy-header" style={{ textAlign: "center" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.5rem", display: "block" }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h2 className="quickbuy-title">Order Sent!</h2>
                <p className="quickbuy-subtitle">Your order has been sent via WhatsApp.</p>
              </div>

              <div className="quickbuy-body">
                <div className="quickbuy-summary">
                  <div className="quickbuy-section">
                    <strong>Customer</strong>
                    <span>{customer.name} &mdash; {customer.phone}</span>
                    <span>{customer.delivery === "delivery" ? `Delivery: ${customer.address}` : "Pickup at store"}</span>
                    <span>Payment: {customer.payment}{customer.paymentOther ? ` (${customer.paymentOther})` : ""}</span>
                  </div>
                  <div className="quickbuy-section">
                    <strong>Item</strong>
                    <div className="quickbuy-confirmed-product">
                      <div className="quickbuy-product-image-wrapper">
                        <SafeImage src={confirmedItem.image} alt={confirmedItem.name} width={60} height={60} className="quickbuy-product-image" />
                      </div>
                      <div className="quickbuy-product-info">
                        <strong className="quickbuy-product-name">{confirmedItem.name}</strong>
                        <span className="quickbuy-product-price">${confirmedItem.priceUSD.toFixed(2)}</span>
                      </div>
                      <span style={{ fontWeight: 600, whiteSpace: "nowrap", color: "var(--text-primary)" }}>${(confirmedItem.priceUSD * confirmedItem.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="quickbuy-total">
                    <strong>Total</strong>
                    <span>${(confirmedItem.priceUSD * confirmedItem.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="quickbuy-footer">
                <button className="quickbuy-btn-secondary" onClick={onClose}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to store
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="quickbuy-header">
                <h2 className="quickbuy-title">Quick Buy</h2>
              </div>

              <div className="quickbuy-product-preview">
                <div className="quickbuy-product-image-wrapper">
                  <SafeImage src={product.image} alt={product.name} width={80} height={80} className="quickbuy-product-image" />
                </div>
                <div className="quickbuy-product-info">
                  <span className="quickbuy-product-category">{product.category}</span>
                  <strong className="quickbuy-product-name">{product.name}</strong>
                  <span className="quickbuy-product-price">${product.priceUSD.toFixed(2)}</span>
                </div>
              </div>

              <div className="quickbuy-body">
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.5 }}>
                  Fill in your details to send the order directly via WhatsApp.
                </p>

                <div className="quickbuy-form">
                  <div className="qfield">
                    <label className="qlabel">Name *</label>
                    <input className="qinput" type="text" placeholder="Your name" value={customer.name} onChange={(e) => update("name", e.target.value)} />
                  </div>
                  <div className="qfield">
                    <label className="qlabel">Phone *</label>
                    <input className="qinput" type="tel" placeholder="+1 555 XXX XXXX" value={customer.phone} onChange={(e) => update("phone", e.target.value)} />
                  </div>
                  <div className="qfield">
                    <label className="qlabel">Pickup / Delivery *</label>
                    <div className="qradio-group">
                      <label className={`qradio ${customer.delivery === "pickup" ? "active" : ""}`}>
                        <input type="radio" name="qdelivery" value="pickup" checked={customer.delivery === "pickup"} onChange={(e) => update("delivery", e.target.value)} />
                        Pick up at store
                      </label>
                      <label className={`qradio ${customer.delivery === "delivery" ? "active" : ""}`}>
                        <input type="radio" name="qdelivery" value="delivery" checked={customer.delivery === "delivery"} onChange={(e) => update("delivery", e.target.value)} />
                        Home delivery
                      </label>
                    </div>
                    {customer.delivery === "delivery" ? (
                      <input className="qinput" type="text" placeholder="Your address" value={customer.address} onChange={(e) => update("address", e.target.value)} />
                    ) : (
                      <p className="qstore-address">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.3rem", verticalAlign: "middle" }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {storeConfig.location}
                      </p>
                    )}
                  </div>
                  <div className="qfield">
                    <label className="qlabel">Payment method *</label>
                    <div className="qchip-grid">
                      {PAYMENT_OPTIONS.map((opt) => (
                        <label key={opt} className={`qchip ${customer.payment === opt ? "active" : ""}`}>
                          <input type="radio" name="qpayment" value={opt} checked={customer.payment === opt} onChange={(e) => update("payment", e.target.value)} />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {customer.payment === "Other" && (
                      <input className="qinput" type="text" placeholder="Specify payment method" value={customer.paymentOther} onChange={(e) => update("paymentOther", e.target.value)} style={{ marginTop: "0.5rem" }} />
                    )}
                  </div>
                </div>
              </div>

              <div className="quickbuy-footer">
                <button
                  className="quickbuy-btn-primary"
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  style={!canConfirm ? { opacity: 0.5 } : {}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Confirm order via WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .quickbuy-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(6px);
          z-index: 300;
        }

        .quickbuy-modal {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 310;
          background: var(--bg-primary);
          max-width: 500px;
          max-height: 90svh;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          animation: slide-up 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @media (min-width: 1024px) {
          .quickbuy-modal {
            left: auto;
            right: 1.5rem;
            max-width: 420px;
            width: min(32vw, 420px);
            max-height: 90dvh;
            height: 90dvh;
          }
        }

        .quickbuy-scroll {
          overflow-y: auto;
          flex: 1;
          min-height: 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .quickbuy-scroll::-webkit-scrollbar {
          display: none;
        }

        .quickbuy-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--bg-secondary);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          z-index: 10;
          transition: all 0.2s;
        }

        .quickbuy-close:hover {
          color: var(--text-primary);
          background: var(--border-color);
        }

        .quickbuy-header {
          padding: 2rem 1.5rem 0.5rem;
        }

        .quickbuy-title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .quickbuy-subtitle {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin: 0.25rem 0 0;
        }

        .quickbuy-product-preview {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin: 0.5rem 1.5rem 0.5rem;
          padding: 0.75rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .quickbuy-product-image-wrapper {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          flex-shrink: 0;
          background: var(--bg-primary);
        }

        .quickbuy-product-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .quickbuy-product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }

        .quickbuy-product-category {
          font-size: 0.7rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .quickbuy-product-name {
          font-size: 0.85rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quickbuy-product-price {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-green);
        }

        .quickbuy-body {
          padding: 0.5rem 1.5rem 1rem;
        }

        .quickbuy-footer {
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid var(--border-color);
          background: var(--bg-primary);
          position: sticky;
          bottom: 0;
          z-index: 1;
        }

        .quickbuy-btn-primary {
          width: 100%;
          padding: 0.85rem 1.5rem;
          border-radius: 30px;
          border: none;
          background: var(--accent-green);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: opacity 0.2s, transform 0.2s;
        }

        .quickbuy-btn-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
        }

        .quickbuy-btn-secondary {
          width: 100%;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          transition: background 0.2s;
        }

        .quickbuy-btn-secondary:hover {
          background: var(--border-color);
        }

        .quickbuy-summary {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.85rem;
        }

        .quickbuy-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: var(--text-secondary);
        }

        .quickbuy-section strong {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-primary);
        }

        .quickbuy-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .quickbuy-confirmed-product {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.4rem 0;
        }

        .quickbuy-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.5rem;
          border-top: 2px solid var(--text-primary);
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .quickbuy-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .qfield {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .qlabel {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .qinput {
          padding: 0.6rem 0.85rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          outline: none;
        }

        .qradio-group {
          display: flex;
          gap: 0.5rem;
        }

        .qradio {
          flex: 1;
          padding: 0.6rem 0.85rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .qradio input { display: none; }

        .qradio.active {
          background: var(--text-primary);
          color: var(--accent-light);
          border-color: var(--text-primary);
        }

        .qstore-address {
          font-size: 0.85rem;
          color: var(--text-secondary);
          padding: 0.4rem 0;
        }

        .qchip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .qchip {
          padding: 0.4rem 0.75rem;
          border-radius: 15px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .qchip input { display: none; }

        .qchip.active {
          background: var(--text-primary);
          color: var(--accent-light);
          border-color: var(--text-primary);
        }

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
