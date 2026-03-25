const { mysqlTable, serial, varchar, timestamp } = require('drizzle-orm/mysql-core');

const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { users };