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
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new Error('เชื่อมต่อ Auth API ไม่ได้ กรุณาเริ่มเซิร์ฟเวอร์ด้วย npm run dev:api')
  }

  const responseText = await response.text()
  let payload: unknown = null
  if (responseText.trim()) {
    try {
      payload = JSON.parse(responseText) as unknown
    } catch {
      throw new Error(`Auth API ส่งข้อมูลกลับมาไม่ใช่ JSON (HTTP ${response.status})`)
    }
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : `Auth API ตอบกลับโดยไม่มีรายละเอียด (HTTP ${response.status})`
    throw new Error(message)
  }

  if (payload === null) {
    throw new Error('Auth API ไม่ได้ส่งข้อมูลกลับมา กรุณาตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงาน')
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
