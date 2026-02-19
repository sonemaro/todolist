// In dev mode the Vite proxy forwards /api → http://localhost:3456
// so we use an empty base (relative URLs).  In production, set VITE_API_URL.
const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

/**
 * Thin wrapper around fetch that automatically adds the JWT token
 * and handles JSON responses.
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type to JSON if we're not sending FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error: any = new Error(data.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint),

  post: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = any>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = any>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
