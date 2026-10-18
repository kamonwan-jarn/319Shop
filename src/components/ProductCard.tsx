import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Star, Heart, Eye, ImageOff } from 'lucide-react'
import type { Product } from '../types/product'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { useToastStore } from '../store/useToastStore'
import { formatPrice, translateProduct } from '../utils/locale'
import { getOptimizedImageUrl } from '../utils/imageOptimizer'
import QuickViewModal from './QuickViewModal'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const addToast = useToastStore((state) => state.addToast)

  const [showQuickView, setShowQuickView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const { title, category } = translateProduct(product)
  const isFav = isInWishlist(product.id)

  const optimizedSrc = getOptimizedImageUrl(product.image, {
    size: 'card',
    width: 360,
    quality: 72,
  })

  const handleAddToCart = () => {
    addItem(product.id)
    addToast(`เพิ่ม "${title}" ลงตะกร้าแล้ว`, 'success')
  }

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist(product.id)
    addToast(
      !isFav ? `บันทึก "${title}" ในสินค้าที่ชอบ` : `นำออกจากสินค้าที่ชอบแล้ว`,
      'info'
    )
  }

  return (
    <>
      <div className="group bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative">
        <div>
          {/* กรอบรูป + ปุ่ม Heart & Quick View */}
          <div className="relative bg-slate-50 rounded-2xl p-4 overflow-hidden h-48 flex items-center justify-center">
            {/* Shimmer skeleton while image loads */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin opacity-40" />
              </div>
            )}

            <button
              onClick={handleToggleFav}
              className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
                isFav
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
              }`}
              title="ถูกใจ"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
            </button>

            <Link to={`/product/${product.id}`} className="block w-full h-full flex items-center justify-center">
              {hasError ? (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 py-6">
                  <ImageOff className="w-8 h-8 opacity-40" />
                  <span className="text-[11px] font-medium text-slate-400">รูปภาพกำลังโหลด</span>
                </div>
              ) : (
                <img
                  src={optimizedSrc}
                  alt={title}
                  loading={priority ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={priority ? 'high' : 'auto'}
                  onLoad={() => setIsLoaded(true)}
                  onError={() => {
                    setHasError(true)
                    setIsLoaded(true)
                  }}
                  className={`w-full h-44 object-contain mix-blend-multiply group-hover:scale-105 transition-all duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </Link>

            {/* ปุ่ม Quick View เด้งเมื่อโฮเวอร์ */}
            <button
              onClick={() => setShowQuickView(true)}
              className="absolute bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 shadow-lg z-10"
            >
              <Eye className="w-3.5 h-3.5" /> ดูอย่างไว
            </button>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              {category}
            </span>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mt-0.5 hover:text-indigo-600 transition-colors">
                {title}
              </h3>
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-slate-700">{product.rating?.rate ?? 4.5}</span>
            </div>
            <div className="text-base font-extrabold text-indigo-600 mt-0.5">
              {formatPrice(product.price)}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-2xl transition-all active:scale-95 shadow-sm"
            title="เพิ่มลงตะกร้า"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  )
}