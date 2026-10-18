import type { Product } from '../types/product'

const API_URL = 'https://fakestoreapi.com'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return (await response.json()) as T
}

export function fetchProducts(): Promise<Product[]> {
  return fetchJson<Product[]>(`${API_URL}/products`)
}

export function fetchProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${API_URL}/products/${id}`)
}

export function fetchCategories(): Promise<string[]> {
  return fetchJson<string[]>(`${API_URL}/products/categories`)
}

export function fetchProductsByCategory(category: string): Promise<Product[]> {
  return fetchJson<Product[]>(`${API_URL}/products/category/${encodeURIComponent(category)}`)
}
