"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Preloader({ children }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!loaded && (
        <div className="preloader-overlay">
          <div className="preloader-ring">
            <div className="preloader-logo-wrapper">
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={56}
                height={56}
                className="preloader-logo"
                priority
              />
            </div>
          </div>
        </div>
      )}
      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {children}
      </div>
    </>
  );
}
