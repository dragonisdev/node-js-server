const http = require('http')
const path = require('path')
const fs = require('fs')
const { serveFile, verifySession, verifyAdmin } = require('./helpers')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const studentRoutes = require('./routes/student')

const PORT = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../client')

// file types we serve from client
const mimeTypes = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.html': 'text/html',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  /* --------------------------------------------------------
   * STATIC FILES
   * Serve HTML pages and client-side assets
   * -------------------------------------------------------- */

  if (method === 'GET' && (url === '/' || url === '/login')) {
    return serveFile(res, path.join(publicDir, 'login.html'), 'text/html')
  }

  if (method === 'GET' && url === '/register') {
    return serveFile(res, path.join(publicDir, 'register.html'), 'text/html')
  }

  if (method === 'GET' && url === '/admin-dashboard') {
    const admin = verifyAdmin(req)
    if (!admin) {
      res.writeHead(302, { Location: '/' })
      return res.end()
    }
    return serveFile(res, path.join(publicDir, 'admin-dashboard.html'), 'text/html')
  }

  if (method === 'GET' && url === '/student-dashboard') {
    const session = verifySession(req)
    if (!session) {
      res.writeHead(302, { Location: '/' })
      return res.end()
    }
    return serveFile(res, path.join(publicDir, 'student-dashboard.html'), 'text/html')
  }

  if (method === 'GET' && url.split('?')[0] === '/course-management') {
    return serveFile(res, path.join(publicDir, 'course-management.html'), 'text/html')
  }

  // General static file handler
  if (method === 'GET') {
    const filePath = path.join(publicDir, url)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase()
      // if user requests weird file mimetype, thats not defined within the file types above,
      // we just let them download it instead
      return serveFile(res, filePath, mimeTypes[ext] || 'application/octet-stream')
    }
  }

  /* --------------------------------------------------------
   * API ROUTES
   * Each handler returns true if it matched the request
   * -------------------------------------------------------- */

  if (await authRoutes.handle(req, res)) return
  if (await adminRoutes.handle(req, res)) return
  if (await studentRoutes.handle(req, res)) return

  res.writeHead(404)
  res.end('Not found')
})

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

module.exports = { server }
