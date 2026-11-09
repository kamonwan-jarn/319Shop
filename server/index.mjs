import { createServer } from 'node:http'
import { createHash, randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const PORT = Number(process.env.API_PORT ?? 3001)
const MAX_BODY_BYTES = 16 * 1024
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000
const prisma = new PrismaClient()

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(payload))
}

async function readJson(request) {
  const chunks = []
  let bytes = 0

  for await (const chunk of request) {
    bytes += chunk.length
    if (bytes > MAX_BODY_BYTES) throw Object.assign(new Error('คำขอมีขนาดใหญ่เกินไป'), { statusCode: 413 })
    chunks.push(chunk)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw Object.assign(new Error('ข้อมูลคำขอไม่ถูกต้อง'), { statusCode: 400 })
  }
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

async function getSessionUserId(request) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return null

  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { id: true, userId: true, expiresAt: true },
  })
  if (!session) return null
  if (session.expiresAt <= new Date()) {
    await prisma.authSession.delete({ where: { id: session.id } })
    return null
  }
  return session.userId
}

async function createSession(user) {
  const token = randomBytes(32).toString('base64url')
  await prisma.authSession.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  })
  return { token, user: publicUser(user) }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)
  const method = request.method ?? 'GET'

  if (method === 'GET' && url.pathname === '/api/health') {
    try {
      await prisma.$queryRaw`SELECT 1`
      return sendJson(response, 200, { status: 'ok', database: 'connected', storage: 'postgresql' })
    } catch {
      return sendJson(response, 503, { status: 'error', database: 'not-connected' })
    }
  }

  try {
    if (url.pathname === '/api/cart' && method === 'GET') {
      const userId = await getSessionUserId(request)
      if (!userId) return sendJson(response, 401, { error: 'กรุณาเข้าสู่ระบบใหม่' })

      const items = await prisma.cartItem.findMany({
        where: { userId },
        select: { productId: true, quantity: true },
        orderBy: { updatedAt: 'desc' },
      })
      return sendJson(response, 200, {
        items: items.map(({ productId, quantity }) => ({ id: productId, quantity })),
      })
    }

    if (url.pathname === '/api/cart/items' && method === 'POST') {
      const userId = await getSessionUserId(request)
      if (!userId) return sendJson(response, 401, { error: 'กรุณาเข้าสู่ระบบใหม่' })

      const { product, quantity } = await readJson(request)
      if (
        !product ||
        !Number.isInteger(product.id) ||
        typeof product.title !== 'string' ||
        typeof product.image !== 'string' ||
        typeof product.category !== 'string' ||
        typeof product.price !== 'number' ||
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return sendJson(response, 400, { error: 'ข้อมูลสินค้าในตะกร้าไม่ถูกต้อง' })
      }

      await prisma.$transaction(async (transaction) => {
        await transaction.product.upsert({
          where: { id: product.id },
          create: {
            id: product.id,
            name: product.title,
            price: product.price,
            imageUrl: product.image,
            category: product.category,
          },
          update: {
            name: product.title,
            price: product.price,
            imageUrl: product.image,
            category: product.category,
          },
        })
        await transaction.cartItem.upsert({
          where: { userId_productId: { userId, productId: product.id } },
          create: { userId, productId: product.id, quantity },
          update: { quantity },
        })
      })
      return sendJson(response, 200, { success: true })
    }

    const cartItemMatch = url.pathname.match(/^\/api\/cart\/items\/(\d+)$/)
    if (cartItemMatch && (method === 'PUT' || method === 'DELETE')) {
      const userId = await getSessionUserId(request)
      if (!userId) return sendJson(response, 401, { error: 'กรุณาเข้าสู่ระบบใหม่' })
      const productId = Number(cartItemMatch[1])

      if (method === 'DELETE') {
        await prisma.cartItem.deleteMany({ where: { userId, productId } })
        return sendJson(response, 200, { success: true })
      }

      const { quantity } = await readJson(request)
      if (!Number.isInteger(quantity) || quantity < 1) {
        return sendJson(response, 400, { error: 'จำนวนสินค้าไม่ถูกต้อง' })
      }
      const result = await prisma.cartItem.updateMany({
        where: { userId, productId },
        data: { quantity },
      })
      if (result.count === 0) return sendJson(response, 404, { error: 'ไม่พบสินค้าในตะกร้า' })
      return sendJson(response, 200, { success: true })
    }

    if (url.pathname === '/api/cart' && method === 'DELETE') {
      const userId = await getSessionUserId(request)
      if (!userId) return sendJson(response, 401, { error: 'กรุณาเข้าสู่ระบบใหม่' })
      await prisma.cartItem.deleteMany({ where: { userId } })
      return sendJson(response, 200, { success: true })
    }

    if (method === 'POST' && url.pathname === '/api/auth/register') {
      const { name, email, password } = await readJson(request)
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
      const normalizedName = typeof name === 'string' ? name.trim() : ''

      if (normalizedName.length < 2 || normalizedName.length > 80) return sendJson(response, 400, { error: 'กรุณากรอกชื่อ 2–80 ตัวอักษร' })
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254) return sendJson(response, 400, { error: 'รูปแบบอีเมลไม่ถูกต้อง' })
      if (typeof password !== 'string' || password.length < 8 || password.length > 128) return sendJson(response, 400, { error: 'รหัสผ่านต้องมี 8–128 ตัวอักษร' })
      const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
      if (existingUser) return sendJson(response, 409, { error: 'อีเมลนี้ถูกใช้งานแล้ว' })

      const passwordHash = await bcrypt.hash(password, 12)
      const token = randomBytes(32).toString('base64url')
      const user = await prisma.$transaction(async (transaction) => {
        const createdUser = await transaction.user.create({
          data: { name: normalizedName, email: normalizedEmail, passwordHash },
        })
        await transaction.authSession.create({
          data: {
            userId: createdUser.id,
            tokenHash: hashToken(token),
            expiresAt: new Date(Date.now() + SESSION_TTL_MS),
          },
        })
        return createdUser
      })

      return sendJson(response, 201, { token, user: publicUser(user) })
    }

    if (method === 'POST' && url.pathname === '/api/auth/login') {
      const { email, password } = await readJson(request)
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

      if (!user || typeof password !== 'string' || !(await bcrypt.compare(password, user.passwordHash))) {
        return sendJson(response, 401, { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
      }
      return sendJson(response, 200, await createSession(user))
    }

    if (method === 'GET' && url.pathname === '/api/auth/me') {
      const token = request.headers.authorization?.replace(/^Bearer\s+/i, '')
      if (!token) return sendJson(response, 401, { error: 'กรุณาเข้าสู่ระบบใหม่' })

      const session = await prisma.authSession.findUnique({
        where: { tokenHash: hashToken(token) },
        include: { user: true },
      })
      if (!session || session.expiresAt <= new Date()) {
        if (session) await prisma.authSession.delete({ where: { id: session.id } })
        return sendJson(response, 401, { error: 'กรุณาเข้าสู่ระบบใหม่' })
      }
      return sendJson(response, 200, { user: publicUser(session.user) })
    }

    if (method === 'POST' && url.pathname === '/api/auth/logout') {
      const token = request.headers.authorization?.replace(/^Bearer\s+/i, '')
      if (token) {
        await prisma.authSession.deleteMany({ where: { tokenHash: hashToken(token) } })
      }
      return sendJson(response, 200, { success: true })
    }

    return sendJson(response, 404, { error: 'ไม่พบ API ที่เรียกใช้งาน' })
  } catch (error) {
    if (error?.code === 'P2002') {
      return sendJson(response, 409, { error: 'อีเมลนี้ถูกใช้งานแล้ว' })
    }
    const statusCode = error?.statusCode ?? 500
    if (statusCode === 500) console.error('Auth API request failed:', error.message)
    return sendJson(response, statusCode, { error: statusCode === 500 ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' : error.message })
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Auth API ready at http://127.0.0.1:${PORT}`)
  console.log('Storage: PostgreSQL via Prisma')
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      void prisma.$disconnect().finally(() => process.exit(0))
    })
  })
}
