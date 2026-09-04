"use client";

import BackgroundVideo from "@/components/landing/BackgroundVideo";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleEntrarAlMenu = () => {
    router.push("/menu");
  };

  return (
    <div className="relative min-h-screen flex items-end justify-center bg-[#f8fafc] overflow-hidden px-4 pb-12 sm:pb-16 select-none">
      <BackgroundVideo />

      {/* Tarjeta Flotante Inferior Mobile-First */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-white/90 backdrop-blur-xl border border-emerald-100/80 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(20,83,45,0.18)] text-center fade-in-up">
        
        {/* Badge de Trébol Verde */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 shadow-sm">
          <span>☘️</span>
          <span>Pizzería 0600Boston</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[#14532d] tracking-tight mb-2">
          0600<span className="text-[#15803d]">Boston</span>
        </h1>

        <p className="text-sm text-[#4b6b55] mb-6 leading-relaxed">
          Pizzas artesanales horneadas a la perfección con los ingredientes más frescos. Armá tu pizza favorita en tiempo real.
        </p>

        {/* Botón CTA Verde con animación */}
        <button
          onClick={handleEntrarAlMenu}
          className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-gradient-to-r from-[#15803d] to-[#16a34a] shadow-xl shadow-emerald-700/30 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Ver la Carta & Armar Pedido</span>
          <span className="text-lg">🍕</span>
        </button>

        <div className="mt-4 flex justify-center items-center gap-4 text-xs font-semibold text-[#4b6b55]">
          <span>✓ Masa Madre</span>
          <span>•</span>
          <span>✓ Menú Táctil</span>
          <span>•</span>
          <span>✓ Envíos WhatsApp</span>
        </div>
      </div>
    </div>
  );
}