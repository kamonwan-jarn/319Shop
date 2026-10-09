import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import { useCartStore } from '../store/useCartStore'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const validId = Number.isInteger(productId) && productId > 0
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['product', productId], queryFn: () => fetchProductById(productId), enabled: validId, staleTime: 5 * 60 * 1000 })
  const addItem = useCartStore((state) => state.addItem)

  if (!validId) return <p className="rounded-xl bg-amber-50 p-5 text-amber-800">ไม่พบรหัสสินค้าที่ถูกต้อง <Link className="underline" to="/">กลับไปหน้าสินค้า</Link></p>
  if (isLoading) return <div className="grid animate-pulse gap-8 md:grid-cols-2"><div className="h-96 rounded-2xl bg-slate-200" /><div className="h-80 rounded-2xl bg-slate-200" /></div>
  if (isError || !data) return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">โหลดรายละเอียดไม่สำเร็จ <button onClick={() => void refetch()} className="ml-3 font-bold underline">ลองอีกครั้ง</button></div>

  return (
    <div className="grid gap-7 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-7 md:grid-cols-2 md:p-9">
      <div className="flex min-h-80 items-center justify-center rounded-2xl bg-[#f8f7f5] p-8 sm:min-h-[28rem]"><img src={data.image} alt={data.title} className="max-h-96 max-w-full object-contain" /></div>
      <div className="flex flex-col justify-center px-1 py-3 sm:px-4"><Link to="/" className="text-sm font-medium text-[#a94f25] hover:underline">← กลับไปเลือกสินค้า</Link><p className="mt-6 w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-[#a94f25]">{data.category}</p><h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">{data.title}</h1><p className="mt-3 text-amber-600">★ {data.rating.rate} <span className="text-slate-500">({data.rating.count} รีวิว)</span></p><p className="mt-5 leading-7 text-slate-600">{data.description}</p><div className="mt-7 flex items-end justify-between border-t border-slate-100 pt-5"><div><p className="text-xs text-slate-500">ราคา</p><p className="mt-1 text-3xl font-bold">${data.price.toFixed(2)}</p></div><button onClick={() => addItem(data.id)} className="rounded-xl bg-[#b95e2d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#98491f]">เพิ่มลงตะกร้า</button></div></div>
    </div>
  )
}
