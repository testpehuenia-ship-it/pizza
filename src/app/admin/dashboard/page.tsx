"use client";

import { useState, useEffect } from "react";
import { PIZZAS_DATA, ADEREZOS_DATA, BEBIDAS_DATA, PizzaDataType, BebidaDataType, AderezoDataType } from "@/lib/data";
import Link from "next/link";

interface ClienteItem {
  id: string;
  nombre: string;
  apellido: string;
  usuario: string;
  telefono: string;
  direccion: string;
  barrio: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"pizzas" | "aderezos" | "bebidas" | "clientes" | "nuevo-producto">("pizzas");
  const [pizzas, setPizzas] = useState<PizzaDataType[]>(PIZZAS_DATA);
  const [aderezos, setAderezos] = useState<AderezoDataType[]>(ADEREZOS_DATA);
  const [bebidas, setBebidas] = useState<BebidaDataType[]>(BEBIDAS_DATA);
  
  // Clientes desde Turso
  const [clientes, setClientes] = useState<ClienteItem[]>([]);
  const [cargandoClientes, setCargandoClientes] = useState(false);

  // Formulario Alta Producto con Cloudinary & Turso
  const [nuevoProd, setNuevoProd] = useState({
    nombre: "",
    descripcion: "",
    precio4: 0,
    precio8: 0,
    categoria: "pizza",
    imagen_url: "",
  });
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [guardandoProd, setGuardandoProd] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Formularios rápidos locales
  const [nuevaPizza, setNuevaPizza] = useState({ nombre: "", descripcion: "", precio4: 0, precio8: 0 });
  const [nuevoAderezo, setNuevoAderezo] = useState("");
  const [nuevaBebida, setNuevaBebida] = useState({ nombre: "", precio: 0 });

  // Cargar clientes desde Turso API
  const cargarClientes = async () => {
    setCargandoClientes(true);
    try {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      if (data.clientes) {
        setClientes(data.clientes);
      }
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    } finally {
      setCargandoClientes(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setImagenArchivo(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleCrearProductoCompleto = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("");
    setGuardandoProd(true);

    try {
      let finalImageUrl = nuevoProd.imagen_url;

      // 1. Si seleccionó un archivo, subir a Cloudinary mediante /api/upload
      if (imagenArchivo) {
        setSubiendoImagen(true);
        const formData = new FormData();
        formData.append("file", imagenArchivo);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Error al subir imagen");
        }
        finalImageUrl = uploadData.url;
        setSubiendoImagen(false);
      }

      // 2. Guardar producto en Turso DB
      const prodRes = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nuevoProd,
          imagen_url: finalImageUrl,
        }),
      });
      const prodData = await prodRes.json();
      if (!prodRes.ok) {
        throw new Error(prodData.error || "Error al guardar en Turso");
      }

      // 3. Agregar a lista local
      if (nuevoProd.categoria === "pizza") {
        const itemPizza: PizzaDataType = {
          id: prodData.producto.id,
          nombre: nuevoProd.nombre,
          descripcion: nuevoProd.descripcion,
          precio4: Number(nuevoProd.precio4),
          precio8: Number(nuevoProd.precio8),
          imagen: finalImageUrl || "🍕",
        };
        setPizzas([itemPizza, ...pizzas]);
      } else {
        const itemBebida: BebidaDataType = {
          id: prodData.producto.id,
          nombre: nuevoProd.nombre,
          precio: Number(nuevoProd.precio8),
          categoria: "gaseosa",
          imagenUrl: finalImageUrl,
          descripcion: nuevoProd.descripcion,
        };
        setBebidas([itemBebida, ...bebidas]);
      }

