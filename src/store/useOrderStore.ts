// จัดเก็บข้อมูลคำสั่งซื้อ
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Product } from '../types/product'

export interface OrderItem {
  product: Product
  quantity: number
}

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  subdistrict: string
  district: string
  province: string
  postalCode: string
}

export interface Order {
  id: string
  createdAt: string
  items: OrderItem[]
  totalAmount: number
  shippingAddress: ShippingAddress
  paymentMethod: 'promptpay' | 'cod'
  status: 'ชำระเงินสำเร็จ'
}

interface OrderStore {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (newOrderData) => {
        // สร้างรหัสออเดอร์อัตโนมัติ รูปแบบ ORD-XXXXXX
        const randomNum = Math.floor(100000 + Math.random() * 900000)
        const orderId = `ORD-${randomNum}`

        const now = new Date()
        const formattedDate = now.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })

        const newOrder: Order = {
          ...newOrderData,
          id: orderId,
          createdAt: formattedDate,
          status: 'ชำระเงินสำเร็จ'
        }

        set((state) => ({
          orders: [newOrder, ...state.orders]
        }))
      }
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)