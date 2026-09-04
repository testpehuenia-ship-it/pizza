"use client";

import React from "react";

export default function BackgroundVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Video Real de Portada 0600Boston Nítido y de Colores Vivos */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover select-none"
        style={{
          filter: "contrast(1.1) saturate(1.2) brightness(1.02)",
        }}
      >
        <source src="/videos/portadapizza.mp4" type="video/mp4" />
      </video>

      {/* Degradado inferior sutil únicamente para contraste de botones sin difuminado ni biselado */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}