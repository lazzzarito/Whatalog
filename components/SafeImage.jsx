"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

export default function SafeImage({ src, fallback = "/images/placeholder.svg", alt, className, width, height, style, priority, sizes, fill }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  const imgStyle = fill
    ? { objectFit: "cover", width: "100%", height: "100%", position: "absolute", inset: 0, ...style }
    : style;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      style={imgStyle}
      sizes={sizes}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "eager"}
      onError={() => {
        if (!errored) {
          setImgSrc(fallback);
          setErrored(true);
        }
      }}
    />
  );
}
