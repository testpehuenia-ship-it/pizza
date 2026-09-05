import { NextResponse } from "next/server";
import {
  getPushData,
  agregarNotificacionPush,
  agregarPlantillaPush,
  eliminarPlantillaPush,
} from "@/lib/push-db";

export async function GET() {
  try {
    const data = await getPushData();
    return NextResponse.json({
      success: true,
      historial: (data.historial || []).slice(0, 3),
      plantillas: data.plantillas || [],
      totalSuscripciones: (data.suscripciones || []).length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, nombre, titulo, mensaje, url, icono, destinatarios } = body;

    // Caso 1: Guardar como Plantilla
    if (action === "guardar_plantilla") {
      if (!titulo || !mensaje) {
        return NextResponse.json(
          { error: "Título y mensaje son necesarios para guardar la plantilla" },
          { status: 400 }
        );
      }
      const plantilla = await agregarPlantillaPush({
        nombre: (nombre || titulo).trim(),
        titulo: titulo.trim(),
        mensaje: mensaje.trim(),
        url: url || "/menu",
        icono: icono || "🍀",
        destinatarios: destinatarios || "Todos los Clientes",
      });
      const data = await getPushData();
      return NextResponse.json({
        success: true,
        plantilla,
        plantillas: data.plantillas || [],
      });
    }

    // Caso 2: Eliminar Plantilla
    if (action === "eliminar_plantilla") {
      if (!id) {
        return NextResponse.json({ error: "ID de plantilla requerido" }, { status: 400 });
      }
      await eliminarPlantillaPush(id);
      const data = await getPushData();
      return NextResponse.json({
        success: true,
        plantillas: data.plantillas || [],
      });
    }

    // Caso 3: Emitir Notificación Push
    if (!titulo || !mensaje) {
      return NextResponse.json(
        { error: "Título y mensaje son obligatorios" },
        { status: 400 }
      );
    }

    const nueva = await agregarNotificacionPush({
      titulo: titulo.trim(),
      mensaje: mensaje.trim(),
      url: url || "/menu",
      icono: icono || "🍀",
      destinatarios: destinatarios || "Todos los Clientes",
    });

    const data = await getPushData();

    return NextResponse.json({
      success: true,
      notificacion: nueva,
      historial: (data.historial || []).slice(0, 3),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
