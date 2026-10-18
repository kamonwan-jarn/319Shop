import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Star, ArrowLeft, Check, Plus, Minus, ShieldCheck, Truck } from 'lucide-react'
import { fetchProductById } from '../api/products'
import { useCartStore } from '../store/useCartStore'
import { formatPrice, translateProduct } from '../utils/locale'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-slate-600 font-medium">ไม่พบข้อมูลสินค้า</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
        >
          กลับหน้าหลัก
        </button>
      </div>
    )
  }

  const { title, description, category } = translateProduct(product)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product.id)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> ย้อนกลับ
      </button>

      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ฝั่งรูปภาพ */}
        <div className="bg-slate-50/80 rounded-2xl p-8 flex items-center justify-center border border-slate-100 relative group">
          <img
            src={product.image}
            alt={title}
            className="max-h-96 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* ฝั่งรายละเอียด */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="inline-block px-3.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              {category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-3">
              {title}
            </h1>

            {/* คะแนนรีวิว */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="ml-1 text-slate-800 font-semibold text-sm">
                  {product.rating?.rate ?? 4.5}
                </span>
              </div>
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-slate-500 text-sm">
                ({product.rating?.count ?? 120} รีวิว)
              </span>
            </div>

            {/* ราคา */}
            <div className="text-3xl font-extrabold text-indigo-600 mb-6">
              {formatPrice(product.price)}
            </div>

            <p className="text-slate-600 leading-relaxed text-sm mb-6 border-t border-b border-slate-100 py-4">
              {description}
            </p>
          </div>

          <div>
            {/* เลือกจำนวนสินค้า (- 1 +) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                จำนวน
              </label>
              <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-200 active:scale-95 disabled:opacity-40 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-slate-800 text-base">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ปุ่มกดใส่ตะกร้า */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
                added
                  ? 'bg-emerald-600 text-white shadow-emerald-500/25 scale-[0.99]'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-500/25 active:scale-98'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> เพิ่มเข้าตะกร้าแล้ว!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" /> เพิ่มลงตะกร้า • {formatPrice(product.price * quantity)}
                </>
              )}
            </button>

            {/* จุดการันตีเพิ่มเติม */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-slate-500 text-xs font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-500" /> จัดส่งฟรีเมื่อสั่งครบ ฿1,000
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> รับประกันสินค้าแท้ 100%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}