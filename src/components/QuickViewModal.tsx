import { useState } from 'react'
import { X, Star, ShoppingBag, Heart, Check } from 'lucide-react'
import type { Product } from '../types/product'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { useToastStore } from '../store/useToastStore'
import { formatPrice, translateProduct } from '../utils/locale'
import { getOptimizedImageUrl } from '../utils/imageOptimizer'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const addToast = useToastStore((state) => state.addToast)

  if (!product) return null

  const { title, description, category } = translateProduct(product)
  const isFav = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem(product.id)
    setAdded(true)
    addToast(`เพิ่ม "${title}" ลงในตะกร้าเรียบร้อยแล้ว`, 'success')
    setTimeout(() => setAdded(false), 2000)
  }

  const handleToggleFav = () => {
    toggleWishlist(product.id)
    addToast(
      !isFav ? `บันทึก "${title}" ลงในสินค้าที่ชอบแล้ว` : `นำออกจากสินค้าที่ชอบเรียบร้อย`,
      'info'
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-center min-h-[224px]">
            <img
              src={getOptimizedImageUrl(product.image, { size: 'card', width: 400, quality: 75 })}
              alt={title}
              loading="eager"
              decoding="async"
              className="max-h-56 object-contain mix-blend-multiply"
            />
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                {category}
              </span>
              <h3 className="font-extrabold text-slate-800 text-lg mt-2 leading-snug line-clamp-2">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{product.rating?.rate ?? 4.5}</span>
              <span className="text-slate-400">({product.rating?.count ?? 120} รีวิว)</span>
            </div>

            <div className="text-2xl font-black text-indigo-600">
              {formatPrice(product.price)}
            </div>

            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              {description}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> เพิ่มแล้ว!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> เพิ่มลงตะกร้า
                  </>
                )}
              </button>

              <button
                onClick={handleToggleFav}
                className={`p-3 rounded-2xl border transition-all ${
                  isFav
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50'
                }`}
                title="ถูกใจ"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}