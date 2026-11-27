import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ApiError } from "../services/api";
import {
  getExchangeQuote,
  type ExchangeQuote,
  type TradeCurrency,
} from "../services/exchange";
import {
  getWallet,
  type WalletBalance,
} from "../services/wallet";

type TradeMode = "buy" | "sell";
type FiatCurrency = "ARS" | "USD";
type CryptoCurrency = "USDT" | "BTC";

const fiatCurrencies: FiatCurrency[] = ["ARS", "USD"];
const cryptoCurrencies: CryptoCurrency[] = ["USDT", "BTC"];

function formatAmount(value: string): string {
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value);

  if (!match) return value;

  const [, sign, integer, fraction] = match;
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${sign}${grouped}${
    fraction !== undefined ? `,${fraction}` : ""
  }`;
}

// Desplaza dos posiciones decimales sin convertir el importe a Number.
function formatSpread(value: string): string {
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value);

  if (!match) return "No disponible";

  const [, sign, integer, fraction = ""] = match;
  const paddedFraction = fraction.padEnd(2, "0");

  const percentInteger = `${integer}${paddedFraction.slice(0, 2)}`
    .replace(/^0+(?=\d)/, "");

  const percentFraction = paddedFraction
    .slice(2)
    .replace(/0+$/, "")
    .padEnd(2, "0");

  return `${formatAmount(
    `${sign}${percentInteger}.${percentFraction}`,
  )} %`;
}

// Compara importes positivos sin convertirlos a Number.
function exceedsBalance(amount: string, balance: string): boolean {
  const [amountInteger, amountFraction = ""] = amount.split(".");
  const [balanceInteger, balanceFraction = ""] = balance.split(".");

  const leftInteger = amountInteger.replace(/^0+(?=\d)/, "");
  const rightInteger = balanceInteger.replace(/^0+(?=\d)/, "");

  if (leftInteger.length !== rightInteger.length) {
    return leftInteger.length > rightInteger.length;
  }

  if (leftInteger !== rightInteger) {
    return leftInteger > rightInteger;
  }

  const decimals = Math.max(
    amountFraction.length,
    balanceFraction.length,
  );

  return (
    amountFraction.padEnd(decimals, "0") >
    balanceFraction.padEnd(decimals, "0")
  );
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "Fecha no disponible";
  }

  return date.toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getQuoteError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Tu sesión no está disponible. Volvé a iniciar sesión.";
    }

    if (error.status === 503) {
      return "No hay una cotización vigente para operar. Intentá más tarde.";
    }

    if (error.status === 400 || error.status === 422) {
      return error.message;
    }
  }

  return "No pudimos obtener la vista previa. Intentá nuevamente.";
}

export default function TradePage() {
  useDocumentTitle("Comprar y Vender | Refugio");

  const [mode, setMode] = useState<TradeMode>("buy");
  const [fiat, setFiat] = useState<FiatCurrency>("ARS");
  const [crypto, setCrypto] = useState<CryptoCurrency>("USDT");
  const [amount, setAmount] = useState("");

  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [walletStatus, setWalletStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [walletAttempt, setWalletAttempt] = useState(0);

  const [quote, setQuote] = useState<ExchangeQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [requestError, setRequestError] = useState("");

  const amountInput = useRef<HTMLInputElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const quoteController = useRef<AbortController | null>(null);
  const quotePending = useRef(false);

  const from: TradeCurrency = mode === "buy" ? fiat : crypto;
  const to: TradeCurrency = mode === "buy" ? crypto : fiat;

  const sourceBalance = balances.find(
    (balance) => balance.currency_code === from,
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadWallet() {
      setWalletStatus("loading");

      try {
        const response = await getWallet(controller.signal);

        if (!controller.signal.aborted) {
          setBalances(response.wallet.balances);
          setWalletStatus("success");
        }
      } catch {
        if (!controller.signal.aborted) {
          setBalances([]);
          setWalletStatus("error");
        }
      }
    }

    void loadWallet();

    return () => controller.abort();
  }, [walletAttempt]);

  useEffect(() => {
    return () => {
      quoteController.current?.abort();
    };
  }, []);

  // Al recibir una vista previa, lleva la atención al resultado.
  useEffect(() => {
    if (!quote || !previewHeading.current) return;

    const heading = previewHeading.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    heading.focus({ preventScroll: true });
    heading.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [quote]);

  function clearPreview() {
    setQuote(null);
    setAmountError("");
    setRequestError("");
  }

  function changeMode(nextMode: TradeMode) {
    setMode(nextMode);
    setAmount("");
    clearPreview();
  }

  function showAmountError(message: string) {
    setAmountError(message);
    amountInput.current?.focus();
  }

  async function handlePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (quotePending.current) return;

    clearPreview();

    const normalizedAmount = amount.trim().replace(",", ".");

    if (!/^\d+(?:\.\d+)?$/.test(normalizedAmount)) {
      showAmountError(
        "Ingresá un monto válido, sin separadores de miles. Podés usar coma o punto decimal.",
      );
      return;
    }

    if (!/[1-9]/.test(normalizedAmount)) {
      showAmountError("El monto debe ser mayor que cero.");
      return;
    }

    if (!sourceBalance || walletStatus !== "success") {
      setRequestError(
        "Necesitamos consultar tu saldo antes de continuar.",
      );
      return;
    }

    const decimals = normalizedAmount.split(".")[1]?.length ?? 0;

    if (decimals > sourceBalance.decimals) {
      showAmountError(
        `${from} admite hasta ${sourceBalance.decimals} decimales.`,
      );
      return;
    }

    if (exceedsBalance(normalizedAmount, sourceBalance.amount)) {
      showAmountError("El monto supera tu saldo disponible.");
      return;
    }

    const controller = new AbortController();

    quoteController.current = controller;
    quotePending.current = true;
    setQuoting(true);

    try {
      const response = await getExchangeQuote(
        {
          from,
          to,
          amount: normalizedAmount,
        },
        controller.signal,
      );

      if (!controller.signal.aborted) {
        setQuote(response.quote);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setRequestError(getQuoteError(error));
      }
    } finally {
      quotePending.current = false;

      if (!controller.signal.aborted) {
        setQuoting(false);
      }
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-xs font-extrabold tracking-widest text-brand uppercase">
            Operaciones de práctica
          </p>

          <h1 className="mt-3">Comprar y vender</h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Elegí tus monedas e ingresá el monto que querés entregar.
            Revisá la cotización antes de continuar.
          </p>
        </header>

       <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-3">
          <form
            onSubmit={(event) => {
              void handlePreview(event);
            }}
            noValidate
            className="min-w-0 rounded-3xl border border-line bg-surface p-5 sm:p-7 lg:col-span-2"
          >
            <fieldset disabled={quoting} className="min-w-0 space-y-5">
              <legend className="sr-only">
                Configuración de compra o venta
              </legend>

              <div
                role="group"
                aria-label="Tipo de operación"
                className="grid grid-cols-2 gap-1 rounded-xl bg-surface-soft p-1"
              >
                {([
                  { value: "buy", label: "Comprar" },
                  { value: "sell", label: "Vender" },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={mode === option.value}
                    onClick={() => changeMode(option.value)}
                    className={[
                      "min-h-11 rounded-lg px-3 py-2 text-sm font-bold",
                      mode === option.value
                        ? "bg-surface text-brand shadow-sm"
                        : "text-muted hover:text-ink",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="trade-fiat"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Moneda fiat
                  </label>

                  <select
                    id="trade-fiat"
                    value={fiat}
                    onChange={(event) => {
                      setFiat(event.target.value as FiatCurrency);
                      setAmount("");
                      clearPreview();
                    }}
                    className="min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-2"
                  >
                    {fiatCurrencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="trade-crypto"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Criptomoneda
                  </label>

                  <select
                    id="trade-crypto"
                    value={crypto}
                    onChange={(event) => {
                      setCrypto(
                        event.target.value as CryptoCurrency,
                      );
                      setAmount("");
                      clearPreview();
                    }}
                    className="min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-2"
                  >
                    {cryptoCurrencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-page p-4">
                <label
                  htmlFor="trade-amount"
                  className="block text-sm font-semibold"
                >
                  Monto que entregás en {from}
                </label>

                <input
                  ref={amountInput}
                  id="trade-amount"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    clearPreview();
                  }}
                  aria-describedby={[
                    "trade-amount-hint",
                    "trade-balance",
                    amountError ? "trade-amount-error" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-invalid={amountError ? true : undefined}
                  placeholder="0"
                  className={[
                    "mt-3 min-h-12 w-full min-w-0 rounded-xl border",
                    "bg-surface px-3 py-2 text-xl font-bold tabular-nums",
                    amountError ? "border-danger" : "border-line",
                  ].join(" ")}
                />

                <p
                  id="trade-amount-hint"
                  className="mt-2 text-xs text-muted"
                >
                  Sin separadores de miles. Recibirás {to}.
                </p>

                {amountError && (
                  <p
                    id="trade-amount-error"
                    role="alert"
                    className="mt-2 text-sm text-danger"
                  >
                    {amountError}
                  </p>
                )}

                <p
                  id="trade-balance"
                  className="mt-3 wrap-anywhere text-xs font-semibold text-muted"
                >
                  {walletStatus === "loading"
                    ? "Consultando saldo…"
                    : walletStatus === "error"
                      ? "Saldo no disponible."
                      : sourceBalance
                        ? `Disponible: ${formatAmount(sourceBalance.amount)} ${from}`
                        : `No hay un saldo disponible para ${from}.`}
                </p>
              </div>
            </fieldset>

            {walletStatus === "error" && (
              <div className="mt-4">
                <p role="alert" className="text-sm text-danger">
                  No pudimos consultar tu billetera.
                </p>

                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => {
                    setWalletAttempt((value) => value + 1);
                  }}
                >
                  Reintentar carga de saldo
                </Button>
              </div>
            )}

            {requestError && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-danger-surface p-3 text-sm text-danger"
              >
                {requestError}
              </p>
            )}

            <Button
              type="submit"
              loading={quoting}
              loadingText="Consultando…"
              disabled={
                walletStatus !== "success" ||
                !sourceBalance ||
                !amount.trim()
              }
              className="mt-5 w-full"
            >
              {quote ? "Actualizar vista previa" : "Ver vista previa"}
            </Button>
          </form>

          <aside className="min-w-0 space-y-5">
            <section
              aria-labelledby="trade-preview-title"
              aria-busy={quoting}
              className="rounded-3xl border border-line bg-surface p-5"
            >
              <h2
                ref={previewHeading}
                id="trade-preview-title"
                tabIndex={-1}
                className="scroll-mt-6 rounded-md text-lg font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Vista previa
              </h2>

              {quoting ? (
                <p role="status" className="mt-4 text-sm text-muted">
                  Consultando las condiciones de la operación…
                </p>
              ) : quote ? (
                <div className="mt-4 space-y-4">
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-xs text-muted">
                        Entregás
                      </dt>

                      <dd className="mt-1 wrap-anywhere font-bold tabular-nums">
                        {formatAmount(quote.from_amount)}{" "}
                        {quote.from_currency}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-brand-soft p-3">
                      <dt className="text-xs text-muted">
                        Recibirías
                      </dt>

                      <dd className="mt-1 wrap-anywhere text-xl font-extrabold text-brand tabular-nums">
                        {formatAmount(quote.to_amount)}{" "}
                        {quote.to_currency}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs text-muted">
                        Tasa aplicada
                      </dt>

                      <dd className="mt-1 wrap-anywhere text-sm">
                        1 {quote.from_currency} ={" "}
                        {formatAmount(quote.rate)}{" "}
                        {quote.to_currency}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs text-muted">
                        Spread aplicado
                      </dt>

                      <dd className="mt-1 wrap-anywhere text-sm font-semibold tabular-nums">
                        {formatSpread(quote.spread)}
                      </dd>
                    </div>

                    <div className="border-t border-line pt-3">
                      <dt className="text-xs text-muted">
                        Fuente
                      </dt>

                      <dd className="mt-1 wrap-anywhere text-xs">
                        {quote.rate_source}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs text-muted">
                        Cotización consultada
                      </dt>

                      <dd className="mt-1 text-xs">
                        {formatDate(quote.rate_fetched_at)}
                      </dd>
                    </div>
                  </dl>

                  <p className="text-xs leading-relaxed text-muted">
                    Esta consulta no modifica tus balances.
                  </p>

                  <Button disabled className="w-full">
                    Confirmación en preparación
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Completá el formulario para consultar cuánto
                  recibirías y revisar la tasa aplicada.
                </p>
              )}
            </section>

            <section
              aria-labelledby="trade-help-title"
              className="rounded-3xl border border-line bg-surface p-5"
            >
              <h2 id="trade-help-title" className="text-sm font-bold">
                Operaciones de simulación
              </h2>

              <p className="mt-3 text-xs leading-relaxed text-muted">
                Utilizás los fondos ficticios de tu billetera.
                La vista previa consulta las condiciones al backend;
                no calcula los precios en tu navegador.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}