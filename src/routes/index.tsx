import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../components/RootLayout'
import AboutPage from '../pages/AboutPage'
import CartPage from '../pages/CartPage'
import CategoriesPage from '../pages/CategoriesPage'
import HomePage from '../pages/HomePage'
import ProductDetailPage from '../pages/ProductDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: '*', element: <div className="rounded-2xl bg-white p-10 text-center"><h1 className="text-2xl font-bold">ไม่พบหน้าที่ต้องการ</h1><a className="mt-4 inline-block text-indigo-700 underline" href="/">กลับหน้าหลัก</a></div> },
    ],
  },
])
