"use client";

import React from "react";
import { HorariosConfig, HORARIOS_DEFAULT, EstadoHorarioTienda } from "@/lib/horarios";

interface ModalHorariosSemanalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: HorariosConfig | null;
  estado?: EstadoHorarioTienda;
}

export function ModalHorariosSemanal({
  isOpen,
  onClose,
  config,
  estado,
}: ModalHorariosSemanalProps) {
  if (!isOpen) return null;

  const cfg = config || HORARIOS_DEFAULT;
  const dias = cfg.dias && cfg.dias.length > 0 ? cfg.dias : HORARIOS_DEFAULT.dias;
  const diaHoyIndex = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.

  // Ordenar de Lunes a Domingo para presentación visual
  const diasOrdenados = [...dias].sort((a, b) => {
    const ordenA = a.dia === 0 ? 7 : a.dia;
    const ordenB = b.dia === 0 ? 7 : b.dia;
    return ordenA - ordenB;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-[#131d2a] border border-emerald-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-white space-y-4">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⏰</span>
            <div>
              <h3 className="text-base font-black text-white">
                Horarios de Atención
              </h3>
              <p className="text-[11px] text-slate-400">
                0600Boston • Pizzas Artesanales
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-sm bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Estado en Tiempo Real */}
        {estado && (
          <div
            className={`p-3 rounded-2xl border flex items-center gap-3 ${
              estado.estaAbierto
                ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
                : "bg-rose-950/50 border-rose-500/40 text-rose-200"
            }`}
          >
            <span className="text-2xl">{estado.estaAbierto ? "🟢" : "🔴"}</span>
            <div className="flex-1">
              <span className="text-xs font-black block">
                {estado.estaAbierto ? "¡Ahora estamos ABIERTOS!" : "Actualmente CERRADO"}
              </span>
              <p className="text-[11px] opacity-90">{estado.subtitulo}</p>
            </div>
          </div>
        )}

        {/* Tabla de Días Semanales */}
        <div className="space-y-1.5 pt-1">
          {diasOrdenados.map((d) => {
            const esHoy = d.dia === diaHoyIndex;
            return (
              <div
                key={d.dia}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                  esHoy
                    ? "bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 font-bold"
                    : "bg-white/5 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{d.abierto ? "🍕" : "💤"}</span>
                  <span>{d.nombre}</span>
                  {esHoy && (
                    <span className="text-[9px] bg-emerald-400/20 text-emerald-300 uppercase px-1.5 py-0.5 rounded-full font-bold">
                      Hoy
                    </span>
                  )}
                </div>

                <div className="font-mono text-[11px]">
                  {d.abierto ? (
                    <span className="text-white font-semibold">
                      {d.apertura} a {d.cierre} hs
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Cerrado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {cfg.mensajePersonalizado && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200">
            <strong>Nota del local:</strong> {cfg.mensajePersonalizado}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
