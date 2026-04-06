const fs = require('fs')
const crypto = require('crypto')

// Helper functions and middleware for cookie and session management, verifying role
// Active sessions: sessionId -> { userId, username, expiresAt }
const sessions = new Map()

// Clean up expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now()

  for (const [id, session] of sessions) {
    if (session.expiresAt < now) sessions.delete(id)
  }
}, 600_000)


// Creates a random 64-character hex string to use as a session ID
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex')
}

// Turns the raw Cookie: "sessionId=abc123def456; userPref=darkMode" 
// into JSON: { sessionId: "abc123def456", userPref: "darkMode" }
function parseCookies(req) {
  const cookies = {}
  const cookieHeader = req.headers.cookie

  if (!cookieHeader) return cookies

  for (const pair of cookieHeader.split(';')) {
    const [name, ...rest] = pair.trim().split('=')
    cookies[name] = rest.join('=')
  }

  return cookies
}

// Check against sessions Map if the session is valid. If valid, return session
function verifySession(req) {
  const cookies = parseCookies(req)
  const sessionId = cookies.sessionId

  if (!sessionId) return null

  const session = sessions.get(sessionId)
  if (!session) return null

  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId)
    return null
  }

  console.log(session) //check on server the session
  return session

}

// Returns the session if the request comes from an admin, otherwise returns null
function verifyAdmin(req) {
  const session = verifySession(req)
  if (!session) return null
  return session.role === 'admin' ? session : null
}

// Returns the session if the request comes from an active student, otherwise returns null
function verifyStudent(req) {
  const session = verifySession(req)
  if (!session) return null
  if (session.role !== 'student') return null
  if (!session.isActive) return null
  return session
}

// Reads the full request body and parses it as JSON
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''

    req.on('data', chunk => (raw += chunk))

    req.on('end', () => {
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve({})
      }
    })

    req.on('error', reject)
  })
}

// Sends a JSON response with a given status code
function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

// Reads a file from disk and sends it as an HTTP response
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

module.exports = {
  sessions,
  generateSessionId,
  parseCookies,
  verifySession,
  verifyAdmin,
  verifyStudent,
  parseBody,
  sendJSON,
  serveFile,
}
