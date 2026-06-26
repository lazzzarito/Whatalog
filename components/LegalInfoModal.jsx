"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { lockBodyScroll } from "@/lib/scroll-lock";
import { useHistoryPopup } from "@/lib/use-history-popup";
import storeConfig from "@/content/store-config.json";

const SECTIONS = [
  {
    id: "cookies",
    title: "Cookies Policy",
    icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v2h2zm0 4h-2v6h2z",
    content: (
      <>
        <p>This website uses only <strong>essential cookies</strong> required for basic functionality. These include:</p>
        <ul>
          <li><strong>localStorage</strong> — used to persist your cart items (<code>whatalog_cart</code>), sold product counts (<code>whatalog_sold</code>), customer information (<code>whatalog_customer</code>), and favorite products (<code>whatalog_favorites</code>). All data stays in your browser and is never sent to any server.</li>
          <li><strong>Session state</strong> — React state management for UI toggles (modals, filters, search). No cookies are set for this purpose.</li>
        </ul>
        <p>The embedded Google Maps iframe may set its own cookies when you interact with the map. Google&rsquo;s cookie policy applies independently. No advertising, tracking, or third-party analytics cookies are used anywhere on this site.</p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>By continuing to browse, you consent to the use of these essential cookies and localStorage features.</p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm0-2V6.1l6-2.3v7.2c0 4.5-6 7.6-6 7.6z",
    content: (
      <>
        <p>We take your privacy seriously. This is a <strong>static website</strong> with no backend server, no database, and no user accounts.</p>
        <ul>
          <li><strong>No data collection</strong> — We do not collect, store, or share any personal information. There are no forms that send data to a server, no analytics scripts, and no tracking pixels.</li>
          <li><strong>Local storage only</strong> — Cart contents, customer details, and preferences are saved exclusively in your browser&rsquo;s <code>localStorage</code>. This data never leaves your device unless you explicitly send it via WhatsApp.</li>
          <li><strong>WhatsApp messages</strong> — When you confirm an order, the message is composed in your browser and opened via WhatsApp&rsquo;s official API (<code>wa.me</code> link). The message is sent directly through WhatsApp&rsquo;s infrastructure. We do not intercept, log, or store your conversations.</li>
          <li><strong>No cookies from us</strong> — We do not set any tracking or advertising cookies. The only browser storage used is <code>localStorage</code> (client-side only).</li>
          <li><strong>Third-party embeds</strong> — The site may display an embedded Google Maps iframe. Google may set its own cookies in accordance with its privacy policy when you interact with the map.</li>
        </ul>
      </>
    ),
  },
  {
    id: "data-usage",
    title: "Data Usage",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    content: (
      <>
        <p>The only personal data you may provide is what you enter in the checkout forms:</p>
        <ul>
          <li><strong>Name</strong> — used to address your order</li>
          <li><strong>Phone number</strong> — used by the store to contact you about your order</li>
          <li><strong>Delivery address</strong> — used only if you select home delivery</li>
          <li><strong>Payment method</strong> — your stated preference (actual payment is handled outside the site)</li>
        </ul>
        <p><strong>How it flows:</strong></p>
        <ol>
          <li>You fill in your details in the checkout form.</li>
          <li>The data is saved to <code>localStorage</code> on your device for convenience (pre-filled next time).</li>
          <li>When you confirm, a WhatsApp message is composed with your details and the order summary.</li>
          <li>You are redirected to WhatsApp where you can review and send the message.</li>
        </ol>
        <p><strong>What we do NOT do:</strong></p>
        <ul>
          <li>We do not send data to any server or API.</li>
          <li>We do not store your data in any database.</li>
          <li>We do not share your data with third parties.</li>
          <li>We do not use your data for marketing or analytics.</li>
        </ul>
      </>
    ),
  },
  {
    id: "terms",
    title: "Terms of Use",
    icon: "M16 9H8m8 4H8m4-7a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4m0-16a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4m0-16a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4",
    content: (
      <>
        <p>By using this website, you agree to the following terms:</p>
        <ul>
          <li><strong>Template purpose</strong> — This website is built on <strong>Whatalog</strong>, an open-source template for online catalogs. Products shown may be fictional or for demonstration purposes.</li>
          <li><strong>Store operator responsibility</strong> — The individual or business operating this store is solely responsible for:
            <ul>
              <li>Accuracy of product descriptions, pricing, and availability</li>
              <li>Order fulfillment, shipping, and customer service</li>
              <li>Compliance with local laws and regulations</li>
            </ul>
          </li>
          <li><strong>No affiliation</strong> — WhatsApp is a trademark of Meta Platforms, Inc. This site is not affiliated with, endorsed by, or sponsored by WhatsApp or Meta.</li>
          <li><strong>Intellectual property</strong> — All product images, names, and descriptions are the responsibility of the store operator. The Whatalog template code is licensed separately (see License section).</li>
          <li><strong>Availability</strong> — We strive to keep the site operational but do not guarantee uninterrupted access. The site may be taken offline for maintenance or at the operator&rsquo;s discretion.</li>
        </ul>
      </>
    ),
  },
  {
    id: "template",
    title: "About This Template",
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    content: (
      <>
        <p>This site is powered by <strong>Whatalog</strong>, an open-source static e-commerce template designed for small businesses and entrepreneurs.</p>
        <h4 style={{ margin: "1rem 0 0.5rem", fontSize: "0.85rem", color: "var(--text-primary)" }}>Technical Stack</h4>
        <ul>
          <li><strong>Framework:</strong> Next.js 16 (App Router) — static site generation (SSG) with Turbopack</li>
          <li><strong>Language:</strong> JavaScript (ECMAScript) with JSX</li>
          <li><strong>Styling:</strong> Tailwind CSS v4 via CSS custom properties (variables), no configuration file</li>
          <li><strong>Content:</strong> Markdown files with YAML frontmatter (<code>content/products/*.md</code>) — no database</li>
          <li><strong>State:</strong> React <code>useState</code> + <code>useEffect</code> hooks, client-side only</li>
          <li><strong>Persistence:</strong> Browser <code>localStorage</code> (cart, favorites, customer info, sold counts)</li>
          <li><strong>Orders:</strong> WhatsApp API via <code>wa.me</code> links — no backend required</li>
          <li><strong>Images:</strong> Next.js Image component with dynamic routes (<code>/api/images/*</code>)</li>
          <li><strong>Deployment:</strong> Fully static export, deployable to any static host (Vercel, Netlify, GitHub Pages, etc.)</li>
        </ul>
        <h4 style={{ margin: "1rem 0 0.5rem", fontSize: "0.85rem", color: "var(--text-primary)" }}>Key Features</h4>
        <ul>
          <li>Responsive Pinterest-style masonry product grid</li>
          <li>Product detail modal with option variants and image gallery</li>
          <li>Quick buy and floating cart with WhatsApp order integration</li>
          <li>Stock and inventory tracking (client-side)</li>
          <li>Flash offers section with discount filtering</li>
          <li>Favorites / wishlist system with animated heart toggle</li>
          <li>Promo banners with linked product collections</li>
          <li>Onboarding form for customer details</li>
          <li>Scroll-to-top floating button</li>
          <li>Dark mode support via CSS custom properties</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>
          <strong>Version:</strong> 0.1.0<br />
          <strong>Repository:</strong> <a href="https://github.com/lazzzarito/Whatalog" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-green)" }}>github.com/lazzzarito/Whatalog</a><br />
          <strong>Author:</strong>{" "}
          <a href="https://1azarito.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-green)" }}>1azarito</a>
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    content: (
      <>
        <p>This template is provided on an <strong>&ldquo;as-is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> basis without any warranties of any kind, either express or implied.</p>
        <ul>
          <li>The template author and contributors are not liable for any damages arising from the use of this template.</li>
          <li>The store operator is solely responsible for ensuring compliance with all applicable laws, regulations, and platform policies.</li>
          <li>Product information, images, and pricing displayed on this site are the responsibility of the store operator.</li>
          <li>WhatsApp message delivery depends on WhatsApp&rsquo;s infrastructure and is subject to their terms of service.</li>
          <li>Embedded maps and external services are subject to their respective providers&rsquo; terms and availability.</li>
        </ul>
      </>
    ),
  },
  {
    id: "license",
    title: "License",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    content: (
      <>
        <p>The Whatalog template is open-source software licensed under the <strong>MIT License</strong>.</p>
        <div style={{ background: "var(--bg-secondary)", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.78rem", lineHeight: 1.6, margin: "0.75rem 0", color: "var(--text-secondary)" }}>
          <p>MIT License</p>
          <p style={{ marginTop: "0.5rem" }}>Copyright &copy; {new Date().getFullYear()} 1azarito</p>
          <p style={{ marginTop: "0.5rem" }}>
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &ldquo;Software&rdquo;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    icon: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
    content: (
      <>
        <p>This site integrates with the following third-party services:</p>
        <div className="legal-service">
          <strong>WhatsApp</strong>
          <p>Used to send order messages via <code>wa.me</code> links. Your message is sent through WhatsApp&rsquo;s infrastructure. See <a href="https://www.whatsapp.com/legal" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-green)" }}>WhatsApp&rsquo;s Legal Terms</a>.</p>
        </div>
        <div className="legal-service">
          <strong>Google Maps</strong>
          <p>An embedded map shows the store location. Google may set cookies when you interact with the map. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-green)" }}>Google&rsquo;s Privacy Policy</a>.</p>
        </div>
        <div className="legal-service">
          <strong>Trustpilot</strong>
          <p>An external link to the store&rsquo;s Trustpilot profile for reviews. See <a href="https://legal.trustpilot.com/for-visitors/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-green)" }}>Trustpilot&rsquo;s Privacy Policy</a>.</p>
        </div>
        <div className="legal-service">
          <strong>Vercel</strong>
          <p>The site may be hosted on Vercel&rsquo;s platform. Vercel provides the infrastructure but does not have access to your data. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-green)" }}>Vercel&rsquo;s Privacy Policy</a>.</p>
        </div>
        <div className="legal-service">
          <strong>GitHub</strong>
          <p>The source code is hosted on GitHub. See <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-green)" }}>GitHub&rsquo;s Privacy Statement</a>.</p>
        </div>
      </>
    ),
  },
];

export default function LegalInfoModal() {
  const [visible, setVisible] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const handleClose = useCallback(() => setVisible(false), []);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("open-legal-modal", handler);
    return () => window.removeEventListener("open-legal-modal", handler);
  }, []);

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

  if (!visible) return null;

  return (
    <div className="store-info-overlay" onClick={handleClose}>
      <div className="store-info-modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "80dvh" }}>
        <button className="store-info-close" onClick={handleClose}>
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
              <h2 className="store-info-title">Legal Information</h2>
              <span className="store-info-badge">Cookies, Privacy & Terms</span>
            </div>
          </div>

          <div className="store-info-body">
            {SECTIONS.map((section) => {
              const isOpen = !!openSections[section.id];
              return (
                <div key={section.id} className="legal-section">
                  <button
                    className={`legal-section-header${isOpen ? " open" : ""}`}
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={isOpen}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.5rem", flexShrink: 0 }}>
                      <path d={section.icon} />
                    </svg>
                    <span>{section.title}</span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="legal-chevron"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <div className={`legal-section-body${isOpen ? " open" : ""}`}>
                    <div className="legal-section-content">
                      {section.content}
                    </div>
                  </div>
                </div>
              );
            })}

            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center", marginTop: "1.5rem" }}>
              Last updated: June 2026
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .legal-section {
          border-bottom: 1px solid var(--border-color);
        }

        .legal-section:last-child {
          border-bottom: none;
        }

        .legal-section-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.85rem 0;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s;
        }

        .legal-section-header:hover {
          color: var(--accent-green);
        }

        .legal-section-header span {
          flex: 1;
        }

        .legal-chevron {
          transition: transform 0.25s ease;
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .legal-section-header.open .legal-chevron {
          transform: rotate(90deg);
        }

        .legal-section-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }

        .legal-section-body.open {
          grid-template-rows: 1fr;
        }

        .legal-section-content {
          overflow: hidden;
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .legal-section-content p {
          margin-bottom: 0.5rem;
        }

        .legal-section-content ul,
        .legal-section-content ol {
          padding-left: 1.25rem;
          margin: 0.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .legal-section-content li {
          list-style-type: disc;
        }

        .legal-section-content ol li {
          list-style-type: decimal;
        }

        .legal-section-content ul ul {
          margin: 0.25rem 0 0.25rem 0.5rem;
        }

        .legal-section-content ul ul li {
          list-style-type: circle;
        }

        .legal-section-content strong {
          color: var(--text-primary);
        }

        .legal-section-content code {
          background: var(--bg-secondary);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-size: 0.78rem;
        }

        .legal-section-content a:hover {
          text-decoration: underline;
        }

        .legal-service {
          margin: 0.75rem 0;
        }

        .legal-service strong {
          display: block;
          margin-bottom: 0.15rem;
        }

        .legal-service p {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
