import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Search, Shield, RefreshCw, Zap } from 'lucide-react'
import { fetchCategories, fetchProducts } from '../api/products'
import ProductCard from '../components/ProductCard'

type SortMode = 'featured' | 'price-low' | 'price-high'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<SortMode>('featured')
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: fetchProducts, staleTime: 5 * 60 * 1000 })
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: 30 * 60 * 1000 })

  const products = useMemo(() => {
    const filtered = (productsQuery.data ?? []).filter((product) => {
      const matchesCategory = !category || product.category === category
      const matchesSearch = product.title.toLowerCase().includes(search.trim().toLowerCase())
      return matchesCategory && matchesSearch
    })
    if (sort === 'price-low') return filtered.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') return filtered.sort((a, b) => b.price - a.price)
    return filtered
  }, [productsQuery.data, category, search, sort])

  const heroProduct = productsQuery.data?.find((product) => product.id === 1) ?? productsQuery.data?.[0]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative mt-4 sm:mt-8 overflow-hidden rounded-[2rem] bg-zinc-600 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-600 via-zinc-600/90 to-transparent z-10" />
        {heroProduct && (
          <img
            src={heroProduct.image}
            alt="Hero Background"
            className="absolute inset-0 h-full w-full object-cover object-right opacity-30 mix-blend-luminosity"
          />
        )}
        <div className="relative z-20 flex flex-col justify-center min-h-[400px] sm:min-h-[500px] p-8 sm:p-16 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-100 backdrop-blur-sm w-fit mb-6">
            <Zap size={14} className="text-yellow-400" /> New Collection
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white">
            Elevate Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400">Everyday Style.</span>
          </h1>
          <p className="text-zinc-200 text-sm sm:text-lg max-w-md mb-8">
            Discover our curated collection of premium clothing, electronics, and jewelry designed for modern living.
          </p>
          <div className="flex items-center gap-4">
            <a href="#products" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-zinc-600 transition-transform hover:scale-105 shadow-lg">
              Shop Now <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-zinc-200">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <Shield size={24} />
          </div>
          <h3 className="font-bold text-zinc-700 text-lg">Premium Quality</h3>
          <p className="text-sm text-zinc-500 max-w-xs">Crafted with precision and excellence for the highest standards.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <RefreshCw size={24} />
          </div>
          <h3 className="font-bold text-zinc-700 text-lg">Easy Returns</h3>
          <p className="text-sm text-zinc-500 max-w-xs">30-day hassle-free return policy on all unworn items.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <Zap size={24} />
          </div>
          <h3 className="font-bold text-zinc-700 text-lg">Fast Shipping</h3>
          <p className="text-sm text-zinc-500 max-w-xs">Free express shipping on all orders over $50.</p>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="scroll-mt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-700">Trending Now</h2>
            <p className="text-zinc-500 mt-2">Explore what's popular among our community.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="hidden sm:block rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-600 outline-none focus:border-zinc-400"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 flex gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
          <button onClick={() => setCategory('')} className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${category === '' ? 'bg-zinc-600 text-white shadow-md' : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400'}`}>All Products</button>
          {(categoriesQuery.data ?? []).map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-bold capitalize transition-all ${category === item ? 'bg-zinc-600 text-white shadow-md' : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400'}`}>
              {item}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {productsQuery.isError && <div className="rounded-2xl bg-red-50 p-6 text-red-800 font-medium">Failed to load products. <button onClick={() => void productsQuery.refetch()} className="underline ml-2">Try again</button></div>}

        {productsQuery.isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-zinc-100" />
                <div className="mt-4 h-4 w-3/4 rounded bg-zinc-100" />
                <div className="mt-2 h-4 w-1/4 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        )}

        {productsQuery.data && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {productsQuery.data && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-600">No products found</h3>
            <p className="mt-2 text-sm text-zinc-500 max-w-sm">We couldn't find anything matching your search. Try adjusting your filters or search terms.</p>
            <button onClick={() => { setSearch(''); setCategory('') }} className="mt-6 rounded-full bg-zinc-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-500">Clear all filters</button>
          </div>
        )}
      </section>
    </div>
  )
}
