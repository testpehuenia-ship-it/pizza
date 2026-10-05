export interface DiaHorario {
  dia: number; // 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
  nombre: string;
  abierto: boolean;
  apertura: string; // "HH:mm", ej: "20:00"
  cierre: string; // "HH:mm", ej: "23:00"
}

export type ModoHorario = "automatico" | "forzar_abierto" | "forzar_cerrado";

export interface HorariosConfig {
  modo: ModoHorario;
  mensajePersonalizado?: string;
  dias: DiaHorario[];
}

export const HORARIOS_DEFAULT: HorariosConfig = {
  modo: "automatico",
  mensajePersonalizado: "",
  dias: [
    { dia: 1, nombre: "Lunes", abierto: false, apertura: "20:00", cierre: "23:00" },
    { dia: 2, nombre: "Martes", abierto: true, apertura: "20:00", cierre: "23:00" },
    { dia: 3, nombre: "Miércoles", abierto: true, apertura: "20:00", cierre: "23:00" },
    { dia: 4, nombre: "Jueves", abierto: true, apertura: "20:00", cierre: "23:00" },
    { dia: 5, nombre: "Viernes", abierto: true, apertura: "20:00", cierre: "23:00" },
    { dia: 6, nombre: "Sábado", abierto: true, apertura: "20:00", cierre: "23:00" },
    { dia: 0, nombre: "Domingo", abierto: true, apertura: "20:00", cierre: "23:00" },
  ],
};

export interface EstadoHorarioTienda {
  estaAbierto: boolean;
  tituloEstado: string; // "Abierto" | "Cerrado"
  subtitulo: string; // "Cierra a las 23:00 hs (en 1h 20min)" o "Abre hoy a las 20:00 hs"
  tiempoRestanteTexto: string; // "1h 20min", "45 min", etc.
  minutosRestantes: number;
  proximaApertura?: {
    diaNombre: string;
    esHoy: boolean;
    esManana: boolean;
    hora: string;
    minutosHastaApertura: number;
  };
  horarioHoy?: {
    abierto: boolean;
    apertura: string;
    cierre: string;
  };
  modoActual: ModoHorario;
  mensajePersonalizado?: string;
}

/**
 * Convierte "HH:mm" a minutos desde las 00:00
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map((v) => parseInt(v, 10) || 0);
  return h * 60 + m;
}

/**
 * Formatea una cantidad de minutos en texto amigable (ej: "45 min", "1h 15min", "3 horas")
 */
export function formatearMinutosRestantes(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0 min";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  if (hours === 0) {
    return `${minutes} min`;
  }
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  }
  return `${hours}h ${minutes}min`;
}

/**
 * Evalúa el estado de apertura/cierre de la tienda en base a la configuración y hora actual.
 */
