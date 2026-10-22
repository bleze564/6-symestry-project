import 'dotenv/config'
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import express from 'express'
import { db } from './db.js'

const app = express()
const port = Number(process.env.PORT) || 3001
const sessionCookieName = 'investiq_session'
const sessions = new Map()
const scrypt = promisify(scryptCallback)

app.use(express.json({ limit: '20kb' }))

function readCookie(request, name) {
  const cookie = request.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null
}

function setSessionCookie(response, token) {
  response.setHeader(
    'Set-Cookie',
    `${sessionCookieName}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax`,
  )
}

function clearSessionCookie(response) {
  response.setHeader(
    'Set-Cookie',
    `${sessionCookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
  )
}

function getSessionUser(request) {
  const token = readCookie(request, sessionCookieName)
  return token ? sessions.get(token) ?? null : null
}

function requireUser(request, response, next) {
  const user = getSessionUser(request)
  if (!user) return response.status(401).json({ message: 'Увійдіть, щоб продовжити.' })
  request.user = user
  next()
}

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 255
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, 64)
  return `${salt}:${hash.toString('hex')}`
}

async function verifyPassword(password, storedHash) {
  const [salt, hashHex] = storedHash.split(':')
  if (!salt || !hashHex) return false

  const expectedHash = Buffer.from(hashHex, 'hex')
  const actualHash = await scrypt(password, salt, expectedHash.length)
  return actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash)
}

function startSession(response, user) {
  const token = randomBytes(32).toString('hex')
  sessions.set(token, user)
  setSessionCookie(response, token)
  return user
}

function publicTransaction(row) {
  return {
    ...row,
    amountMinorUnits: Number(row.amountMinorUnits),
  }
}

app.get('/api/health/db', async (_request, response) => {
  try {
    await db.query('SELECT 1')
    response.json({ connected: true })
  } catch (error) {
    console.error(error)
    response.status(500).json({ connected: false, message: 'Database connection failed' })
  }
})

app.post('/api/auth/register', async (request, response, next) => {
  try {
    const email = normalizeEmail(request.body?.email)
    const password = request.body?.password

    if (!isValidEmail(email)) {
      return response.status(400).json({ message: 'Введіть коректну електронну пошту.' })
    }
    if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return response.status(400).json({ message: 'Пароль має містити від 6 до 128 символів.' })
    }

    const id = randomUUID()
    const passwordHash = await hashPassword(password)
    await db.execute(
      'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
      [id, email, passwordHash],
    )

    const user = startSession(response, { id, email })
    response.status(201).json({ user })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({ message: 'Акаунт із такою електронною поштою вже існує.' })
    }
    next(error)
  }
})

app.post('/api/auth/login', async (request, response, next) => {
  try {
    const email = normalizeEmail(request.body?.email)
    const password = request.body?.password
    if (!isValidEmail(email) || typeof password !== 'string') {
      return response.status(400).json({ message: 'Перевірте електронну пошту та пароль.' })
    }

    const [rows] = await db.execute(
      'SELECT id, email, password_hash AS passwordHash FROM users WHERE email = ? LIMIT 1',
      [email],
    )
    const account = rows[0]

    if (!account || !(await verifyPassword(password, account.passwordHash))) {
      return response.status(401).json({ message: 'Неправильна електронна пошта або пароль.' })
    }

    const user = startSession(response, { id: account.id, email: account.email })
    response.json({ user })
  } catch (error) {
    next(error)
  }
})

app.get('/api/auth/me', (request, response) => {
  const user = getSessionUser(request)
  if (!user) return response.status(401).json({ message: 'Сесію не знайдено.' })
  response.json({ user })
})

app.post('/api/auth/logout', (request, response) => {
  const token = readCookie(request, sessionCookieName)
  if (token) sessions.delete(token)
  clearSessionCookie(response)
  response.status(204).end()
})

app.get('/api/transactions', requireUser, async (request, response, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, type, description, category_id AS categoryId,
              amount_minor_units AS amountMinorUnits, currency,
              occurred_at AS occurredAt, created_at AS createdAt
       FROM transactions WHERE user_id = ? ORDER BY occurred_at DESC, created_at DESC`,
      [request.user.id],
    )
    response.json(rows.map(publicTransaction))
  } catch (error) {
    next(error)
  }
})

app.post('/api/transactions', requireUser, async (request, response, next) => {
  try {
    const { type, description, categoryId, amountMinorUnits, currency, occurredAt } = request.body ?? {}
    const allowedCategories = {
      expense: ['food', 'transport', 'housing', 'health', 'shopping', 'leisure', 'other-expense'],
      income: ['salary', 'freelance', 'gift', 'other-income'],
    }

    if (!['income', 'expense'].includes(type)) {
      return response.status(400).json({ message: 'Невідомий тип операції.' })
    }
    if (typeof description !== 'string' || !description.trim() || description.trim().length > 80) {
      return response.status(400).json({ message: 'Опис має містити від 1 до 80 символів.' })
    }
    if (!allowedCategories[type].includes(categoryId)) {
      return response.status(400).json({ message: 'Оберіть категорію зі списку.' })
    }
    if (!Number.isSafeInteger(amountMinorUnits) || amountMinorUnits <= 0) {
      return response.status(400).json({ message: 'Сума має бути додатним числом.' })
    }
    if (currency !== 'UAH' || typeof occurredAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(occurredAt)) {
      return response.status(400).json({ message: 'Перевірте валюту та дату операції.' })
    }

    const id = randomUUID()
    await db.execute(
      `INSERT INTO transactions
         (id, user_id, type, description, category_id, amount_minor_units, currency, occurred_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, request.user.id, type, description.trim(), categoryId, amountMinorUnits, currency, occurredAt],
    )
    const [rows] = await db.execute(
      `SELECT id, type, description, category_id AS categoryId,
              amount_minor_units AS amountMinorUnits, currency,
              occurred_at AS occurredAt, created_at AS createdAt
       FROM transactions WHERE id = ? AND user_id = ?`,
      [id, request.user.id],
    )
    response.status(201).json(publicTransaction(rows[0]))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/transactions/:id', requireUser, async (request, response, next) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [request.params.id, request.user.id],
    )
    if (result.affectedRows === 0) {
      return response.status(404).json({ message: 'Операцію не знайдено.' })
    }
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ message: 'Сталася помилка сервера.' })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
