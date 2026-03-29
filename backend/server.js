const http = require('http')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const { db, users } = require('./db')
const { eq } = require('drizzle-orm')
const crypto = require('crypto')

const PORT = process.env.PORT || 3000

// In-memory session store
const sessions = new Map()

function generateSessionId() {
  return crypto.randomBytes(32).toString('hex')
}

function verifySession(req) {
  const cookies = parseCookies(req)
  const sessionId = cookies.sessionId
  if (!sessionId) return null
  const session = sessions.get(sessionId)
  return session || null
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

// parse cookies
function parseCookies(req) {
  const cookies = {}
  const header = req.headers.cookie
  if (!header) return cookies
  header.split(';').forEach(pair => {
    const [key, ...val] = pair.trim().split('=')
    cookies[key] = val.join('=')
  })
  return cookies
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
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
}

// serve actual files

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

  // login route
  if (method === 'POST' && url === '/login') {
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
          sessions.set(sessionId, { userId: user.id, username: user.username })
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
    return (async () => {
      try {
        const body = await parseBody(req)
        const { username, password } = body
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
    res.end(JSON.stringify({ message: 'Logged out' }))
  }

  else {
    res.writeHead(404);
    res.end('Not found');
  }
}) 

//starting server
server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});