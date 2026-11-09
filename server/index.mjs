import { createServer } from 'node:http'
import { randomBytes, scryptSync, timingSafeEqual, randomUUID } from 'node:crypto'

const PORT = Number(process.env.API_PORT ?? 3001)
const MAX_BODY_BYTES = 16 * 1024

// Temporary in-memory repository. Replace this map with a database repository when wiring up the DB.
const usersByEmail = new Map()
const sessionsByToken = new Map()

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
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
}

function createSession(user) {
  const token = randomBytes(32).toString('base64url')
  sessionsByToken.set(token, user.id)
  return { token, user: publicUser(user) }
}

function passwordMatches(password, savedHash) {
  const [salt, hash] = savedHash.split(':')
  const actual = scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)
  const method = request.method ?? 'GET'

  if (method === 'GET' && url.pathname === '/api/health') {
    return sendJson(response, 200, { status: 'ok', database: 'not-connected', storage: 'in-memory' })
  }

  try {
    if (method === 'POST' && url.pathname === '/api/auth/register') {
      const { name, email, password } = await readJson(request)
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
      const normalizedName = typeof name === 'string' ? name.trim() : ''

      if (normalizedName.length < 2 || normalizedName.length > 80) return sendJson(response, 400, { error: 'กรุณากรอกชื่อ 2–80 ตัวอักษร' })
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254) return sendJson(response, 400, { error: 'รูปแบบอีเมลไม่ถูกต้อง' })
      if (typeof password !== 'string' || password.length < 8 || password.length > 128) return sendJson(response, 400, { error: 'รหัสผ่านต้องมี 8–128 ตัวอักษร' })
      if (usersByEmail.has(normalizedEmail)) return sendJson(response, 409, { error: 'อีเมลนี้ถูกใช้งานแล้ว' })

      const salt = randomBytes(16).toString('hex')
      const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
      const user = { id: randomUUID(), name: normalizedName, email: normalizedEmail, passwordHash, createdAt: new Date().toISOString() }
      usersByEmail.set(normalizedEmail, user)
      return sendJson(response, 201, createSession(user))
    }

    if (method === 'POST' && url.pathname === '/api/auth/login') {
      const { email, password } = await readJson(request)
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
      const user = usersByEmail.get(normalizedEmail)

      if (!user || typeof password !== 'string' || !passwordMatches(password, user.passwordHash)) {
        return sendJson(response, 401, { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
      }
      return sendJson(response, 200, createSession(user))
    }

    if (method === 'GET' && url.pathname === '/api/auth/me') {
      const token = request.headers.authorization?.replace(/^Bearer\s+/i, '')
      const userId = token ? sessionsByToken.get(token) : undefined
      const user = userId ? [...usersByEmail.values()].find((entry) => entry.id === userId) : undefined
      if (!user) return sendJson(response, 401, { error: 'กรุณาเข้าสู่ระบบใหม่' })
      return sendJson(response, 200, { user: publicUser(user) })
    }

    if (method === 'POST' && url.pathname === '/api/auth/logout') {
      const token = request.headers.authorization?.replace(/^Bearer\s+/i, '')
      if (token) sessionsByToken.delete(token)
      return sendJson(response, 200, { success: true })
    }

    return sendJson(response, 404, { error: 'ไม่พบ API ที่เรียกใช้งาน' })
  } catch (error) {
    const statusCode = error?.statusCode ?? 500
    return sendJson(response, statusCode, { error: statusCode === 500 ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' : error.message })
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Auth API ready at http://127.0.0.1:${PORT}`)
  console.log('Storage: in-memory only (data resets when the server restarts)')
})
