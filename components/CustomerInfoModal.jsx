"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { lockBodyScroll } from "@/lib/scroll-lock";
import { useHistoryPopup } from "@/lib/use-history-popup";
import storeConfig from "@/content/store-config.json";

const CUSTOMER_KEY = "whatalog_customer";

const defaultCustomer = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CUSTOMER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
  }
  return null;
};

const PAYMENT_OPTIONS = [
  "Cash USD",
  "Credit Card",
  "Debit Card",
  "Zelle",
  "PayPal",
  "Venmo",
  "Other",
];

export default function CustomerInfoModal() {
  const [visible, setVisible] = useState(() => !defaultCustomer());
  const [customer, setCustomer] = useState({ name: "", phone: "", delivery: "pickup", address: "", payment: "", paymentOther: "" });
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  const handleClose = useCallback(() => {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    setVisible(false);
  }, [customer]);

  useEffect(() => {
    if (visible) {
      const unlock = lockBodyScroll();
      const handler = (e) => { if (e.key === "Escape") handleClose(); };
      document.addEventListener("keydown", handler);
      return () => {
        document.removeEventListener("keydown", handler);
        unlock();
      };
    }
  }, [visible, handleClose]);

  useHistoryPopup(visible, handleClose);

  const update = (field, value) => setCustomer((prev) => ({ ...prev, [field]: value }));

  const blur = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const errors = {};
  if (!customer.name) errors.name = "What's your name?";
  if (!customer.phone) errors.phone = "We need a phone number to reach you";
  if (customer.delivery === "delivery" && !customer.address) errors.address = "Where should we deliver?";
  if (!customer.payment) errors.payment = "Pick a payment method";
  if (customer.payment === "Other" && !customer.paymentOther) errors.paymentOther = "Tell us your payment method";

  const hasErrors = Object.keys(errors).length > 0;
  const showErrors = submitted;

  if (!visible) return null;

  return (
    <div className="store-info-overlay" onClick={handleClose}>
      <div className="store-info-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px", maxHeight: "80dvh" }}>
        <button className="modal-close" onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="store-info-scroll">
          <div className="store-info-header">
            {storeConfig.logoUrl && (
              <Image src={storeConfig.logoUrl} alt={storeConfig.name} width={36} height={36} style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <h2 className="store-info-title" style={{ fontSize: "1.2rem" }}>Welcome!</h2>
              <span className="store-info-badge">Tell us about yourself</span>
            </div>
          </div>

          <div className="store-info-body">
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              Fill in your details once and they will be pre-filled every time you place an order.
            </p>

            <div className="cinfo-form">
              <div className="cinfo-field">
                <label className="cinfo-label">Name *</label>
                <input className={`cinfo-input${errors.name && showErrors ? " error" : ""}`} type="text" placeholder="Enter your full name" value={customer.name} onChange={(e) => update("name", e.target.value)} onBlur={() => blur("name")} />
                {errors.name && showErrors && <span className="cinfo-error">{errors.name}</span>}
              </div>
              <div className="cinfo-field">
                <label className="cinfo-label">Phone *</label>
                <input className={`cinfo-input${errors.phone && showErrors ? " error" : ""}`} type="tel" placeholder="e.g. +1 555 123 4567" value={customer.phone} onChange={(e) => update("phone", e.target.value)} onBlur={() => blur("phone")} />
                {errors.phone && showErrors && <span className="cinfo-error">{errors.phone}</span>}
              </div>
              <div className="cinfo-field">
                <label className="cinfo-label">Pickup / Delivery *</label>
                <div className="cinfo-radio-group">
                  <label className={`cinfo-radio ${customer.delivery === "pickup" ? "active" : ""}`}>
                    <input type="radio" name="odelivery" value="pickup" checked={customer.delivery === "pickup"} onChange={(e) => update("delivery", e.target.value)} />
                    Pick up at store
                  </label>
                  <label className={`cinfo-radio ${customer.delivery === "delivery" ? "active" : ""}`}>
                    <input type="radio" name="odelivery" value="delivery" checked={customer.delivery === "delivery"} onChange={(e) => update("delivery", e.target.value)} />
                    Home delivery
                  </label>
                </div>
                {customer.delivery === "delivery" ? (
                  <>
                    <input className={`cinfo-input${errors.address && showErrors ? " error" : ""}`} type="text" placeholder="Street, city, zip code" value={customer.address} onChange={(e) => update("address", e.target.value)} onBlur={() => blur("address")} />
                    {errors.address && showErrors && <span className="cinfo-error">{errors.address}</span>}
                  </>
                ) : (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", padding: "0.4rem 0", margin: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.3rem", verticalAlign: "middle" }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {storeConfig.location}
                  </p>
                )}
              </div>
              <div className="cinfo-field">
                <label className="cinfo-label">Payment method *</label>
                <div className="cinfo-chip-grid">
                  {PAYMENT_OPTIONS.map((opt) => (
                    <label key={opt} className={`cinfo-chip ${customer.payment === opt ? "active" : ""}`}>
                      <input type="radio" name="opayment" value={opt} checked={customer.payment === opt} onChange={(e) => { update("payment", e.target.value); blur("payment"); }} />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.payment && showErrors && <span className="cinfo-error">{errors.payment}</span>}
                {customer.payment === "Other" && (
                  <>
                    <input className={`cinfo-input${errors.paymentOther && showErrors ? " error" : ""}`} type="text" placeholder="Describe your payment method" value={customer.paymentOther} onChange={(e) => update("paymentOther", e.target.value)} onBlur={() => blur("paymentOther")} style={{ marginTop: "0.5rem" }} />
                    {errors.paymentOther && showErrors && <span className="cinfo-error">{errors.paymentOther}</span>}
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <button
                className="cinfo-btn"
                onClick={() => {
                  setSubmitted(true);
                  if (!hasErrors) handleClose();
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Start shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .cinfo-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cinfo-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .cinfo-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .cinfo-input {
          padding: 0.6rem 0.85rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .cinfo-input:focus {
          border-color: var(--accent-green);
        }

        .cinfo-input.error {
          border-color: #e74c3c;
        }

        .cinfo-error {
          font-size: 0.72rem;
          color: #e74c3c;
          font-weight: 500;
          line-height: 1.3;
        }

        .cinfo-radio-group {
          display: flex;
          gap: 0.5rem;
        }

        .cinfo-radio {
          flex: 1;
          padding: 0.6rem 0.85rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .cinfo-radio input { display: none; }

        .cinfo-radio.active {
          background: var(--text-primary);
          color: var(--bg-primary);
          border-color: var(--text-primary);
        }

        .cinfo-chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .cinfo-chip {
          padding: 0.4rem 0.75rem;
          border-radius: 18px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }

        .cinfo-chip input { display: none; }

        .cinfo-chip:hover {
          border-color: var(--text-secondary);
          background: var(--border-color);
        }

        .cinfo-chip.active {
          background: var(--text-primary) !important;
          color: var(--bg-primary) !important;
          border-color: var(--text-primary) !important;
        }

        .cinfo-btn {
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
          transition: opacity 0.2s, background 0.2s;
        }

        .cinfo-btn:hover:not(:disabled) {
          background: var(--accent-hover);
        }

        .cinfo-btn:disabled {
          cursor: default;
        }
      `}</style>
    </div>
  );
}
