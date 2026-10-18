import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Plus,
  Minus,
  ShieldCheck,
  MapPin,
  CreditCard,
  QrCode,
  X,
  CheckCircle2,
} from 'lucide-react'
import { fetchProductById } from '../api/products'
import { useCartStore } from '../store/useCartStore'
import { useOrderStore, type ShippingAddress } from '../store/useOrderStore'
import { formatPrice, translateProduct } from '../utils/locale'
import { getOptimizedImageUrl } from '../utils/imageOptimizer'

// อัตราแลกเปลี่ยนแปลงหน่วยเปรียบเทียบ
const EXCHANGE_RATE = 35

export default function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const addOrder = useOrderStore((state) => state.addOrder)

  // สถานะเปิด/ปิด Modal ชำระเงิน & จัดส่ง
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // สถานะฟอร์มที่อยู่จัดส่ง
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    subdistrict: '',
    district: '',
    province: '',
    postalCode: '',
  })

  // สถานะช่องทางชำระเงิน
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'cod'>('promptpay')

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const results = useQueries({
    queries: items.map(({ id }) => ({
      queryKey: ['product', id],
      queryFn: () => fetchProductById(id),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const isLoading = results.some((res) => res.isLoading)

  const cartItemsWithDetails = items.map((item) => {
    const productQuery = results.find((r) => r.data?.id === item.id)
    return {
      ...item,
      product: productQuery?.data,
    }
  })

  // 1. คำนวณราคาสินค้ารวมในหน่วย USD
  const subtotalUSD = cartItemsWithDetails.reduce((sum, item) => {
    if (item.product) {
      return sum + item.product.price * item.quantity
    }
    return sum
  }, 0)

  // 2. แปลงเป็น THB เพื่อตรวจสอบเงื่อนไขส่งฟรีครบ 1,000 บาท
  const subtotalTHB = subtotalUSD * EXCHANGE_RATE
  const isFreeShipping = subtotalTHB >= 1000

  // 3. คิดค่าจัดส่งเป็น USD (45 บาท = 45 / 35 USD)
  const shippingUSD = isFreeShipping ? 0 : (subtotalUSD > 0 ? 45 / EXCHANGE_RATE : 0)
  const totalUSD = subtotalUSD + shippingUSD

  // ยอดที่ต้องซื้อเพิ่มเพื่อให้ได้ส่งฟรี (ในหน่วย USD สำหรับส่งเข้า formatPrice)
  const remainingForFreeShippingUSD = (1000 - subtotalTHB) / EXCHANGE_RATE

  // ยืนยันคำสั่งซื้อ
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!address.fullName || !address.phone || !address.address || !address.province || !address.postalCode) {
      alert('กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน')
      return
    }

    const orderItems = cartItemsWithDetails
      .filter((item): item is { id: number; quantity: number; product: NonNullable<typeof item.product> } => !!item.product)
      .map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }))

    addOrder({
      items: orderItems,
      totalAmount: totalUSD,
      shippingAddress: address,
      paymentMethod: paymentMethod,
    })

    clearCart()
    setIsCheckoutOpen(false)
    navigate('/orders')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">ตะกร้าสินค้าของคุณยังว่างอยู่</h2>
        <p className="text-slate-500 mb-8">เลือกชมสินค้าที่น่าสนใจ แล้วเพิ่มลงในตะกร้าได้เลย</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all"
        >
          เลือกซื้อสินค้า <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">ตะกร้าสินค้าของฉัน</h1>
          <p className="text-slate-500 text-sm">ตรวจสอบรายการสินค้าและดำเนินการชำระเงิน</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ฝั่งรายการสินค้า */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" /> รายการสินค้า ({items.length})
          </h2>

          {isLoading ? (
            <div className="bg-white p-8 rounded-3xl text-center text-slate-400">กำลังโหลดรายการ...</div>
          ) : (
            cartItemsWithDetails.map((item) => {
              if (!item.product) return null
              const { title, category } = translateProduct(item.product)

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-5"
                >
                  <img
                    src={getOptimizedImageUrl(item.product.image, { size: 'thumb', width: 140 })}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-20 object-contain p-2 bg-slate-50 rounded-2xl border border-slate-100"
                  />
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                      {category}
                    </span>
                    <h3 className="font-bold text-slate-800 truncate text-sm mt-0.5">{title}</h3>
                    <div className="text-indigo-600 font-extrabold mt-1">
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  {/* ปุ่มปรับจำนวน */}
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-800 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="text-xs text-slate-400">ราคารวม</div>
                      <div className="font-extrabold text-slate-800">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ฝั่งสรุปคำสั่งซื้อ */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              สรุปคำสั่งซื้อ
            </h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-600">
                <span>ราคาสินค้ารวม</span>
                <span className="font-semibold text-slate-800">{formatPrice(subtotalUSD)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>ค่าจัดส่ง</span>
                <span className="font-semibold text-slate-800">
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      ฟรี
                    </span>
                  ) : (
                    formatPrice(shippingUSD)
                  )}
                </span>
              </div>

              {!isFreeShipping && subtotalTHB > 0 && (
                <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-100 leading-tight">
                  💡 ช้อปเพิ่มอีก <span className="font-bold">{formatPrice(remainingForFreeShippingUSD)}</span> เพื่อรับสิทธิ์จัดส่งฟรี!
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-bold text-slate-900">ยอดชำระสุทธิ</span>
                <span className="text-2xl font-extrabold text-indigo-600">{formatPrice(totalUSD)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              ดำเนินการชำระเงิน <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> ชำระเงินปลอดภัย 100% ผ่านระบบเข้ารหัส
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: ชำระเงิน & จัดส่ง */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-black text-slate-900">ชำระเงิน & จัดส่ง</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                กรอกข้อมูลและเลือกช่องทางชำระเงินเพื่อยืนยันออเดอร์
              </p>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" /> ข้อมูลที่อยู่จัดส่ง
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อ - นามสกุล *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={address.fullName}
                      onChange={handleAddressChange}
                      placeholder="สมชาย ใจดี"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">เบอร์โทรศัพท์ *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={address.phone}
                      onChange={handleAddressChange}
                      placeholder="0812345678"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">ที่อยู่จัดส่ง *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={address.address}
                      onChange={handleAddressChange}
                      placeholder="บ้านเลขที่, ถนน, ซอย"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">ตำบล / แขวง</label>
                    <input
                      type="text"
                      name="subdistrict"
                      value={address.subdistrict}
                      onChange={handleAddressChange}
                      placeholder="ตำบล/แขวง"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">อำเภอ / เขต</label>
                    <input
                      type="text"
                      name="district"
                      value={address.district}
                      onChange={handleAddressChange}
                      placeholder="อำเภอ/เขต"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">จังหวัด *</label>
                    <input
                      type="text"
                      name="province"
                      required
                      value={address.province}
                      onChange={handleAddressChange}
                      placeholder="จังหวัด"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">รหัสไปรษณีย์ *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={address.postalCode}
                      onChange={handleAddressChange}
                      placeholder="รหัสไปรษณีย์"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-600" /> ช่องทางชำระเงิน
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'promptpay'
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700'
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-xs">พร้อมเพย์ / QR Code</span>
                    <span className="text-[10px] text-slate-400">สแกนจ่ายด้วยแอปธนาคาร</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700'
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-xs">เก็บเงินปลายทาง (COD)</span>
                    <span className="text-[10px] text-slate-400">ชำระเงินกับพนักงานขนส่ง</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'promptpay' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-2">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PROMPTPAY_${totalUSD}`}
                    alt="PromptPay QR Code"
                    className="w-36 h-36 mx-auto rounded-xl border border-slate-200 bg-white p-1"
                  />
                  <div className="text-xs text-slate-500">สแกนด้วยแอปธนาคารใดก็ได้</div>
                  <div className="text-sm font-extrabold text-indigo-600">
                    ยอดชำระสุทธิ: {formatPrice(totalUSD)}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5" /> ยืนยันการสั่งซื้อ • {formatPrice(totalUSD)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}