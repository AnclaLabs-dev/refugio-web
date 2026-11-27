import { renderBaseEmailLayout, escapeHtml } from "./base.ts";
import { type WelcomeEmailData } from "../types.ts";

export function renderWelcomeEmail(data: WelcomeEmailData): { subject: string; html: string; text: string } {
  const name = data.userName?.trim() || "Hola";
  const appUrl = data.appUrl || "https://refugio-web.vercel.app";
  const subject = `¡Te damos la bienvenida a Refugio, ${name}! 🛡️`;
  const preheader = "Tu cuenta en Refugio está lista para proteger tus ahorros contra la inflación.";

  const contentHtml = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 800; color: #292524; line-height: 1.3;">
      ¡Te damos la bienvenida a Refugio!
    </h1>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #605A56; line-height: 1.6;">
      Hola <strong>${escapeHtml(name)}</strong>, tu cuenta vinculada a <code>${escapeHtml(data.userEmail)}</code> ya se encuentra activa y lista para operar.
    </p>

    <!-- Caja de Propuesta de Valor -->
    <div style="background-color: #F8F6F0; border-left: 4px solid #6F2BFB; padding: 18px 20px; border-radius: 8px; margin-bottom: 28px;">
      <p style="margin: 0; font-size: 14px; color: #292524; font-weight: 600; line-height: 1.5;">
        Refugio es tu billetera digital anti-inflación diseñada para proteger el poder adquisitivo de tu dinero con cotizaciones transparentes en tiempo real.
      </p>
    </div>

    <!-- Pasos recomendados de inicio -->
    <h2 style="margin: 0 0 14px 0; font-size: 16px; font-weight: 700; color: #292524;">
      Tus próximos pasos:
    </h2>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
      <tr>
        <td style="padding: 10px 0; vertical-align: top; width: 32px;">
          <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #F3E8FF; color: #6F2BFB; font-weight: 800; font-size: 12px; text-align: center; line-height: 24px;">1</div>
        </td>
        <td style="padding: 10px 0 10px 8px; vertical-align: top;">
          <strong style="font-size: 14px; color: #292524;">Fondeá tu billetera:</strong>
          <span style="display: block; font-size: 13px; color: #605A56; margin-top: 2px;">Ingresá ARS o USD mediante depósito simulado instantáneo.</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; vertical-align: top; width: 32px;">
          <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #F3E8FF; color: #6F2BFB; font-weight: 800; font-size: 12px; text-align: center; line-height: 24px;">2</div>
        </td>
        <td style="padding: 10px 0 10px 8px; vertical-align: top;">
          <strong style="font-size: 14px; color: #292524;">Dolarizá o pasá a cripto:</strong>
          <span style="display: block; font-size: 13px; color: #605A56; margin-top: 2px;">Comprá USD, USDT o BTC con tasas oficiales y spot transparentes.</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; vertical-align: top; width: 32px;">
          <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #F3E8FF; color: #6F2BFB; font-weight: 800; font-size: 12px; text-align: center; line-height: 24px;">3</div>
        </td>
        <td style="padding: 10px 0 10px 8px; vertical-align: top;">
          <strong style="font-size: 14px; color: #292524;">Fijá tu Meta de Ahorro:</strong>
          <span style="display: block; font-size: 13px; color: #605A56; margin-top: 2px;">Hacé seguimiento visual de tu progreso y recibí apoyo de nuestro Asistente con IA.</span>
        </td>
      </tr>
    </table>

    <!-- Botón de Llamado a la Acción -->
    <div style="text-align: center; margin: 30px 0 15px 0;">
      <a href="${escapeHtml(appUrl)}" style="display: inline-block; background-color: #6F2BFB; color: #FFFFFF; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 10px rgba(111, 43, 251, 0.25);">
        Ingresar a mi Billetera &rarr;
      </a>
    </div>
  `;

  const html = renderBaseEmailLayout({ title: subject, preheader, contentHtml });

  const text = `¡Te damos la bienvenida a Refugio, ${name}!

Tu cuenta vinculada a ${data.userEmail} ya se encuentra activa.

Refugio es tu billetera digital anti-inflación diseñada para proteger tu dinero con cotizaciones transparentes en tiempo real.

Tus próximos pasos:
1. Fondeá tu billetera en ARS o USD.
2. Dolarizá tus ahorros o adquirí USDT/BTC.
3. Fijá tu Meta de Ahorro y consultá al Asistente Refugio.

Accedé a tu cuenta en: ${appUrl}

© ${new Date().getFullYear()} Refugio - Ancla Labs.
`;

  return { subject, html, text };
}
