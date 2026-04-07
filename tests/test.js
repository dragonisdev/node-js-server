const assert = require('node:assert')
const test = require('node:test')

test('GET / returns 200 and login HTML', async () => {
  const { server } = require('../backend/server.js')

  // Start the server on a random available port
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, resolve)
  })
  const { port } = server.address()

  try {
    const res = await fetch(`http://127.0.0.1:${port}/`)
    const body = await res.text()

    assert.strictEqual(res.status, 200)
    assert.ok(
      res.headers.get('content-type')?.includes('text/html'),
      `expected text/html content-type, got ${res.headers.get('content-type')}`
    )
    assert.match(body, /<title>Login<\/title>/)
    assert.match(body, /id="loginForm"/)
  } finally {
    // Always close the server after the test, even if assertions fail
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()))
    })
  }
})
