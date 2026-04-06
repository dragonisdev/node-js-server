require('dotenv').config()
const mysql = require('mysql2/promise')
const { drizzle } = require('drizzle-orm/mysql2')
const { users, courses, enrollments } = require('./schema')

// Use the full connection URL from Railway
const pool = mysql.createPool(process.env.DATABASE_URL)

// Connect to db via drizzle
const db = drizzle(pool)

module.exports = { db, users, courses, enrollments }
