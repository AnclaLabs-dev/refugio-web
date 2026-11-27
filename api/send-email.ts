import type { SESClient } from "@aws-sdk/client-ses";
import * as sesSdk from "@aws-sdk/client-ses";
import { renderWelcomeEmail } from "./templates/welcome.ts";
import { renderTransactionEmail } from "./templates/transaction.ts";
import {
  type SendEmailRequestBody,
  type EmailResponseSuccess,
  type EmailResponseError,
  type TransactionEmailData,
  type WelcomeEmailData,
} from "./types.ts";

const { SESClient: SESClientConstructor, SendEmailCommand, VerifyEmailIdentityCommand } = sesSdk;

// Tipado liviano para entornos Serverless de Vercel sin requerir @vercel/node en runtime
interface ServerlessRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}

interface ServerlessResponse {
  status: (statusCode: number) => ServerlessResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => ServerlessResponse;
}

/**
 * Cliente de AWS SES v3 inicializado con variables de entorno
 */
function getSESClient(): { client: SESClient | null; error?: string } {
  const region = process.env.AWS_REGION || "us-east-2";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    return {
      client: null,
      error: "Credenciales de AWS SES no configuradas (AWS_ACCESS_KEY_ID o AWS_SECRET_ACCESS_KEY faltantes)",
    };
  }

  const client = new SESClientConstructor({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return { client };
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  // CORS y cabeceras
  res.setHeader("Content-Type", "application/json");

  // 1. Validar Método HTTP
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Método no permitido. Solo se acepta POST.",
    } satisfies EmailResponseError);
  }

  // 2. Validar Header Secreto de Autorización Compartida
  const configuredSecret = process.env.EMAIL_SERVICE_SECRET;
  if (configuredSecret) {
    const rawHeader = req.headers["x-internal-secret"];
    const receivedSecret = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

    if (!receivedSecret || receivedSecret !== configuredSecret) {
      return res.status(401).json({
        success: false,
        error: "No autorizado. El header x-internal-secret es inválido o no fue provisto.",
      } satisfies EmailResponseError);
    }
  }

  // 3. Parsear y normalizar el cuerpo de la petición
  let body: SendEmailRequestBody;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({
      success: false,
      error: "JSON malformado en el cuerpo de la solicitud.",
    } satisfies EmailResponseError);
  }

  const { action, to, template, data } = body || {};

  if (!to || !to.includes("@")) {
    return res.status(400).json({
      success: false,
      error: "El campo 'to' es obligatorio y debe ser un correo electrónico válido.",
    } satisfies EmailResponseError);
  }

  if (!action || (action !== "SEND_EMAIL" && action !== "VERIFY_IDENTITY")) {
    return res.status(400).json({
      success: false,
      error: "El campo 'action' debe ser 'SEND_EMAIL' o 'VERIFY_IDENTITY'.",
    } satisfies EmailResponseError);
  }

  const isSimulation =
    process.env.ENABLE_EMAIL_SIMULATION === "true" ||
    process.env.NODE_ENV === "test";

  const { client, error: clientError } = getSESClient();

  // 4. ACCIÓN: Registrar y verificar identidad en Sandbox (CreateEmailIdentity)
  if (action === "VERIFY_IDENTITY") {
    if (isSimulation || !client) {
      console.log(`[SES-SIMULACIÓN] Verificación de identidad solicitada para: ${to}`);
      return res.status(200).json({
        success: true,
        action: "VERIFY_IDENTITY",
        status: "PENDING_VERIFICATION",
        details: isSimulation
          ? "Modo simulación activo. AWS SES no fue invocado."
          : `Simulación por falta de credenciales: ${clientError}`,
      } satisfies EmailResponseSuccess);
    }

    try {
      const command = new VerifyEmailIdentityCommand({
        EmailAddress: to,
      });
      await client.send(command);

      return res.status(200).json({
        success: true,
        action: "VERIFY_IDENTITY",
        status: "PENDING_VERIFICATION",
        details: `Se solicitó a AWS SES el envío del correo de verificación a ${to}.`,
      } satisfies EmailResponseSuccess);
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      // Si ya existía, lo consideramos éxito idempotente
      if (errorObj.name === "AlreadyExistsException") {
        return res.status(200).json({
          success: true,
          action: "VERIFY_IDENTITY",
          status: "PENDING_VERIFICATION",
          details: `La identidad ${to} ya se encontraba registrada en AWS SES.`,
        } satisfies EmailResponseSuccess);
      }

      console.error("[SES-ERROR] Error al verificar identidad en SES:", err);
      return res.status(500).json({
        success: false,
        error: `Error al registrar identidad en SES: ${errorObj.message}`,
      } satisfies EmailResponseError);
    }
  }

  // 5. ACCIÓN: Envío de Correo (SEND_EMAIL)
  if (!template || (template !== "WELCOME" && template !== "TRANSACTION_CONFIRMATION")) {
    return res.status(400).json({
      success: false,
      error: "Para la acción SEND_EMAIL, 'template' debe ser 'WELCOME' o 'TRANSACTION_CONFIRMATION'.",
    } satisfies EmailResponseError);
  }

  // Generar contenido según la plantilla
  let subject = "";
  let html = "";
  let text = "";

  if (template === "WELCOME") {
    const welcomeData = (data as WelcomeEmailData) || { userEmail: to };
    const rendered = renderWelcomeEmail({ ...welcomeData, userEmail: to });
    subject = rendered.subject;
    html = rendered.html;
    text = rendered.text;
  } else if (template === "TRANSACTION_CONFIRMATION") {
    const txData = data as TransactionEmailData;
    if (!txData || !txData.transactionId || !txData.type) {
      return res.status(400).json({
        success: false,
        error: "Para 'TRANSACTION_CONFIRMATION', se requieren 'transactionId' y 'type' dentro de 'data'.",
      } satisfies EmailResponseError);
    }
    const rendered = renderTransactionEmail(txData);
    subject = rendered.subject;
    html = rendered.html;
    text = rendered.text;
  }

  const senderEmail = process.env.AWS_SES_FROM_EMAIL || "refugio.anclalabs@gmail.com";

  // En caso de modo simulación
  if (isSimulation || !client) {
    console.log(`[SES-SIMULACIÓN] Correo enviado exitosamente a: ${to}`);
    console.log(`[SES-SIMULACIÓN] Asunto: ${subject}`);
    console.log(`[SES-SIMULACIÓN] Remitente: ${senderEmail}`);

    return res.status(200).json({
      success: true,
      action: "SEND_EMAIL",
      messageId: `simulated-msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      status: "SIMULATED",
      details: isSimulation
        ? "Modo simulación activo."
        : `Simulado por credenciales faltantes: ${clientError}`,
    } satisfies EmailResponseSuccess);
  }

  // Envío real con AWS SES SDK v3
  try {
    const sendCommand = new SendEmailCommand({
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
          Text: {
            Charset: "UTF-8",
            Data: text,
          },
        },
      },
      Source: `Refugio <${senderEmail}>`,
    });

    const response = await client.send(sendCommand);

    return res.status(200).json({
      success: true,
      action: "SEND_EMAIL",
      messageId: response.MessageId,
      status: "SENT",
    } satisfies EmailResponseSuccess);
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    const errorMessage: string = errorObj.message;
    console.error("[SES-ERROR] Falló el envío en AWS SES:", err);

    // Detectar si el fallo es por Sandbox (dirección de destino no verificada)
    if (
      errorObj.name === "MessageRejected" ||
      errorMessage.toLowerCase().includes("not verified") ||
      errorMessage.toLowerCase().includes("identity")
    ) {
      return res.status(422).json({
        success: false,
        error: `La dirección ${to} no está verificada en el Sandbox de AWS SES. Debe ser verificada antes de recibir correos.`,
        needsVerification: true,
        unverifiedEmail: to,
      } satisfies EmailResponseError);
    }

    return res.status(500).json({
      success: false,
      error: `Error interno de AWS SES: ${errorMessage}`,
    } satisfies EmailResponseError);
  }
}
