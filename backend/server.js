const http = require('http')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const { db, users, courses } = require('./db')
const { eq } = require('drizzle-orm')
const crypto = require('crypto')

const PORT = process.env.PORT || 3000

/* HELPER FUNCTIONS BELOW
___________________________________________*/
// Store active sessions as a map
const sessions = new Map()

// Simple rate limiter: max 10 requests per minute per IP
const rateLimitStore = new Map()

// Purge expired sessions and stale rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [id, session] of sessions) {
    if (session.expiresAt < now) sessions.delete(id)
  }
  for (const [ip, entry] of rateLimitStore) {
    if (now > entry.resetTime) rateLimitStore.delete(ip)
  }
}, 600_000).unref()
function rateLimit(req) {
  const ip = req.socket.remoteAddress
  const now = Date.now()
  const entry = rateLimitStore.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60_000 })
    return false
  }
  entry.count++
  return entry.count > 10
}

// generate cookie
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex')
}
// Cookies are generated in server, and sent to the browser. Subsequent requests parse the incoming cookies

// parse cookies
function parseCookies(req) {
  // Create an empty object to store the parsed cookies
  const cookies = {}
  
  // Get the 'cookie' header from the HTTP request
  const header = req.headers.cookie
  
  // If there's no cookie header, return the empty object
  if (!header) return cookies
  
  header.split(';').forEach(pair => {
    // Trim whitespace and split each pair by '=' to separate key and value
    // Use destructuring: key is the first part, val is the rest (in case value contains '=')
    const [key, ...val] = pair.trim().split('=')
    
    // Store the cookie in the cookies object, joining val back in case it had '='
    cookies[key] = val.join('=')
  })
  
  // Return the object containing all parsed cookies
  return cookies
}

// We parse the cookies
function verifySession(req) {
  //First we parse cookies
  const cookies = parseCookies(req)
  const sessionId = cookies.sessionId
  if (!sessionId) return null
  const session = sessions.get(sessionId)
  if (!session) return null
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId)
    return null
  }
  return session
}

// We check if user is admin with this function
async function verifyAdmin(req) {
  //First we verify session
  const session = verifySession(req)
  if (!session) return null
  
  try {
    const result = await db.select().from(users).where(eq(users.id, session.userId))
    if (result.length === 0) return null
    const user = result[0]
    return user.role === 'admin' ? user : null
  } catch (error) {
    console.error('Error verifying admin:', error)
    return null
  }
}

// parse JSON request body from HTTP POST requests
function parseBody(req) {
  // return a promise
  return new Promise((resolve, reject) => {
    let body = '' // empty string to hold all the incoming data
    
    // HTTP requests come in chunks. This event fires for each chunk of data.
    // We add each chunk to our body string to build the complete request data.
    req.on('data', chunk => (body += chunk))
    
    // This event fires when ALL data has been received (the stream is finished)
    req.on('end', () => {
      try {
        // Try to convert the collected string into a JavaScript object
        const parsedData = JSON.parse(body)
        resolve(parsedData) // Success! Return the parsed object
      } catch {
        // If JSON.parse fails (bad JSON format), return empty object instead of crashing
        resolve({})
      }
    })
    
    // If there's a network error while receiving data, reject the Promise
    req.on('error', reject)
  })
}



function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

// serve files
function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      return res.end('Not found')
    }
  
    const headers = { 'Content-Type': contentType }
    if (contentType === 'text/html') {
      headers['Content-Security-Policy'] =
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; " +
        "font-src https://fonts.gstatic.com; " +
        "img-src 'self'; " +
        "connect-src 'self'"
    }
    res.writeHead(200, headers)
    res.end(data)
  })
}

/* server to serve actual files
___________________________________________*/

