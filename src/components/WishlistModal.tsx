import { useQuery } from '@tanstack/react-query'
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { fetchProducts } from '../api/products'
import { useWishlistStore } from '../store/useWishlistStore'
import { useCartStore } from '../store/useCartStore'
import { useToastStore } from '../store/useToastStore'
import { formatPrice, translateProduct } from '../utils/locale'
import { getOptimizedImageUrl } from '../utils/imageOptimizer'

interface WishlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const wishlistIds = useWishlistStore((state) => state.wishlistIds)
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  if (!isOpen) return null

  const favoritedProducts = products.filter((p) => wishlistIds.includes(p.id))

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* หัวข้อ */}
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-2xl">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">สินค้าที่ชอบ</h2>
            <p className="text-xs text-slate-500">
              รายการที่คุณกดถูกใจไว้ทั้งหมด ({favoritedProducts.length} รายการ)
            </p>
          </div>
        </div>

        {/* รายการสินค้าที่ชอบ */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {favoritedProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Heart className="w-12 h-12 mx-auto mb-2 text-slate-200" />
              <p className="text-sm font-semibold">ยังไม่มีสินค้าที่กดถูกใจไว้</p>
            </div>
          ) : (
            favoritedProducts.map((product) => {
              const { title } = translateProduct(product)
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <img
                    src={getOptimizedImageUrl(product.image, { size: 'thumb', width: 120 })}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-14 object-contain bg-white p-1 rounded-xl border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate">
                      {title}
                    </h4>
                    <div className="text-indigo-600 font-extrabold text-xs mt-0.5">
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        addItem(product.id)
                        addToast(`เพิ่ม "${title}" ลงในตะกร้าเรียบร้อยแล้ว`, 'success')
                      }}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95"
                      title="ย้ายลงตะกร้า"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        toggleWishlist(product.id)
                        addToast(`นำ "${title}" ออกจากรายการที่ชอบแล้ว`, 'info')
                      }}
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      title="ลบออก"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}