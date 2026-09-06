import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaPrompts from "@/components/pwa/PwaPrompts";
import CookieConsent from "@/components/legal/CookieConsent";

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "0600Boston | La Mejor Pizza Artesanal",
  description:
    "Pizzería artesanal 0600Boston: masa madre horneada a la leña, carrusel 3D interactivo con toppings en tiempo real, combos exclusivos y pedidos directos por WhatsApp.",
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://pizza.vercel.app"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "pizza",
    "pizzería",
    "0600boston",
    "pizza artesanal",
    "delivery pizza buenos aires",
    "pizza a la leña",
    "pedir pizza whatsapp",
    "combos pizza",
    "pizza napolitana",
  ],
  authors: [
    { name: "0600Boston" },
    { name: "ADNQN.ar", url: "https://adnqn.ar" },
  ],
  creator: "ADNQN.ar (https://adnqn.ar)",
  publisher: "0600Boston",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "0600Boston",
  },
  icons: {
    icon: "/images/brunodescarga.webp",
    apple: "/images/brunodescarga.webp",
  },
  openGraph: {
    title: "0600Boston | La Mejor Pizza Artesanal",
    description:
      "Pizzas artesanales horneadas a la leña. Armá tu pizza con topping interactivo y pedí al instante por WhatsApp.",
    url: "https://pizza.vercel.app",
    siteName: "0600Boston",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/images/pizzas/pizza_base_madera.png",
        width: 800,
        height: 800,
        alt: "Pizza Artesanal 0600Boston",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "0600Boston | La Mejor Pizza Artesanal",
    description:
      "Pizzas artesanales horneadas a la leña con carrusel interactivo y pedidos directos por WhatsApp.",
    images: ["/images/pizzas/pizza_base_madera.png"],
  },
  other: {
    "geo.region": "AR-B",
    "geo.placename": "Buenos Aires, Argentina",
    "geo.position": "-34.6037;-58.3816",
    ICBM: "-34.6037, -58.3816",
    designer: "ADNQN.ar",
    copyright: "Derechos 0600Boston 2026 - Producido by ADNQN.ar",
  },
};

// Marcado Estructurado JSON-LD para Google Search & Local SEO (Restaurant / Pizzeria)
const schemaJsonLd = {
  "@context": "https://schema.org",
  "@type": "FastFoodRestaurant",
  name: "0600Boston - Pizzería Artesanal",
  image: "https://pizza.vercel.app/images/pizzas/pizza_base_madera.png",
  "@id": "https://pizza.vercel.app",
  url: "https://pizza.vercel.app",
  telephone: "+54 9 11 0000-0000",
  priceRange: "$$",
  servesCuisine: ["Pizza", "Pizzería Artesanal", "Comida Rápida", "Bebidas"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Principal 0600",
    addressLocality: "Buenos Aires",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.6037,
    longitude: -58.3816,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "19:30",
      closes: "23:59",
    },
  ],
  menu: "https://pizza.vercel.app/menu",
  hasMenu: "https://pizza.vercel.app/menu",
  acceptsReservations: "False",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0f141f] text-slate-100">
        {children}
        <PwaPrompts />
        <CookieConsent />
      </body>
    </html>
  );
}