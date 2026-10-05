"use client";

import React, { useState } from "react";
import { EstadoHorarioTienda, HorariosConfig } from "@/lib/horarios";
import { ModalHorariosSemanal } from "./ModalHorariosSemanal";

interface AlertaLocalCerradoProps {
  estado: EstadoHorarioTienda;
  config?: HorariosConfig | null;
  className?: string;
  theme?: "light" | "dark";
}

export function AlertaLocalCerrado({
  estado,
  config,
  className = "",
  theme = "light",
}: AlertaLocalCerradoProps) {
  const [modalAbierto, setModalAbierto] = useState(false);

  if (estado.estaAbierto) return null;

  const esOscuro = theme === "dark";

  return (
    <>
      <div
        className={`rounded-3xl p-4 sm:p-5 border select-none transition-all shadow-md ${
          esOscuro
            ? "bg-rose-950/40 border-rose-500/40 text-rose-100"
            : "bg-rose-50 border-rose-200 text-rose-950"
        } ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-xl shrink-0">
            ⛔
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-rose-500 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                Local Fuera de Horario
              </span>
              <button
                type="button"
                onClick={() => setModalAbierto(true)}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline flex items-center gap-1 cursor-pointer"
              >
                <span>📅 Ver Horarios</span>
              </button>
            </div>

            <h4 className="text-sm sm:text-base font-black leading-tight">
              {estado.subtitulo || "No estamos tomando pedidos en este momento"}
            </h4>

            <p className="text-xs opacity-90 leading-relaxed">
              Atendemos de <strong>Martes a Domingos de 20:00 a 23:00 hs</strong>. Podés mirar la carta, pero la confirmación de pedidos estará disponible cuando abramos.
            </p>

            {estado.proximaApertura && (
              <div
                className={`mt-2 p-2.5 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                  esOscuro
                    ? "bg-rose-900/30 border-rose-500/30 text-rose-200"
                    : "bg-white/90 border-rose-200 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <span>
                    Próxima apertura:{" "}
                    <strong>
                      {estado.proximaApertura.esHoy
                        ? `Hoy a las ${estado.proximaApertura.hora} hs`
                        : estado.proximaApertura.esManana
                        ? `Mañana a las ${estado.proximaApertura.hora} hs`
                        : `${estado.proximaApertura.diaNombre} a las ${estado.proximaApertura.hora} hs`}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalHorariosSemanal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        config={config}
        estado={estado}
      />
    </>
  );
}
