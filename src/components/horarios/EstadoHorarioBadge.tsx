"use client";

import React, { useState } from "react";
import { useHorarioTienda } from "@/hooks/useHorarioTienda";
import { ModalHorariosSemanal } from "./ModalHorariosSemanal";

interface EstadoHorarioBadgeProps {
  theme?: "light" | "dark";
  className?: string;
}

export function EstadoHorarioBadge({
  theme = "light",
  className = "",
}: EstadoHorarioBadgeProps) {
  const { estado, horariosConfig } = useHorarioTienda();
  const [modalAbierto, setModalAbierto] = useState(false);

  const esOscuro = theme === "dark";

  return (
    <>
      <button
        type="button"
        onClick={() => setModalAbierto(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer select-none ${
          estado.estaAbierto
            ? esOscuro
              ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              : "bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs"
            : esOscuro
            ? "bg-rose-950/70 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
            : "bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 shadow-xs"
        } ${className}`}
        title="Tocar para ver los horarios completos de atención"
      >
        {/* Indicador con pulso luminoso */}
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              estado.estaAbierto ? "bg-emerald-400" : "bg-rose-400"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              estado.estaAbierto ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
        </span>

        {/* Texto Dinámico */}
        <span className="truncate">
          {estado.estaAbierto ? (
            <span>
              <strong className="font-black">Abierto</strong> • {estado.tiempoRestanteTexto}
            </span>
          ) : (
            <span>
              <strong className="font-black">Cerrado</strong> • {estado.tiempoRestanteTexto}
            </span>
          )}
        </span>

        <span className="text-[10px] opacity-70">⏰</span>
      </button>

      <ModalHorariosSemanal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        config={horariosConfig}
        estado={estado}
      />
    </>
  );
}
