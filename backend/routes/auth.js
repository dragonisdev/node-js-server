const bcrypt = require('bcrypt')
const { db, users } = require('../db')
const { eq } = require('drizzle-orm')
const {
  sessions,
  generateSessionId,
  parseCookies,
  parseBody,
  sendJSON,
} = require('../helpers')


// Simple rate limiter (in-memory)
// Tracks how many requests each IP has made within a time window.
const RATE_LIMIT = {
  maxAttempts: 10,       // max requests allowed per window
  windowMs: 60 * 1000,
}

// { [ip]: { count: number, resetAt: number } }
const rateLimitStore = {}

function isRateLimited(ip) {
  const now = Date.now()
  const record = rateLimitStore[ip]

  // First request from this IP, or the window has expired — start fresh
  if (!record || now > record.resetAt) {
    rateLimitStore[ip] = { count: 1, resetAt: now + RATE_LIMIT.windowMs }
    return false
  }

  record.count++
  return record.count > RATE_LIMIT.maxAttempts
}


// Handles all auth-related routes: login, register, logout
// Returns true if the route matched, false if no match (so server.js can try the next handler)
async function handle(req, res) {
  const { method, url } = req
  const ip = req.socket.remoteAddress

  if (method === 'POST' && (url === '/login' || url === '/register')) {
    if (isRateLimited(ip)) {
      sendJSON(res, 429, { error: 'Too many requests. Please wait a minute and try again.' })
      return true
    }
  }

  if (method === 'POST' && url === '/login') {
    const body = await parseBody(req)
    const { username, password } = body

    try {
      const rows = await db.select().from(users).where(eq(users.username, username))

      if (rows.length === 0) {
        sendJSON(res, 401, { error: 'Invalid credentials' })
        return true
      }

      const user = rows[0]
      const passwordMatches = await bcrypt.compare(password, user.passwordHash)

      if (!passwordMatches) {
        sendJSON(res, 401, { error: 'Invalid credentials' })
        return true
      }

      const sessionId = generateSessionId()
      
      sessions.set(sessionId, {
        userId: user.id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        expiresAt: Date.now() + 3_600_000,
        
      })

      const isProduction = process.env.NODE_ENV === 'production'

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `sessionId=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600${isProduction ? '; Secure' : ''}`,
      })
      res.end(JSON.stringify({ message: 'Logged in' }))
      return true
    } catch (error) {
      console.error(error)
      sendJSON(res, 500, { error: 'Internal server error' })
      return true
    }
  }

  if (method === 'POST' && url === '/register') {
    const body = await parseBody(req)
    const { username, password } = body

    if (!username || !password) {
      sendJSON(res, 400, { error: 'Username and password are required' })
      return true
    }
    if (!/^[a-zA-Z0-9_]{1,50}$/.test(username)) {
      sendJSON(res, 400, { error: 'Username must be 1–50 alphanumeric characters or underscores' })
      return true
    }
    if (password.length < 8 || password.length > 128) {
      sendJSON(res, 400, { error: 'Password must be 8–128 characters' })
      return true
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      await db.insert(users).values({ username, passwordHash: hashedPassword })
      sendJSON(res, 201, { message: 'User registered' })
      return true
    } catch (error) {
      console.error(error)
      if (error.cause?.code === 'ER_DUP_ENTRY') {
        sendJSON(res, 409, { error: 'Username already exists' })
      } else {
        sendJSON(res, 500, { error: 'Internal server error' })
      }
      return true
    }
  }

  if (method === 'POST' && url === '/logout') {
    const cookies = parseCookies(req)
    const sessionId = cookies.sessionId

    if (sessionId) sessions.delete(sessionId)

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'sessionId=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0',
    })
    res.end(JSON.stringify({ message: 'Logged out' }))
    return true
  }

  return false
}

module.exports = { handle }
