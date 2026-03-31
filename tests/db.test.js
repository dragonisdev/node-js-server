const assert = require('node:assert')
const test = require('node:test')
const mysql = require('mysql2/promise')

test('database connection (DATABASE_URL)', { skip: !process.env.DATABASE_URL }, async () => {
  const conn = await mysql.createConnection(process.env.DATABASE_URL)
  try {
    const [rows] = await conn.query('SELECT 1 AS ok')
    assert.strictEqual(rows[0].ok, 1)
  } finally {
    await conn.end()
  }
})
