"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function CerradoPage() {
  useEffect(() => {
    // Intentar cerrar la pestaña / app automáticamente al ingresar
    try {
      window.close();
    } catch {}
  }, []);

  const handleCerrarVentana = () => {
    try {
      window.close();
    } catch {}
    try {
      window.open("", "_self");
      window.close();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0a0f17] text-white flex items-center justify-center p-4 select-none">
      <div className="max-w-md w-full bg-[#131d2a] border border-red-500/30 rounded-3xl p-8 text-center shadow-[0_20px_50px_rgba(239,68,68,0.15)] space-y-5 fade-in-up">
        {/* Icono de Salida Destacado */}
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center text-4xl shadow-inner animate-pulse-subtle">
          🚪
        </div>

        <div>
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/15 px-3 py-1 rounded-full border border-red-500/30 mb-3">
            Aplicación Cerrada
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            ¡Gracias por visitarnos!
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Has salido de <strong>0600Boston</strong>. Tu sesión y pedidos activos han finalizado y la aplicación se ha cerrado.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <button
            type="button"
            onClick={handleCerrarVentana}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black shadow-lg shadow-red-700/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🚪</span>
            <span>Cerrar esta Ventana / Pestaña</span>
          </button>

          <Link
            href="/"
            className="block w-full py-3 px-4 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition-all text-center"
          >
            🍀 Volver a Abrir la App
          </Link>
        </div>
      </div>
    </div>
  );
}
