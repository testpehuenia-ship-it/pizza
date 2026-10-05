"use client";

import { useState, useEffect, useCallback } from "react";
import {
  HorariosConfig,
  HORARIOS_DEFAULT,
  EstadoHorarioTienda,
  calcularEstadoHorario,
} from "@/lib/horarios";

export function useHorarioTienda() {
  const [horariosConfig, setHorariosConfig] = useState<HorariosConfig>(HORARIOS_DEFAULT);
  const [estado, setEstado] = useState<EstadoHorarioTienda>(() =>
    calcularEstadoHorario(HORARIOS_DEFAULT)
  );
  const [cargando, setCargando] = useState(true);

  const cargarConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.settings?.horarios) {
        setHorariosConfig(data.settings.horarios);
        setEstado(calcularEstadoHorario(data.settings.horarios));
      } else {
        setEstado(calcularEstadoHorario(HORARIOS_DEFAULT));
      }
    } catch (err) {
      console.warn("No se pudo cargar horario desde servidor, usando valor local:", err);
      setEstado(calcularEstadoHorario(HORARIOS_DEFAULT));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarConfig();
  }, [cargarConfig]);

  // Actualizar cálculo de tiempo restante cada 30 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setEstado(calcularEstadoHorario(horariosConfig));
    }, 30000);
    return () => clearInterval(timer);
  }, [horariosConfig]);

  return {
    horariosConfig,
    estado,
    estaAbierto: estado.estaAbierto,
    cargando,
    recargarHorarios: cargarConfig,
  };
}
