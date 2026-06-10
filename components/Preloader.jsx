"use client";

import { useState, useEffect } from "react";

export default function Preloader({ children }) {
  // ── Show spinner for at least 400ms before revealing content ──
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!loaded && (
        <div className="preloader-overlay">
          <div className="preloader-spinner" />
        </div>
      )}
      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {children}
      </div>
    </>
  );
}
