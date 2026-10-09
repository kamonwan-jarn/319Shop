import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchCategories, fetchProductsByCategory } from '../api/products'
import ProductCard from '../components/ProductCard'

export default function CategoriesPage() {
  const [selected, setSelected] = useState('')
  const categories = useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: 30 * 60 * 1000 })
  const products = useQuery({ queryKey: ['category-products', selected], queryFn: () => fetchProductsByCategory(selected), enabled: Boolean(selected), staleTime: 5 * 60 * 1000 })

  return <><div className="rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 to-white px-6 py-7 sm:px-8"><p className="text-xs font-bold uppercase tracking-widest text-[#b95e2d]">เลือกดูแบบง่าย ๆ</p><h1 className="mt-2 text-3xl font-bold">หมวดหมู่สินค้า</h1><p className="mt-2 text-slate-500">เลือกหมวดหมู่ที่สนใจเพื่อกรองรายการสินค้า</p></div>
    {categories.isLoading && <div className="mt-6 h-12 animate-pulse rounded-xl bg-slate-200" />}
    {categories.isError && <div role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">โหลดหมวดหมู่ไม่สำเร็จ <button onClick={() => void categories.refetch()} className="font-bold underline">ลองอีกครั้ง</button></div>}
    {categories.data && <div className="mt-6 flex flex-wrap gap-2">{categories.data.map((category) => <button key={category} onClick={() => setSelected(category)} className={`rounded-full border px-4 py-2 text-sm font-medium capitalize shadow-sm transition ${selected === category ? 'border-[#b95e2d] bg-[#b95e2d] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-[#a94f25]'}`}>{category}</button>)}</div>}
    {selected && <><h2 className="mb-4 mt-8 text-xl font-bold capitalize">{selected}</h2>{products.isLoading && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200" />)}</div>}{products.isError && <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">โหลดสินค้าไม่สำเร็จ <button onClick={() => void products.refetch()} className="font-bold underline">ลองอีกครั้ง</button></div>}{products.data && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{products.data.map((product) => <ProductCard key={product.id} product={product} />)}</div>}</>}
  </>
}
