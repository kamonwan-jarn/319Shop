import type { Product } from '../types/product'

// อัตราแลกเปลี่ยนคงที่สำหรับเดโม (ราคาจาก Fake Store API เป็น USD)
const USD_TO_THB = 35

// แปลงราคา USD จาก API เป็นเงินบาทเพื่อใช้แสดงบนหน้าเว็บ
export function formatPrice(usd: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(usd * USD_TO_THB)
}

const categories: Record<string, string> = {
  "men's clothing": 'เสื้อผ้าผู้ชาย',
  "women's clothing": 'เสื้อผ้าผู้หญิง',
  jewelery: 'เครื่องประดับ',
  electronics: 'อุปกรณ์อิเล็กทรอนิกส์',
}

// คำแปลชื่อสินค้าจากชุดข้อมูล Fake Store API
const titles: Record<string, string> = {
  "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops": 'กระเป๋าเป้ Fjallraven รุ่น Foldsack No. 1 สำหรับแล็ปท็อป 15 นิ้ว',
  "Mens Casual Premium Slim Fit T-Shirts": 'เสื้อยืดผู้ชายทรงสลิมฟิต รุ่นพรีเมียม',
  "Mens Cotton Jacket": 'แจ็กเก็ตผ้าฝ้ายผู้ชาย',
  "Mens Casual Slim Fit": 'เสื้อผ้าผู้ชายทรงสลิมฟิต',
  "John Hardy Women's Legends Gold & Silver Dragon Bracelet": 'สร้อยข้อมือมังกรทองและเงิน John Hardy รุ่น Legends',
  "Solid Gold Petite Micropavé": 'แหวนทองคำแท้ประดับไมโครพาเว่',
  "White Gold Plated Princess": 'สร้อยคอชุบทองคำขาวพร้อมจี้ทรงเจ้าหญิง',
  "Pierced Owl Rose Gold Plated Stainless Steel Double": 'ต่างหูสเตนเลสชุบโรสโกลด์ Pierced Owl',
  "WD 2TB Elements Portable External Hard Drive - USB 3.0": 'ฮาร์ดไดรฟ์พกพา WD Elements 2TB USB 3.0',
  "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s": 'SSD ภายใน SanDisk SSD PLUS 1TB SATA III',
  "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5": 'SSD Silicon Power 256GB 3D NAND A55 SATA III',
  "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive": 'ฮาร์ดไดรฟ์เกมมิง WD 4TB สำหรับ PlayStation 4',
  "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin": 'จอมอนิเตอร์ Acer SB220Q 21.5 นิ้ว Full HD IPS',
  "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED": 'จอมอนิเตอร์เกมมิงโค้ง Samsung 49 นิ้ว 144Hz QLED',
  "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats": 'เสื้อแจ็กเก็ตกันหนาว 3-in-1 สำหรับผู้หญิง',
  "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket": 'แจ็กเก็ตหนังเทียมผู้หญิงพร้อมฮู้ดถอดได้',
  "Rain Jacket Women Windbreaker Striped Climbing Raincoats": 'เสื้อกันฝนและกันลมผู้หญิงลายทาง',
  "MBJ Women's Solid Short Sleeve Boat Neck V": 'เสื้อแขนสั้นคอเรือผู้หญิง MBJ',
  "Opna Women's Short Sleeve Moisture": 'เสื้อแขนสั้นผู้หญิงระบายความชื้น Opna',
  "DANVOUY Womens T Shirt Casual Cotton Short": 'เสื้อยืดผ้าฝ้ายลำลองผู้หญิง DANVOUY',
}

export function translateCategory(category: string): string {
  return categories[category] ?? category
}

// ปรับข้อมูลที่แสดงให้เป็นภาษาไทย โดยคงข้อมูลต้นฉบับสำหรับการเรียก API ไว้
export function translateProduct(product: Product): Product {
  const category = translateCategory(product.category)
  return {
    ...product,
    title: titles[product.title] ?? product.title,
    category,
    description: `สินค้า${category}คุณภาพดี คัดสรรมาเพื่อการใช้งานในชีวิตประจำวัน ดูรายละเอียดและราคาได้จากข้อมูลสินค้าด้านบน`,
  }
}
