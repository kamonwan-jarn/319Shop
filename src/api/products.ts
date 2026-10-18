import type { Product } from '../types/product'
import { extraProducts } from '../data/extraProducts'
import { baseProductsFallback } from '../data/baseProductsFallback'

const API_URL = 'https://fakestoreapi.com'

const extraProductsMap = new Map<number, Product>(
  extraProducts.map((p) => [p.id, p])
)

const baseProductsFallbackMap = new Map<number, Product>(
  baseProductsFallback.map((p) => [p.id, p])
)

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return (await response.json()) as T
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const baseProducts = await fetchJson<Product[]>(`${API_URL}/products`)
    return [...baseProducts, ...extraProducts]
  } catch (error) {
    console.warn('FakeStoreAPI unavailable, using fallback products:', error)
    return [...baseProductsFallback, ...extraProducts]
  }
}

export async function fetchProductById(id: number): Promise<Product> {
  const extra = extraProductsMap.get(id)
  if (extra) {
    return extra
  }

  try {
    return await fetchJson<Product>(`${API_URL}/products/${id}`)
  } catch (error) {
    const fallback = baseProductsFallbackMap.get(id)
    if (fallback) {
      return fallback
    }
    throw error
  }
}

export async function fetchCategories(): Promise<string[]> {
  return [
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing",
  ]
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const all = await fetchProducts()
  return all.filter((p) => p.category === category)
}

