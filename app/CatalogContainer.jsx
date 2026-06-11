"use client";

import { useState, useEffect, useRef, useMemo, useCallback, startTransition } from "react";
import Image from "next/image";
import FilterHeader from "@/components/FilterHeader";
import MasonryGrid from "@/components/MasonryGrid";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Cart from "@/components/Cart";
import TemplateInfoModal from "@/components/TemplateInfoModal";

export default function CatalogContainer({ initialProducts, storeConfig }) {
  // ── Init cart from localStorage ──
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("whatalog_cart");
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Error reading cart from localStorage:", e);
      }
    }
    return [];
  });
  const [isClient, setIsClient] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);
  const catalogRef = useRef(null);
  const offersRef = useRef(null);

  useEffect(() => {
    startTransition(() => {
      setIsClient(true);
    });
  }, []);

  // ── Cart persistence ──
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("whatalog_cart", JSON.stringify(items));
  };

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("whatalog_cart");
  }, []);

  // ── Toast notifications ──
  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2700);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // ── Cart actions ──
  const handleAddToCart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      saveCart(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      saveCart([...cartItems, { ...product, quantity: 1 }]);
    }
    showToast(`Added: ${product.name}`);
  };

  const handleUpdateQty = (id, qty) => {
    if (qty <= 0) {
      handleRemoveItem(id);
    } else {
      saveCart(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item
        )
      );
      showToast("Quantity updated");
    }
  };

  const handleRemoveItem = (id) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    saveCart(cartItems.filter((item) => item.id !== id));
    if (itemToRemove) {
      showToast(`Removed: ${itemToRemove.name}`);
    }
  };

  // ── Category, search & sort state ──
  const categories = useMemo(() => {
    return Array.from(new Set(initialProducts.map((p) => p.category)));
  }, [initialProducts]);

  const scrollInProgressRef = useRef(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
  }, []);

  const handleSearchChange = useCallback((q) => {
    setSearchQuery(q);
    if (q && !scrollInProgressRef.current) {
      scrollInProgressRef.current = true;
      setTimeout(() => {
        catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        scrollInProgressRef.current = false;
      }, 350);
    }
  }, []);

  // ── Only scroll to catalog when category actually changes ──
  const prevCategoryRef = useRef(activeCategory);
  useEffect(() => {
    if (activeCategory !== prevCategoryRef.current) {
      prevCategoryRef.current = activeCategory;
      if (!scrollInProgressRef.current) {
        scrollInProgressRef.current = true;
        setTimeout(() => {
          catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          scrollInProgressRef.current = false;
        }, 350);
      }
    }
  }, [activeCategory]);

  // ── Filter + sort logic ──
  const sortedProducts = useMemo(() => {
    const filtered = initialProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !cleanQuery ||
        product.name.toLowerCase().includes(cleanQuery) ||
        product.category.toLowerCase().includes(cleanQuery) ||
        (product.description && product.description.toLowerCase().includes(cleanQuery));
      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "featured") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "price-asc") {
        return a.priceUSD - b.priceUSD;
      }
      if (sortBy === "price-desc") {
        return b.priceUSD - a.priceUSD;
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [initialProducts, activeCategory, searchQuery, sortBy]);

  // ── Infinite scroll ──
  const initialLoad = 12;
  const [visibleLimit, setVisibleLimit] = useState(initialLoad);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    startTransition(() => {
      setVisibleLimit(initialLoad);
      setHasMore(sortedProducts.length > initialLoad);
    });
  }, [searchQuery, activeCategory, sortBy, sortedProducts.length]);

  const loaderRef = useRef(null);

  // ── IntersectionObserver for load-more trigger ──
  useEffect(() => {
    if (!hasMore) return;

    const el = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleLimit((prev) => {
              const nextLimit = prev + 8;
              if (nextLimit >= sortedProducts.length) {
                setHasMore(false);
              }
              return nextLimit;
            });
            setLoadingMore(false);
          }, 600);
        }
      },
      { threshold: 0.1 }
    );

    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [hasMore, loadingMore, sortedProducts.length]);

  // ── Promo & offer sections ──
  const promoBanners = storeConfig.promoBanners || [];

  const offerProducts = useMemo(() => {
    return initialProducts.filter((p) => p.offer).map((p) => ({ ...p, ratioClass: "ratio-square" }));
  }, [initialProducts]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handlePromoClick = useCallback((index) => {
    const links = storeConfig.promoLinks || [];
    const link = links[index];
    if (!link) return;
    if (link.type === "section" && link.target === "offers") {
      offersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (link.type === "product") {
      const product = initialProducts.find((p) => p.id === link.target);
      if (product) setSelectedProduct(product);
    }
  }, [storeConfig, initialProducts]);

  const visibleProducts = sortedProducts.slice(0, visibleLimit);

  return (
    <>
      <FilterHeader
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        storeConfig={storeConfig}
      />

      {toast && (
        <div className="toast-notification success">
          <span>{toast}</span>
        </div>
      )}

      {/* ── Main content: promos, offers, product grid ── */}
      <main className="main-container">
        {promoBanners[0] && (
          <div className="promo-grid">
            <div className="promo-grid-landscape" onClick={() => handlePromoClick(0)} style={{ cursor: "pointer" }}>
              <Image src={promoBanners[0]} alt="Promotion" fill className="promo-grid-img" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="promo-grid-squares">
              {promoBanners[1] && (
                <div className="promo-grid-square" onClick={() => handlePromoClick(1)} style={{ cursor: "pointer" }}>
                  <Image src={promoBanners[1]} alt="Promotion" fill className="promo-grid-img" sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
              )}
              {promoBanners[2] && (
                <div className="promo-grid-square" onClick={() => handlePromoClick(2)} style={{ cursor: "pointer" }}>
                  <Image src={promoBanners[2]} alt="Promotion" fill className="promo-grid-img" sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
              )}
            </div>
          </div>
        )}

        {offerProducts.length > 0 && (
          <section className="featured-section" ref={offersRef}>
            <h2 className="featured-title">
              Flash Offers
            </h2>
            <div className="featured-grid">
              {offerProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpenDetails={setSelectedProduct}
                />
              ))}
            </div>
          </section>
        )}

        <div ref={catalogRef}>
          <h2 className="featured-title" style={{ marginTop: offerProducts.length > 0 ? "2.5rem" : 0 }}>Available Products</h2>
          {visibleProducts.length > 0 ? (
            <MasonryGrid>
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpenDetails={setSelectedProduct}
                />
              ))}
            </MasonryGrid>
          ) : (
            <div className="cart-empty-message" style={{ marginTop: "4rem" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3>No products found</h3>
              <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>
                Try different search terms or change category.
              </p>
              {(searchQuery || activeCategory !== "all") && (
                <button
                  className="category-btn active"
                  onClick={() => {
                    setSearchQuery("");
                    handleCategoryChange("all");
                  }}
                  style={{ marginTop: "1.5rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {hasMore && (
          <div ref={loaderRef} className="infinite-scroll-trigger">
            <div className="dot-loader">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
      </main>

      {isClient && (
        <Cart
          cartItems={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={clearCart}
          storeConfig={storeConfig}
        />
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <TemplateInfoModal />

      <style jsx global>{`
        .promo-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
          margin: 0 0 1.25rem 0;
          container-type: inline-size;
        }

        .promo-grid-landscape {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .promo-grid-squares {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          width: auto;
        }

        .promo-grid-square {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .promo-grid-img {
          object-fit: cover;
        }

        @media (min-width: 769px) {
          .promo-grid {
            grid-template-columns: 1fr auto;
            gap: 0.5rem;
            margin: 0 0 2rem 0;
          }

          .promo-grid-landscape {
            min-width: 0;
          }

          .promo-grid-squares {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .promo-grid-square {
            flex: 1;
            width: 100%;
          }

          @container (min-width: 0px) {
            .promo-grid-squares {
              width: calc((9 / 41) * 100cqw - 0.3049rem);
            }
          }
        }
      `}</style>

      {/* ── Footer with map & social links ── */}
      <footer className="app-footer-minimal">
        <div className="footer-map-card">
          <div className="footer-map-frame">
            <iframe
              title="Store location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.2315394774677!2d-80.19178818465261!3d25.76167978363209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b4a1b1b1b1b1%3A0x1b1b1b1b1b1b1b1b!2sMiami%2C%20FL%2C%20USA!5e0!3m2!1sen!2sus!4v1710000000000"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-hidden="false"
              allowFullScreen
            />
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="app-footer-copyright">
            &copy; {new Date().getFullYear()} Whatalog. All rights reserved.
            <br />
            <button
              className="footer-template-link"
              onClick={() => window.dispatchEvent(new CustomEvent("open-template-modal"))}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              What is this? — Template info
            </button>
          </div>
          <div className="social-links">
            <a href="https://github.com/lazzzarito/Whatalog" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9+]/g, "")}`} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
