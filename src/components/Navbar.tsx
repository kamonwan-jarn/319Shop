import { NavLink } from 'react-router-dom'
import { ShoppingBag, Menu } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'

export default function Navbar() {
  const count = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))

  // แถบนำทางหลักพร้อมจำนวนสินค้าที่อยู่ในตะกร้า
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/50 bg-white/80 backdrop-blur-lg">
      <div className="bg-zinc-600 text-white text-[10px] sm:text-xs font-bold text-center py-2 px-4 uppercase tracking-widest">
        เลือกชมสินค้าและสั่งซื้อได้ทุกวัน
      </div>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center gap-4">
          <button aria-label="เปิดเมนู" className="p-2 text-zinc-500 hover:text-zinc-700 lg:hidden">
            <Menu size={20} />
          </button>
          <NavLink to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tighter text-zinc-600">
            319<span className="text-zinc-400">STORE</span>
          </NavLink>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <NavLink to="/" className="text-sm font-bold text-zinc-500 hover:text-zinc-700 transition">หน้าร้าน</NavLink>
          <NavLink to="/categories" className="text-sm font-bold text-zinc-500 hover:text-zinc-700 transition">หมวดหมู่</NavLink>
          <NavLink to="/about" className="text-sm font-bold text-zinc-500 hover:text-zinc-700 transition">เกี่ยวกับเรา</NavLink>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <NavLink aria-label="ตะกร้าสินค้า" to="/cart" className="relative p-2 text-zinc-600 hover:text-zinc-500 transition flex items-center">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[10px] font-bold text-white ring-2 ring-white">
                {count}
              </span>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
