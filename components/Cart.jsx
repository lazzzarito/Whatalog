"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { lockBodyScroll } from "@/lib/scroll-lock";

export default function Cart({ cartItems, onUpdateQty, onRemoveItem, onClearCart, storeConfig }) {
  // ── Drawer state + form fields ──
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", delivery: "pickup", address: "", payment: "", paymentOther: "" });

  useEffect(() => {
    if (isOpen) {
      return lockBodyScroll();
    }
  }, [isOpen]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalUSD = cartItems.reduce((acc, item) => acc + item.priceUSD * item.quantity, 0);

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

  // ── Build order message and return WhatsApp link ──
  const getWhatsAppLink = () => {
    const number = storeConfig.whatsappNumber.replace(/[^0-9+]/g, "");

    let message = `🛒 *New Order - ${storeConfig.name}*\n`;
    message += `──────────────────────────\n\n`;

    if (customer.name) message += `👤 *Customer:* ${customer.name}\n`;
    if (customer.phone) message += `📞 *Phone:* ${customer.phone}\n`;

    if (customer.delivery === "delivery") {
      message += `📍 *Delivery:* Home delivery\n`;
      if (customer.address) message += `   *Address:* ${customer.address}\n`;
    } else {
      message += `📍 *Pickup:* At store\n`;
      message += `   *Address:* ${storeConfig.location}\n`;
    }

    if (customer.payment) message += `💳 *Payment:* ${customer.payment}${customer.paymentOther ? ` (${customer.paymentOther})` : ""}\n`;

    message += `\n──────────────────────────\n`;
    message += `*Products:*\n`;

    cartItems.forEach((item) => {
      const itemUSD = (item.priceUSD * item.quantity).toFixed(2);
      message += `• *${item.quantity}x* ${item.name}\n`;
      if (item.attributes && Object.keys(item.attributes).length > 0) {
        const attrStr = Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(" | ");
        message += `  _${attrStr}_\n`;
      }
      message += `  $${item.priceUSD.toFixed(2)} USD → *$${itemUSD} USD*\n\n`;
    });

    message += `──────────────────────────\n`;
    message += `*Total:* $${totalUSD.toFixed(2)} USD\n\n`;
    message += `Thank you! We'll confirm shortly.`;

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  // ── Validation: all required fields must be filled ──
  const canConfirm = customer.name && customer.phone && customer.payment && (customer.delivery === "pickup" || customer.delivery === "delivery");

  return (
    <>
      <button className="floating-cart-btn" onClick={() => setIsOpen(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span>My Cart</span>
        {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
      </button>

      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(false)} />

      {/* ── Cart content: items list + checkout form ── */}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="btn-close-cart" onClick={() => setIsOpen(false)}>&times;</button>
        </div>

        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="cart-empty-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p>Your cart is empty.</p>
              <button className="category-btn" onClick={() => setIsOpen(false)} style={{ background: "var(--border-color)", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to store
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <Image src={item.image} alt={item.name} width={60} height={60} className="cart-item-image" />
                  <div className="cart-item-details">
                    <span className="cart-item-title">{item.name}</span>
                    <span className="cart-item-price">${item.priceUSD.toFixed(2)} USD</span>
                    <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
                      <div className="cart-item-qty-controls">
                        <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.quantity - 1)} title="Decrease quantity">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.quantity + 1)} title="Increase quantity">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                      <button className="btn-remove-item" onClick={() => onRemoveItem(item.id)} title="Remove product">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="cart-checkout-form">
                <h3 className="cart-checkout-title">Order Details</h3>

                <div className="checkout-field">
                  <label className="checkout-label">Name *</label>
                  <input className="checkout-input" type="text" placeholder="Your name" value={customer.name} onChange={(e) => update("name", e.target.value)} />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Phone *</label>
                  <input className="checkout-input" type="tel" placeholder="+1 555 XXX XXXX" value={customer.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Pickup / Delivery *</label>
                  <div className="checkout-radio-group">
                    <label className={`checkout-radio ${customer.delivery === "pickup" ? "active" : ""}`}>
                      <input type="radio" name="delivery" value="pickup" checked={customer.delivery === "pickup"} onChange={(e) => update("delivery", e.target.value)} />
                      Pick up at store
                    </label>
                    <label className={`checkout-radio ${customer.delivery === "delivery" ? "active" : ""}`}>
                      <input type="radio" name="delivery" value="delivery" checked={customer.delivery === "delivery"} onChange={(e) => update("delivery", e.target.value)} />
                      Home delivery
                    </label>
                  </div>
                  {customer.delivery === "delivery" ? (
                    <input className="checkout-input" type="text" placeholder="Your address" value={customer.address} onChange={(e) => update("address", e.target.value)} />
                  ) : (
                    <p className="checkout-store-address">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.3rem", verticalAlign: "middle" }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {storeConfig.location}
                    </p>
                  )}
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Payment method *</label>
                  <div className="checkout-payment-grid">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <label key={opt} className={`checkout-payment-chip ${customer.payment === opt ? "active" : ""}`}>
                        <input type="radio" name="payment" value={opt} checked={customer.payment === opt} onChange={(e) => update("payment", e.target.value)} />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {customer.payment === "Other" && (
                    <input className="checkout-input" type="text" placeholder="Specify payment method" value={customer.paymentOther} onChange={(e) => update("paymentOther", e.target.value)} style={{ marginTop: "0.5rem" }} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span className="cart-total-label">Total:</span>
              <div className="cart-total-values">
                <span className="cart-total-primary">${totalUSD.toFixed(2)} USD</span>
              </div>
            </div>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-checkout ${!canConfirm ? "btn-disabled" : ""}`}
              onClick={(e) => {
                if (!canConfirm) { e.preventDefault(); return; }
                setTimeout(() => onClearCart(), 500);
              }}
              style={!canConfirm ? { opacity: 0.5, pointerEvents: "none" } : {}}
            >
              Confirm order via WhatsApp
            </a>
          </div>
        )}
      </div>

      <style jsx global>{`
        .cart-checkout-form {
          padding: 1.5rem 0 0.5rem;
          border-top: 1px solid var(--border-color);
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-checkout-title {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .checkout-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .checkout-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .checkout-input {
          padding: 0.6rem 0.85rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          outline: none;
        }

        .checkout-radio-group {
          display: flex;
          gap: 0.5rem;
        }

        .checkout-radio {
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

        .checkout-radio input { display: none; }

        .checkout-radio.active {
          background: var(--text-primary);
          color: var(--accent-light);
          border-color: var(--text-primary);
        }

        .checkout-store-address {
          font-size: 0.85rem;
          color: var(--text-secondary);
          padding: 0.4rem 0;
        }

        .checkout-payment-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .checkout-payment-chip {
          padding: 0.4rem 0.75rem;
          border-radius: 15px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checkout-payment-chip input { display: none; }

        .checkout-payment-chip.active {
          background: var(--text-primary);
          color: var(--accent-light);
          border-color: var(--text-primary);
        }
      `}</style>
    </>
  );
}
