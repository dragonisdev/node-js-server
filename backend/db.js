require('dotenv').config()
const mysql = require('mysql2/promise')
const { drizzle } = require('drizzle-orm/mysql2')
const { users } = require('./schema')

// Use the full connection URL from Railway
const pool = mysql.createPool(process.env.DATABASE_URL)

const db = drizzle(pool)

module.exports = { db, users }
