import { apiFetch } from "./api";

export type TradeCurrency = "ARS" | "USD" | "USDT" | "BTC";

export interface ExchangeQuoteParams {
  from: TradeCurrency;
  to: TradeCurrency;
  amount: string;
}

export interface ExchangeQuote {
  from_currency: TradeCurrency;
  from_amount: string;
  to_currency: TradeCurrency;
  to_amount: string;
  rate: string;
  mid_to_amount: string;
  spread: string;
  type: string;
  rate_type: string;
  rate_source: string;
  rate_fetched_at: string;
}

interface ExchangeQuoteResponse {
  quote: ExchangeQuote;
}

export async function getExchangeQuote(
  params: ExchangeQuoteParams,
  signal?: AbortSignal,
): Promise<ExchangeQuoteResponse> {
  return apiFetch<ExchangeQuoteResponse>("/exchange/quote", {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });
}