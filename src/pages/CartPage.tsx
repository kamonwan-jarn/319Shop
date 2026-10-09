import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import { useCartStore } from '../store/useCartStore'
import ProductCard from '../components/ProductCard'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const results = useQueries({ queries: items.map(({ id }) => ({ queryKey: ['product', id], queryFn: () => fetchProductById(id), staleTime: 5 * 60 * 1000 })) })
  const loading = results.some((result) => result.isLoading)
  const hasError = results.some((result) => result.isError)

  return <><div className="mb-7"><h1 className="text-3xl font-bold">ตะกร้าของฉัน</h1><p className="mt-2 text-slate-500">รายการสินค้าเก็บไว้ในเครื่องของคุณ</p></div>
    {items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><p className="text-lg font-semibold">ยังไม่มีสินค้าในตะกร้า</p><Link to="/" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">เลือกซื้อสินค้า</Link></div> : <>
      {loading && <p className="mb-4 text-slate-500">กำลังโหลดข้อมูลสินค้า…</p>}
      {hasError && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">โหลดสินค้าบางรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง <button onClick={() => results.forEach((result) => { if (result.isError) void result.refetch() })} className="ml-2 font-bold underline">ลองอีกครั้ง</button></div>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{results.map((result, index) => {
        const item = items[index]
        if (!item || !result.data) return null
        return <div key={item.id} className="relative"><ProductCard product={result.data} /><div className="absolute right-2 top-2 flex items-center gap-2 rounded-full bg-white/95 px-2 py-1 text-xs shadow">จำนวน {item.quantity}<button aria-label={`ลบ ${result.data.title} ออกจากตะกร้า`} onClick={() => removeItem(item.id)} className="rounded-full bg-red-100 px-2 py-1 font-semibold text-red-700">ลบ</button></div></div>
      })}</div>
    </>}
  </>
}
