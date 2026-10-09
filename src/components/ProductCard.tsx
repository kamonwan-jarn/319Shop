import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import type { Product } from '../types/product'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <article className="group relative flex flex-col bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 rounded-2xl p-6 transition-all duration-300 group-hover:shadow-lg border border-zinc-100 group-hover:border-zinc-200">
        <Link to={`/product/${product.id}`} className="absolute inset-0 flex items-center justify-center p-8">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
            loading="lazy"
          />
        </Link>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600 shadow-sm border border-zinc-100">
          {product.category}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); addItem(product.id) }}
          className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-4 items-center justify-center rounded-full bg-zinc-600 text-white opacity-0 shadow-xl transition-all duration-300 hover:bg-zinc-500 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100"
          title="Add to cart"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="mt-4 flex flex-col px-1">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex items-center text-[11px] font-bold text-zinc-600">
            ★ {product.rating.rate}
          </div>
          <span className="text-[11px] font-medium text-zinc-400">({product.rating.count} reviews)</span>
        </div>
        <Link to={`/product/${product.id}`} className="text-sm font-bold leading-tight text-zinc-700 hover:underline line-clamp-1">
          {product.title}
        </Link>
        <span className="mt-1.5 text-sm font-bold text-zinc-500">${product.price.toFixed(2)}</span>
      </div>
    </article>
  )
}
