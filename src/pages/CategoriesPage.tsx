import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { fetchProducts } from '../api/products'
import ProductCard from '../components/ProductCard'
import { matchesProductSearch } from '../utils/productSearch'

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('recommended')

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const categories = ['all', 'electronics', 'jewelery', "men's clothing", "women's clothing"]

  const categoryNames: Record<string, string> = {
    all: 'ทั้งหมด',
    electronics: 'อุปกรณ์อิเล็กทรอนิกส์',
    jewelery: 'เครื่องประดับ',
    "men's clothing": 'เสื้อผ้าผู้ชาย',
    "women's clothing": 'เสื้อผ้าผู้หญิง',
  }

  // ระบบกรองและจัดเรียงสินค้า
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory
        const matchesSearch = matchesProductSearch(product, searchTerm)
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'rating') return (b.rating?.rate || 0) - (a.rating?.rate || 0)
        return 0
      })
  }, [products, selectedCategory, searchTerm, sortBy])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* 1. กล่องค้นหา & ตัวเลือกจัดเรียง */}
      <div className="bg-slate-50/60 p-3.5 md:p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาสินค้าที่ต้องการ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200/80 text-sm focus:outline-none focus:border-indigo-600 shadow-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
            เรียงตาม:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-white rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600 shadow-sm cursor-pointer"
          >
            <option value="recommended">สินค้าแนะนำ</option>
            <option value="price-low">ราคา: ต่ำ - สูง</option>
            <option value="price-high">ราคา: สูง - ต่ำ</option>
            <option value="rating">คะแนนรีวิวสูงสุด</option>
          </select>
        </div>
      </div>

      {/* 2. ปุ่มเลือกหมวดหมู่สินค้า */}
      <div className="space-y-4 pt-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900">หมวดหมู่สินค้า</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            เลือกดูสินค้าตามหมวดหมู่ที่คุณสนใจ
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {categoryNames[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. แสดงรายการสินค้า Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-100 h-72 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
          <p className="text-slate-500 font-medium">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
