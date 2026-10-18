import type { Product } from '../types/product'
import { translateProduct } from './locale'

function normalize(value: string): string {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

function editDistance(left: string, right: string): number {
  const a = Array.from(left)
  const b = Array.from(right)
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i]
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
    previous = current
  }
  return previous[b.length]
}

function closeMatch(query: string, text: string): boolean {
  if (text.includes(query)) return true

  const queryChars = Array.from(query)
  if (queryChars.length < 4) return false
  const maxDistance = queryChars.length >= 8 ? 2 : 1
  const words = text.split(' ')

  return words.some((word) => {
    if (Math.abs(Array.from(word).length - queryChars.length) > maxDistance) return false
    return editDistance(query, word) <= maxDistance
  })
}

export function matchesProductSearch(product: Product, searchTerm: string): boolean {
  const query = normalize(searchTerm)
  if (!query) return true

  const translated = translateProduct(product)
  const searchableText = normalize(
    `${product.title} ${translated.title} ${product.category} ${translated.category}`,
  )
  const queryWords = query.split(' ')

  return queryWords.every((word) => closeMatch(word, searchableText))
}
