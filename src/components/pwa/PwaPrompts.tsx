"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type PromptStep = "none" | "install" | "ios_guide" | "notifications" | "notif_success";

export default function PwaPrompts() {
  const [step, setStep] = useState<PromptStep>("none");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Registrar Service Worker para cumplir con PWA instalable
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.log("SW registration failed:", err);
      });
    }

    // Comprobar si ya está instalada / modo standalone
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(standaloneMode);

    // Detectar iOS
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Estado actual de notificaciones
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }

    // Escuchar evento de instalación PWA en navegadores compatibles (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Escuchar cuando el usuario instala exitosamente la app
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      localStorage.setItem("pwa_installed", "true");
      // Al instalar, pasar directamente al mensaje de agradecer e invitar a notificaciones con Bruno
      setStep("notifications");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Determinar qué mensaje mostrar al cargar
    const installDismissed = localStorage.getItem("pwa_install_dismissed_at");
    const notifDismissed = localStorage.getItem("pwa_notif_dismissed_at");

    const timer = setTimeout(() => {
      if (standaloneMode) {
        // Ya está instalada: verificar si aún no tiene notificaciones activadas
        if ("Notification" in window && Notification.permission === "default" && !notifDismissed) {
          setStep("notifications");
        }
      } else {
        // No está instalada: verificar si fue descartada recientemente
        if (!installDismissed) {
          setStep("install");
        } else {
          // Mostrar botón flotante discreto para permitir instalar en cualquier momento
          setShowFloatingButton(true);
        }
      }
    }, 1200);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  // Manejar acción de instalación
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        localStorage.setItem("pwa_installed", "true");
        setStep("notifications");
      } else {
        setStep("none");
        setShowFloatingButton(true);
      }
    } else if (isIOS) {
      // Mostrar tutorial interactivo para iPhone / iPad
      setStep("ios_guide");
    } else {
      // Navegador que no disparó beforeinstallprompt aún (o escritorio sin prompt)
      alert(
        "Para instalar la Web App en tu navegador, haz clic en el menú (tres puntos) y selecciona 'Instalar 0600Boston' o 'Agregar a la pantalla principal'."
      );
      setStep("none");
      setShowFloatingButton(true);
    }
  };

  // Descartar instalación temporalmente
  const handleDismissInstall = () => {
    localStorage.setItem("pwa_install_dismissed_at", Date.now().toString());
    setStep("none");
    setShowFloatingButton(true);
  };

  // Manejar solicitud de notificaciones
  const handleRequestNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones push.");
      setStep("none");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);

      if (permission === "granted") {
        setStep("notif_success");
        // Enviar notificación de bienvenida si está disponible
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "WELCOME_NOTIFICATION",
          });
        } else {
          new Notification("¡Bienvenido a 0600Boston! 🍕☘️", {
            body: "¡Genial! Vas a ser el primero en recibir nuestras ofertas relámpago y promociones exclusivas.",
            icon: "/images/brunoagradece.webp",
          });
        }

        setTimeout(() => {
          setStep("none");
        }, 3200);
      } else {
        localStorage.setItem("pwa_notif_dismissed_at", Date.now().toString());
        setStep("none");
      }
    } catch (err) {
      console.error("Error pidiendo permiso de notificaciones:", err);
      setStep("none");
    }
  };

  // Descartar notificaciones
  const handleDismissNotif = () => {
    localStorage.setItem("pwa_notif_dismissed_at", Date.now().toString());
    setStep("none");
  };

  return (
    <>
      {/* Botón Flotante Discreto cuando se descartó el banner */}
      {showFloatingButton && !isStandalone && step === "none" && (
        <button
          onClick={() => setStep("install")}
          className="fixed bottom-4 left-4 z-40 bg-black/80 hover:bg-black backdrop-blur-md text-white border-2 border-emerald-400/90 rounded-full px-3.5 py-2 flex items-center gap-2.5 shadow-xl shadow-emerald-950/50 hover:scale-105 active:scale-95 transition-all text-xs font-black animate-fade-in"
          title="Instalar App 0600Boston"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-400 bg-white shrink-0">
            <img
              src="/images/brunodescarga.webp"
              alt="Bruno"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="hidden sm:inline">Instalar App</span>
          <span className="text-emerald-400">📲</span>
        </button>
      )}

      {/* MODAL / BANNER FLOTANTE PRINCIPAL */}
      {step !== "none" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm transition-all duration-300">
          <div
            className="relative w-full max-w-lg bg-[#0c141d]/95 backdrop-blur-xl border-2 border-emerald-500/80 rounded-3xl p-5 sm:p-6 shadow-[0_15px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(16,185,129,0.2)] text-white animate-fade-in-up"
            role="dialog"
            aria-modal="true"
          >
            {/* Botón de cerrar superior */}
            <button
              onClick={() => {
                if (step === "install" || step === "ios_guide") handleDismissInstall();
                else handleDismissNotif();
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* CASO 1: INVITACIÓN A INSTALAR APP (Con Bruno Descraga) */}
            {step === "install" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    ☘️ Web App Oficial 0600Boston
                  </span>
                </div>

                <div className="flex flex-row items-center gap-4 sm:gap-5 mb-4">
                  {/* AVATAR BRUNO ADAPTADO AL DISEÑO */}
                  <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50 p-1 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] overflow-hidden flex items-center justify-center group">
                    <img
                      src="/images/brunodescarga.webp"
                      alt="Bruno te invita a descargar la app"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 backdrop-blur-[1px] text-[9px] font-black text-white text-center py-0.5 uppercase tracking-wide">
                      Bruno
                    </div>
                  </div>

                  {/* TEXTO Y TÍTULO */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      ¡Instalá nuestra App en tu teléfono! 📲
                    </h3>
                    <p className="text-xs text-emerald-200/90 font-medium mt-1">
                      Disfrutá una experiencia más ágil, directa y cómoda para pedir tus pizzas favoritas.
                    </p>
                  </div>
                </div>

                {/* BENEFICIOS DE LA WEB SAS */}
                <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-3 sm:p-3.5 mb-5 space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-400 text-sm leading-none shrink-0">⚡</span>
                    <span className="text-slate-200 font-medium">
                      <strong className="text-white font-bold">1 Toque de acceso:</strong> Entrá directamente desde tu pantalla de inicio sin usar tiendas.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-400 text-sm leading-none shrink-0">💾</span>
                    <span className="text-slate-200 font-medium">
                      <strong className="text-white font-bold">0% Espacio:</strong> No llena la memoria de tu móvil ni gasta recursos.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-400 text-sm leading-none shrink-0">🍕</span>
                    <span className="text-slate-200 font-medium">
                      <strong className="text-white font-bold">Pedidos en segundos:</strong> Tus direcciones y datos listos para enviar al WhatsApp al instante.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-400 text-sm leading-none shrink-0">🎁</span>
                    <span className="text-slate-200 font-medium">
                      <strong className="text-white font-bold">Beneficios exclusivos:</strong> Promos especiales solo para clientes con la app instalada.
                    </span>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full py-3 px-5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:brightness-110 active:scale-98 shadow-lg shadow-emerald-950/60 border border-emerald-400/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Descargar e Instalar App</span>
                    <span className="text-base">🚀</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDismissInstall}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Más tarde
                  </button>
                </div>
              </div>
            )}

            {/* CASO 1.5: GUÍA PARA iOS SAFARI */}
            {step === "ios_guide" && (
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    📱 Instrucciones para iPhone / iPad
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mb-2">
                  Cómo agregar 0600Boston a tu pantalla:
                </h3>

                <div className="space-y-3 bg-black/40 border border-emerald-500/30 rounded-2xl p-4 mb-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <p className="text-slate-200">
                      Toca el botón <strong className="text-white">Compartir</strong> (icono del cuadro con flecha hacia arriba ⎋) en la barra de Safari.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <p className="text-slate-200">
                      Desplaza las opciones y pulsa en <strong className="text-white">&quot;Agregar a pantalla de inicio&quot;</strong> ➕.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <p className="text-slate-200">
                      Confirma tocando <strong className="text-white">&quot;Agregar&quot;</strong> en la esquina superior derecha.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("notifications");
                  }}
                  className="w-full py-3 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:brightness-110 transition-all cursor-pointer"
                >
                  ¡Entendido! Ya la agregué 👍
                </button>
              </div>
            )}

            {/* CASO 2: INVITACIÓN A NOTIFICACIONES (Con Bruno Agradece) */}
            {step === "notifications" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    🎉 ¡Gracias por elegir 0600Boston!
                  </span>
                </div>

                <div className="flex flex-row items-center gap-4 sm:gap-5 mb-4">
                  {/* AVATAR BRUNO AGRADECE ADAPTADO */}
                  <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50 p-1 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] overflow-hidden flex items-center justify-center">
                    <img
                      src="/images/brunoagradece.webp"
                      alt="Bruno agradece y te invita a recibir notificaciones"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 backdrop-blur-[1px] text-[9px] font-black text-white text-center py-0.5 uppercase tracking-wide">
                      Bruno
                    </div>
                  </div>

                  {/* TEXTO Y TÍTULO */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      ¡Recibí ofertas y promos exclusivas! 🔔
                    </h3>
                    <p className="text-xs text-emerald-200/90 font-medium mt-1">
                      ¡Bruno y el equipo te avisan cuando salgan promociones relámpago y pizzas con descuento!
                    </p>
                  </div>
                </div>

                {/* QUÉ RECIBIRÁN */}
                <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-3 sm:p-3.5 mb-5 space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-400 text-sm leading-none shrink-0">🔥</span>
                    <span className="text-slate-200 font-medium">
                      <strong className="text-white font-bold">Ofertas Flash y 2x1:</strong> Descuentos de tiempo limitado antes de que se agote el stock.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-400 text-sm leading-none shrink-0">🛵</span>
                    <span className="text-slate-200 font-medium">
                      <strong className="text-white font-bold">Avisos de tu pedido:</strong> Te avisamos cuando la pizza entra al horno y sale en camino.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-emerald-400 text-sm leading-none shrink-0">🎁</span>
                    <span className="text-slate-200 font-medium">
                      <strong className="text-white font-bold">Cupones sorpresas:</strong> Regalos y descuentos en días especiales para usuarios de la app.
                    </span>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleRequestNotifications}
                    className="w-full py-3 px-5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:brightness-110 active:scale-98 shadow-lg shadow-emerald-950/60 border border-emerald-400/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Activar Notificaciones</span>
                    <span className="text-base">🔔</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDismissNotif}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Ahora no
                  </button>
                </div>
              </div>
            )}

            {/* CASO 3: ÉXITO AL ACTIVAR NOTIFICACIONES */}
            {step === "notif_success" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  🎉
                </div>
                <h3 className="text-xl font-black text-white mb-1">
                  ¡Notificaciones Activadas!
                </h3>
                <p className="text-xs text-emerald-200 max-w-xs mx-auto">
                  ¡Genial! Vas a ser el primero en recibir nuestras promociones exclusivas. Bruno te lo agradece.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
