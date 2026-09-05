"use client";

import React, { useState, useEffect, useRef } from "react";
import { PushNotificationRecord } from "@/lib/push-db";

interface PushAdminProps {
  onMostrarNotificacion: (msg: string, tipo?: "exito" | "error") => void;
}

export function PushAdmin({ onMostrarNotificacion }: PushAdminProps) {
  const [historial, setHistorial] = useState<PushNotificationRecord[]>([]);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [subiendoIcono, setSubiendoIcono] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formulario de emisión
  const [formTitulo, setFormTitulo] = useState("🔥 ¡Promo Relámpago en 0600Boston! 🍕");
  const [formMensaje, setFormMensaje] = useState("Hoy 20% de descuento en tu pizza grande favorita. ¡Pedí ahora por la app!");
  const [formUrl, setFormUrl] = useState("/menu");
  const [formIcono, setFormIcono] = useState("🍀");
  const [formDestinatarios, setFormDestinatarios] = useState("Todos los Clientes");

  const handleSubirIcono = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onMostrarNotificacion("Por favor seleccioná un archivo de imagen válido (PNG, WebP, JPG, SVG).", "error");
      return;
    }

    setSubiendoIcono(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("removeBg", "true");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "No se pudo procesar la imagen del icono");
      }

      setFormIcono(data.url);
      onMostrarNotificacion("¡Imagen optimizada y convertida a icono push con éxito!", "exito");
    } catch (err: any) {
      onMostrarNotificacion(`Error al cargar icono: ${err.message}`, "error");
    } finally {
      setSubiendoIcono(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/push");
      const data = await res.json();
      if (data.success && data.historial) {
        setHistorial(data.historial);
      }
    } catch (err) {
      console.error("Error al cargar historial push:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const handleEnviarPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const res = await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: formTitulo,
          mensaje: formMensaje,
          url: formUrl,
          icono: formIcono,
          destinatarios: formDestinatarios,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar notificación push");

      onMostrarNotificacion("¡Notificación push emitida y registrada con éxito!", "exito");
      cargarHistorial();
    } catch (err: any) {
      onMostrarNotificacion(err.message, "error");
    } finally {
      setEnviando(false);
    }
  };

  const handleProbarEnEsteDispositivo = async () => {
    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones de escritorio.");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(formTitulo, {
        body: formMensaje,
        icon: "/images/brunoagradece.webp",
      });
      onMostrarNotificacion("Notificación enviada a tu dispositivo.", "exito");
    } else if (Notification.permission === "default") {
      const p = await Notification.requestPermission();
      if (p === "granted") {
        new Notification(formTitulo, {
          body: formMensaje,
          icon: "/images/brunoagradece.webp",
        });
        onMostrarNotificacion("Permiso concedido y notificación de prueba enviada.", "exito");
      }
    } else {
      alert("Las notificaciones están bloqueadas en tu navegador para este sitio. Habilítalas desde el candado en la barra de direcciones.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior de Administración de Push */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#151f2e] border border-emerald-500/20 rounded-2xl p-4 shadow-lg">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>🔔</span>
            <span>Administración de Mensajes Push</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enviá ofertas relámpago, avisos de promociones y novedades directamente a las pantallas de los clientes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleProbarEnEsteDispositivo}
          className="bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
        >
          <span>🧪</span>
          <span>Probar en mi pantalla</span>
        </button>
      </div>

      {/* Reglas de Precaución y Filtros Inteligentes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#151f2e] border border-emerald-500/30 rounded-2xl p-4 shadow-lg flex items-start gap-3">
          <span className="text-3xl">🛡️</span>
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span>Filtro de Descargas Activo</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Garantizado
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Cuando el cliente descarga o instala la App en su teléfono, el sistema <strong>no vuelve a enviar mensajes de descarga</strong> ni muestra banners invasivos.
            </p>
          </div>
        </div>

        <div className="bg-[#151f2e] border border-emerald-500/30 rounded-2xl p-4 shadow-lg flex items-start gap-3">
          <span className="text-3xl">🔕</span>
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span>Filtro de Permisos Activo</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Garantizado
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Si el cliente ya aceptó las notificaciones, <strong>no se le vuelve a enviar el mensaje de solicitud</strong>. Solo se solicita a quienes aún no las aceptaron o no las tienen.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario para Componer y Emitir Notificación Push */}
      <div className="bg-[#151f2e] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <span className="text-2xl">📢</span>
          <h3 className="text-base font-black text-white">Componer Nueva Notificación Push</h3>
        </div>

        <form onSubmit={handleEnviarPush} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">
                Título del Mensaje
              </label>
              <input
                type="text"
                required
                value={formTitulo}
                onChange={(e) => setFormTitulo(e.target.value)}
                placeholder="Ej: 🔥 ¡20% OFF en Pizza Napolitana Grande!"
                className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase text-emerald-400">
                  Icono / Emoji
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={subiendoIcono}
                  className="text-[10px] font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>🖼️</span>
                  <span>{subiendoIcono ? "Procesando..." : "Subir Imagen / Icono"}</span>
                </button>
              </div>

              {/* Input oculto para subir icono */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/webp,image/jpeg,image/svg+xml"
                onChange={handleSubirIcono}
                className="hidden"
              />

              {/* Presets rápidos con Trébol de 4 Hojas */}
              <div className="flex gap-1 mb-2 flex-wrap">
                {["🍕", "🔥", "🍀", "🎁", "🛵", "🥤", "⭐", "🎉"].map((ico) => (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setFormIcono(ico)}
                    className={`px-2.5 py-1 rounded-xl text-sm transition-all border cursor-pointer ${
                      formIcono === ico
                        ? "bg-emerald-500/30 border-emerald-400 text-white"
                        : "bg-[#0d141e] border-white/10 hover:border-white/20 text-slate-300"
                    }`}
                  >
                    {ico}
                  </button>
                ))}
              </div>

              {/* Input para Emoji personalizado o URL de icono */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#0d141e] border border-white/15 flex items-center justify-center shrink-0 overflow-hidden text-lg">
                  {formIcono.startsWith("http") || formIcono.startsWith("/") ? (
                    <img src={formIcono} alt="Icono" className="w-full h-full object-contain p-0.5" />
                  ) : (
                    formIcono
                  )}
                </div>
                <input
                  type="text"
                  value={formIcono}
                  onChange={(e) => setFormIcono(e.target.value)}
                  placeholder="Emoji o /ruta/icono.png"
                  className="flex-1 bg-[#0d141e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Tarjeta de Especificaciones y Requisitos de Iconos Push */}
          <div className="bg-[#0d141e]/80 border border-emerald-500/30 rounded-2xl p-3.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-[11px] uppercase tracking-wide mb-1.5">
              <span>ℹ️</span>
              <span>Requisitos para Iconos de Notificaciones Push (Web Push Standard):</span>
            </div>
            <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
              <li><strong className="text-white">Formatos admitidos:</strong> .png, .webp, .jpg o .svg. (Recomendado: <em>PNG transparente</em> o <em>WebP</em>).</li>
              <li><strong className="text-white">Proporción recomendada:</strong> Cuadrada 1:1. Tamaño óptimo: <strong>192 × 192 px</strong> o <strong>512 × 512 px</strong>.</li>
              <li><strong className="text-white">Peso máximo:</strong> Menos de 1 MB (el sistema optimiza y reduce automáticamente a &lt; 50 KB).</li>
              <li><strong className="text-white">Conversor automático:</strong> Al subir cualquier imagen o logo, el sistema recorta bordes vacíos y elimina fondos sólidos automáticamente para adaptarlo a icono web push.</li>
            </ul>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">
              Cuerpo del Mensaje (Texto que verá el cliente en su pantalla o celular)
            </label>
            <textarea
              rows={2}
              required
              value={formMensaje}
              onChange={(e) => setFormMensaje(e.target.value)}
              placeholder="Ej: Solo por hoy con tu pedido recibís una bebida gratis. ¡Pedí en 0600Boston!"
              className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">
                Página de Destino al Tocar la Notificación
              </label>
              <select
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="/menu">Ver Menú y Pizzas (/menu)</option>
                <option value="/bebidas">Ver Bebidas (/bebidas)</option>
                <option value="/carrito">Ir al Carrito (/carrito)</option>
                <option value="/">Portada (/)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">
                Destinatarios
              </label>
              <select
                value={formDestinatarios}
                onChange={(e) => setFormDestinatarios(e.target.value)}
                className="w-full bg-[#0d141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Todos los Clientes">Todos los Clientes Suscritos</option>
                <option value="Clientes con App Instalada">Solo Clientes con App Instalada</option>
                <option value="Nuevos Clientes">Nuevos Clientes Registrados</option>
              </select>
            </div>
          </div>

          {/* Vista previa simulada de cómo se ve en el celular */}
          <div className="bg-[#0d141e] border border-white/10 rounded-2xl p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Vista previa en pantalla del cliente:
            </span>
            <div className="bg-[#182333] border border-emerald-500/30 rounded-xl p-3 flex items-start gap-3 shadow-md max-w-md">
              <div className="w-10 h-10 rounded-xl bg-[#0d141e] border border-emerald-400 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                {formIcono.startsWith("http") || formIcono.startsWith("/") ? (
                  <img src={formIcono} alt="Icono Preview" className="w-full h-full object-contain p-0.5" />
                ) : (
                  <span>{formIcono}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold">0600Boston • Ahora</span>
                </div>
                <h5 className="font-extrabold text-white text-xs truncate mt-0.5">{formTitulo}</h5>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                  {formMensaje}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="submit"
              disabled={enviando}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{enviando ? "Emitiendo push..." : "🚀 Enviar Notificación Push"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Historial de Notificaciones Push Emitidas */}
      <div className="bg-[#151f2e] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <span>📋</span>
            <span>Historial de Mensajes Push Enviados ({historial.length})</span>
          </h3>
          <button
            type="button"
            onClick={cargarHistorial}
            disabled={cargando}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
          >
            {cargando ? "Actualizando..." : "🔄 Actualizar"}
          </button>
        </div>

        <div className="space-y-3">
          {historial.map((push) => (
            <div
              key={push.id}
              className="bg-[#0d141e] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-start gap-3">
                {push.icono?.startsWith("http") || push.icono?.startsWith("/") ? (
                  <div className="w-10 h-10 p-1 bg-[#151f2e] border border-white/10 rounded-xl shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={push.icono} alt="Icono" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <span className="text-2xl p-2 bg-[#151f2e] border border-white/10 rounded-xl shrink-0">
                    {push.icono}
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-white text-sm">{push.titulo}</h4>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      {push.estado}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{push.mensaje}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-2 font-mono">
                    <span>📅 {new Date(push.fecha).toLocaleString("es-AR")}</span>
                    <span>👥 {push.destinatarios}</span>
                    <span>🔗 Destino: {push.url}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {historial.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs italic">
              Aún no se han enviado notificaciones push.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
