"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { lockBodyScroll } from "@/lib/scroll-lock";

export default function FilterHeader({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  storeConfig,
}) {
  // ── Refs & UI state ──
  const navRef = useRef(null);
  const searchInputRef = useRef(null);
  const sortMenuRef = useRef(null);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [showStoreInfo, setShowStoreInfo] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // ── Auto-scroll active category tab into view ──
  useEffect(() => {
    if (!navRef.current) return;
    const activeTab = navRef.current.querySelector(".category-btn.active");
    if (activeTab) {
      const container = navRef.current;
      const scrollLeft =
        activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
      });
    }
  }, [activeCategory]);

  // ── Focus search when mobile search activates ──
  useEffect(() => {
    if (isMobileSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchActive]);

  // ── Lock scroll & handle Escape key for modals ──
  useEffect(() => {
    if (showStoreInfo) {
      const unlock = lockBodyScroll();
      const handler = (e) => { if (e.key === "Escape") setShowStoreInfo(false); };
      document.addEventListener("keydown", handler);
      return () => {
        document.removeEventListener("keydown", handler);
        unlock();
      };
    }
  }, [showStoreInfo]);

  useEffect(() => {
    if (showSortMenu) {
      const unlock = lockBodyScroll();
      const handler = (e) => { if (e.key === "Escape") setShowSortMenu(false); };
      document.addEventListener("keydown", handler);
      return () => {
        document.removeEventListener("keydown", handler);
        unlock();
      };
    }
  }, [showSortMenu]);

  return (
    <>
      {/* ── Header bar: mobile search or brand + categories + actions ── */}
      <header className="app-header">
        {isMobileSearchActive ? (
          <div className="mobile-search-row">
            <button
              className="btn-back-header"
              onClick={() => {
                setIsMobileSearchActive(false);
                onSearchChange("");
              }}
              title="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div className="search-bar-wrapper" style={{ maxWidth: "none", flex: 1 }}>
              <span className="search-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchQuery && (
                    <button className="clear-search-btn" onClick={() => onSearchChange("")} title="Clear">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="header-main-row">
            <div className="brand-section" style={{ cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="brand-logo-container">
                <Image
                  src={storeConfig.logoUrl || "/logo.webp"}
                  alt={storeConfig.name}
                  width={36}
                  height={36}
                  className="brand-logo-image"
                  priority
                />
              </div>
            </div>

            <div className="category-nav-container" ref={navRef}>
              <nav className="category-nav">
                <div
                  ref={sortMenuRef}
                  className="icon-btn-select-wrapper category-filter-icon"
                  title="Filters"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSortMenu(true);
                  }}
                >
                  <button
                    type="button"
                    className="sort-toggle-btn"
                    aria-expanded={showSortMenu}
                    aria-label="Open filters"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="6" x2="20" y2="6"></line>
                      <line x1="4" y1="12" x2="16" y2="12"></line>
                      <line x1="4" y1="18" x2="12" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <button
                  className={`category-btn ${activeCategory === "all" ? "active" : ""}`}
                  onClick={() => onCategoryChange("all")}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${activeCategory === category ? "active" : ""}`}
                    onClick={() => onCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>

            <div className="header-right-actions">
              <div className="desktop-search-bar">
                <div className="search-bar-wrapper">
                  <span className="search-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                  {searchQuery && (
                <button className="clear-search-btn" onClick={() => onSearchChange("")} title="Clear">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <button
                className="icon-btn mobile-only-btn"
                onClick={() => setIsMobileSearchActive(true)}
                title="Search..."
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              <button
                className="icon-btn"
                onClick={() => setShowStoreInfo(true)}
                title="Store Info"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Sort / filter bottom sheet ── */}
      {showSortMenu && (
        <div className="sort-modal-overlay" onClick={() => setShowSortMenu(false)}>
          <div className="sort-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <button className="store-info-close" onClick={() => setShowSortMenu(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="store-info-header">
              <h2 className="store-info-title">Filters</h2>
              <span className="store-info-badge">Adjust your search</span>
            </div>

            <div className="store-info-body">
              <div className="store-info-section">
                <strong>Categories</strong>
                <div className="sort-modal-categories-scroll">
                  <button
                    className={`sort-category-pill ${activeCategory === "all" ? "active" : ""}`}
                    onClick={() => {
                      onCategoryChange("all");
                      setShowSortMenu(false);
                    }}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`sort-category-pill ${activeCategory === category ? "active" : ""}`}
                      onClick={() => {
                        onCategoryChange(category);
                        setShowSortMenu(false);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="store-info-section">
                <strong>Sort by</strong>
                <div className="sort-modal-options">
                  <button
                    type="button"
                    className={`sort-dropdown-option ${sortBy === "featured" ? "active" : ""}`}
                    onClick={() => {
                      onSortChange("featured");
                      setShowSortMenu(false);
                    }}
                  >
                    Featured First
                  </button>
                  <button
                    type="button"
                    className={`sort-dropdown-option ${sortBy === "price-asc" ? "active" : ""}`}
                    onClick={() => {
                      onSortChange("price-asc");
                      setShowSortMenu(false);
                    }}
                  >
                    Price: Low to High
                  </button>
                  <button
                    type="button"
                    className={`sort-dropdown-option ${sortBy === "price-desc" ? "active" : ""}`}
                    onClick={() => {
                      onSortChange("price-desc");
                      setShowSortMenu(false);
                    }}
                  >
                    Price: High to Low
                  </button>
                  <button
                    type="button"
                    className={`sort-dropdown-option ${sortBy === "name-asc" ? "active" : ""}`}
                    onClick={() => {
                      onSortChange("name-asc");
                      setShowSortMenu(false);
                    }}
                  >
                    Name: A-Z
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Store info modal ── */}
      {showStoreInfo && (
        <div className="store-info-overlay" onClick={() => setShowStoreInfo(false)}>
          <div className="store-info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="store-info-close" onClick={() => setShowStoreInfo(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="store-info-header">
              <h2 className="store-info-title">{storeConfig.name}</h2>
              <span className="store-info-badge">Online Catalog</span>
            </div>

            <div className="store-info-body">
              <div className="store-info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <strong>Location</strong>
                  <p>{storeConfig.location}</p>
                </div>
              </div>

              <div className="store-info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <div>
                  <strong>WhatsApp</strong>
                  <p>{storeConfig.whatsappNumber}</p>
                </div>
              </div>

              <div className="store-info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div>
                  <strong>Hours</strong>
                  <p>Monday - Saturday, 9:00 AM – 6:00 PM</p>
                </div>
              </div>

              <div className="store-info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <div>
                  <strong>Deliveries</strong>
                  <p>Coordinated shipping in Miami area</p>
                </div>
              </div>
            </div>

            <div className="store-info-howto">
              <h3>How to buy?</h3>
              <ol>
                <li>Browse the catalog and tap + to add products.</li>
                <li>Open My Cart (floating button below).</li>
                <li>Tap Confirm via WhatsApp to send us your order.</li>
              </ol>
            </div>

            <div className="store-info-social">
              <a
                href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9+]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                title="WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                title="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a6 6 0 0 0-6 6v3H9v4h3v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                title="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <circle cx="17.5" cy="6.5" r="1.5"></circle>
                </svg>
              </a>
            </div>

            <a
              className="store-info-wa-btn"
              href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9+]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Contact us on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
