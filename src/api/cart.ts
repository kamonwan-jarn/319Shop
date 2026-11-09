import type { Product } from '../types/product'

export interface SavedCartItem {
  id: number
  quantity: number
}

const API_BASE = '/api/cart'

async function request<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  const body = await response.text()
  let payload: unknown = null
  if (body.trim()) {
    try {
      payload = JSON.parse(body) as unknown
    } catch {
      throw new Error(`Cart API ส่งข้อมูลกลับมาไม่ใช่ JSON (HTTP ${response.status})`)
    }
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : `Cart API ตอบกลับผิดพลาด (HTTP ${response.status})`
    throw new Error(message)
  }

  return payload as T
}

export async function fetchSavedCart(token: string): Promise<SavedCartItem[]> {
  const result = await request<{ items: SavedCartItem[] }>('', token)
  return result.items
}

export function saveCartItem(token: string, product: Product, quantity: number): Promise<unknown> {
  return request('/items', token, {
    method: 'POST',
    body: JSON.stringify({
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      quantity,
    }),
  })
}

export function updateSavedCartQuantity(token: string, productId: number, quantity: number): Promise<unknown> {
  return request(`/items/${productId}`, token, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  })
}

export function removeSavedCartItem(token: string, productId: number): Promise<unknown> {
  return request(`/items/${productId}`, token, { method: 'DELETE' })
}

export function clearSavedCart(token: string): Promise<unknown> {
  return request('', token, { method: 'DELETE' })
}
