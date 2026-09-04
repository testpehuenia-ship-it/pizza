"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTiendaStore } from "@/lib/store";

export default function FormularioRegistro() {
  const router = useRouter();
  const { cliente, setCliente } = useTiendaStore();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    domicilio: "",
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        telefono: cliente.telefono || "",
        domicilio: cliente.domicilio || "",
      });
    }
  }, [cliente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCliente(formData);
    router.push("/menu");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 select-none">
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_15px_40px_rgba(20,83,45,0.08)] fade-in-up">
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 inline-block">☘️</span>
          <h2 className="text-2xl font-black text-[#14532d]">Tus Datos de Envío</h2>
          <p className="text-xs text-[#4b6b55] mt-1">
            Completá tus datos para que el delivery llegue directo a tu puerta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4b6b55] mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full bg-[#f8fafc] border border-emerald-200 rounded-2xl px-3.5 py-3 text-xs text-[#14532d] font-medium focus:outline-none focus:border-[#15803d] transition-all"
                placeholder="Ej: Juan"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4b6b55] mb-1">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="w-full bg-[#f8fafc] border border-emerald-200 rounded-2xl px-3.5 py-3 text-xs text-[#14532d] font-medium focus:outline-none focus:border-[#15803d] transition-all"
                placeholder="Ej: Pérez"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4b6b55] mb-1">Teléfono (WhatsApp)</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              maxLength={15}
              className="w-full bg-[#f8fafc] border border-emerald-200 rounded-2xl px-3.5 py-3 text-xs text-[#14532d] font-medium focus:outline-none focus:border-[#15803d] transition-all"
              placeholder="Ej: 2964625057"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4b6b55] mb-1">Domicilio para Delivery</label>
            <input
              type="text"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              required
              className="w-full bg-[#f8fafc] border border-emerald-200 rounded-2xl px-3.5 py-3 text-xs text-[#14532d] font-medium focus:outline-none focus:border-[#15803d] transition-all"
              placeholder="Ej: Av. San Martín 1234, Dpto 2B"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#15803d] to-[#16a34a] shadow-lg shadow-emerald-700/25 hover:brightness-105 active:scale-[0.98] transition-all mt-3"
          >
            Continuar al Menú 🍕
          </button>
        </form>
      </div>
    </div>
  );
}