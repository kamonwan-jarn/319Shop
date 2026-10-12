import { ExternalLink, Users } from 'lucide-react'

interface Developer {
  name: string
  studentId: string
  role: string
  imageSrc: string
}

// เปลี่ยน imageSrc เป็น path รูปสมาชิกจริงใน public/images ได้ตรงนี้
const developers: Developer[] = [
  { name: 'นิฤมน ศรีวิชา', studentId: '1660704923', role: 'ส่วนติดต่อผู้ใช้', imageSrc: '/images/dev1.png' },
  { name: 'ธนากร กระสายกลาง', studentId: '1660703172', role: 'API และจัดการสถานะ', imageSrc: '/images/dev2.png' },
  { name: 'กมลวรรณ จารไทสงค์', studentId: '1660704931', role: 'เส้นทางและทดสอบระบบ', imageSrc: '/images/dev3.png' },
]

export default function AboutPage() {
  // แสดงข้อมูลโปรเจกต์ รายชื่อผู้พัฒนา และแหล่งที่มาของข้อมูลสินค้า
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="rounded-3xl bg-zinc-700 px-6 py-8 text-white sm:px-10 sm:py-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-300">Mini Project 2</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">เกี่ยวกับโปรเจกต์</h1>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-200">เว็บแอปพลิเคชันร้านค้าตัวอย่าง พัฒนาด้วย React, TypeScript, React Router, TanStack Query และ Zustand</p>
      </header>

      <section aria-labelledby="developers-heading">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-zinc-200 text-zinc-700"><Users size={20} /></span>
          <div>
            <h2 id="developers-heading" className="text-xl font-bold text-zinc-800">ผู้พัฒนา</h2>
            <p className="text-sm text-zinc-500">สมาชิกกลุ่ม 3 คน</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {developers.map((developer, index) => (
            <article key={developer.studentId + index} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                <img src={developer.imageSrc} alt={`รูปโปรไฟล์ ${developer.name}`} className="size-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} />
              </div>
              <div className="space-y-3 p-4 sm:p-5">
                <div className="min-h-14"><p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">ชื่อ-สกุล</p><h3 className="mt-1 break-words font-bold leading-5 text-zinc-800">{developer.name}</h3></div>
                <div className="space-y-2 border-t border-zinc-100 pt-3">
                  <div><p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">รหัสนักศึกษา</p><p className="mt-1 break-words text-sm text-zinc-600">{developer.studentId}</p></div>
                  <div><p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">หน้าที่</p><p className="mt-1 break-words text-sm text-zinc-600">{developer.role}</p></div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-zinc-500">* ตอนนี้ใช้ภาพ avatar ตัวอย่าง หากต้องการใส่รูปจริง ให้วางไฟล์ใน <code className="rounded bg-zinc-100 px-1.5 py-0.5">public/images/</code> แล้วแก้ <code className="rounded bg-zinc-100 px-1.5 py-0.5">imageSrc</code> ในตัวแปร <code className="rounded bg-zinc-100 px-1.5 py-0.5">developers</code></p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
        <p className="text-xs font-bold tracking-[0.16em] text-zinc-500">แหล่งข้อมูล</p>
        <h2 className="mt-2 text-xl font-bold text-zinc-800">เครดิตข้อมูลสินค้า</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">ข้อมูลสินค้าและหมวดหมู่ในโปรเจกต์นี้ให้บริการโดย Fake Store API</p>
        <a href="https://fakestoreapi.com" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-600">ไปยัง FakeStoreAPI <ExternalLink size={15} /></a>
      </section>
    </div>
  )
}
