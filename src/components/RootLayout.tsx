import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] text-zinc-800">
      <Navbar />
      <main className="w-full flex-1 pt-24 pb-12"><Outlet /></main>
      <footer className="mt-auto border-t border-zinc-200 bg-white px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm text-zinc-500">
          <div>
            <span className="font-extrabold text-xl text-zinc-700 tracking-tighter">319<span className="text-zinc-400">STORE</span></span>
            <p className="mt-4">The ultimate destination for premium quality products. Crafted for the modern lifestyle.</p>
          </div>
          <div>
            <h3 className="font-bold text-zinc-700 mb-4 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-zinc-700 transition">Men's Clothing</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">Women's Clothing</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">Jewelry</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">Electronics</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-700 mb-4 uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-zinc-700 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">FAQs</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">Shipping & Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-700 mb-4 uppercase tracking-wider">Newsletter</h3>
            <p className="mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none focus:border-zinc-400 focus:bg-white transition" />
              <button className="rounded-lg bg-zinc-600 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 transition">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-zinc-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>© 2026 319 STORE. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-zinc-700 transition">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-700 transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
