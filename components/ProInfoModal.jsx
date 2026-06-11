"use client";

import { useEffect } from "react";
import { lockBodyScroll } from "@/lib/scroll-lock";

export default function ProInfoModal({ visible, onClose }) {
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
          <h2 className="store-info-title">Whatalog Pro</h2>
          <span className="store-info-badge">Coming Soon</span>
        </div>

        <div className="store-info-body">
          <div className="store-info-howto" style={{ textAlign: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 1rem", display: "block" }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <h3>Premium features in development</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "0.5rem" }}>
              Whatalog Pro will include multi-language support (automatic UI translation), advanced analytics dashboard,
              bulk product import/export, custom themes, priority support, and more.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "1rem" }}>
              Stay tuned — early access and pricing details will be announced soon.
            </p>
          </div>

          <div className="store-info-social">
            <a
              href="https://github.com/lazzzarito/Whatalog"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              title="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://github.com/lazzzarito/Whatalog/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              title="Submit feedback"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
