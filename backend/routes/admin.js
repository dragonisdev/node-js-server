const { db, users, courses, enrollments } = require('../db')
const { eq, count } = require('drizzle-orm')
const { verifyAdmin, parseBody, sendJSON } = require('../helpers')

// Handles all /api/admin/* routes
// Returns true if the route matched, false if no match
async function handle(req, res) {
  const { method, url } = req

  if (!url.startsWith('/api/admin/')) return false

  /* --------------------------------------------------------
   * COURSES CRUD
   * -------------------------------------------------------- */

  if (method === 'GET' && url === '/api/admin/courses') {
    const admin = verifyAdmin(req)
    if (!admin) {
      sendJSON(res, 401, { error: 'Unauthorized' })
      return true
    }

    try {
      const allCourses = await db.select().from(courses)

      // Count active enrollments per course in one query
      const enrollmentCounts = await db
        .select({ courseId: enrollments.courseId, enrolledCount: count() })
        .from(enrollments)
        .where(eq(enrollments.status, 'enrolled'))
        .groupBy(enrollments.courseId)

      const countMap = {}
      for (const row of enrollmentCounts) {
        countMap[row.courseId] = Number(row.enrolledCount)
      }

      const result = allCourses.map(course => ({
        ...course,
        enrolledCount: countMap[course.id] ?? 0,
      }))

      sendJSON(res, 200, result)
    } catch (error) {
      console.error(error)
      sendJSON(res, 500, { error: 'Internal server error' })
    }
    return true
  }

  if (method === 'POST' && url === '/api/admin/courses') {
    const admin = verifyAdmin(req)
    if (!admin) {
      sendJSON(res, 401, { error: 'Unauthorized' })
      return true
    }

    const body = await parseBody(req)
    const { title, courseCode, credits, maxStudents, startDate, endDate } = body

    if (!title || title.trim().length === 0) {
      sendJSON(res, 400, { error: 'Title is required' })
      return true
    }
    if (!courseCode || courseCode.trim().length === 0) {
      sendJSON(res, 400, { error: 'Course code is required' })
      return true
    }

    const creditsNum = Number(credits)
    const maxStudentsNum = Number(maxStudents)

    if (isNaN(creditsNum) || creditsNum < 1) {
      sendJSON(res, 400, { error: 'Credits must be at least 1' })
      return true
    }
    if (isNaN(maxStudentsNum) || maxStudentsNum < 1) {
      sendJSON(res, 400, { error: 'Max students must be at least 1' })
      return true
    }

    try {
      await db.insert(courses).values({
        title,
        courseCode,
        credits: creditsNum,
        maxStudents: maxStudentsNum,
        startDate: startDate || null,
        endDate: endDate || null,
      })
      sendJSON(res, 201, { message: 'Course created' })
    } catch (error) {
      console.error(error)
      if (error.cause?.code === 'ER_DUP_ENTRY') {
        sendJSON(res, 409, { error: 'Course code already exists' })
      } else {
        sendJSON(res, 500, { error: 'Internal server error' })
      }
    }
    return true
  }

  if (url.startsWith('/api/admin/courses/')) {
    const id = parseInt(url.split('/')[4])
    if (isNaN(id)) {
      sendJSON(res, 400, { error: 'Invalid id' })
      return true
    }

    if (method === 'GET') {
      const admin = verifyAdmin(req)
      if (!admin) {
        sendJSON(res, 401, { error: 'Unauthorized' })
        return true
      }

      try {
        const rows = await db.select().from(courses).where(eq(courses.id, id))
        if (rows.length === 0) {
          sendJSON(res, 404, { error: 'Course not found' })
          return true
        }
        sendJSON(res, 200, rows[0])
      } catch (error) {
        console.error(error)
        sendJSON(res, 500, { error: 'Internal server error' })
      }
      return true
    }

    if (method === 'PUT') {
      const admin = verifyAdmin(req)
      if (!admin) {
        sendJSON(res, 401, { error: 'Unauthorized' })
        return true
      }

      const body = await parseBody(req)
      const { title, courseCode, credits, maxStudents, startDate, endDate, isActive } = body

      if (!title || title.trim().length === 0) {
        sendJSON(res, 400, { error: 'Title is required' })
        return true
      }
      if (!courseCode || courseCode.trim().length === 0) {
        sendJSON(res, 400, { error: 'Course code is required' })
        return true
      }

      const creditsNum = Number(credits)
      const maxStudentsNum = Number(maxStudents)

      if (isNaN(creditsNum) || creditsNum < 1) {
        sendJSON(res, 400, { error: 'Credits must be at least 1' })
        return true
      }
      if (isNaN(maxStudentsNum) || maxStudentsNum < 1) {
        sendJSON(res, 400, { error: 'Max students must be at least 1' })
        return true
      }

      try {
        await db.update(courses).set({
          title,
          courseCode,
          credits: creditsNum,
          maxStudents: maxStudentsNum,
          startDate: startDate || null,
          endDate: endDate || null,
          isActive: Boolean(isActive),
        }).where(eq(courses.id, id))
        sendJSON(res, 200, { message: 'Course updated' })
      } catch (error) {
        console.error(error)
        sendJSON(res, 500, { error: 'Internal server error' })
      }
      return true
    }

    if (method === 'DELETE') {
      const admin = verifyAdmin(req)
      if (!admin) {
        sendJSON(res, 401, { error: 'Unauthorized' })
        return true
      }

      try {
        await db.delete(courses).where(eq(courses.id, id))
        sendJSON(res, 200, { message: 'Course deleted' })
      } catch (error) {
        console.error(error)
        sendJSON(res, 500, { error: 'Internal server error' })
      }
      return true
    }
  }

  /* --------------------------------------------------------
   * STUDENTS
   * -------------------------------------------------------- */

  if (method === 'GET' && url === '/api/admin/students') {
    const admin = verifyAdmin(req)
    if (!admin) {
      sendJSON(res, 401, { error: 'Unauthorized' })
      return true
    }

    try {
      const rows = await db.select({
        id: users.id,
        username: users.username,
        isActive: users.isActive,
        createdAt: users.createdAt,
      }).from(users).where(eq(users.role, 'student'))

      sendJSON(res, 200, rows)
    } catch (error) {
      console.error(error)
      sendJSON(res, 500, { error: 'Internal server error' })
    }
    return true
  }

  return false
}

module.exports = { handle }
