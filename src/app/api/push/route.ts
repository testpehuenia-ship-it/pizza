import { NextResponse } from "next/server";
import { getPushData, agregarNotificacionPush } from "@/lib/push-db";

export async function GET() {
  try {
    const data = await getPushData();
    return NextResponse.json({
      success: true,
      historial: data.historial,
      totalSuscripciones: data.suscripciones.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, mensaje, url, icono, destinatarios } = body;

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
      icono: icono || "🍕",
      destinatarios: destinatarios || "Todos los Clientes",
    });

    return NextResponse.json({ success: true, notificacion: nueva });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
