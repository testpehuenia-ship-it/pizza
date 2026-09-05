import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { removeBackgroundAndOptimize } from "@/lib/image-processor";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const removeBgParam = formData.get("removeBg");
    const removeBg = removeBgParam !== "false"; // por defecto true

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // Optimizar imagen y remover fondo transparente automáticamente
    let processedBuffer = rawBuffer;
    let width = 0;
    let height = 0;
    try {
      const { buffer, info } = await removeBackgroundAndOptimize(rawBuffer, {
        maxDimension: 800,
        removeBg,
      });
      processedBuffer = Buffer.from(buffer);
      width = info.width;
      height = info.height;
    } catch (procErr: any) {
      console.warn("Advertencia en procesamiento de imagen, usando original:", procErr.message);
    }

    // 1. Si Cloudinary está configurado en variables de entorno, subimos la imagen optimizada transparente
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const secureUrl = await uploadToCloudinary(processedBuffer, "0600boston/productos");
        return NextResponse.json({
          success: true,
          url: secureUrl,
          provider: "cloudinary",
          width,
          height,
          sizeBytes: processedBuffer.length,
          fondoTransparente: removeBg,
        });
      } catch (cloudErr: any) {
        console.warn("Fallo subida a Cloudinary, usando almacenamiento local:", cloudErr.message);
      }
    }

    // 2. Fallback de desarrollo local
    const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, processedBuffer);
    const localUrl = `/images/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
      provider: "local",
      width,
      height,
      sizeBytes: processedBuffer.length,
      fondoTransparente: removeBg,
      nota: "Imagen optimizada con fondo transparente guardada con éxito.",
    });
  } catch (error: any) {
    console.error("Error en endpoint /api/upload:", error);
    return NextResponse.json({ error: error.message || "Error al procesar la imagen" }, { status: 500 });
  }
}

