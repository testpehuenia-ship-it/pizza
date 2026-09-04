"use client";

import { useState, useEffect } from "react";
import { PIZZAS_DATA, ADEREZOS_DATA, BEBIDAS_DATA, PizzaDataType, BebidaDataType, AderezoDataType } from "@/lib/data";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"pizzas" | "aderezos" | "bebidas">("pizzas");
  const [pizzas, setPizzas] = useState<PizzaDataType[]>(PIZZAS_DATA);
  const [nuevaPizza, setNuevaPizza] = useState({
    nombre: "",
    descripcion: "",
    precio4: 0,
    precio8: 0,
  });

  const [aderezos, setAderezos] = useState<AderezoDataType[]>(ADEREZOS_DATA);
  const [nuevoAderezo, setNuevoAderezo] = useState("");

  const [bebidas, setBebidas] = useState<BebidaDataType[]>(BEBIDAS_DATA);
  const [nuevaBebida, setNuevaBebida] = useState({
    nombre: "",
    precio: 0,
  });

  // Cargar datos persistidos si existen
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = localStorage.getItem("adminPizzas0600");
    if (p) {
      try { setPizzas(JSON.parse(p)); } catch (_) {}
    }
    const a = localStorage.getItem("adminAderezos0600");
    if (a) {
      try { setAderezos(JSON.parse(a)); } catch (_) {}
    }
    const b = localStorage.getItem("adminBebidas0600");
    if (b) {
      try { setBebidas(JSON.parse(b)); } catch (_) {}
    }
  }, []);

  const guardarPizzas = (lista: PizzaDataType[]) => {
    setPizzas(lista);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminPizzas0600", JSON.stringify(lista));
    }
  };

  const agregarPizza = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaPizza.nombre) return;
    const item: PizzaDataType = {
      id: nuevaPizza.nombre.toLowerCase().replace(/\s+/g, "-"),
      nombre: nuevaPizza.nombre,
      descripcion: nuevaPizza.descripcion || "Ingredientes especiales 0600Boston",
      precio4: Number(nuevaPizza.precio4),
      precio8: Number(nuevaPizza.precio8),
      imagen: "🍕",
    };
    guardarPizzas([...pizzas, item]);
    setNuevaPizza({ nombre: "", descripcion: "", precio4: 0, precio8: 0 });
  };

  const eliminarPizza = (id: string) => {
    guardarPizzas(pizzas.filter((p) => p.id !== id));
  };

  const agregarAderezo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoAderezo) return;
    const item: AderezoDataType = {
      id: nuevoAderezo.toLowerCase().replace(/\s+/g, "-"),
      nombre: nuevoAderezo,
      precio: 0,
    };
    const lista = [...aderezos, item];
    setAderezos(lista);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminAderezos0600", JSON.stringify(lista));
    }
    setNuevoAderezo("");
  };

  const eliminarAderezo = (id: string) => {
    const lista = aderezos.filter((a) => a.id !== id);
    setAderezos(lista);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminAderezos0600", JSON.stringify(lista));
    }
  };

  const agregarBebida = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaBebida.nombre) return;
    const item: BebidaDataType = {
      id: nuevaBebida.nombre.toLowerCase().replace(/\s+/g, "-"),
      nombre: nuevaBebida.nombre,
      precio: Number(nuevaBebida.precio),
      categoria: "gaseosa",
    };
    const lista = [...bebidas, item];
    setBebidas(lista);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminBebidas0600", JSON.stringify(lista));
    }
    setNuevaBebida({ nombre: "", precio: 0 });
  };

  const eliminarBebida = (id: string) => {
    const lista = bebidas.filter((b) => b.id !== id);
    setBebidas(lista);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminBebidas0600", JSON.stringify(lista));
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141f] text-slate-100 pb-20">
      <nav className="bg-[#182030] border-b border-white/10 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍕</span>
            <span className="font-extrabold text-white text-base">
              0600Boston <span className="text-[#ff5f3b]">Dashboard</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("pizzas")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "pizzas"
                  ? "bg-[#ff5f3b] text-white shadow-md shadow-[#ff5f3b]/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Pizzas ({pizzas.length})
            </button>
            <button
              onClick={() => setTab("aderezos")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "aderezos"
                  ? "bg-[#ff5f3b] text-white shadow-md shadow-[#ff5f3b]/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Aderezos ({aderezos.length})
            </button>
            <button
              onClick={() => setTab("bebidas")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "bebidas"
                  ? "bg-[#ff5f3b] text-white shadow-md shadow-[#ff5f3b]/30"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Bebidas ({bebidas.length})
            </button>

            <Link
              href="/menu"
              className="ml-4 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition-colors"
            >
              Ver Carta →
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* TAB PIZZAS */}
        {tab === "pizzas" && (
          <div>
            <div className="bg-[#182030] border border-white/10 rounded-3xl p-6 mb-8 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">
                ➕ Agregar Nueva Pizza
              </h3>
              <form onSubmit={agregarPizza} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Nombre de la Pizza"
                  value={nuevaPizza.nombre}
                  onChange={(e) => setNuevaPizza({ ...nuevaPizza, nombre: e.target.value })}
                  required
                  className="bg-[#0d121c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5f3b]"
                />
                <input
                  type="text"
                  placeholder="Ingredientes / Descripción"
                  value={nuevaPizza.descripcion}
                  onChange={(e) => setNuevaPizza({ ...nuevaPizza, descripcion: e.target.value })}
                  className="bg-[#0d121c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5f3b]"
                />
                <input
                  type="number"
                  placeholder="Precio 4 Porc."
                  value={nuevaPizza.precio4 || ""}
                  onChange={(e) => setNuevaPizza({ ...nuevaPizza, precio4: Number(e.target.value) })}
                  required
                  className="bg-[#0d121c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5f3b]"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Precio 8 Porc."
                    value={nuevaPizza.precio8 || ""}
                    onChange={(e) => setNuevaPizza({ ...nuevaPizza, precio8: Number(e.target.value) })}
                    required
                    className="w-full bg-[#0d121c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5f3b]"
                  />
                  <button
                    type="submit"
                    className="bg-[#ff5f3b] text-white font-bold px-4 py-2.5 rounded-xl hover:brightness-110 whitespace-nowrap text-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pizzas.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#141b29] border border-white/10 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base">🍕 {p.nombre}</h4>
                      <button
                        onClick={() => eliminarPizza(p.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{p.descripcion}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between font-mono text-xs">
                    <span className="text-slate-300">4p: <strong className="text-[#ff5f3b]">${p.precio4.toLocaleString("es-AR")}</strong></span>
                    <span className="text-slate-300">8p: <strong className="text-[#ff5f3b]">${p.precio8.toLocaleString("es-AR")}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB ADEREZOS */}
        {tab === "aderezos" && (
          <div>
            <div className="bg-[#182030] border border-white/10 rounded-3xl p-6 mb-8 shadow-xl max-w-lg">
              <h3 className="text-lg font-bold text-white mb-4">
                ➕ Agregar Aderezo
              </h3>
              <form onSubmit={agregarAderezo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre (ej: Ají Picante)"
                  value={nuevoAderezo}
                  onChange={(e) => setNuevoAderezo(e.target.value)}
                  required
                  className="flex-1 bg-[#0d121c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5f3b]"
                />
                <button
                  type="submit"
                  className="bg-[#ff5f3b] text-white font-bold px-5 py-2.5 rounded-xl hover:brightness-110 text-sm"
                >
                  Agregar
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {aderezos.map((a) => (
                <div
                  key={a.id}
                  className="bg-[#141b29] border border-white/10 rounded-2xl p-4 flex justify-between items-center"
                >
                  <span className="text-sm font-semibold text-white">🌿 {a.nombre}</span>
                  <button
                    onClick={() => eliminarAderezo(a.id)}
                    className="text-xs text-rose-400 hover:text-rose-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB BEBIDAS */}
        {tab === "bebidas" && (
          <div>
            <div className="bg-[#182030] border border-white/10 rounded-3xl p-6 mb-8 shadow-xl max-w-xl">
              <h3 className="text-lg font-bold text-white mb-4">
                ➕ Agregar Bebida
              </h3>
              <form onSubmit={agregarBebida} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre de Bebida"
                  value={nuevaBebida.nombre}
                  onChange={(e) => setNuevaBebida({ ...nuevaBebida, nombre: e.target.value })}
                  required
                  className="flex-1 bg-[#0d121c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5f3b]"
                />
                <input
                  type="number"
                  placeholder="Precio $"
                  value={nuevaBebida.precio || ""}
                  onChange={(e) => setNuevaBebida({ ...nuevaBebida, precio: Number(e.target.value) })}
                  required
                  className="w-32 bg-[#0d121c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5f3b]"
                />
                <button
                  type="submit"
                  className="bg-[#ff5f3b] text-white font-bold px-5 py-2.5 rounded-xl hover:brightness-110 text-sm"
                >
                  Agregar
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bebidas.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#141b29] border border-white/10 rounded-2xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">🥤 {b.nombre}</h4>
                    <span className="text-xs font-mono text-[#ff5f3b]">${b.precio.toLocaleString("es-AR")}</span>
                  </div>
                  <button
                    onClick={() => eliminarBebida(b.id)}
                    className="text-xs text-rose-400 hover:text-rose-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}