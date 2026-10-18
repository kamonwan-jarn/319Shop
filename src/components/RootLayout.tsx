import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function RootLayout() {
  // โครงหน้าเว็บส่วนกลาง รวมแถบนำทาง เนื้อหาตามเส้นทาง และส่วนท้าย
  return (
    <div className="flex min-h-screen flex-col bg-[#fdfdfd] text-zinc-800">
      <Navbar />
      <main className="w-full flex-1 pt-24 pb-12"><Outlet /></main>
      {/* ส่วนท้ายรวมลิงก์หมวดหมู่ ช่องรับข่าวสาร และข้อมูลลิขสิทธิ์ */}
      <footer className="mt-auto border-t border-zinc-200 bg-white px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm text-zinc-500">
          <div>
            <span className="font-extrabold text-xl text-zinc-700 tracking-tighter">319<span className="text-zinc-400">STORE</span></span>
            <p className="mt-4">แหล่งรวมสินค้าคุณภาพที่คัดสรรเพื่อไลฟ์สไตล์ของคุณ</p>
          </div>
          <div>
            <h3 className="font-bold text-zinc-700 mb-4 tracking-wider">เลือกซื้อสินค้า</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-zinc-700 transition">เสื้อผ้าผู้ชาย</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">เสื้อผ้าผู้หญิง</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">เครื่องประดับ</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">อุปกรณ์อิเล็กทรอนิกส์</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-700 mb-4 tracking-wider">ช่วยเหลือ</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-zinc-700 transition">ติดต่อเรา</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">คำถามที่พบบ่อย</a></li>
              <li><a href="#" className="hover:text-zinc-700 transition">การจัดส่งและการคืนสินค้า</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-700 mb-4 tracking-wider">รับข่าวสาร</h3>
            <p className="mb-4">ติดตามข่าวสารและโปรโมชันจากเรา</p>
            <div className="flex gap-2">
              <input type="email" placeholder="อีเมลของคุณ" className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none focus:border-zinc-400 focus:bg-white transition" />
              <button className="rounded-lg bg-zinc-600 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 transition">สมัคร</button>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-zinc-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>© 2026 319 STORE สงวนลิขสิทธิ์</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-zinc-700 transition">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-zinc-700 transition">เงื่อนไขการใช้บริการ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
