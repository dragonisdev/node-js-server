const http = require('http')
const path = require('path')
const { serveFile, verifySession, verifyAdmin } = require('./helpers')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const studentRoutes = require('./routes/student')

const PORT = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../client')

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

  if (method === 'GET' && url === '/style.css') {
    return serveFile(res, path.join(publicDir, 'style.css'), 'text/css')
  }

  if (method === 'GET' && url === '/authentication.js') {
    return serveFile(res, path.join(publicDir, 'authentication.js'), 'application/javascript')
  }

  if (method === 'GET' && url === '/admin-dashboard.js') {
    return serveFile(res, path.join(publicDir, 'admin-dashboard.js'), 'application/javascript')
  }

  if (method === 'GET' && url === '/course-management.js') {
    return serveFile(res, path.join(publicDir, 'course-management.js'), 'application/javascript')
  }

  if (method === 'GET' && url === '/student-dashboard.js') {
    return serveFile(res, path.join(publicDir, 'student-dashboard.js'), 'application/javascript')
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
