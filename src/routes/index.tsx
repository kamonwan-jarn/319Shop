import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../components/RootLayout'
import AboutPage from '../pages/AboutPage'
import CartPage from '../pages/CartPage'
import CategoriesPage from '../pages/CategoriesPage'
import HomePage from '../pages/HomePage'
import ProductDetailPage from '../pages/ProductDetailPage'
import OrdersPage from '../pages/OrdersPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      {
        path: '*',
        element: (
          <div className="rounded-3xl bg-white p-12 text-center max-w-md mx-auto my-12 border border-slate-100 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">ไม่พบหน้าที่ต้องการ</h1>
            <a className="mt-4 inline-block text-indigo-600 font-bold underline" href="/">
              กลับหน้าหลัก
            </a>
          </div>
        ),
      },
    ],
  },
])