"use client";

import { useState, useEffect, useCallback } from "react";
import { lockBodyScroll } from "@/lib/scroll-lock";
import ProInfoModal from "@/components/ProInfoModal";

const GITHUB_URL = "https://github.com/lazzzarito/Whatalog";

export default function TemplateInfoModal() {
  const [visible, setVisible] = useState(false);
  const [showPro, setShowPro] = useState(false);

  const show = useCallback(() => setVisible(true), []);

  const handleClose = useCallback(() => {
    localStorage.setItem("whatalog_template_seen", "true");
    setVisible(false);
  }, []);

  useEffect(() => {
    const seen = localStorage.getItem("whatalog_template_seen");
    if (!seen) {
      const timer = setTimeout(show, 600);
      return () => clearTimeout(timer);
    }
  }, [show]);

  useEffect(() => {
    const handler = () => show();
    window.addEventListener("open-template-modal", handler);
    return () => window.removeEventListener("open-template-modal", handler);
  }, [show]);

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

  if (!visible) return null;

  return (
    <>
    <div className="store-info-overlay" onClick={handleClose}>
      <div className="store-info-modal template-info-modal" onClick={(e) => e.stopPropagation()}>
        <button className="store-info-close" onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="store-info-header">
          <h2 className="store-info-title">Whatalog</h2>
          <span className="store-info-badge">WhatsApp Catalog Template</span>
        </div>

        <div className="store-info-body">
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            This is a <strong>free, open-source template</strong> for creating a WhatsApp-based online catalog.
            Everything you see here — products, images, store info — is demo content.
          </p>

          <div className="store-info-howto">
            <h3>Get your own copy</h3>
            <ol>
              <li><strong>Clone the repo</strong> — <code>git clone {GITHUB_URL}.git</code></li>
              <li><strong>Install dependencies</strong> — <code>npm install</code></li>
              <li><strong>Customize</strong> — edit <code>content/store-config.json</code> and add your products as <code>.md</code> files</li>
              <li><strong>Deploy</strong> — run <code>npm run build</code> and deploy anywhere (Vercel, Netlify, Railway)</li>
            </ol>
          </div>

          <div className="template-info-actions">
            <button className="template-btn-got-it" onClick={handleClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              Start browsing
            </button>
            <a href="https://github.com/lazzzarito/Whatalog/archive/refs/heads/main.zip" className="template-btn-download">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download ZIP
            </a>
            <button className="template-btn-pro" onClick={() => setShowPro(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Whatalog Pro
            </button>
          </div>
        </div>
      </div>
    </div>

    <ProInfoModal visible={showPro} onClose={() => setShowPro(false)} />
    </>
  );
}
