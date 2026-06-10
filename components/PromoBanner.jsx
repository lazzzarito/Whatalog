"use client";

import Image from "next/image";

export default function PromoBanner({ src, alt = "" }) {
  if (!src) return null;

  return (
    <div className="promo-banner-wrapper">
      <div className="promo-banner-image-container">
        <Image
          src={src}
          alt={alt}
          fill
          className="promo-banner-image"
          sizes="(max-width: 768px) 100vw, 1400px"
        />
      </div>
      <style jsx global>{`
        .promo-banner-wrapper {
          width: 100%;
          margin: 2rem 0;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .promo-banner-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
        }

        .promo-banner-image {
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .promo-banner-wrapper {
            margin: 1.25rem 0;
            border-radius: var(--radius-sm);
          }
        }
      `}</style>
    </div>
  );
}
