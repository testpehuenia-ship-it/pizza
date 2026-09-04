import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaPrompts from "@/components/pwa/PwaPrompts";

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "0600Boston | La Mejor Pizza",
  description: "Pizzería artesanal 0600Boston - Carrusel 3D, pedidos directos por WhatsApp",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "0600Boston",
  },
  icons: {
    icon: "/images/brunodescarga.webp",
    apple: "/images/brunodescarga.webp",
  },
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
        <PwaPrompts />
      </body>
    </html>
  );
}