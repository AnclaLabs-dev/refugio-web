import { auth } from "./firebase";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://refugio-api-production-1c49e3aa.up.railway.app"
).replace(/\/+$/, "");

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === "object") {
    if ("error" in data && typeof data.error === "string") {
      return data.error;
    }

    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }
  }

  return `No pudimos completar la solicitud (HTTP ${status}).`;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    requiresAuth = true,
    headers,
    ...requestOptions
  } = options;

  if (!endpoint.startsWith("/") || endpoint.startsWith("//")) {
    throw new Error(
      "La ruta de la API debe comenzar con una sola /.",
    );
  }

  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (
    requestOptions.body != null &&
    !(requestOptions.body instanceof FormData) &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new ApiError(
        "Tu sesión no está disponible. Iniciá sesión nuevamente.",
        401,
      );
    }

    const token = await currentUser.getIdToken();
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: requestHeaders,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let data: unknown = text || null;

  if (
    text &&
    response.headers.get("content-type")?.includes("json")
  ) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError(
        "El servidor devolvió una respuesta que no pudimos interpretar.",
        response.status,
      );
    }
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, response.status),
      response.status,
    );
  }

  return data as T;
}