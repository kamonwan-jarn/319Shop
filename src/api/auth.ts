export interface AuthUser {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

const API_BASE = '/api/auth'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const payload: unknown = await response.json()
  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : 'เกิดข้อผิดพลาด กรุณาลองใหม่'
    throw new Error(message)
  }
  return payload as T
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export function logout(token: string | null): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/logout', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}
