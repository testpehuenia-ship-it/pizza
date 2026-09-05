import { WHATSAPP_NUMERO } from "./data";
import { ItemCarritoPizza, ItemCarritoBebida, ItemCarritoCombo, Cliente } from "./store";

export function generarMensajeWhatsApp(
  cliente: Cliente | null,
  pizzas: ItemCarritoPizza[],
  bebidas: ItemCarritoBebida[],
  tipoEntrega: "delivery" | "retiro",
  domicilio: string,
  total: number,
  datosGps?: {
    lat: number;
    lng: number;
    calleAprox?: string;
    nota?: string;
  } | null,
  combos?: ItemCarritoCombo[]
): string {
  let msg = `🍕 *PEDIDO - 0600BOSTON*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  
  if (cliente) {
    msg += `👤 *Cliente:* ${cliente.nombre} ${cliente.apellido}\n`;
    msg += `📱 *Tel:* ${cliente.telefono}\n`;
  }
  
  msg += `🛵 *Modalidad:* ${tipoEntrega === "delivery" ? "Delivery a Domicilio" : "Retiro en Local"}\n`;
  if (tipoEntrega === "delivery") {
    if (datosGps) {
      msg += `📍 *Ubicación del Celular (GPS):*\n`;
      if (datosGps.calleAprox) {
        msg += `🏠 *Dirección aprox:* ${datosGps.calleAprox}\n`;
      }
      msg += `📌 *Coordenadas:* ${datosGps.lat.toFixed(6)}, ${datosGps.lng.toFixed(6)}\n`;
      msg += `🗺️ *Mapa Repartidor:* https://www.google.com/maps?q=${datosGps.lat},${datosGps.lng}\n`;
      if (datosGps.nota) {
        msg += `📝 *Aclaración / Timbre:* ${datosGps.nota}\n`;
      }
    } else {
      msg += `🏠 *Dirección de Entrega:* ${domicilio || cliente?.domicilio || "A coordinar"}\n`;
    }
  }
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📋 *DETALLE DEL PEDIDO:*\n\n`;

  if (pizzas.length > 0) {
    msg += `*🍕 PIZZAS:*\n`;
    pizzas.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.pizza.nombre}* (${item.tamaño} porciones)\n`;
      if (item.aderezos && item.aderezos.length > 0) {
        msg += `   └ Aderezos: ${item.aderezos.join(", ")}\n`;
      }
      msg += `   └ Subtotal: $${item.precio.toLocaleString("es-AR")}\n`;
    });
    msg += `\n`;
  }

  if (combos && combos.length > 0) {
    msg += `*🎁 COMBOS ESPECIALES:*\n`;
    combos.forEach((item, idx) => {
      const subtotal = item.precioUnitario * item.cantidad;
      msg += `${idx + 1}. ${item.cantidad}x *${item.combo.nombre}* - $${subtotal.toLocaleString("es-AR")}\n`;
      msg += `   └ Incluye: ${item.combo.pizzaNombre} (${item.combo.pizzaTamano}p) + ${item.combo.bebidaNombre}\n`;
      if (item.aderezosPersonalizados && item.aderezosPersonalizados.length > 0) {
        msg += `   └ Aderezos: ${item.aderezosPersonalizados.join(", ")}\n`;
      }
    });
    msg += `\n`;
  }

  if (bebidas.length > 0) {
    msg += `*🥤 BEBIDAS:*\n`;
    bebidas.forEach((item) => {
      const subtotal = item.precioUnitario * item.cantidad;
      msg += `• ${item.cantidad}x *${item.bebida.nombre}* - $${subtotal.toLocaleString("es-AR")}\n`;
    });
    msg += `\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *TOTAL A PAGAR:* $${total.toLocaleString("es-AR")}\n\n`;
  msg += `_¡Muchas gracias por elegir Pizzería 0600Boston! Aguardo confirmación de demora estimada._`;

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;
}
