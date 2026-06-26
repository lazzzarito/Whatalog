"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Preloader({ children }) {
  const [loaded, setLoaded] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const handler = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
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
