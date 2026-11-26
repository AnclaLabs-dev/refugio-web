import { apiFetch, ApiError } from "./api";

export interface BackendUser {
  id: string;
  firebase_uid: string;
  email: string;
  name: string | null;
  alias?: string | null;
  alias_updated_at?: string | null;
  created_at: string;
}

interface MeResponse {
  user: BackendUser;
}

/**
 * Obtiene los datos del usuario autenticado almacenados en la base de datos (PostgreSQL).
 * Si el usuario todavía no fue sincronizado, intenta un POST /auth/sync automático y reintenta.
 */
export async function getMe(signal?: AbortSignal): Promise<BackendUser> {
  try {
    const data = await apiFetch<MeResponse>("/me", { signal });
    return data.user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      await apiFetch("/auth/sync", {
        method: "POST",
        signal,
      });

      const data = await apiFetch<MeResponse>("/me", { signal });
      return data.user;
    }
    throw error;
  }
}

/**
 * Actualiza el nombre del usuario en PostgreSQL a través de PATCH /me.
 */
export async function updateUserName(name: string, signal?: AbortSignal): Promise<BackendUser> {
  const data = await apiFetch<MeResponse>("/me", {
    method: "PATCH",
    body: JSON.stringify({ name }),
    signal,
  });

  return data.user;
}
