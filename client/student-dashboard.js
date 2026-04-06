// Escapes special HTML characters to prevent XSS when inserting user data into the DOM
function escapeHTML(str) {
  const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(str).replace(/[&<>"']/g, char => escapeMap[char])
}

window.onload = async function () {
  await loadProfile()
  await loadMyCourses()
  await loadAvailableCourses()

  document.getElementById('logoutBtn').onclick = async function () {
    await fetch('/logout', { method: 'POST' })
    window.location.href = '/login'
  }
}

// Fetches the student's profile and shows their username in the header
async function loadProfile() {
  const response = await fetch('/api/user/profile')

  if (response.status === 401) {
    window.location.href = '/login'
    return
  }

  const user = await response.json()
  document.getElementById('studentUsername').textContent = user.username
}

// Fetches and displays the courses the student is currently enrolled in
async function loadMyCourses() {
  const response = await fetch('/api/student/courses')

  if (response.status === 401) {
    window.location.href = '/login'
    return
  }

  const courses = await response.json()
  const tbody = document.getElementById('myCoursesTableBody')
  tbody.innerHTML = ''

  if (courses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="table-loading">You are not enrolled in any courses yet.</td></tr>'
    return
  }

  for (const course of courses) {
    const startDate = course.startDate ? course.startDate.slice(0, 10) : '—'
    const endDate = course.endDate ? course.endDate.slice(0, 10) : '—'
    const statusClass = course.isActive ? 'badge-active' : 'badge-inactive'
    const statusLabel = course.isActive ? 'Active' : 'Inactive'

    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${escapeHTML(course.courseCode)}</td>
      <td>${escapeHTML(course.title)}</td>
      <td>${course.credits}</td>
      <td>${startDate}</td>
      <td>${endDate}</td>
      <td><span class="badge ${statusClass}">${statusLabel}</span></td>
      <td class="action-cell">
        <button type="button" class="btn-icon btn-delete" title="Drop course">
          <span class="material-icons">remove_circle_outline</span>
        </button>
      </td>
    `
    row.querySelector('.btn-delete').addEventListener('click', () => dropCourse(course.courseId))
    tbody.appendChild(row)
  }
}

// Fetches and displays all active courses with an Enroll or Enrolled button
async function loadAvailableCourses() {
  const response = await fetch('/api/student/courses/available')

  if (response.status === 401) {
    window.location.href = '/login'
    return
  }

  const courses = await response.json()
  const tbody = document.getElementById('availableCoursesTableBody')
  tbody.innerHTML = ''

  if (courses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="table-loading">No courses available.</td></tr>'
    return
  }

  for (const course of courses) {
    const startDate = course.startDate ? course.startDate.slice(0, 10) : '—'
    const endDate = course.endDate ? course.endDate.slice(0, 10) : '—'
    const spotsLabel = `${course.enrolledCount} / ${course.maxStudents}`

    const actionButton = course.isEnrolled
      ? `<span class="badge badge-active">Enrolled</span>`
      : `<button type="button" class="btn-primary">
           <span class="material-icons">add</span> Enroll
         </button>`

    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${escapeHTML(course.courseCode)}</td>
      <td>${escapeHTML(course.title)}</td>
      <td>${course.credits}</td>
      <td>${spotsLabel}</td>
      <td>${startDate}</td>
      <td>${endDate}</td>
      <td class="action-cell">${actionButton}</td>
    `
    if (!course.isEnrolled) {
      row.querySelector('.btn-primary').addEventListener('click', () => enrollInCourse(course.id))
    }
    tbody.appendChild(row)
  }
}

// Enrolls the student in a course, then refreshes both tables
async function enrollInCourse(courseId) {
  const response = await fetch('/api/student/enroll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId }),
  })

  if (response.ok) {
    await loadMyCourses()
    await loadAvailableCourses()
  } else {
    const data = await response.json()
    alert(data.error || 'Failed to enroll.')
  }
}

// Drops the student from a course, then refreshes both tables
async function dropCourse(courseId) {
  const confirmed = confirm('Are you sure you want to drop this course?')
  if (!confirmed) return

  const response = await fetch(`/api/student/enroll/${courseId}`, { method: 'DELETE' })

  if (response.ok) {
    await loadMyCourses()
    await loadAvailableCourses()
  } else {
    const data = await response.json()
    alert(data.error || 'Failed to drop course.')
  }
}
