import { useToastStore } from '../store/useToastStore'
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react'

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
            <span className="text-xs font-semibold truncate">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}