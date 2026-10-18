/**
 * Image Optimization Utility for 319Shop
 * Optimizes external image URLs (Unsplash, Imgur, DummyJSON, etc.)
 * by specifying appropriate dimensions, compression quality, and modern formats (WebP/AVIF).
 */

export interface ImageOptimizationOptions {
  width?: number
  quality?: number
  size?: 'thumb' | 'card' | 'detail'
}

export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=360&auto=format&fit=crop&q=70'
  }

  const trimmed = url.trim()
  const { size = 'card' } = options

  // Preset widths and qualities based on display context
  let targetWidth = options.width
  let targetQuality = options.quality

  if (!targetWidth) {
    if (size === 'thumb') targetWidth = 140
    else if (size === 'card') targetWidth = 360
    else targetWidth = 640 // detail view
  }

  if (!targetQuality) {
    if (size === 'thumb') targetQuality = 65
    else if (size === 'card') targetQuality = 72
    else targetQuality = 80
  }

  try {
    // 1. Unsplash: optimize width, quality, and enable auto format (webp/avif)
    if (trimmed.includes('images.unsplash.com')) {
      const parsed = new URL(trimmed)
      parsed.searchParams.set('w', targetWidth.toString())
      parsed.searchParams.set('q', targetQuality.toString())
      parsed.searchParams.set('auto', 'format')
      parsed.searchParams.set('fit', 'crop')
      return parsed.toString()
    }

    // 2. Imgur: apply thumbnail sizing suffixes (m = 320px, l = 640px, h = 1024px)
    if (trimmed.includes('i.imgur.com')) {
      // Regex match: https://i.imgur.com/{id}.{ext}
      const match = trimmed.match(/^https?:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)$/i)
      if (match) {
        const id = match[1]
        // If id already has a single-letter suffix, keep it
        const suffix = size === 'thumb' ? 'm' : size === 'card' ? 'l' : 'h'
        return `https://i.imgur.com/${id}${suffix}.jpg`
      }
      return trimmed
    }

    // 3. DummyJSON: already hosted on high-speed CDN in .webp format
    if (trimmed.includes('cdn.dummyjson.com')) {
      return trimmed
    }

    // 4. Return original URL if unrecognized domain
    return trimmed
  } catch {
    return trimmed
  }
}
