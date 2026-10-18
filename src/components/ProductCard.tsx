import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Star, Heart, Eye } from 'lucide-react'
import type { Product } from '../types/product'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { useToastStore } from '../store/useToastStore'
import { formatPrice, translateProduct } from '../utils/locale'
import QuickViewModal from './QuickViewModal'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const addToast = useToastStore((state) => state.addToast)

  const [showQuickView, setShowQuickView] = useState(false)

  const { title, category } = translateProduct(product)
  const isFav = isInWishlist(product.id)

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
          <div className="relative bg-slate-50 rounded-2xl p-4 overflow-hidden">
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

            <Link to={`/product/${product.id}`} className="block">
              <img
                src={product.image}
                alt={title}
                className="w-full h-44 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* ปุ่ม Quick View เด้งเมื่อโฮเวอร์ */}
            <button
              onClick={() => setShowQuickView(true)}
              className="absolute bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 shadow-lg"
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