export function calcularEstadoHorario(
  config?: HorariosConfig | null,
  fechaReferencia = new Date()
): EstadoHorarioTienda {
  const cfg = config || HORARIOS_DEFAULT;
  const modo = cfg.modo || "automatico";

  // 1. Manejo de Modo Forzado Manual
  if (modo === "forzar_abierto") {
    return {
      estaAbierto: true,
      tituloEstado: "Abierto",
      subtitulo: "Local abierto por atención especial",
      tiempoRestanteTexto: "Atendiendo ahora",
      minutosRestantes: 9999,
      modoActual: modo,
      mensajePersonalizado: cfg.mensajePersonalizado,
    };
  }

  if (modo === "forzar_cerrado") {
    return {
      estaAbierto: false,
      tituloEstado: "Cerrado",
      subtitulo: cfg.mensajePersonalizado || "Local cerrado temporalmente",
      tiempoRestanteTexto: "Cerrado por el momento",
      minutosRestantes: 0,
      modoActual: modo,
      mensajePersonalizado: cfg.mensajePersonalizado,
    };
  }

  // 2. Modo Automático según Horario Semanal
  const dias = cfg.dias && cfg.dias.length > 0 ? cfg.dias : HORARIOS_DEFAULT.dias;
  const diaSemanaActual = fechaReferencia.getDay(); // 0 = Dom, 1 = Lun, ..., 6 = Sab
  const minutosActuales = fechaReferencia.getHours() * 60 + fechaReferencia.getMinutes();

  const diaHoy = dias.find((d) => d.dia === diaSemanaActual);
  const diaAyerSemana = (diaSemanaActual + 6) % 7;
  const diaAyer = dias.find((d) => d.dia === diaAyerSemana);

  let estaAbierto = false;
  let minutosRestantes = 0;
  let horaCierreStr = "";

  // A. Verificar si estamos dentro del horario de hoy
  if (diaHoy && diaHoy.abierto) {
    const apMin = timeStringToMinutes(diaHoy.apertura);
    const ciMin = timeStringToMinutes(diaHoy.cierre);

    if (ciMin > apMin) {
      // Horario normal dentro del mismo día (ej: 20:00 a 23:00)
      if (minutosActuales >= apMin && minutosActuales < ciMin) {
        estaAbierto = true;
        minutosRestantes = ciMin - minutosActuales;
        horaCierreStr = diaHoy.cierre;
      }
    } else {
      // Horario que cruza la medianoche (ej: 20:00 a 02:00)
      if (minutosActuales >= apMin) {
        estaAbierto = true;
        minutosRestantes = 24 * 60 - minutosActuales + ciMin;
        horaCierreStr = diaHoy.cierre;
      }
    }
  }

  // B. Verificar si estamos en la madrugada de una apertura de ayer que cruza la medianoche
  if (!estaAbierto && diaAyer && diaAyer.abierto) {
    const apAyerMin = timeStringToMinutes(diaAyer.apertura);
    const ciAyerMin = timeStringToMinutes(diaAyer.cierre);
    if (ciAyerMin < apAyerMin) {
      if (minutosActuales < ciAyerMin) {
        estaAbierto = true;
        minutosRestantes = ciAyerMin - minutosActuales;
        horaCierreStr = diaAyer.cierre;
      }
    }
  }

  // Si ESTÁ ABIERTO
  if (estaAbierto) {
    const tiempoTexto = formatearMinutosRestantes(minutosRestantes);
    return {
      estaAbierto: true,
      tituloEstado: "Abierto",
      subtitulo: `Cierra a las ${horaCierreStr} hs (restan ${tiempoTexto})`,
      tiempoRestanteTexto: `Cierra en ${tiempoTexto}`,
      minutosRestantes,
      horarioHoy: diaHoy
        ? { abierto: diaHoy.abierto, apertura: diaHoy.apertura, cierre: diaHoy.cierre }
        : undefined,
      modoActual: modo,
      mensajePersonalizado: cfg.mensajePersonalizado,
    };
  }

  // Si ESTÁ CERRADO -> Calcular la próxima apertura
  let proximaApertura: EstadoHorarioTienda["proximaApertura"] = undefined;
  let minutosHastaProximaApertura = 0;

  // Buscar en los próximos 7 días
  for (let offset = 0; offset < 7; offset++) {
    const checkDiaSemana = (diaSemanaActual + offset) % 7;
    const configDia = dias.find((d) => d.dia === checkDiaSemana);

    if (configDia && configDia.abierto) {
      const apMin = timeStringToMinutes(configDia.apertura);

      if (offset === 0) {
        // Mismo día: solo si aún no llegó la hora de apertura
        if (minutosActuales < apMin) {
          minutosHastaProximaApertura = apMin - minutosActuales;
          proximaApertura = {
            diaNombre: configDia.nombre,
            esHoy: true,
            esManana: false,
            hora: configDia.apertura,
            minutosHastaApertura: minutosHastaProximaApertura,
          };
          break;
        }
      } else {
        // Días posteriores
        const minutosRestantesHoy = 24 * 60 - minutosActuales;
        const minutosDiasIntermedios = (offset - 1) * 24 * 60;
        minutosHastaProximaApertura = minutosRestantesHoy + minutosDiasIntermedios + apMin;

        proximaApertura = {
          diaNombre: configDia.nombre,
          esHoy: false,
          esManana: offset === 1,
          hora: configDia.apertura,
          minutosHastaApertura: minutosHastaProximaApertura,
        };
        break;
      }
    }
  }

  let subtituloCerrado = "Cerrado por hoy";
  let tiempoTextoCerrado = "Cerrado";

  if (proximaApertura) {
    const tiempoFaltanteStr = formatearMinutosRestantes(proximaApertura.minutosHastaApertura);
    if (proximaApertura.esHoy) {
      subtituloCerrado = `Abre hoy a las ${proximaApertura.hora} hs (en ${tiempoFaltanteStr})`;
      tiempoTextoCerrado = `Abre hoy a las ${proximaApertura.hora} hs`;
    } else if (proximaApertura.esManana) {
      subtituloCerrado = `Abre mañana ${proximaApertura.diaNombre} a las ${proximaApertura.hora} hs (en ${tiempoFaltanteStr})`;
      tiempoTextoCerrado = `Abre mañana a las ${proximaApertura.hora} hs`;
    } else {
      subtituloCerrado = `Abre el ${proximaApertura.diaNombre} a las ${proximaApertura.hora} hs`;
      tiempoTextoCerrado = `Abre el ${proximaApertura.diaNombre} ${proximaApertura.hora} hs`;
    }
  }

  return {
    estaAbierto: false,
    tituloEstado: "Cerrado",
    subtitulo: subtituloCerrado,
    tiempoRestanteTexto: tiempoTextoCerrado,
    minutosRestantes: 0,
    proximaApertura,
    horarioHoy: diaHoy
      ? { abierto: diaHoy.abierto, apertura: diaHoy.apertura, cierre: diaHoy.cierre }
      : undefined,
    modoActual: modo,
    mensajePersonalizado: cfg.mensajePersonalizado,
  };
}

