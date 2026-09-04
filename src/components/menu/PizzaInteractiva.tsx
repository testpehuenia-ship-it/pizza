"use client";

import React from "react";
import { PizzaDataType } from "@/lib/data";

interface PizzaInteractivaProps {
  pizza: PizzaDataType;
  ingredientesAgregados: string[];
  tamaño: "4" | "8";
}

export function PizzaInteractiva({
  pizza,
  ingredientesAgregados,
  tamaño,
}: PizzaInteractivaProps) {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center select-none">
      {/* Fuente redonda de madera rústica gourmet */}
      <div 
        className="absolute inset-0 rounded-full shadow-[0_20px_50px_rgba(20,83,45,0.15)] flex items-center justify-center border-4 border-[#8B5A2B]/40"
        style={{
          background: "radial-gradient(circle at 40% 40%, #c9935a 0%, #a66e38 50%, #6d421d 100%)",
        }}
      >
        {/* Borde tallado de la fuente */}
        <div className="w-[94%] h-[94%] rounded-full border-2 border-[#543012]/30 flex items-center justify-center relative overflow-hidden">
          
          {/* Prepizza Base Fotográfica Hiperrealista (Masa horneada, salsa y muzzarella sobre tabla) */}
          <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="/images/pizzas/pizza_base_madera.png"
              alt="Base de Pizza 0600 Boston artesanal"
              className="w-full h-full object-cover rounded-full filter drop-shadow-md"
            />
          </div>

          {/* Marcadores de Porciones (Líneas sutiles si es 4 u 8) */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#451a03] shadow-sm"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-[#451a03] shadow-sm"></div>
            {tamaño === "8" && (
              <>
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#451a03] rotate-45 shadow-sm"></div>
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#451a03] -rotate-45 shadow-sm"></div>
              </>
            )}
          </div>

          {/* Capa de Ingredientes Fotográficos Hiperrealistas Decorados */}
          {(pizza.ingredientesDecorables || []).map((ingrediente) => {
            const estaActivo = ingredientesAgregados.includes(ingrediente.id);
            if (!estaActivo) return null;

            return (
              <div key={ingrediente.id} className="absolute inset-0 pointer-events-none">
                {ingrediente.posiciones.map((pos, idx) => (
                  <div
                    key={idx}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-ingredient-drop select-none"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rot}deg) scale(${pos.scale || 1})`,
                    }}
                  >
                    {ingrediente.imagenUrl ? (
                      <img
                        src={ingrediente.imagenUrl}
                        alt={ingrediente.nombre}
                        className={`object-contain pointer-events-none filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)] ${
                          ingrediente.id === "tomate-rodajas" || ingrediente.id === "tomates"
                            ? "w-14 h-14"
                            : ingrediente.id === "huevo"
                            ? "w-13 h-13"
                            : ingrediente.id === "jamon" || ingrediente.id === "jamon-crudo"
                            ? "w-16 h-12"
                            : ingrediente.id === "albahaca"
                            ? "w-10 h-10"
                            : ingrediente.id === "aceitunas"
                            ? "w-7 h-7"
                            : ingrediente.id === "longaniza"
                            ? "w-12 h-12"
                            : ingrediente.id === "morrones"
                            ? "w-13 h-7"
                            : ingrediente.id === "cebolla" || ingrediente.id === "cebolla-blanca" || ingrediente.id === "cebolla-morada"
                            ? "w-14 h-10"
                            : ingrediente.id === "champinon"
                            ? "w-11 h-11"
                            : ingrediente.id === "ajo-picado"
                            ? "w-8 h-8"
                            : "w-10 h-10"
                        }`}
                      />
                    ) : (
                      <span className="text-2xl drop-shadow-md">{ingrediente.icono}</span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Trébol de 4 Hojas Verde de la marca 0600Boston en el centro */}
          <div className="absolute top-2 right-2 bg-emerald-900/30 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white border border-emerald-400/30 pointer-events-none shadow-md">
            ☘️ 0600
          </div>
        </div>
      </div>
    </div>
  );
}
