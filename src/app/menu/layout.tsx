import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carta y Menú de Pizzas Artesanales | 0600Boston",
  description:
    "Descubrí nuestra carta de pizzas artesanales con masa madre, combos exclusivos y pedidos directos por WhatsApp en 0600Boston.",
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Carta y Menú de Pizzas Artesanales | 0600Boston",
    description:
      "Descubrí nuestra carta de pizzas artesanales con masa madre, combos exclusivos y pedidos directos por WhatsApp en 0600Boston.",
    url: "https://www.0600boston.com.ar/menu",
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
