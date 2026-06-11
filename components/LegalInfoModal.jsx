"use client";

import { useEffect } from "react";
import { lockBodyScroll } from "@/lib/scroll-lock";

export default function LegalInfoModal({ visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const unlock = lockBodyScroll();
      const handler = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", handler);
      return () => {
        document.removeEventListener("keydown", handler);
        unlock();
      };
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="store-info-overlay" onClick={onClose}>
      <div className="store-info-modal" onClick={(e) => e.stopPropagation()}>
        <button className="store-info-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="store-info-header">
          <h2 className="store-info-title">Legal Information</h2>
          <span className="store-info-badge">Cookies, Privacy & Terms</span>
        </div>

        <div className="store-info-body">

          <div className="store-info-howto">
            <h3>🍪 Cookies Policy</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              This site uses only essential cookies required for basic functionality — such as remembering your cart
              items and whether you have dismissed informational modals. No tracking, advertising, or third-party
              cookies are used unless you embed external content (e.g., Google Maps). By continuing to browse, you
              consent to the use of these essential cookies.
            </p>
          </div>

          <div className="store-info-howto">
            <h3>🔒 Privacy Policy</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              We do not collect, store, or share any personal information. Cart data is saved locally in your browser
              via <code>localStorage</code> and is never sent to any server. When you place an order via WhatsApp, the
              message is sent directly through WhatsApp&rsquo;s infrastructure — we do not intercept, log, or store your
              conversations.
            </p>
          </div>

          <div className="store-info-howto">
            <h3>📋 Data Usage</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Any information you provide (name, phone, address) is used solely to fulfill your order and is
              transmitted only through the WhatsApp message you send. No data is stored on any server, sold to third
              parties, or used for analytics. This is a static site — there is no backend database.
            </p>
          </div>

          <div className="store-info-howto">
            <h3>⚖️ Terms of Use</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              This website is a template for demonstration purposes. Products shown are fictional. The actual store
              operator is solely responsible for the accuracy of product information, pricing, and order fulfillment.
              WhatsApp is a trademark of Meta Platforms, Inc. This site is not affiliated with or endorsed by WhatsApp
              or Meta.
            </p>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center", marginTop: "1rem" }}>
            Last updated: June 2026
          </p>
        </div>
      </div>
    </div>
  );
}
