import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Si Cloudinary está configurado en variables de entorno, subimos a la nube
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const secureUrl = await uploadToCloudinary(buffer, "0600boston/productos");
        return NextResponse.json({
          success: true,
          url: secureUrl,
          provider: "cloudinary",
        });
      } catch (cloudErr: any) {
        console.warn("Fallo subida a Cloudinary, usando almacenamiento local:", cloudErr.message);
      }
    }

    // Fallback de desarrollo local
    const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    
    const ext = path.extname(file.name) || ".png";
    const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    
    await writeFile(filePath, buffer);
    const localUrl = `/images/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: localUrl,
      provider: "local",
      nota: "Guardado localmente. Al configurar CLOUDINARY_CLOUD_NAME y CLOUDINARY_API_KEY en .env.local se subirá automáticamente a tu cuenta Cloudinary.",
    });
  } catch (error: any) {
    console.error("Error en endpoint /api/upload:", error);
    return NextResponse.json({ error: error.message || "Error al procesar la imagen" }, { status: 500 });
  }
}
