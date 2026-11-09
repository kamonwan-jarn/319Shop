import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShoppingBag, UserRound } from 'lucide-react'
import { login, register } from '../api/auth'
import { useAuthStore } from '../store/useAuthStore'

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const session = isRegistering
        ? await register(name.trim(), email.trim(), password)
        : await login(email.trim(), password)
      setSession(session)
      navigate(returnTo, { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'ไม่สามารถเข้าสู่ระบบได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-14">
      <div className="relative hidden min-h-[570px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-10 text-white shadow-2xl shadow-indigo-950/15 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <Link to="/" className="relative inline-flex w-fit items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"><ShoppingBag size={23} /></span>
          <span className="text-xl font-black tracking-tight">319<span className="text-indigo-300">STORE</span></span>
        </Link>
        <div className="relative max-w-md">
          <span className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-100">YOUR EVERYDAY FINDS</span>
          <h1 className="text-4xl font-black leading-tight tracking-tight xl:text-5xl">ช้อปสิ่งที่ใช่<br />ในแบบของคุณ</h1>
          <p className="mt-5 max-w-sm leading-7 text-indigo-100/75">เข้าสู่ระบบเพื่อจัดการบัญชีและกลับมาเลือกดูสินค้าที่คุณชื่นชอบได้ทุกเวลา</p>
        </div>
        <div className="relative flex items-center gap-3 text-sm text-indigo-100/65">
          <span className="flex -space-x-2"><i className="size-8 rounded-full border-2 border-indigo-950 bg-amber-300" /><i className="size-8 rounded-full border-2 border-indigo-950 bg-rose-300" /><i className="size-8 rounded-full border-2 border-indigo-950 bg-cyan-300" /></span>
          <span>ประสบการณ์ช้อปปิ้งที่เรียบง่ายและปลอดภัย</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9 lg:mx-0 lg:ml-auto">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-indigo-600 lg:hidden">
          <ShoppingBag size={18} /> 319 STORE
        </Link>
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">ยินดีต้อนรับ</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{isRegistering ? 'สร้างบัญชีใหม่' : 'เข้าสู่ระบบ'}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isRegistering ? 'สมัครสมาชิกเพื่อเริ่มต้นช้อปปิ้งกับเรา' : 'กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่บัญชีของคุณ'}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isRegistering && (
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-700">ชื่อที่ใช้แสดง</span>
              <span className="relative block">
                <UserRound className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                <input autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="ชื่อของคุณ" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50" />
              </span>
            </label>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">อีเมล</span>
            <span className="relative block">
              <Mail className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
              <input autoComplete="email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50" />
            </span>
          </label>

          <label className="block space-y-2">
            <span className="flex items-center justify-between text-sm font-bold text-slate-700">
              รหัสผ่าน
              {!isRegistering && <span className="text-xs font-medium text-slate-400">อย่างน้อย 8 ตัวอักษร</span>}
            </span>
            <span className="relative block">
              <LockKeyhole className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
              <input autoComplete={isRegistering ? 'new-password' : 'current-password'} type={showPassword ? 'text' : 'password'} required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>

          {error && <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 hover:shadow-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'กำลังดำเนินการ...' : isRegistering ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
            {!isSubmitting && <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          {isRegistering ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชี?'}{' '}
          <button type="button" onClick={() => { setIsRegistering((value) => !value); setError('') }} className="font-extrabold text-indigo-600 hover:text-indigo-700">
            {isRegistering ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        </p>
        <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-400">การสมัครใช้งานเป็นโหมดเริ่มต้นสำหรับเชื่อมต่อ API และฐานข้อมูลภายหลัง</p>
      </div>
    </section>
  )
}
