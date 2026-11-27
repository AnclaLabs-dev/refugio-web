import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Cargar variables de .env.local manualmente para el runner local de Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

// Importar dinámicamente el handler
const { default: handler } = await import("./api/send-email.ts");

function createMockReqRes({ method = "POST", headers = {}, body = {} }) {
  let statusCode = 200;
  let responseData = null;
  const resHeaders = {};

  const req = {
    method,
    headers,
    body,
  };

  const res = {
    setHeader(name, val) {
      resHeaders[name] = val;
      return res;
    },
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
    },
  };

  return {
    req,
    res,
    getResponse: () => ({ status: statusCode, data: responseData, headers: resHeaders }),
  };
}

async function runTests() {
  console.log("=== INICIO DE PRUEBAS LOCALES DE /api/send-email ===");
  console.log("AWS_REGION:", process.env.AWS_REGION);
  console.log("AWS_SES_FROM_EMAIL:", process.env.AWS_SES_FROM_EMAIL);
  console.log("ENABLE_EMAIL_SIMULATION:", process.env.ENABLE_EMAIL_SIMULATION);
  console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID ? "[CONFIGURADA]" : "[NO CONFIGURADA]");

  const secret = process.env.EMAIL_SERVICE_SECRET || "refugio_ses_secret_sprint2_2026";

  // Test 1: Rechazo de método no POST
  {
    console.log("\n[TEST 1] Método GET debe retornar 405...");
    const mock = createMockReqRes({ method: "GET" });
    await handler(mock.req, mock.res);
    const resp = mock.getResponse();
    console.log("Status:", resp.status, "| Data:", resp.data);
    if (resp.status !== 405) throw new Error("Fallo Test 1");
    console.log("✓ Test 1 superado.");
  }

  // Test 2: Rechazo sin secret header
  {
    console.log("\n[TEST 2] Petición sin header x-internal-secret debe retornar 401...");
    const mock = createMockReqRes({
      method: "POST",
      headers: {},
      body: { action: "VERIFY_IDENTITY", to: "test@anclalabs.dev" },
    });
    await handler(mock.req, mock.res);
    const resp = mock.getResponse();
    console.log("Status:", resp.status, "| Data:", resp.data);
    if (resp.status !== 401) throw new Error("Fallo Test 2");
    console.log("✓ Test 2 superado.");
  }

  // Test 3: Envío de Welcome Email
  {
    console.log("\n[TEST 3] Envío de Welcome Email con secret válido...");
    const mock = createMockReqRes({
      method: "POST",
      headers: { "x-internal-secret": secret },
      body: {
        action: "SEND_EMAIL",
        to: process.env.AWS_SES_FROM_EMAIL || "refugio.anclalabs@gmail.com",
        template: "WELCOME",
        data: {
          userName: "Gabriel Rey",
          userEmail: process.env.AWS_SES_FROM_EMAIL || "refugio.anclalabs@gmail.com",
        },
      },
    });
    await handler(mock.req, mock.res);
    const resp = mock.getResponse();
    console.log("Status:", resp.status, "| Data:", resp.data);
    if (resp.status !== 200 && resp.status !== 422) throw new Error(`Fallo Test 3: status ${resp.status}`);
    console.log("✓ Test 3 superado.");
  }

  // Test 4: Envío de Confirmación de Transacción (Compra de USDT)
  {
    console.log("\n[TEST 4] Envío de Confirmación de Transacción (BUY)...");
    const mock = createMockReqRes({
      method: "POST",
      headers: { "x-internal-secret": secret },
      body: {
        action: "SEND_EMAIL",
        to: process.env.AWS_SES_FROM_EMAIL || "refugio.anclalabs@gmail.com",
        template: "TRANSACTION_CONFIRMATION",
        data: {
          userName: "Gabriel Rey",
          transactionId: "tx_9876543210abcdef",
          type: "BUY",
          fromCurrency: "ARS",
          fromAmount: "120000.00",
          toCurrency: "USDT",
          toAmount: "100.000000",
          rate: "1200.00 ARS/USDT",
          spread: "0.005",
          balanceAfter: "100.000000",
          idempotencyKey: "idem_abc_123_test",
        },
      },
    });
    await handler(mock.req, mock.res);
    const resp = mock.getResponse();
    console.log("Status:", resp.status, "| Data:", resp.data);
    if (resp.status !== 200 && resp.status !== 422) throw new Error(`Fallo Test 4: status ${resp.status}`);
    console.log("✓ Test 4 superado.");
  }

  // Test 5: Acción VERIFY_IDENTITY
  {
    console.log("\n[TEST 5] Acción VERIFY_IDENTITY...");
    const mock = createMockReqRes({
      method: "POST",
      headers: { "x-internal-secret": secret },
      body: {
        action: "VERIFY_IDENTITY",
        to: "nuevo_usuario@ejemplo.com",
      },
    });
    await handler(mock.req, mock.res);
    const resp = mock.getResponse();
    console.log("Status:", resp.status, "| Data:", resp.data);
    if (resp.status !== 200) throw new Error(`Fallo Test 5: status ${resp.status}`);
    console.log("✓ Test 5 superado.");
  }

  console.log("\n=== TODAS LAS PRUEBAS LOCALES FINALIZARON CON ÉXITO ===");
}

runTests().catch((err) => {
  console.error("ERROR EN PRUEBAS:", err);
  process.exit(1);
});
