import FormularioRegistro from "@/components/registro/FormularioRegistro";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro de Cliente y Dirección | 0600Boston",
  description:
    "Registrá tus datos y dirección de entrega para agilizar tus pedidos de pizzas artesanales en 0600Boston.",
  alternates: {
    canonical: "/registro",
  },
};

export default function RegistroPage() {
  return <FormularioRegistro />;
}
