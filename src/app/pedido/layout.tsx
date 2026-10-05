import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirmar Pedido y Delivery de Pizzas | 0600Boston",
  description:
    "Confirmá tu pedido de pizzas artesanales y bebidas con entrega por delivery o retiro en local en 0600Boston.",
  alternates: {
    canonical: "/pedido",
  },
  openGraph: {
    title: "Confirmar Pedido y Delivery de Pizzas | 0600Boston",
    description:
      "Confirmá tu pedido de pizzas artesanales y bebidas con entrega por delivery o retiro en local en 0600Boston.",
    url: "https://www.0600boston.com.ar/pedido",
  },
};

export default function PedidoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
