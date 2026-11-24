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