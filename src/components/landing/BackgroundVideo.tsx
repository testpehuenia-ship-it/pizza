"use client";

import React from "react";

export default function BackgroundVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f4f6f0]">
      {/* Video Real de Portada 0600Boston */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-90 scale-105"
      >
        <source src="/videos/portadapizza.mp4" type="video/mp4" />
      </video>

      {/* Overlay translúcido limpio y elegante */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/30 to-black/20 pointer-events-none" />
    </div>
  );
}