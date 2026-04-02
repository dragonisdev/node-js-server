const { mysqlTable, serial, varchar, timestamp, int, boolean, date, mysqlEnum } = require('drizzle-orm/mysql-core');

// Drizzle ORM imports for interacting with database without making direct SQL queries
const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin', 'instructor', 'student']).default('student').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

const courses = mysqlTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  courseCode: varchar('course_code', { length: 20 }).unique().notNull(),
  credits: int('credits').default(5),
  maxStudents: int('max_students').default(30),
  startDate: date('start_date'),
  endDate: date('end_date'),
  instructorId: int('instructor_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

const enrollments = mysqlTable('enrollments', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  courseId: int('course_id').notNull(),
  enrollmentDate: timestamp('enrollment_date').defaultNow(),
  status: mysqlEnum('status', ['enrolled', 'dropped', 'completed']).default('enrolled'),
  grade: varchar('grade', { length: 5 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});


module.exports = { users, courses, enrollments };