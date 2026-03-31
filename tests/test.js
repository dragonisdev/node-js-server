const http = require('http')
const assert = require('node:assert')
const test = require('node:test')

test('GET / returns 200 and login HTML', async () => {
  const { server } = require('../backend/server.js')
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, resolve)
  })
  const { port } = server.address()

  try {
    const { statusCode, headers, body } = await new Promise((resolve, reject) => {
      http
        .get(`http://127.0.0.1:${port}/`, (res) => {
          const chunks = []
          res.on('data', (c) => chunks.push(c))
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: Buffer.concat(chunks).toString('utf8'),
            })
          })
        })
        .on('error', reject)
    })

    assert.strictEqual(statusCode, 200)
    assert.ok(
      String(headers['content-type'] || '').includes('text/html'),
      `expected text/html content-type, got ${headers['content-type']}`
    )
    assert.match(body, /<title>Login<\/title>/)
    assert.match(body, /id="loginForm"/)
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()))
    })
  }
})
