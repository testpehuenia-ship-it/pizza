"use client";

import React, { useState, useRef } from "react";
import { PizzaDataType } from "@/lib/data";
import { PizzaInteractiva } from "./PizzaInteractiva";

interface CarruselPizzas3DProps {
  pizzas: PizzaDataType[];
  onAgregarAlCarrito: (
    pizza: PizzaDataType,
    tamaño: "4" | "8",
    ingredientes: string[]
  ) => void;
}

export function CarruselPizzas3D({
  pizzas,
  onAgregarAlCarrito,
}: CarruselPizzas3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tamañoSeleccionado, setTamañoSeleccionado] = useState<"4" | "8">("8");
  
  // Guardamos los ingredientes decorados para cada pizza
  const [ingredientesActivosMap, setIngredientesActivosMap] = useState<
    Record<string, string[]>
  >({
    napolitana: ["tomate-rodajas", "albahaca", "aceitunas"],
    muzzarella: ["aceitunas", "oregano"],
  });

  const [animandoEmpaque, setAnimandoEmpaque] = useState(false);

  // Variables para swipe táctil con el dedo
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 45;

  const pizzaActual = pizzas[activeIndex] || pizzas[0];
  const ingredientesActivos =
    ingredientesActivosMap[pizzaActual.id] ||
    (pizzaActual.ingredientesDecorables || []).map((i) => i.id);

  const precioActual =
    tamañoSeleccionado === "4" ? pizzaActual.precio4 : pizzaActual.precio8;

  // Manejadores de eventos táctiles (Touch Mobile)
  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    touchEndX.current = null;
    touchStartX.current = "touches" in e ? e.targetTouches[0].clientX : e.clientX;
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    touchEndX.current = "touches" in e ? e.targetTouches[0].clientX : e.clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Siguiente pizza (deslizar a la izquierda)
      setActiveIndex((prev) => (prev === pizzas.length - 1 ? 0 : prev + 1));
    } else if (isRightSwipe) {
      // Pizza anterior (deslizar a la derecha)
      setActiveIndex((prev) => (prev === 0 ? pizzas.length - 1 : prev - 1));
    }
  };

  // Alternar ingrediente decorativo sobre la pizza
  const toggleIngrediente = (ingId: string) => {
    const actuales = ingredientesActivosMap[pizzaActual.id] || [];
    let nuevos: string[];
    if (actuales.includes(ingId)) {
      nuevos = actuales.filter((id) => id !== ingId);
    } else {
      nuevos = [...actuales, ingId];
    }
    setIngredientesActivosMap({
      ...ingredientesActivosMap,
      [pizzaActual.id]: nuevos,
    });
  };

  // Botón para decorar todos
  const decorarTodos = () => {
    setIngredientesActivosMap({
      ...ingredientesActivosMap,
      [pizzaActual.id]: (pizzaActual.ingredientesDecorables || []).map((i) => i.id),
    });
  };

  const handleAgregar = () => {
    setAnimandoEmpaque(true);
    setTimeout(() => {
      onAgregarAlCarrito(pizzaActual, tamañoSeleccionado, ingredientesActivos);
      setAnimandoEmpaque(false);
    }, 700);
  };

  return (
    <div className="w-full max-w-md mx-auto select-none">
      
      {/* Título de la Pizza y Guía Táctil */}
      <div className="text-center mb-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide uppercase">
          ☘️ Variedad #{activeIndex + 1} de {pizzas.length}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14532d] mt-1 tracking-tight">
          {pizzaActual.nombre}
        </h2>
        <p className="text-xs text-[#4b6b55] max-w-xs mx-auto mt-1 leading-snug">
          {pizzaActual.descripcion}
        </p>
      </div>

      {/* Selector Táctil de Porciones */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTamañoSeleccionado("4")}
          className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
            tamañoSeleccionado === "4"
              ? "bg-[#15803d] text-white shadow-md shadow-emerald-700/20"
              : "bg-white text-[#4b6b55] border border-emerald-200"
          }`}
        >
          4 Porciones (${pizzaActual.precio4.toLocaleString("es-AR")})
        </button>
        <button
          type="button"
          onClick={() => setTamañoSeleccionado("8")}
          className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
            tamañoSeleccionado === "8"
              ? "bg-[#15803d] text-white shadow-md shadow-emerald-700/20"
              : "bg-white text-[#4b6b55] border border-emerald-200"
          }`}
        >
          8 Porciones Grande (${pizzaActual.precio8.toLocaleString("es-AR")})
        </button>
      </div>

      {/* ÁREA CENTRAL TÁCTIL (Swipe con el dedo sin flechas) */}
      <div
        className={`relative py-3 cursor-grab active:cursor-grabbing transition-transform duration-300 ${
          animandoEmpaque ? "animate-fly-to-cart pointer-events-none" : ""
        }`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
      >
        <PizzaInteractiva
          pizza={pizzaActual}
          ingredientesAgregados={ingredientesActivos}
          tamaño={tamañoSeleccionado}
        />

        {/* Indicador sutil de deslizamiento táctil */}
        <div className="flex justify-center items-center gap-1.5 mt-4 text-[11px] text-[#4b6b55]/80">
          <span>👈 Deslizá con tu dedo para ver más pizzas 👉</span>
        </div>
      </div>

      {/* BANDEJA TÁCTIL DE INGREDIENTES PARA DECORAR LA PIZZA */}
      <div className="bg-white rounded-3xl p-4 shadow-[0_10px_30px_rgba(21,128,61,0.06)] border border-emerald-100 mt-2">
        <div className="flex justify-between items-center mb-2.5 px-1">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#14532d]">
              Topping & Ingredientes de la receta:
            </h3>
            <p className="text-[11px] text-[#4b6b55]">
              Tocá cada ingrediente para decorarlo en la pizza
            </p>
          </div>
          <button
            type="button"
            onClick={decorarTodos}
            className="text-[11px] font-bold text-[#15803d] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors"
          >
            Poner Todos ✨
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {(pizzaActual.ingredientesDecorables || []).map((ing) => {
            const activo = ingredientesActivos.includes(ing.id);
            return (
              <button
                key={ing.id}
                type="button"
                onClick={() => toggleIngrediente(ing.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-bold transition-all active:scale-95 group ${
                  activo
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-800/20"
                    : "bg-[#f8fafc] text-[#14532d] border-emerald-200/80 hover:bg-emerald-50/80"
                }`}
              >
                {ing.imagenUrl ? (
                  <img
                    src={ing.imagenUrl}
                    alt={ing.nombre}
                    className="w-7 h-7 object-contain filter drop-shadow-sm transition-transform group-hover:scale-110"
                  />
                ) : (
                  <span className="text-lg">{ing.icono}</span>
                )}
                <span>{ing.nombre}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    activo ? "bg-white/25 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {activo ? "✓" : "+"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra Inferior Táctil: Precio y Botón Añadir al Carrito */}
      <div className="mt-4 flex items-center justify-between gap-3 bg-white p-3.5 rounded-3xl shadow-[0_10px_30px_rgba(21,128,61,0.08)] border border-emerald-100">
        <div className="pl-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4b6b55] block">
            Total {pizzaActual.nombre}:
          </span>
          <span className="text-2xl font-black text-[#15803d] font-mono leading-none">
            ${precioActual.toLocaleString("es-AR")}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAgregar}
          disabled={animandoEmpaque}
          className="flex-1 max-w-[200px] py-3.5 px-4 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-[#15803d] to-[#16a34a] shadow-lg shadow-emerald-700/25 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Añadir al Carrito</span>
          <span className="text-base">🛒</span>
        </button>
      </div>

      {/* Puntos de Paginación */}
      <div className="flex justify-center gap-1.5 mt-4">
        {pizzas.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === idx ? "w-6 bg-[#15803d]" : "w-1.5 bg-emerald-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}