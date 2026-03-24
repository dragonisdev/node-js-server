const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 3000
const JWT_SECRET = process.env.JWT_SECRET


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

const server = http.createServer((req, res) => {
    const { method, url } = req
    const publicDir = path.join(__dirname, '../client')

    // static files
    if (method === 'GET' && url === '/') {
        return serveFile(res, path.join(publicDir, 'index.html'), 'text/html')
    }

     if (method === 'GET' && url === '/style.css') {
    return serveFile(res, path.join(publicDir, 'style.css'), 'text/css')
    }

    if (method === 'GET' && url === '/script.js') {
    return serveFile(res, path.join(publicDir, 'script.js'), 'application/javascript')
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