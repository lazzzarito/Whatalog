"use client";

import { useState, useEffect, useRef } from "react";
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

export default function Cart({ cartItems, onUpdateQty, onRemoveItem, onClearCart, storeConfig, onOrderComplete, isFooterVisible, scrollToTop }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState(defaultCustomer);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedItems, setConfirmedItems] = useState(null);
  const prevOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevOpen.current) {
      setStep(1);
      setConfirmed(false);
      setConfirmedItems(null);
    }
    prevOpen.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      return lockBodyScroll();
    }
  }, [isOpen]);

  useHistoryPopup(isOpen, () => setIsOpen(false));

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
      if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
        const optStr = Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(" | ");
        message += `  _${optStr}_\n`;
      } else if (item.attributes && Object.keys(item.attributes).length > 0) {
        const attrStr = Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(" | ");
        message += `  _${attrStr}_\n`;
      }
      message += `  $${item.priceUSD.toFixed(2)} → *$${itemUSD}*\n\n`;
    });
    message += `──────────────────────────\n`;
    message += `*Total:* $${totalUSD.toFixed(2)}\n\n`;
    message += `Thank you! We'll confirm shortly.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  const canConfirm = customer.name && customer.phone && customer.payment && (customer.delivery === "pickup" || customer.delivery === "delivery");

  const handleConfirm = (e) => {
    if (!canConfirm) { e.preventDefault(); return; }
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    setConfirmedItems(cartItems.map((item) => ({ ...item })));
    setConfirmed(true);
    if (onOrderComplete) onOrderComplete();
    setTimeout(() => onClearCart(), 300);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const showingConfirm = confirmed && confirmedItems;
  const itemsToShow = showingConfirm ? confirmedItems : [];

  return (
    <>
      <button
        className={`floating-cart-btn${isFooterVisible ? " scroll-top" : ""}`}
        onClick={isFooterVisible ? scrollToTop : () => setIsOpen(true)}
      >
        <span className="cart-btn-icon">
          {isFooterVisible ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          )}
        </span>
        <span className="cart-btn-text">My Cart</span>
        {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
      </button>

      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={handleClose} />

      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          {step === 2 && !confirmed && (
            <button className="btn-back-step" onClick={() => setStep(1)} title="Back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
          )}
          <h2>{confirmed ? "Order Confirmed" : step === 1 ? "Your Cart" : "Your Details"}</h2>
          <button className="btn-close-cart" onClick={handleClose}>&times;</button>
        </div>

        {!confirmed && (
        <div className="cart-step-indicator">
          <span className={`cart-step-dot ${step === 1 ? "active" : ""} ${step > 1 ? "done" : ""}`} />
          <span className="cart-step-line" />
          <span className={`cart-step-dot ${step === 2 ? "active" : ""}`} />
        </div>
        )}

        <div className="cart-items-container">
          {showingConfirm ? (
            <>
              <div className="cart-confirmed">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3>Order Sent!</h3>
                <p>Your order has been sent via WhatsApp.<br />We will confirm shortly.</p>

                <div className="cart-confirmed-details">
                  <div className="cart-confirmed-section">
                    <strong>Customer</strong>
                    <span>{customer.name} — {customer.phone}</span>
                    <span>{customer.delivery === "delivery" ? `Delivery: ${customer.address}` : "Pickup at store"}</span>
                    <span>Payment: {customer.payment}{customer.paymentOther ? ` (${customer.paymentOther})` : ""}</span>
                  </div>

                  <div className="cart-confirmed-section">
                    <strong>Items</strong>
                    {itemsToShow.map((item) => (
                      <div className="cart-confirmed-product" key={item.id}>
                        <div className="cart-confirmed-product-image-wrapper">
                          <SafeImage src={item.image} alt={item.name} width={60} height={60} className="cart-confirmed-product-image" />
                        </div>
                        <div className="cart-confirmed-product-info">
                          {item.category && <span className="cart-confirmed-product-category">{item.category}</span>}
                          <strong className="cart-confirmed-product-name">{item.quantity}x {item.name}</strong>
                          {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "block", marginTop: "0.1rem" }}>
                              {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                            </span>
                          )}
                          <span className="cart-confirmed-product-price">${item.priceUSD.toFixed(2)}</span>
                        </div>
                        <span className="cart-confirmed-product-total">${(item.priceUSD * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="cart-confirmed-total">
                    <strong>Total</strong>
                    <span>${itemsToShow.reduce((s, i) => s + i.priceUSD * i.quantity, 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="cart-footer">
                <button className="btn-back-store" onClick={handleClose}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to store
                </button>
              </div>
            </>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p>Your cart is empty.</p>
              <button className="btn-back-store" onClick={handleClose}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to store
              </button>
            </div>
          ) : step === 1 ? (
            <>
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image-wrapper">
                    <SafeImage src={item.image} alt={item.name} width={80} height={80} className="cart-item-image" />
                  </div>
                  <div className="cart-item-details">
                    {item.category && <span className="cart-item-category">{item.category}</span>}
                    <span className="cart-item-title">{item.name}</span>
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>
                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                      </span>
                    )}
                    <span className="cart-item-price">${item.priceUSD.toFixed(2)}</span>
                    <div className="cart-item-actions">
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
            </>
          ) : (
            <div className="cart-checkout-form">
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
          )}
        </div>

        {!confirmed && cartItems.length > 0 && step === 2 && (
          <div className="cart-footer">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-checkout"
              onClick={handleConfirm}
              style={!canConfirm ? { opacity: 0.5 } : {}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirm order via WhatsApp
            </a>
          </div>
        )}

        {!confirmed && cartItems.length > 0 && step === 1 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-primary">${totalUSD.toFixed(2)}</span>
            </div>
            <button className="btn-checkout" onClick={() => setStep(2)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Continue
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .btn-back-store {
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

        .btn-back-store:hover {
          background: var(--border-color);
        }

        .cart-confirmed {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1rem 1rem;
          gap: 0.75rem;
        }

        .cart-confirmed h3 {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cart-confirmed > p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .cart-confirmed-details {
          width: 100%;
          text-align: left;
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-confirmed-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .cart-confirmed-section strong {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-primary);
          margin-bottom: 0.15rem;
        }

        .cart-confirmed-product {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .cart-confirmed-product:last-child {
          border-bottom: none;
        }

        .cart-confirmed-product-image-wrapper {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          flex-shrink: 0;
          background: var(--bg-secondary);
        }

        .cart-confirmed-product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-confirmed-product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }

        .cart-confirmed-product-category {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .cart-confirmed-product-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.82rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cart-confirmed-product-price {
          color: var(--text-secondary);
          font-size: 0.78rem;
        }

        .cart-confirmed-product-total {
          font-weight: 600;
          white-space: nowrap;
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        .cart-confirmed-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.5rem;
          border-top: 2px solid var(--text-primary);
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .cart-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-back-step {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .btn-back-step:hover {
          color: var(--text-primary);
        }

        .cart-step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin: 0.75rem 0 0.5rem;
        }

        .cart-step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border-color);
          transition: all 0.3s;
        }

        .cart-step-dot.active {
          background: var(--text-primary);
          width: 10px;
          height: 10px;
        }

        .cart-step-dot.done {
          background: var(--accent-green);
        }

        .cart-step-line {
          width: 2rem;
          height: 2px;
          background: var(--border-color);
          border-radius: 1px;
        }

        .cart-checkout-form {
          padding: 1.5rem 0 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
