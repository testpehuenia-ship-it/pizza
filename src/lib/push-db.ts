import fs from "fs/promises";
import path from "path";
import { getTursoClient } from "./turso";

export interface PushNotificationRecord {
  id: string;
  titulo: string;
  mensaje: string;
  url: string;
  icono: string;
  fecha: string;
  destinatarios: string;
  estado: "enviada" | "programada";
}

export interface PushSubscriptionItem {
  id: string;
  endpoint: string;
  created_at: string;
  userAgent?: string;
}

const PUSH_DATA_FILE = path.join(process.cwd(), "src", "data", "push-notifications.json");

interface PushDataStore {
  historial: PushNotificationRecord[];
  suscripciones: PushSubscriptionItem[];
}

const DEFAULT_PUSH_DATA: PushDataStore = {
  historial: [
    {
      id: "push_1",
      titulo: "¡Bienvenido a 0600Boston! 🍕🍀",
      mensaje: "Gracias por sumarte. Mirá las pizzas artesanales y combos que tenemos para vos hoy.",
      url: "/menu",
      icono: "🍀",
      fecha: new Date(Date.now() - 86400000).toISOString(),
      destinatarios: "Nuevos Clientes",
      estado: "enviada",
    },
    {
      id: "push_2",
      titulo: "🔥 Promo Fin de Semana: 20% OFF en Napolitana",
      mensaje: "Aprovechá hoy tu pizza Napolitana grande 8 porciones a precio especial.",
      url: "/menu",
      icono: "🍕",
      fecha: new Date().toISOString(),
      destinatarios: "Todos los Clientes",
      estado: "enviada",
    },
  ],
  suscripciones: [],
};

let memoryPushCache: PushDataStore | null = null;

async function persistPushData(data: PushDataStore): Promise<void> {
  memoryPushCache = data;
  try {
    const dir = path.dirname(PUSH_DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(PUSH_DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error al guardar push-notifications.json:", err);
  }

  const db = getTursoClient();
  if (db) {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS tienda_push (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await db.execute({
        sql: `INSERT INTO tienda_push (key, value, updated_at) VALUES ('main_push', ?, CURRENT_TIMESTAMP)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
        args: [JSON.stringify(data)],
      });
    } catch (e) {
      console.warn("Turso no disponible para push, usando almacenamiento local:", e);
    }
  }
}

export async function getPushData(): Promise<PushDataStore> {
  if (memoryPushCache) return memoryPushCache;

  const db = getTursoClient();
  if (db) {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS tienda_push (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const res = await db.execute(`SELECT value FROM tienda_push WHERE key = 'main_push' LIMIT 1`);
      if (res.rows.length > 0 && res.rows[0].value) {
        const parsed = JSON.parse(String(res.rows[0].value)) as PushDataStore;
        memoryPushCache = parsed;
        return parsed;
      }
    } catch (e) {}
  }

  try {
    const content = await fs.readFile(PUSH_DATA_FILE, "utf-8");
    const parsed = JSON.parse(content) as PushDataStore;
    memoryPushCache = parsed;
    return parsed;
  } catch {
    await persistPushData(DEFAULT_PUSH_DATA);
    return DEFAULT_PUSH_DATA;
  }
}

export async function agregarNotificacionPush(
  notif: Omit<PushNotificationRecord, "id" | "fecha" | "estado">
): Promise<PushNotificationRecord> {
  const store = await getPushData();
  const nueva: PushNotificationRecord = {
    id: `push_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fecha: new Date().toISOString(),
    estado: "enviada",
    ...notif,
  };
  store.historial.unshift(nueva);
  await persistPushData(store);
  return nueva;
}

export async function registrarSuscripcionPush(
  endpoint: string,
  userAgent?: string
): Promise<boolean> {
  const store = await getPushData();
  if (!store.suscripciones.some((s) => s.endpoint === endpoint)) {
    store.suscripciones.push({
      id: `sub_${Date.now()}`,
      endpoint,
      created_at: new Date().toISOString(),
      userAgent,
    });
    await persistPushData(store);
  }
  return true;
}
