import { apiFetch, ApiError } from "./api";

export interface WalletBalance {
  currency_code: string;
  name: string;
  type: "fiat" | "crypto";
  decimals: number;
  amount: string;
  updated_at: string;
}

interface WalletResponse {
  wallet: {
    id: string;
    balances: WalletBalance[];
  };
}

export type DepositCurrency = "ARS" | "USD";

export const DEPOSIT_LIMITS: Record<DepositCurrency, { perDeposit: number; daily: number }> = {
  ARS: { perDeposit: 1_000_000, daily: 100_000_000 },
  USD: { perDeposit: 1_000, daily: 100_000 },
};

export interface DepositResult {
  deposit: {
    id: string;
    type: "DEPOSIT";
    currency: DepositCurrency;
    amount: string;
    balance_after: string;
    idempotency_key: string;
    email_status: "PENDING" | "SENT" | "FAILED";
    created_at: string;
  };
  replayed: boolean;
}

export interface CreateDepositParams {
  currency: DepositCurrency;
  amount: number | string;
  idempotency_key?: string;
}

export async function getWallet(
  signal: AbortSignal,
): Promise<WalletResponse> {
  try {
    return await apiFetch<WalletResponse>("/wallet", { signal });
  } catch (error) {
    // Recupera cuentas cuya sincronización anterior haya fallado.
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error;
    }

    await apiFetch("/auth/sync", {
      method: "POST",
      signal,
    });

    return apiFetch<WalletResponse>("/wallet", { signal });
  }
}

/**
 * Realiza una recarga de saldo en la cuenta del usuario en PostgreSQL.
 * Envía el contrato estricto requerido por el backend: currency, amount e idempotency_key.
 */
export async function createDeposit(
  params: CreateDepositParams,
  signal?: AbortSignal,
): Promise<DepositResult> {
  const idempotency_key = params.idempotency_key || crypto.randomUUID();
  const amountStr =
    typeof params.amount === "number"
      ? params.amount.toFixed(2).replace(/\.00$/, "")
      : params.amount;

  return apiFetch<DepositResult>("/wallet/deposit", {
    method: "POST",
    body: JSON.stringify({
      currency: params.currency,
      amount: amountStr,
      idempotency_key,
    }),
    signal,
  });
}
