const { db, users, courses, enrollments } = require('../db')
const { eq, and, count } = require('drizzle-orm')
const { verifySession, verifyStudent, parseBody, sendJSON } = require('../helpers')

// Handles /api/user/* and /api/student/* routes
// Returns true if the route matched, false if no match
async function handle(req, res) {
  const { method, url } = req

  if (!url.startsWith('/api/user/') && !url.startsWith('/api/student/')) return false

  /* --------------------------------------------------------
   * GET CURRENT USER PROFILES
   * Any authenticated user (admin or student) can access this
   * -------------------------------------------------------- */

  if (method === 'GET' && url === '/api/user/profile') {
    const session = verifySession(req)
    if (!session) return sendJSON(res, 401, { error: 'Not authenticated' }), true

    try {
      const rows = await db.select().from(users).where(eq(users.id, session.userId))
      if (rows.length === 0) return sendJSON(res, 404, { error: 'User not found' }), true

      const user = rows[0]
      sendJSON(res, 200, {
        id: user.id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      })
    } catch (error) {
      console.error(error)
      sendJSON(res, 500, { error: 'Internal server error' })
    }
    return true
  }

  /* --------------------------------------------------------
   * STUDENT — GET MY COURSES
   * GET /api/student/courses
   * Returns all courses the student is currently enrolled in
   * -------------------------------------------------------- */

  if (method === 'GET' && url === '/api/student/courses') {
    const student = verifyStudent(req)
    if (!student) {
      sendJSON(res, 403, { error: 'Access denied' })
      return true
    }

    try {
      // Join enrollments with courses to get full course details
      const rows = await db
        .select({
          enrollmentId: enrollments.id,
          enrollmentDate: enrollments.enrollmentDate,
          status: enrollments.status,
          courseId: courses.id,
          title: courses.title,
          courseCode: courses.courseCode,
          credits: courses.credits,
          maxStudents: courses.maxStudents,
          startDate: courses.startDate,
          endDate: courses.endDate,
          isActive: courses.isActive,
        })
        .from(enrollments)
        .innerJoin(courses, eq(enrollments.courseId, courses.id))
        .where(
          and(
            eq(enrollments.studentId, student.userId),
            eq(enrollments.status, 'enrolled')
          )
        )

      sendJSON(res, 200, rows)
    } catch (error) {
      console.error(error)
      sendJSON(res, 500, { error: 'Internal server error' })
    }
    return true
  }

  /* --------------------------------------------------------
   * STUDENT — GET AVAILABLE COURSES
   * GET /api/student/courses/available
   * Returns all active courses with enrolledCount and isEnrolled flag
   * -------------------------------------------------------- */

  if (method === 'GET' && url === '/api/student/courses/available') {
    const student = verifyStudent(req)
    if (!student) {
      sendJSON(res, 403, { error: 'Access denied' })
      return true
    }

    try {
      // Fetch all active courses
      const allCourses = await db.select().from(courses).where(eq(courses.isActive, true))

      // Count how many students are currently enrolled in each course
      const enrollmentCounts = await db
        .select({ courseId: enrollments.courseId, enrolledCount: count() })
        .from(enrollments)
        .where(eq(enrollments.status, 'enrolled'))
        .groupBy(enrollments.courseId)

      const countMap = {}
      for (const row of enrollmentCounts) {
        countMap[row.courseId] = Number(row.enrolledCount)
      }

      // Fetch which courses this student is already enrolled in
      const myEnrollments = await db
        .select({ courseId: enrollments.courseId })
        .from(enrollments)
        .where(
          and(
            eq(enrollments.studentId, student.userId),
            eq(enrollments.status, 'enrolled')
          )
        )

      const enrolledIds = new Set(myEnrollments.map(e => e.courseId))

      // Add enrolledCount and isEnrolled to each course
      const result = allCourses.map(course => ({
        ...course,
        enrolledCount: countMap[course.id] ?? 0,
        isEnrolled: enrolledIds.has(course.id),
      }))

      sendJSON(res, 200, result)
    } catch (error) {
      console.error(error)
      sendJSON(res, 500, { error: 'Internal server error' })
    }
    return true
  }

  /* --------------------------------------------------------
   * STUDENT — ENROLL INTO COURSE
   * POST /api/student/enroll
   * Body: { courseId }
   * Checks the student is active, course is active, not already enrolled, and has capacity
   * -------------------------------------------------------- */

  if (method === 'POST' && url === '/api/student/enroll') {
    const student = verifyStudent(req)
    if (!student) {
      sendJSON(res, 403, { error: 'Access denied' })
      return true
    }

    const body = await parseBody(req)
    const courseId = Number(body.courseId)

    if (!Number.isInteger(courseId) || courseId < 1) {
      sendJSON(res, 400, { error: 'Invalid course ID' })
      return true
    }

    try {
      // Make sure the course exists and is active
      const courseRows = await db.select().from(courses).where(eq(courses.id, courseId))
      if (courseRows.length === 0) {
        sendJSON(res, 404, { error: 'Course not found' })
        return true
      }

      const course = courseRows[0]
      if (!course.isActive) {
        sendJSON(res, 400, { error: 'Course is not active' })
        return true
      }

      // Check if the student has any existing enrollment for this course
      const existing = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.studentId, student.userId),
            eq(enrollments.courseId, courseId)
          )
        )

      if (existing.length > 0) {
        const enrollment = existing[0]
        if (enrollment.status === 'enrolled') {
          sendJSON(res, 409, { error: 'Already enrolled in this course' })
          return true
        } else if (enrollment.status === 'dropped') {
          // Re-enroll by updating the status back to 'enrolled'
          await db
            .update(enrollments)
            .set({ status: 'enrolled' })
            .where(eq(enrollments.id, enrollment.id))
          sendJSON(res, 200, { message: 'Re-enrolled successfully' })
          return true
        } else {
          sendJSON(res, 400, { error: 'Cannot enroll in this course due to current status' })
          return true
        }
      }

      // Check if the course has space left
      const countResult = await db
        .select({ enrolled: count() })
        .from(enrollments)
        .where(
          and(
            eq(enrollments.courseId, courseId),
            eq(enrollments.status, 'enrolled')
          )
        )

      const currentEnrollments = Number(countResult[0].enrolled)
      if (currentEnrollments >= course.maxStudents) {
        sendJSON(res, 400, { error: 'Course is full' })
        return true
      }

      await db.insert(enrollments).values({
        studentId: student.userId,
        courseId,
      })

      sendJSON(res, 201, { message: 'Enrolled successfully' })
    } catch (error) {
      console.error(error)
      sendJSON(res, 500, { error: 'Internal server error' })
    }
    return true
  }

  /* --------------------------------------------------------
   * STUDENT — DROP COURSE
   * DELETE /api/student/enroll/:courseId
   * Sets the enrollment status to 'dropped' instead of deleting
   * -------------------------------------------------------- */

  if (method === 'DELETE' && url.startsWith('/api/student/enroll/')) {
    const student = verifyStudent(req)
    if (!student) {
      sendJSON(res, 403, { error: 'Access denied' })
      return true
    }

    const courseId = Number(url.split('/')[4])
    if (!Number.isInteger(courseId) || courseId < 1) {
      sendJSON(res, 400, { error: 'Invalid course ID' })
      return true
    }

    try {
      // Make sure they are actually enrolled before dropping
      const existing = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.studentId, student.userId),
            eq(enrollments.courseId, courseId),
            eq(enrollments.status, 'enrolled')
          )
        )

      if (existing.length === 0) {
        sendJSON(res, 404, { error: 'No active enrollment found for this course' })
        return true
      }

      await db
        .update(enrollments)
        .set({ status: 'dropped' })
        .where(
          and(
            eq(enrollments.studentId, student.userId),
            eq(enrollments.courseId, courseId)
          )
        )

      sendJSON(res, 200, { message: 'Course dropped successfully' })
    } catch (error) {
      console.error(error)
      sendJSON(res, 500, { error: 'Internal server error' })
    }
    return true
  }

  return false
}

module.exports = { handle }
