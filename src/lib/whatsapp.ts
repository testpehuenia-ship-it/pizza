import { WHATSAPP_NUMERO } from "./data";
import { ItemCarritoPizza, ItemCarritoBebida, Cliente } from "./store";

export function generarMensajeWhatsApp(
  cliente: Cliente | null,
  pizzas: ItemCarritoPizza[],
  bebidas: ItemCarritoBebida[],
  tipoEntrega: "delivery" | "retiro",
  domicilio: string,
  total: number
): string {
  let msg = `🍕 *PEDIDO - 0600BOSTON*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  
  if (cliente) {
    msg += `👤 *Cliente:* ${cliente.nombre} ${cliente.apellido}\n`;
    msg += `📱 *Tel:* ${cliente.telefono}\n`;
  }
  
  msg += `🛵 *Modalidad:* ${tipoEntrega === "delivery" ? "Delivery a Domicilio" : "Retiro en Local"}\n`;
  if (tipoEntrega === "delivery") {
    msg += `🏠 *Dirección:* ${domicilio || cliente?.domicilio || "A coordinar"}\n`;
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
