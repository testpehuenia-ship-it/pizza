import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bebidas, Gaseosas y Cervezas Heladas | 0600Boston",
  description:
    "Acompañá tus pizzas con gaseosas de 500ml y 1.5L, cervezas heladas y aguas minerales. Pedidos directos en 0600Boston.",
  alternates: {
    canonical: "/bebidas",
  },
  openGraph: {
    title: "Bebidas, Gaseosas y Cervezas Heladas | 0600Boston",
    description:
      "Acompañá tus pizzas con gaseosas de 500ml y 1.5L, cervezas heladas y aguas minerales. Pedidos directos en 0600Boston.",
    url: "https://www.0600boston.com.ar/bebidas",
  },
};

export default function BebidasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
