/**
 * Layout base responsive para correos de Refugio (estilo Stripo).
 * Optimizado para compatibilidad con Gmail, Apple Mail, Outlook y clientes móviles.
 */
export function renderBaseEmailLayout({
  title,
  preheader,
  contentHtml,
}: {
  title: string;
  preheader: string;
  contentHtml: string;
}): string {
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset de clientes */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #F8F6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .stack-column { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F6F0; color: #292524;">
  <!-- Preheader oculto para preview en la bandeja de entrada -->
  <div style="display: none; font-size: 1px; color: #F8F6F0; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${escapeHtml(preheader)}
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F6F0;">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        <!-- Contenedor Principal (Max 600px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E7E3DC; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);">
          
          <!-- Encabezado con Identidad Refugio -->
          <tr>
            <td style="padding: 28px 36px 20px 36px; background-color: #FFFFFF; border-bottom: 1px solid #F1EEE8;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 10px;">
                          <!-- Isotipo Refugio simplificado para emails -->
                          <div style="width: 32px; height: 32px; background-color: #6F2BFB; border-radius: 8px; text-align: center; line-height: 32px; color: #FFFFFF; font-weight: 900; font-size: 18px;">
                            ∩
                          </div>
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-size: 22px; font-weight: 900; color: #292524; letter-spacing: -0.5px;">Refugio</span>
                          <span style="font-size: 11px; font-weight: 700; color: #6F2BFB; background-color: #F3E8FF; padding: 2px 7px; border-radius: 10px; margin-left: 8px; text-transform: uppercase;">Anti-inflación</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="font-size: 12px; color: #8C827A;">
                    Ancla Labs
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cuerpo Principal -->
          <tr>
            <td style="padding: 36px; background-color: #FFFFFF;" class="mobile-padding">
              ${contentHtml}
            </td>
          </tr>

          <!-- Pie de Página -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAFAF7; border-top: 1px solid #F1EEE8; text-align: center;" class="mobile-padding">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #8C827A; line-height: 1.5;">
                Este correo fue enviado de forma automática y segura por <strong>Refugio</strong> (Ancla Labs).<br>
                Si no reconocés esta actividad, ponete en contacto de inmediato con nuestro equipo.
              </p>
              <p style="margin: 0; font-size: 11px; color: #B5AFA8;">
                &copy; ${new Date().getFullYear()} Refugio &bull; Billetera digital anti-inflación &bull; Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function escapeHtml(str: string = ""): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
