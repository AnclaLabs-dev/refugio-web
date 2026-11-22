import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Wrapper sobre fetch nativo que:
 * 1. Resuelve la URL base contra el backend en Railway/local.
 * 2. Si `requiresAuth` es true (por defecto), inyecta el token Bearer de Firebase Auth.
 * 3. Setea headers por defecto (Content-Type: application/json).
 * 4. Parsea y maneja errores HTTP unificados.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  const requestHeaders = new Headers(headers);

  // Aseguramos Content-Type a menos que se envíe FormData (que lo maneja el browser)
  if (!requestHeaders.has('Content-Type') && !(restOptions.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  // Si la petición requiere autenticación, inyectamos el ID token de Firebase
  if (requiresAuth) {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        requestHeaders.set('Authorization', `Bearer ${token}`);
      } catch (error) {
        console.error('Error al obtener el token de Firebase:', error);
      }
    }
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });

  // Manejo de respuestas vacías (ej. 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  // Parsear JSON o texto
  let data: unknown;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    if (data && typeof data === 'object' && 'message' in data && typeof (data as { message: unknown }).message === 'string') {
      errorMessage = (data as { message: string }).message;
    }
    throw new Error(errorMessage);
  }

  return data as T;
}
