import { createHash, randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const seedDatabaseUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL
const samplePassword = process.env.SEED_SAMPLE_PASSWORD

if (!seedDatabaseUrl) {
  throw new Error('Set DIRECT_URL or DATABASE_URL before running the seed.')
}

if (!samplePassword) {
  throw new Error('Set SEED_SAMPLE_PASSWORD in the local environment before running the seed.')
}

const prisma = new PrismaClient({
  datasources: { db: { url: seedDatabaseUrl } },
})

const products = [
  {
    id: 1,
    name: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
    category: "men's clothing",
  },
  {
    id: 2,
    name: 'Mens Casual Premium Slim Fit T-Shirts ',
    price: 22.3,
    imageUrl: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
    category: "men's clothing",
  },
  {
    id: 3,
    name: 'Mens Cotton Jacket',
    price: 55.99,
    imageUrl: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png',
    category: "men's clothing",
  },
  {
    id: 4,
    name: 'Mens Casual Slim Fit',
    price: 15.99,
    imageUrl: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png',
    category: "men's clothing",
  },
  {
    id: 5,
    name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    imageUrl: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png',
    category: 'jewelery',
  },
]

const userSeeds = [
  { name: 'Avery Sample', email: 'avery@example.com' },
  { name: 'Bailey Sample', email: 'bailey@example.com' },
  { name: 'Casey Sample', email: 'casey@example.com' },
  { name: 'Devon Sample', email: 'devon@example.com' },
  { name: 'Elliot Sample', email: 'elliot@example.com' },
]

const shippingAddress = {
  address: '319 Sample Road',
  subdistrict: 'Pathum Wan',
  district: 'Pathum Wan',
  province: 'Bangkok',
  postalCode: '10330',
}

async function main() {
  const passwordHash = await bcrypt.hash(samplePassword, 12)

  // ลบตามลำดับ FK เพื่อให้รัน seed ซ้ำได้
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.authSession.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  await prisma.product.createMany({ data: products })
  const users = await Promise.all(
    userSeeds.map((user) => prisma.user.create({ data: { ...user, passwordHash } }))
  )

  await prisma.wishlistItem.createMany({
    data: [
      { userId: users[0].id, productId: 1 },
      { userId: users[0].id, productId: 5 },
      { userId: users[1].id, productId: 2 },
      { userId: users[2].id, productId: 3 },
      { userId: users[3].id, productId: 4 },
    ],
  })

  await prisma.cartItem.createMany({
    data: [
      { userId: users[0].id, productId: 2, quantity: 2 },
      { userId: users[1].id, productId: 1, quantity: 1 },
      { userId: users[2].id, productId: 4, quantity: 3 },
      { userId: users[4].id, productId: 5, quantity: 1 },
    ],
  })

  await prisma.order.create({
    data: {
      userId: users[0].id,
      totalAmount: 154.55,
      status: 'PAID',
      shippingName: users[0].name,
      shippingPhone: '0812345678',
      shippingAddress,
      paymentMethod: 'promptpay',
      items: {
        create: [
          { productId: 1, productName: products[0].name, unitPrice: 109.95, quantity: 1 },
          { productId: 2, productName: products[1].name, unitPrice: 22.3, quantity: 2 },
        ],
      },
    },
  })

  await prisma.order.create({
    data: {
      userId: users[1].id,
      totalAmount: 87.97,
      status: 'PENDING',
      shippingName: users[1].name,
      shippingPhone: '0898765432',
      shippingAddress: {
        ...shippingAddress,
        address: '88 Sample Street',
        postalCode: '10110',
      },
      paymentMethod: 'cod',
      items: {
        create: [
          { productId: 3, productName: products[2].name, unitPrice: 55.99, quantity: 1 },
          { productId: 4, productName: products[3].name, unitPrice: 15.99, quantity: 2 },
        ],
      },
    },
  })

  const sessions = users.slice(0, 2).map((user) => {
    const token = randomBytes(32).toString('base64url')
    const tokenHash = createHash('sha256').update(token).digest('hex')
    return {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    }
  })
  await prisma.authSession.createMany({ data: sessions })

  console.info('Seed completed: 5 users, 5 products, wishlist/cart rows, 2 orders, and 2 sessions.')
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
