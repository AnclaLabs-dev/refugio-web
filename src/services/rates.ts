import { apiFetch } from "./api";

export type RateType = "oficial" | "spot";

export interface Rate {
  pair: string;
  base: string;
  quote: string;
  rate_type: RateType;
  buy: string;
  sell: string;
  source: string;
  fetched_at: string;
  stale: boolean;
}

export interface RatesResponse {
  rates: Rate[];
  ttl_minutes: number;
}

/**
 * Obtiene las cotizaciones actuales con caché del backend.
 * Es un endpoint público (no requiere autenticación).
 */
export async function getRates(signal?: AbortSignal): Promise<RatesResponse> {
  return apiFetch<RatesResponse>("/rates", {
    requiresAuth: false,
    signal,
  });
}
