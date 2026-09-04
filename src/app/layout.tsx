import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "0600Boston | La Mejor Pizza",
  description: "Pizzería artesanal 0600Boston - Carrusel 3D, pedidos directos por WhatsApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-[#0f141f] text-slate-100">
        {children}
      </body>
    </html>
  );
}