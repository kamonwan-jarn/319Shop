import { useState } from 'react'
import { useOrderStore, type Order } from '../store/useOrderStore'
import { Package, Clock, MapPin, CreditCard, Printer, Truck, X } from 'lucide-react'
import { formatPrice } from '../utils/locale'

export default function OrdersPage() {
  const orders = useOrderStore((state) => state.orders)
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null)

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">ยังไม่มีประวัติการสั่งซื้อ</h2>
        <p className="text-slate-500 text-sm">เมื่อคุณทำรายการสั่งซื้อสำเร็จ รายการจะถูกบันทึกไว้ที่นี่</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
          <Package className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">ประวัติการสั่งซื้อ</h1>
          <p className="text-slate-500 text-sm">ตรวจสอบคำสั่งซื้อ สถานะการจัดส่ง และพิมพ์ใบเสร็จ</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 hover:shadow-md transition-shadow"
          >
            {/* Header ออเดอร์ */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400">รหัสคำสั่งซื้อ</span>
                <div className="text-lg font-black text-indigo-600">{order.id}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {order.createdAt}
                </span>

                <button
                  onClick={() => setSelectedReceipt(order)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> ใบเสร็จ
                </button>
              </div>
            </div>

            {/* แถบติดตามสถานะพัสดุ */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-1 text-indigo-600">
                  <Truck className="w-4 h-4" /> สถานะจัดส่ง
                </span>
                <span className="text-emerald-600 font-bold">กำลังเตรียมพัสดุ (จัดส่งถึงใน 1-2 วัน)</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-emerald-700">ชำระเงินแล้ว</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <span className="text-indigo-600">กำลังแพ็กของ</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-slate-200"></div>
                  <span className="text-slate-400">ส่งขนส่ง</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-slate-200"></div>
                  <span className="text-slate-400">จัดส่งสำเร็จ</span>
                </div>
              </div>
            </div>

            {/* รายการสินค้าในออเดอร์ */}
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-12 h-12 object-contain p-1 bg-slate-50 rounded-xl border border-slate-100"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 line-clamp-1 max-w-md">
                        {item.product.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatPrice(item.product.price)} x {item.quantity} ชิ้น
                      </div>
                    </div>
                  </div>
                  <div className="font-extrabold text-slate-800">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* ที่อยู่จัดส่ง และสรุปชำระเงิน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-indigo-500" /> ที่อยู่จัดส่ง:
                </div>
                {order.shippingAddress?.fullName ? (
                  <div>
                    <div className="font-bold text-slate-800">{order.shippingAddress.fullName} ({order.shippingAddress.phone})</div>
                    <div className="text-slate-600 mt-1">
                      {order.shippingAddress.address}{' '}
                      {order.shippingAddress.subdistrict && `ต.${order.shippingAddress.subdistrict} `}
                      {order.shippingAddress.district && `อ.${order.shippingAddress.district} `}
                      จ.{order.shippingAddress.province} {order.shippingAddress.postalCode}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400">ไม่ได้ระบุที่อยู่</div>
                )}
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-2 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-500" /> ช่องทางชำระเงิน:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {order.paymentMethod === 'promptpay' ? 'สแกน QR Code พร้อมเพย์' : 'เก็บเงินปลายทาง (COD)'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200/60">
                  <span className="font-bold text-slate-900 text-sm">ยอดรวมทั้งสิ้น:</span>
                  <span className="text-xl font-black text-indigo-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL พิมพ์ใบเสร็จ */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div id="receipt-print-area" className="space-y-4">
              <div className="text-center border-b pb-4">
                <div className="font-black text-2xl text-indigo-600">319STORE</div>
                <div className="text-xs text-slate-400 mt-0.5">ใบเสร็จรับเงิน / Receipt</div>
                <div className="text-xs font-bold text-slate-700 mt-2">เลขที่: {selectedReceipt.id}</div>
                <div className="text-[11px] text-slate-500">วันที่: {selectedReceipt.createdAt}</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-800">รายการสินค้า:</div>
                {selectedReceipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-600">
                    <span>{item.product.title} (x{item.quantity})</span>
                    <span className="font-semibold text-slate-800">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between font-black text-sm text-slate-900">
                <span>ยอดรวมชำระสุทธิ:</span>
                <span className="text-indigo-600">{formatPrice(selectedReceipt.totalAmount)}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 space-y-0.5 border border-slate-100">
                <div className="font-bold text-slate-700">จัดส่งให้: {selectedReceipt.shippingAddress?.fullName}</div>
                <div>{selectedReceipt.shippingAddress?.address} จ.{selectedReceipt.shippingAddress?.province}</div>
                <div>เบอร์โทร: {selectedReceipt.shippingAddress?.phone}</div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Printer className="w-4 h-4" /> สั่งพิมพ์ใบเสร็จ (Print)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}