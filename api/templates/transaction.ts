import { renderBaseEmailLayout, escapeHtml } from "./base.ts";
import { type TransactionEmailData, type TransactionType } from "../types.ts";

const TRANSACTION_CONFIG: Record<TransactionType, { title: string; badgeText: string; badgeBg: string; badgeColor: string }> = {
  DEPOSIT: {
    title: "Depósito acreditado",
    badgeText: "FONDEO EXITOSO",
    badgeBg: "#DCFCE7",
    badgeColor: "#15803D",
  },
  BUY: {
    title: "Compra confirmada",
    badgeText: "COMPRA EXITOSA",
    badgeBg: "#E0F2FE",
    badgeColor: "#0369A1",
  },
  SELL: {
    title: "Venta confirmada",
    badgeText: "VENTA EXITOSA",
    badgeBg: "#FEF3C7",
    badgeColor: "#B45309",
  },
  EXCHANGE: {
    title: "Intercambio completado",
    badgeText: "SWAP EXITOSO",
    badgeBg: "#F3E8FF",
    badgeColor: "#6F2BFB",
  },
};

export function renderTransactionEmail(data: TransactionEmailData): { subject: string; html: string; text: string } {
  const config = TRANSACTION_CONFIG[data.type] || TRANSACTION_CONFIG.DEPOSIT;
  const name = data.userName?.trim() || "Usuario";
  const dateStr = data.date || new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
  const subject = `Comprobante de operación: ${config.title} (#${data.transactionId.slice(0, 8)})`;
  const preheader = `Tu operación de ${config.title.toLowerCase()} en Refugio se ejecutó con éxito.`;

  // Construir filas de detalles según el tipo de operación
  const rows: { label: string; value: string; bold?: boolean }[] = [];

  if (data.type === "DEPOSIT") {
    rows.push({ label: "Monto acreditado", value: `${data.toAmount || data.fromAmount || "0"} ${data.toCurrency || data.fromCurrency || "ARS"}`, bold: true });
    if (data.balanceAfter) {
      rows.push({ label: "Saldo resultante", value: `${data.balanceAfter} ${data.toCurrency || "ARS"}` });
    }
  } else {
    if (data.fromAmount && data.fromCurrency) {
      rows.push({ label: "Entregaste", value: `${data.fromAmount} ${data.fromCurrency}` });
    }
    if (data.toAmount && data.toCurrency) {
      rows.push({ label: "Recibiste", value: `${data.toAmount} ${data.toCurrency}`, bold: true });
    }
    if (data.rate) {
      rows.push({ label: "Tasa de cambio", value: data.rate });
    }
    if (data.spread) {
      rows.push({ label: "Spread de la operación", value: `${(Number(data.spread) * 100).toFixed(2)}%` });
    }
    if (data.balanceAfter && data.toCurrency) {
      rows.push({ label: `Saldo final en ${data.toCurrency}`, value: `${data.balanceAfter} ${data.toCurrency}` });
    }
  }

  rows.push({ label: "Fecha y hora", value: dateStr });
  rows.push({ label: "ID de transacción", value: data.transactionId });
  if (data.idempotencyKey) {
    rows.push({ label: "Clave de idempotencia", value: data.idempotencyKey.slice(0, 16) + "..." });
  }

  const tableRowsHtml = rows
    .map(
      (r) => `
      <tr>
        <td style="padding: 12px 14px; font-size: 13px; color: #605A56; border-bottom: 1px solid #F1EEE8;">
          ${escapeHtml(r.label)}
        </td>
        <td align="right" style="padding: 12px 14px; font-size: 14px; color: #292524; font-weight: ${r.bold ? "700" : "500"}; border-bottom: 1px solid #F1EEE8;">
          ${escapeHtml(r.value)}
        </td>
      </tr>
    `
    )
    .join("");

  const contentHtml = `
    <!-- Badge de Estado -->
    <div style="margin-bottom: 16px;">
      <span style="display: inline-block; background-color: ${config.badgeBg}; color: ${config.badgeColor}; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.5px;">
        ${config.badgeText}
      </span>
    </div>

    <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #292524;">
      ${config.title}
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 14px; color: #605A56;">
      Hola <strong>${escapeHtml(name)}</strong>, confirmamos que tu operación se procesó correctamente en tu billetera Refugio.
    </p>

    <!-- Resumen de Transacción -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FBF9F6; border: 1px solid #EFECE6; border-radius: 12px; margin-bottom: 26px; overflow: hidden;">
      ${tableRowsHtml}
    </table>

    <div style="background-color: #F8F6F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 12px; color: #605A56; line-height: 1.5;">
        🔒 <strong>Transparencia Refugio:</strong> Las cotizaciones aplicadas provienen directamente de fuentes oficiales y de mercado en tiempo real, garantizando trazabilidad total.
      </p>
    </div>

    <!-- Botón a Movimientos -->
    <div style="text-align: center;">
      <a href="https://refugio-web.vercel.app/movements" style="display: inline-block; background-color: #292524; color: #FFFFFF; font-weight: 600; font-size: 13px; padding: 10px 22px; border-radius: 8px; text-decoration: none;">
        Ver en mi Historial de Movimientos &rarr;
      </a>
    </div>
  `;

  const html = renderBaseEmailLayout({ title: subject, preheader, contentHtml });

  const textRows = rows.map((r) => `- ${r.label}: ${r.value}`).join("\n");
  const text = `Comprobante de Operación - Refugio

${config.title}
Hola ${name}, confirmamos que tu operación se procesó con éxito.

Detalles:
${textRows}

Podés revisar tu historial completo en https://refugio-web.vercel.app/movements

© ${new Date().getFullYear()} Refugio - Ancla Labs.
`;

  return { subject, html, text };
}
