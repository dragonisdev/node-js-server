require('dotenv').config()
const mysql = require('mysql2/promise')
const fs = require('fs')

async function runMigration() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL)
    
    // Read and execute schema
    const schema = fs.readFileSync('./schema.sql', 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'))
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement)
        console.log('✅ Executed:', statement.substring(0, 50) + '...')
      }
    }
    
    await connection.end()
    console.log('🎉 Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
