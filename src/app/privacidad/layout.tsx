import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad y Protección de Datos | 0600Boston",
  description:
    "Política de privacidad y protección de datos de 0600Boston en cumplimiento con RGPD, LGPD y Ley 25.326 de Protección de Datos Personales.",
  alternates: {
    canonical: "/privacidad",
  },
  openGraph: {
    title: "Política de Privacidad y Protección de Datos | 0600Boston",
    description:
      "Política de privacidad y protección de datos de 0600Boston en cumplimiento con RGPD, LGPD y Ley 25.326 de Protección de Datos Personales.",
    url: "https://www.0600boston.com.ar/privacidad",
  },
};

export default function PrivacidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
