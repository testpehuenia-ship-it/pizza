# 🍕 0600Boston - PWA & Plataforma Web Gastronómica de Alta Gama

> **Versión de Entrega:** 1.0.0 (Producción / Entrega Final)  
> **Derechos:** 0600Boston 2026  
> **Desarrollado y Producido by:** [ADNQN.ar](https://adnqn.ar/)  

---

## 🌟 Descripción General

**0600Boston** es una Progressive Web App (PWA) y plataforma gastronómica SaaS especializada en comercio directo al consumidor (D2C). Diseñada para optimizar las conversiones de pizzerías artesanales eliminando comisiones de terceros, cuenta con una experiencia de usuario inmersiva con carrusel 3D, armador de pizzas en tiempo real, gestión completa de catálogo, notificaciones Push VAPID y derivación automática de pedidos estructurados a **WhatsApp Business**.

---

## 🚀 Inicio Rápido

### Requisitos Previos
* **Node.js**: `18.18+` (Recomendado: Node.js 20 LTS o 22 LTS).
* **NPM**: `9+` (incluido con Node.js).

### Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (crear .env.local a partir del ejemplo)
cp .env.example .env.local

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción
npm run build

# 5. Iniciar servidor de producción
npm run start
```

Para Windows, también se incluye el script de un solo clic `iniciar_pc.bat` y para servidores Linux `iniciar_servidor.sh`.

---

## 📂 Estructura del Proyecto

```
0600boston/
├── src/
│   ├── app/                    # Next.js 15 App Router (Rutas y APIs)
│   │   ├── admin/              # Panel de Administración y Dashboard
│   │   ├── api/                # Endpoints Backend (Auth, Catálogo, Push, Upload, Settings)
│   │   ├── bebidas/            # Carta de Bebidas
│   │   ├── carrito/            # Carrito de Compras
│   │   ├── cerrado/            # Estado de Local Cerrado y Logout
│   │   ├── menu/               # Catálogo de Pizzas & Combos (Carrusel 3D)
│   │   ├── pedido/             # Checkout y Despacho a WhatsApp
│   │   ├── privacidad/         # Cumplimiento RGPD / LGPD y Supresión de Datos
│   │   ├── registro/           # Registro de Clientes
│   │   ├── layout.tsx          # Layout Principal con PWA, SEO y Schema.org
│   │   ├── robots.ts           # Configuración SEO de robots.txt
│   │   └── sitemap.ts          # Generador dinámico de sitemap.xml
│   ├── components/             # Componentes modulares reutilizables
│   │   ├── admin/              # Componentes del Dashboard Administrativo
│   │   ├── legal/              # Banner de Consentimiento de Cookies
│   │   ├── menu/               # Carrusel 3D, Selector de Porciones y Toppings
│   │   └── pwa/                # Gestor de Instalación PWA y Notificaciones Push
│   ├── data/                   # Datos iniciales y persistencia local de respaldo
│   │   ├── admin-users.json    # Usuarios administradores por defecto
│   │   ├── catalog.json        # Catálogo base de productos
│   │   ├── push-notifications.json # Historial y plantillas de notificaciones push
│   │   └── tienda-config.json  # Horarios y configuración de tienda
│   └── lib/                    # Lógica de negocio, base de datos y utilidades
│       ├── admin-db.ts         # Autenticación y gestión de usuarios admin
│       ├── catalog-db.ts       # Acceso y mutación del catálogo
│       ├── cloudinary.ts       # Integración con Cloudinary SDK
│       ├── image-processor.ts  # Sharp: Optimización y recorte de fondo automático
│       ├── push-db.ts          # Gestión de suscripciones y emisión Web Push
│       ├── turso.ts            # Cliente LibSQL / Turso Database
│       ├── vapid-server.ts     # Configuración y envío de Web Push VAPID
│       └── whatsapp.ts         # Generador de enlaces y mensajes wa.me
├── public/                     # Assets estáticos, PWA manifest y Service Worker (sw.js)
├── GUIA_INSTALACION.md         # Manual paso a paso para despliegues (PC, VPS, Docker)
├── SAAS_PLATFORM.md            # Especificación completa de arquitectura SaaS y RGPD
├── Dockerfile                  # Contenedor optimizado de producción
├── docker-compose.yml          # Orquestación Docker
└── package.json                # Dependencias y scripts de construcción
```

---

## 🔐 Variables de Entorno (`.env.local`)

| Variable | Descripción | Requerido |
| :--- | :--- | :---: |
| `TURSO_DATABASE_URL` | URL de conexión LibSQL / Turso | Opcional (Fallback local) |
| `TURSO_AUTH_TOKEN` | Token de autenticación de Turso | Opcional (Fallback local) |
| `CLOUDINARY_CLOUD_NAME` | Cloud Name de Cloudinary | Opcional (Fallback local) |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | Opcional (Fallback local) |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | Opcional (Fallback local) |
| `NEXT_PUBLIC_WHATSAPP_NUMERO` | Número internacional para WhatsApp (ej: 5492942661000) | Recomendado |
| `NEXT_PUBLIC_WHATSAPP_LOCAL` | Número en formato legible para la interfaz | Recomendado |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Clave pública Web Push VAPID | Sí (Incluye default) |
| `VAPID_PRIVATE_KEY` | Clave privada Web Push VAPID | Sí (Incluye default) |
| `VAPID_SUBJECT` | Email de contacto VAPID (`mailto:soporte@0600boston.com`) | Sí |

---

## 🛠️ Credenciales de Administración por Defecto

* **URL del Panel:** `/admin`
* **Usuario:** `admin`
* **Contraseña inicial:** `0600boston` *(Modificable desde la pestaña Administradores en el Dashboard)*

---

## 📚 Documentación Adicional

- [Guía de Instalación y Despliegue (GUIA_INSTALACION.md)](./GUIA_INSTALACION.md)
- [Especificación Técnica y Arquitectura SaaS (SAAS_PLATFORM.md)](./SAAS_PLATFORM.md)
- [Plan Inicial de Funcionalidades (PLAN-0600BOSTON.md)](../PLAN-0600BOSTON.md)

---

## 🛡️ Licencia y Créditos

© 2026 **0600Boston**. Producido y desarrollado por **[ADNQN.ar](https://adnqn.ar/)**. Todos los derechos reservados.
