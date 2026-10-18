import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Store, Grid, Package, Info, ShoppingBag, Sparkles, Heart } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useOrderStore } from '../store/useOrderStore'
import { useWishlistStore } from '../store/useWishlistStore'
import ToastContainer from './ToastContainer'
import WishlistModal from './WishlistModal'

export default function Navbar() {
  const location = useLocation()
  const items = useCartStore((state) => state.items)
  const orders = useOrderStore((state) => state.orders)
  const wishlistIds = useWishlistStore((state) => state.wishlistIds)

  const [isWishlistOpen, setIsWishlistOpen] = useState(false)

  const totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalOrders = orders.length
  const totalWishlist = wishlistIds.length

  const navLinks = [
    { path: '/', label: 'หน้าร้าน', icon: Store },
    { path: '/categories', label: 'หมวดหมู่', icon: Grid },
    { path: '/orders', label: 'ประวัติสั่งซื้อ', icon: Package, badge: totalOrders },
    { path: '/about', label: 'เกี่ยวกับเรา', icon: Info },
  ]

  return (
    <header className="sticky top-0 z-40 w-full">
      <ToastContainer />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* แถบแจ้งเตือนด้านบน */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-slate-300 text-[11px] md:text-xs py-2 px-4 text-center font-medium border-b border-indigo-900/30 flex items-center justify-center gap-2 shadow-sm">
        <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold">
          <Sparkles className="w-3.5 h-3.5" /> 319 STORE
        </span>
        <span className="text-slate-600">•</span>
        <span>จัดส่งสินค้ารวดเร็ว ชำระเงินปลอดภัย 100%</span>
        <span className="hidden sm:inline text-slate-600">•</span>
        <span className="hidden sm:inline text-indigo-300 font-semibold">ส่งฟรีเมื่อซื้อครบ ฿1,000</span>
      </div>

      {/* เมนูหลัก */}
      <nav className="bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex items-baseline font-black tracking-tight text-xl">
              <span className="text-slate-900">319</span>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent ml-0.5">STORE</span>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* ปุ่มกดดูสินค้าที่ชอบ (Wishlist Button) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all active:scale-95"
              title="ดูรายการสินค้าที่ชอบ"
            >
              <Heart className="w-5 h-5 fill-rose-500" />
              {totalWishlist > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalWishlist}
                </span>
              )}
            </button>

            {/* ปุ่มตะกร้า */}
            <Link
              to="/cart"
              className={`relative p-2.5 rounded-2xl border transition-all flex items-center justify-center ${
                location.pathname === '/cart'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600 shadow-sm'
              }`}
              title="ตะกร้าสินค้า"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}