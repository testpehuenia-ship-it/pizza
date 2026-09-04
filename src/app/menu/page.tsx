"use client";

import React, { useState } from "react";
import { useTiendaStore } from "@/lib/store";
import { PIZZAS_DATA, PizzaDataType } from "@/lib/data";
import { CarruselPizzas3D } from "@/components/menu/CarruselPizzas3D";
import { AnimacionCaja } from "@/components/carrito/AnimacionCaja";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const router = useRouter();
  const {
    cliente,
    pizzas,
    bebidas,
    agregarPizza,
    calcularTotal,
  } = useTiendaStore();

  const [mostrarModalCaja, setMostrarModalCaja] = useState(false);
  const [ultimaPizzaAgregada, setUltimaPizzaAgregada] = useState<string>("");

  const handleAgregarPizza = (
    pizza: PizzaDataType,
    tamaño: "4" | "8",
    ingredientes: string[]
  ) => {
    agregarPizza(pizza, tamaño, ingredientes);
    setUltimaPizzaAgregada(`${pizza.nombre} (${tamaño}p)`);
    setMostrarModalCaja(true);
  };

  const total = calcularTotal();
  const totalItems = pizzas.length + bebidas.reduce((acc, b) => acc + b.cantidad, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#14532d] pb-24 select-none">
      
      {/* Barra Superior Mobile */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 px-4 py-3 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl">☘️</span>
            <span className="font-black text-lg text-[#14532d] tracking-tight">
              0600<span className="text-[#15803d]">Boston</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Acceso a Bebidas */}
            <Link
              href="/bebidas"
              className="text-xs font-bold text-[#15803d] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-xl transition-all"
            >
              🥤 Bebidas
            </Link>

            {/* Carrito Flotante */}
            <Link
              href="/carrito"
              className="flex items-center gap-1.5 bg-[#15803d] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
            >
              <span>🛒</span>
              <span>{totalItems}</span>
              <span className="hidden sm:inline font-mono">(${total.toLocaleString("es-AR")})</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container Mobile */}
      <main className="max-w-md mx-auto px-4 pt-4">
        
        {/* Carrusel Táctil de Pizzas con Ensamble Interactivo */}
        <CarruselPizzas3D
          pizzas={PIZZAS_DATA}
          onAgregarAlCarrito={handleAgregarPizza}
        />

        {/* Banner Inferior: Ir a Bebidas o Finalizar */}
        {totalItems > 0 && (
          <div className="mt-6 bg-white border border-emerald-100 rounded-3xl p-4 shadow-sm flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#4b6b55] block">
                Total acumulado:
              </span>
              <span className="text-xl font-black text-[#15803d] font-mono">
                ${total.toLocaleString("es-AR")}
              </span>
            </div>

            <div className="flex gap-2">
              <Link
                href="/bebidas"
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-[#14532d] hover:bg-emerald-100 transition-all"
              >
                + Bebidas
              </Link>
              <Link
                href="/pedido"
                className="py-2.5 px-3.5 rounded-xl text-xs font-black text-white bg-[#15803d] hover:bg-[#16a34a] shadow-md shadow-emerald-700/20 transition-all"
              >
                Pedir →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Empaque y Consulta por Bebidas */}
      {mostrarModalCaja && (
        <AnimacionCaja
          pizzaNombre={ultimaPizzaAgregada}
          onCerrar={() => setMostrarModalCaja(false)}
        />
      )}
    </div>
  );
}