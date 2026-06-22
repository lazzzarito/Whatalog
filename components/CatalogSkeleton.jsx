"use client";

export default function CatalogSkeleton() {
  return (
    <div className="catalog-skeleton">
      {/* Header */}
      <div className="sk-header">
        <div className="sk-row">
          <div className="sk-logo" />
          <div className="sk-categories">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="sk-pill" />)}
          </div>
          <div className="sk-actions">
            <div className="sk-icon" />
            <div className="sk-icon" />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="sk-content">
        {/* Promo section */}
        <div className="sk-promo-grid">
          <div className="sk-promo-landscape skeleton" />
          <div className="sk-promo-squares">
            <div className="sk-promo-square skeleton" />
            <div className="sk-promo-square skeleton" />
          </div>
        </div>

        {/* Flash Offers section */}
        <div className="sk-section">
          <div className="sk-section-title skeleton" />
          <div className="sk-grid">
            <div className="sk-card sk-card-tall skeleton" />
            <div className="sk-card sk-card-square skeleton" />
            <div className="sk-card sk-card-wide skeleton" />
            <div className="sk-card sk-card-square skeleton" />
          </div>
        </div>

        {/* Available Products section */}
        <div className="sk-section">
          <div className="sk-section-title skeleton" />
          <div className="sk-grid">
            <div className="sk-card sk-card-tall skeleton" />
            <div className="sk-card sk-card-square skeleton" />
            <div className="sk-card sk-card-wide skeleton" />
            <div className="sk-card sk-card-square skeleton" />
            <div className="sk-card sk-card-tall skeleton" />
            <div className="sk-card sk-card-square skeleton" />
            <div className="sk-card sk-card-wide skeleton" />
            <div className="sk-card sk-card-square skeleton" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .catalog-skeleton {
          animation: sk-fade-in 0.3s ease both;
        }
        .sk-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          padding: 0.5rem 1.5rem;
        }
        .sk-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .sk-logo {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-secondary);
          flex-shrink: 0;
        }
        .sk-categories {
          display: flex;
          gap: 0.4rem;
          flex: 1;
        }
        .sk-pill {
          height: 28px;
          width: 60px;
          border-radius: 15px;
          background: var(--bg-secondary);
        }
        .sk-actions {
          display: flex;
          gap: 0.5rem;
        }
        .sk-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-secondary);
        }
        .sk-content {
          max-width: 1400px;
          margin: 82px auto 0;
          padding: 2rem;
        }
        .sk-promo-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
        }
        .sk-promo-landscape {
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-md);
        }
        .sk-promo-squares {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .sk-promo-square {
          aspect-ratio: 1;
          border-radius: var(--radius-md);
        }
        .sk-section {
          margin-bottom: 3rem;
        }
        .sk-section-title {
          height: 28px;
          width: 260px;
          border-radius: 6px;
          margin-bottom: 1.25rem;
        }
        .sk-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .sk-card {
          border-radius: var(--radius-md);
          width: 100%;
        }
        .sk-card-tall { aspect-ratio: 3 / 4; }
        .sk-card-square { aspect-ratio: 1; }
        .sk-card-wide { aspect-ratio: 4 / 3; }

        @keyframes sk-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (min-width: 768px) {
          .sk-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }
          .sk-content {
            padding: 2rem;
          }
          .sk-promo-grid {
            grid-template-columns: 1fr auto;
          }
          .sk-promo-squares {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
        }
        @media (max-width: 768px) {
          .sk-content {
            margin-top: 52px;
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