/**
 * Genera un texto resumen amigable de los horarios semanales
 */
export function generarResumenSemanal(config?: HorariosConfig | null): string {
  const cfg = config || HORARIOS_DEFAULT;
  const dias = cfg.dias && cfg.dias.length > 0 ? cfg.dias : HORARIOS_DEFAULT.dias;

  const abiertos = dias.filter((d) => d.abierto);
  const cerrados = dias.filter((d) => !d.abierto);

  if (abiertos.length === 0) {
    return "Cerrado temporalmente todos los días.";
  }

  if (abiertos.length === 7) {
    return `Abierto todos los días de ${abiertos[0].apertura} a ${abiertos[0].cierre} hs.`;
  }

  // Caso típico: Martes a Domingo 20:00 a 23:00
  const diasCerradosNombres = cerrados.map((d) => d.nombre).join(", ");
  const diasAbiertosNombres = abiertos.map((d) => d.nombre);

  const horaComun = abiertos[0];
  const mismoHorario = abiertos.every(
    (d) => d.apertura === horaComun.apertura && d.cierre === horaComun.cierre
  );

  if (mismoHorario && cerrados.length === 1 && cerrados[0].dia === 1) {
    return `Martes a Domingo de ${horaComun.apertura} a ${horaComun.cierre} hs (Lunes cerrado).`;
  }

  if (mismoHorario) {
    return `${diasAbiertosNombres[0]} a ${
      diasAbiertosNombres[diasAbiertosNombres.length - 1]
    } de ${horaComun.apertura} a ${horaComun.cierre} hs (${diasCerradosNombres} cerrado).`;
  }

  return dias
    .map((d) => `${d.nombre}: ${d.abierto ? `${d.apertura} a ${d.cierre} hs` : "Cerrado"}`)
    .join(" • ");
}
