"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const manejarLogin = () => {
    if (typeof window === "undefined") return;
    const passwordGuardado = localStorage.getItem("adminPassword0600");
    if (password === passwordGuardado || password === "0600boston") {
      localStorage.setItem("adminAuth0600", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141f] flex items-center justify-center p-4">
      <div className="bg-[#182030] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl fade-in-up">
        <div className="text-center mb-6">
          <span className="text-4xl inline-block mb-1">🔐</span>
          <h2 className="text-2xl font-extrabold text-white">Panel de Administración</h2>
          <p className="text-xs text-slate-400 mt-1">Ingresá tu clave de acceso</p>
        </div>
        
        {error && (
          <div className="mb-4 text-rose-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 py-2 rounded-xl">
            {error}
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            manejarLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0d121c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff5f3b] transition-all"
              placeholder="Contraseña por defecto: 0600boston"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#ff5f3b] to-[#ff7b5a] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#ff5f3b]/30 hover:brightness-110 active:scale-[0.99] transition-all text-sm"
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}