import { NextResponse } from "next/server";
import { registrarSuscripcionPush } from "@/lib/push-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, userAgent } = body;

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint requerido" }, { status: 400 });
    }

    await registrarSuscripcionPush(endpoint, userAgent);
    return NextResponse.json({ success: true, message: "Suscripción registrada" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