const server = http.createServer((req, res) => {
  const { method, url } = req
  const publicDir = path.join(__dirname, '../client')

  // static files

  //get login, everyone lands on login
  if (method === 'GET' && (url === '/' || url === '/login')) {
    return serveFile(res, path.join(publicDir, 'login.html'), 'text/html')
  }

  if (method === 'GET' && url === '/style.css') {
    return serveFile(res, path.join(publicDir, 'style.css'), 'text/css')
  }

  if (method === 'GET' && url === '/script.js') {
    return serveFile(res, path.join(publicDir, 'script.js'), 'application/javascript')
  }

  // serve register page
  if (method === 'GET' && url === '/register') {
    return serveFile(res, path.join(publicDir, 'register.html'), 'text/html')
  }

  // serve admin dashboard page - admin only
  if (method === 'GET' && url === '/admin-dashboard') {
    return (async () => {
      const admin = await verifyAdmin(req)
      if (!admin) {
        res.writeHead(302, { 'Location': '/' })
        return res.end()
      }
      return serveFile(res, path.join(publicDir, 'admin-dashboard.html'), 'text/html')
    })()
  }

  // serve student dashboard page - authenticated users only
  if (method === 'GET' && url === '/student-dashboard') {
    const session = verifySession(req)
    if (!session) {
      res.writeHead(302, { 'Location': '/' })
      return res.end()
    }
    return serveFile(res, path.join(publicDir, 'student-dashboard.html'), 'text/html')
  }

  // serve course management page but we must also be load a course by getting "course-management?id=1"
  if (method === 'GET' && url.split('?')[0] === '/course-management') {
    return serveFile(res, path.join(publicDir, 'course-management.html'), 'text/html')
  }

  // serve admin.js
  if (method === 'GET' && url === '/admin.js') {
    return serveFile(res, path.join(publicDir, 'admin.js'), 'application/javascript')
  }

  // serve course-management.js
  if (method === 'GET' && url === '/course-management.js') {
    return serveFile(res, path.join(publicDir, 'course-management.js'), 'application/javascript')
  }

  // login route
  if (method === 'POST' && url === '/login') {
    if (rateLimit(req)) return sendJSON(res, 429, { error: 'Too many requests, please try again later' })
    return (async () => {
      try {
        const body = await parseBody(req)
        const { username, password } = body
        try {
          const result = await db.select().from(users).where(eq(users.username, username))
          if (result.length === 0) {
            res.writeHead(401, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ error: 'Invalid credentials' }))
          }
          const user = result[0]
          const isValid = await bcrypt.compare(password, user.passwordHash)
          if (!isValid) {
            res.writeHead(401, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ error: 'Invalid credentials' }))
          }
          const sessionId = generateSessionId()
          sessions.set(sessionId, { userId: user.id, username: user.username, expiresAt: Date.now() + 3_600_000 })
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `sessionId=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600`
          })
          res.end(JSON.stringify({ message: 'Logged in' }))
        } catch (error) {
          console.error(error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      } catch (error) {
        console.error(error)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })()
  }

  // register route
  if (method === 'POST' && url === '/register') {
    if (rateLimit(req)) return sendJSON(res, 429, { error: 'Too many requests, please try again later' })
    return (async () => {
      try {
        const body = await parseBody(req)
        const { username, password } = body
        if (!username || !password) return sendJSON(res, 400, { error: 'Username and password are required' })
        if (!/^[a-zA-Z0-9_]{1,50}$/.test(username)) return sendJSON(res, 400, { error: 'Username must be 1–50 alphanumeric characters or underscores' })
        if (password.length < 8 || password.length > 128) return sendJSON(res, 400, { error: 'Password must be 8–128 characters' })
        try {
          const hashedPassword = await bcrypt.hash(password, 10)
          await db.insert(users).values({
            username,
            passwordHash: hashedPassword,
          })
          res.writeHead(201, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'User registered' }))
        } catch (error) {
          console.error(error)
          if (error.cause?.code === 'ER_DUP_ENTRY') {
            res.writeHead(409, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Username already exists' }))
          } else {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        }
      } catch (error) {
        console.error(error)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })()
  }

  // protected dashboard
  if (method === 'GET' && url === '/dashboard') {
    const session = verifySession(req)
    if (!session) {
      res.writeHead(302, { 'Location': '/' })
      return res.end()
    }
    return serveFile(res, path.join(publicDir, 'dashboard.html'), 'text/html')
  }

  // logout route
  if (method === 'POST' && url === '/logout') {
    const cookies = parseCookies(req)
    const sessionId = cookies.sessionId
    if (sessionId) {
      sessions.delete(sessionId)
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'sessionId=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'
    })
    return res.end(JSON.stringify({ message: 'Logged out' }))
  }

  // GET /api/admin/courses - list all courses
  if (method === 'GET' && url === '/api/admin/courses') {
    return (async () => {
      const admin = await verifyAdmin(req)
      if (!admin) return sendJSON(res, 401, { error: 'Unauthorized' })
      try {
        const result = await db.select().from(courses)
        sendJSON(res, 200, result)
      } catch (error) {
        console.error(error)
        sendJSON(res, 500, { error: 'Internal server error' })
      }
    })()
  }

  // POST /api/admin/courses - create a course
  if (method === 'POST' && url === '/api/admin/courses') {
    return (async () => {
      const admin = await verifyAdmin(req)
      if (!admin) return sendJSON(res, 401, { error: 'Unauthorized' })
      try {
        const body = await parseBody(req)
        const { title, courseCode, credits, maxStudents, startDate, endDate } = body
        if (!title || typeof title !== 'string' || title.trim().length === 0 || title.length > 255) return sendJSON(res, 400, { error: 'Invalid title' })
        if (!courseCode || typeof courseCode !== 'string' || courseCode.trim().length === 0 || courseCode.length > 20) return sendJSON(res, 400, { error: 'Invalid course code' })
        const creditsNum = Number(credits)
        const maxStudentsNum = Number(maxStudents)
        if (!Number.isInteger(creditsNum) || creditsNum < 1 || creditsNum > 20) return sendJSON(res, 400, { error: 'Credits must be an integer between 1 and 20' })
        if (!Number.isInteger(maxStudentsNum) || maxStudentsNum < 1 || maxStudentsNum > 1000) return sendJSON(res, 400, { error: 'Max students must be an integer between 1 and 1000' })
        await db.insert(courses).values({
          title,
          courseCode,
          credits: Number(credits),
          maxStudents: Number(maxStudents),
          startDate: startDate || null,
          endDate: endDate || null,
        })
        sendJSON(res, 201, { message: 'Course created' })
      } catch (error) {
        console.error(error)
        if (error.cause?.code === 'ER_DUP_ENTRY') {
          sendJSON(res, 409, { error: 'Course code already exists' })
        } else {
          sendJSON(res, 500, { error: 'Internal server error' })
        }
      }
    })()
  }

  // GET /PUT /DELETE /api/admin/courses/:id
  if (url.startsWith('/api/admin/courses/')) {
    const id = parseInt(url.split('/')[4])
    if (isNaN(id)) return sendJSON(res, 400, { error: 'Invalid id' })

    if (method === 'GET') {
      return (async () => {
        const admin = await verifyAdmin(req)
        if (!admin) return sendJSON(res, 401, { error: 'Unauthorized' })
        try {
          const result = await db.select().from(courses).where(eq(courses.id, id))
          if (result.length === 0) return sendJSON(res, 404, { error: 'Course not found' })
          sendJSON(res, 200, result[0])
        } catch (error) {
          console.error(error)
          sendJSON(res, 500, { error: 'Internal server error' })
        }
      })()
    }

    if (method === 'PUT') {
      return (async () => {
        const admin = await verifyAdmin(req)
        if (!admin) return sendJSON(res, 401, { error: 'Unauthorized' })
        try {
          const body = await parseBody(req)
          const { title, courseCode, credits, maxStudents, startDate, endDate, isActive } = body        if (!title || typeof title !== 'string' || title.trim().length === 0 || title.length > 255) return sendJSON(res, 400, { error: 'Invalid title' })
        if (!courseCode || typeof courseCode !== 'string' || courseCode.trim().length === 0 || courseCode.length > 20) return sendJSON(res, 400, { error: 'Invalid course code' })
        const creditsNum = Number(credits)
        const maxStudentsNum = Number(maxStudents)
        if (!Number.isInteger(creditsNum) || creditsNum < 1 || creditsNum > 20) return sendJSON(res, 400, { error: 'Credits must be an integer between 1 and 20' })
        if (!Number.isInteger(maxStudentsNum) || maxStudentsNum < 1 || maxStudentsNum > 1000) return sendJSON(res, 400, { error: 'Max students must be an integer between 1 and 1000' })          await db.update(courses).set({
            title,
            courseCode,
            credits: Number(credits),
            maxStudents: Number(maxStudents),
            startDate: startDate || null,
            endDate: endDate || null,
            isActive: Boolean(isActive),
          }).where(eq(courses.id, id))
          sendJSON(res, 200, { message: 'Course updated' })
        } catch (error) {
          console.error(error)
          sendJSON(res, 500, { error: 'Internal server error' })
        }
      })()
    }

    if (method === 'DELETE') {
      return (async () => {
        const admin = await verifyAdmin(req)
        if (!admin) return sendJSON(res, 401, { error: 'Unauthorized' })
        try {
          await db.delete(courses).where(eq(courses.id, id))
          sendJSON(res, 200, { message: 'Course deleted' })
        } catch (error) {
          console.error(error)
          sendJSON(res, 500, { error: 'Internal server error' })
        }
      })()
    }
  }

  // GET /api/admin/students - list students
  if (method === 'GET' && url === '/api/admin/students') {
    return (async () => {
      const admin = await verifyAdmin(req)
      if (!admin) return sendJSON(res, 401, { error: 'Unauthorized' })
      try {
        const result = await db.select({
          id: users.id,
          username: users.username,
          isActive: users.isActive,
          createdAt: users.createdAt,
        }).from(users).where(eq(users.role, 'student'))
        sendJSON(res, 200, result)
      } catch (error) {
        console.error(error)
        sendJSON(res, 500, { error: 'Internal server error' })
      }
    })()
  }

  // GET /api/user/profile - Get current user profile
  if (method === 'GET' && url === '/api/user/profile') {
    return (async () => {
      try {
        const session = verifySession(req)
        if (!session) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'Not authenticated' }))
        }

        try {
          const result = await db.select().from(users).where(eq(users.id, session.userId))
          if (result.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ error: 'User not found' }))
          }

          const user = result[0]
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
            isActive: user.isActive
          }))
        } catch (error) {
          console.error(error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      } catch (error) {
        console.error(error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Internal server error' }))
      }
    })()
  }

  else {
    res.writeHead(404);
    res.end('Not found');
  }
})

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
  })
}

module.exports = { server }