      setStatusMsg("¡Producto creado y sincronizado con éxito en Cloudinary y Turso DB!");
      setNuevoProd({ nombre: "", descripcion: "", precio4: 0, precio8: 0, categoria: "pizza", imagen_url: "" });
      setImagenArchivo(null);
      setPreviewUrl("");
    } catch (err: any) {
      setStatusMsg("Error: " + err.message);
    } finally {
      setGuardandoProd(false);
      setSubiendoImagen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d141e] text-slate-100 pb-20 select-none">
      {/* Barra de Navegación del Panel */}
      <nav className="bg-[#151f2e] border-b border-emerald-500/20 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☘️</span>
            <div>
              <span className="font-black text-white text-base tracking-wide">
                0600Boston <span className="text-emerald-400">Admin</span>
              </span>
              <span className="block text-[10px] text-emerald-300 font-mono">
                Turso DB & Cloudinary Ready
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setTab("pizzas")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "pizzas" ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Pizzas ({pizzas.length})
            </button>
            <button
              onClick={() => setTab("bebidas")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "bebidas" ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Bebidas ({bebidas.length})
            </button>
            <button
              onClick={() => {
                setTab("clientes");
                cargarClientes();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "clientes" ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              Clientes Turso ({clientes.length})
            </button>
            <button
              onClick={() => setTab("nuevo-producto")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === "nuevo-producto"
                  ? "bg-emerald-500 text-slate-950 font-black"
                  : "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30"
              }`}
            >
              + Alta Cloudinary & Turso ✨
            </button>

            <Link
              href="/menu"
              className="ml-2 text-xs bg-emerald-700/60 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl transition-colors font-bold"
            >
              Ver Carta →
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* PESTAÑA 1: ALTA DE PRODUCTO CON CLOUDINARY Y TURSO */}
        {tab === "nuevo-producto" && (
          <div className="max-w-2xl mx-auto bg-[#151f2e] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-emerald-500/20">
              <span className="text-3xl">☁️</span>
              <div>
                <h3 className="text-lg font-black text-white">
                  Alta de Nuevo Producto (Cloudinary + Turso DB)
                </h3>
                <p className="text-xs text-slate-400">
                  Sube la foto en alta resolución a Cloudinary y almacena el registro en Turso
                </p>
              </div>
            </div>

            {statusMsg && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-bold ${
                  statusMsg.startsWith("Error")
                    ? "bg-red-900/50 border border-red-500 text-red-200"
                    : "bg-emerald-900/50 border border-emerald-500 text-emerald-200"
                }`}
              >
                {statusMsg}
              </div>
            )}

            <form onSubmit={handleCrearProductoCompleto} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Pizza Cuatro Quesos Especial"
                    value={nuevoProd.nombre}
                    onChange={(e) => setNuevoProd({ ...nuevoProd, nombre: e.target.value })}
                    className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">
                    Categoría
                  </label>
                  <select
                    value={nuevoProd.categoria}
                    onChange={(e) => setNuevoProd({ ...nuevoProd, categoria: e.target.value })}
                    className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="pizza">Pizza Artesanal</option>
                    <option value="bebida">Bebida</option>
                    <option value="aderezo">Aderezo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">
                  Descripción / Ingredientes
                </label>
                <textarea
                  rows={2}
                  placeholder="Masa madre, salsa casera, queso azul, gouda y provolone..."
                  value={nuevoProd.descripcion}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, descripcion: e.target.value })}
                  className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">
                    Precio 4 Porciones ($)
                  </label>
                  <input
                    type="number"
                    value={nuevoProd.precio4 || ""}
                    onChange={(e) => setNuevoProd({ ...nuevoProd, precio4: Number(e.target.value) })}
                    placeholder="12500"
                    className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">
                    Precio 8 Porciones / Unidad ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={nuevoProd.precio8 || ""}
                    onChange={(e) => setNuevoProd({ ...nuevoProd, precio8: Number(e.target.value) })}
                    placeholder="25000"
                    className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              {/* Selector de Imagen para Cloudinary */}
              <div className="bg-[#0d141e] border border-dashed border-emerald-500/40 rounded-2xl p-4 text-center">
                <label className="block text-xs font-bold text-emerald-300 mb-2">
                  📸 Imagen del Producto (Subida Automática a Cloudinary)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
                />

                {previewUrl && (
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-xl border border-emerald-500 shadow-md"
                    />
                    <span className="text-[11px] text-emerald-400 font-bold">
                      Listo para subir a tu nube Cloudinary
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={guardandoProd}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <span>
                  {subiendoImagen
                    ? "Subiendo foto a Cloudinary..."
                    : guardandoProd
                    ? "Guardando en Turso DB..."
                    : "Guardar Producto en Cloudinary & Turso ✨"}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* PESTAÑA 2: CLIENTES REGISTRADOS EN TURSO */}
        {tab === "clientes" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>👥</span>
                  <span>Clientes Registrados (Turso Database)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Base de datos en tiempo real de clientes que crearon su cuenta en 0600Boston
                </p>
              </div>
              <button
                onClick={cargarClientes}
                disabled={cargandoClientes}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
              >
                {cargandoClientes ? "Actualizando..." : "🔄 Refrescar"}
              </button>
            </div>

            {clientes.length === 0 ? (
              <div className="bg-[#151f2e] border border-white/10 rounded-2xl p-8 text-center text-slate-400">
                <span className="text-3xl block mb-2">📭</span>
                <p className="text-sm">Aún no hay clientes registrados en la base de datos.</p>
                <p className="text-xs mt-1 text-slate-500">
                  Los clientes que se den de alta en la portada aparecerán automáticamente aquí.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientes.map((c) => (
                  <div
                    key={c.id || c.usuario}
                    className="bg-[#151f2e] border border-emerald-500/20 rounded-2xl p-4 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          @{c.usuario}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString("es-AR") : "Reciente"}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base">
                        {c.nombre} {c.apellido}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                        <span>🏠</span>
                        <span>{c.direccion} {c.barrio ? `(${c.barrio})` : ""}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-300 font-bold">
                        📱 {c.telefono}
                      </span>
                      <a
                        href={`https://wa.me/${c.telefono.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg transition-colors font-bold"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 3: PIZZAS */}
        {tab === "pizzas" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pizzas.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#151f2e] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <h4 className="font-bold text-white text-base">🍕 {p.nombre}</h4>
                    <p className="text-xs text-slate-400 mt-1">{p.descripcion}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between font-mono text-xs">
                    <span className="text-slate-300">
                      4 porciones: <strong className="text-emerald-400">${p.precio4.toLocaleString("es-AR")}</strong>
                    </span>
                    <span className="text-slate-300">
                      8 porciones: <strong className="text-emerald-400">${p.precio8.toLocaleString("es-AR")}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 4: BEBIDAS */}
        {tab === "bebidas" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bebidas.map((b) => (
              <div
                key={b.id}
                className="bg-[#151f2e] border border-white/10 rounded-2xl p-4 flex justify-between items-center shadow-lg"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">🥤 {b.nombre}</h4>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    ${b.precio.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}