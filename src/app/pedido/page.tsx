"use client";

import { useState } from "react";
import { useTiendaStore } from "@/lib/store";
import { generarMensajeWhatsApp } from "@/lib/whatsapp";
import Link from "next/link";

export default function PedidoPage() {
  const {
    cliente,
    pizzas,
    bebidas,
    tipoEntrega,
    domicilioEntrega,
    setTipoEntrega,
    setDomicilioEntrega,
    calcularTotal,
    vaciarCarrito,
  } = useTiendaStore();

  const [domicilio, setDomicilio] = useState(domicilioEntrega || cliente?.domicilio || "");
  const [confirmado, setConfirmado] = useState(false);
  const total = calcularTotal();

  const handleConfirmar = () => {
    if (tipoEntrega === "delivery" && !domicilio.trim()) {
      alert("Por favor ingresá tu dirección para el delivery");
      return;
    }
    setDomicilioEntrega(domicilio);
    setConfirmado(true);
  };

  const urlWhatsApp = generarMensajeWhatsApp(
    cliente,
    pizzas,
    bebidas,
    tipoEntrega,
    domicilio,
    total
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#14532d] p-4 flex items-center justify-center select-none">
      <div className="max-w-md w-full bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(20,83,45,0.08)] fade-in-up">
        {!confirmado ? (
          <div>
            <div className="text-center mb-6">
              <span className="text-4xl inline-block mb-1">🛵</span>
              <h2 className="text-2xl font-black text-[#14532d]">Confirmar Pedido</h2>
              <p className="text-xs text-[#4b6b55] mt-1">Elegí la modalidad de entrega</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4b6b55] mb-2">
                  Tipo de entrega:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoEntrega("delivery")}
                    className={`py-3 px-4 rounded-2xl border text-xs font-extrabold transition-all flex flex-col items-center gap-1 ${
                      tipoEntrega === "delivery"
                        ? "bg-[#15803d] border-[#15803d] text-white shadow-md shadow-emerald-700/20"
                        : "bg-[#f8fafc] border-emerald-200 text-[#4b6b55] hover:bg-emerald-50"
                    }`}
                  >
                    <span className="text-lg">🛵</span>
                    <span>Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoEntrega("retiro")}
                    className={`py-3 px-4 rounded-2xl border text-xs font-extrabold transition-all flex flex-col items-center gap-1 ${
                      tipoEntrega === "retiro"
                        ? "bg-[#15803d] border-[#15803d] text-white shadow-md shadow-emerald-700/20"
                        : "bg-[#f8fafc] border-emerald-200 text-[#4b6b55] hover:bg-emerald-50"
                    }`}
                  >
                    <span className="text-lg">🏪</span>
                    <span>Retiro en Local</span>
                  </button>
                </div>
              </div>

              {tipoEntrega === "delivery" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4b6b55] mb-1">
                    Dirección de entrega:
                  </label>
                  <input
                    type="text"
                    value={domicilio}
                    onChange={(e) => setDomicilio(e.target.value)}
                    required
                    placeholder="Calle, número, depto..."
                    className="w-full bg-[#f8fafc] border border-emerald-200 rounded-2xl px-4 py-3 text-[#14532d] text-xs focus:outline-none focus:border-[#15803d] transition-all font-medium"
                  />
                </div>
              )}

              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex justify-between items-center">
                <span className="text-xs font-bold text-[#4b6b55]">Total a pagar:</span>
                <span className="text-2xl font-black text-[#15803d] font-mono">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirmar}
                className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#15803d] to-[#16a34a] shadow-lg shadow-emerald-700/25 hover:brightness-105 active:scale-[0.98] transition-all"
              >
                Enviar Pedido por WhatsApp 💬
              </button>

              <div className="text-center pt-2">
                <Link href="/menu" className="text-xs font-bold text-[#4b6b55] hover:text-[#14532d]">
                  ← Modificar carrito
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <span className="text-5xl inline-block mb-3">✅</span>
            <h3 className="text-2xl font-black text-[#14532d] mb-2">
              ¡Pedido Confirmado!
            </h3>
            <p className="text-xs text-[#4b6b55] mb-6 leading-relaxed">
              Tu pedido fue formateado. Al presionar el botón se abrirá WhatsApp con el detalle directo para la cocina de 0600Boston.
            </p>

            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => vaciarCarrito()}
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#15803d] to-[#16a34a] shadow-lg shadow-emerald-700/25 hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <span>Abrir WhatsApp Ahora</span>
              <span className="text-base">💬</span>
            </a>

            <div className="mt-4">
              <Link
                href="/"
                className="text-xs font-bold text-[#4b6b55] hover:text-[#14532d]"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}