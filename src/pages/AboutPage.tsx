import { ExternalLink, Users } from 'lucide-react'

interface Developer {
  name: string
  studentId: string
  role: string
  imageSrc: string
}

// ข้อมูลสมาชิกกลุ่มผู้พัฒนา
const developers: Developer[] = [
  { name: 'นิฤมน ศรีวิชา', studentId: '1660704923', role: 'User Interface ', imageSrc: '/images/dev1.png' },
  { name: 'ธนากร กระสายกลาง', studentId: '1660703172', role: 'API and State Management', imageSrc: '/images/dev2.png' },
  { name: 'กมลวรรณ จารไทสงค์', studentId: '1660704931', role: 'Routing and Testing', imageSrc: '/images/dev3.png' },
]

export default function AboutPage() {
  const techStack = [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'TanStack Query',
    'Zustand',
    'Vite',
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-16">
      {/* ส่วนหัวเกี่ยวกับโปรเจกต์ (โทนสี Indigo Gradient) */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl p-8 sm:p-10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4 backdrop-blur-md">
            MINI PROJECT 2
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            เกี่ยวกับโปรเจกต์
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            เว็บแอปพลิเคชันร้านค้าตัวอย่าง พัฒนาด้วย React, TypeScript, React Router, TanStack Query และ Zustand
          </p>

          {/* แท็กรายละเอียดเทคโนโลยีที่ใช้ */}
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-indigo-500/20 text-indigo-200 text-xs font-semibold rounded-lg border border-indigo-500/30 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ส่วนรายชื่อผู้พัฒนา */}
      <section aria-labelledby="developers-heading">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold shadow-sm">
            <Users size={22} />
          </span>
          <div>
            <h2 id="developers-heading" className="text-xl font-bold text-slate-900">
              ผู้พัฒนา
            </h2>
            <p className="text-xs text-slate-500">สมาชิกกลุ่ม 3 คน</p>
          </div>
        </div>

        {/* รายชื่อการ์ดผู้พัฒนา */}
        <div className="grid gap-5 sm:grid-cols-3">
          {developers.map((developer, index) => (
            <article
              key={developer.studentId + index}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={developer.imageSrc}
                  alt={`รูปโปรไฟล์ ${developer.name}`}
                  className="size-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="min-h-[52px]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    ชื่อ-สกุล
                  </p>
                  <h3 className="mt-0.5 break-words font-bold text-slate-900 leading-snug">
                    {developer.name}
                  </h3>
                </div>
                <div className="space-y-2.5 border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      รหัสนักศึกษา
                    </p>
                    <p className="mt-0.5 break-words text-sm font-medium text-slate-700">
                      {developer.studentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      หน้าที่
                    </p>
                    <p className="mt-0.5 break-words text-sm font-medium text-slate-600">
                      {developer.role}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* แหล่งข้อมูลสินค้า */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-sm">
        <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full mb-2">
          แหล่งข้อมูล
        </span>
        <h2 className="text-xl font-bold text-slate-900">เครดิตข้อมูลสินค้า</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          ข้อมูลสินค้าและหมวดหมู่ในโปรเจกต์นี้ให้บริการโดย Fake Store API
        </p>
        <a
          href="https://fakestoreapi.com"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition"
        >
          ไปยัง FakeStoreAPI <ExternalLink size={16} />
        </a>
      </section>
    </div>
  )
}