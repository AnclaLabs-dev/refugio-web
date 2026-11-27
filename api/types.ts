export type TransactionType = "DEPOSIT" | "BUY" | "SELL" | "EXCHANGE";

export interface TransactionEmailData {
  userName?: string;
  transactionId: string;
  type: TransactionType;
  fromCurrency?: string;
  fromAmount?: string;
  toCurrency?: string;
  toAmount?: string;
  rate?: string;
  spread?: string;
  balanceAfter?: string;
  date?: string;
  idempotencyKey?: string;
}

export interface WelcomeEmailData {
  userName?: string;
  userEmail: string;
  appUrl?: string;
}

export type EmailTemplateType = "WELCOME" | "TRANSACTION_CONFIRMATION";

export type EmailAction = "SEND_EMAIL" | "VERIFY_IDENTITY";

export interface SendEmailRequestBody {
  action: EmailAction;
  to: string;
  template?: EmailTemplateType;
  data?: TransactionEmailData | WelcomeEmailData;
}

export interface EmailResponseSuccess {
  success: true;
  action: EmailAction;
  messageId?: string;
  status: "SENT" | "PENDING_VERIFICATION" | "SIMULATED";
  details?: string;
}

export interface EmailResponseError {
  success: false;
  error: string;
  needsVerification?: boolean;
  unverifiedEmail?: string;
}
