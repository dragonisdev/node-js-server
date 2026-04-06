// Escapes special HTML characters to prevent XSS when inserting user data into the DOM
function escapeHTML(str) {
  const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(str).replace(/[&<>"']/g, char => escapeMap[char])
}

window.onload = async function () {
  await loadProfile()
  await loadCourses()
  await loadStudents()

  document.getElementById('logoutBtn').onclick = async function () {
    await fetch('/logout', { method: 'POST' })
    window.location.href = '/login'
  }
}

// Fetches the logged-in admin's profile and shows their username in the header
async function loadProfile() {
  const response = await fetch('/api/user/profile')

  if (response.status === 401) {
    window.location.href = '/login'
    return
  }

  const user = await response.json()
  document.getElementById('adminUsername').textContent = user.username
}

// Fetches all courses and renders them into the courses table
async function loadCourses() {
  const response = await fetch('/api/admin/courses')

  if (response.status === 401) {
    window.location.href = '/login'
    return
  }

  const courses = await response.json()
  const tbody = document.getElementById('coursesTableBody')
  tbody.innerHTML = ''

  if (courses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="table-loading">No courses found.</td></tr>'
    return
  }

  for (const course of courses) {
    const status = course.isActive ? 'Active' : 'Inactive'
    const statusClass = course.isActive ? 'badge-active' : 'badge-inactive'
    const startDate = course.startDate ? course.startDate.slice(0, 10) : '—'
    const endDate = course.endDate ? course.endDate.slice(0, 10) : '—'

    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${escapeHTML(course.courseCode)}</td>
      <td>${escapeHTML(course.title)}</td>
      <td>${course.credits}</td>
      <td>${course.enrolledCount} / ${course.maxStudents}</td>
      <td>${course.maxStudents}</td>
      <td>${startDate}</td>
      <td>${endDate}</td>
      <td><span class="badge ${statusClass}">${status}</span></td>
      <td class="action-cell">
        <a href="/course-management?id=${course.id}" class="btn-icon btn-edit" title="Edit">
          <span class="material-icons">edit</span>
        </a>
        <button type="button" class="btn-icon btn-delete" title="Delete">
          <span class="material-icons">delete</span>
        </button>
      </td>
    `
    row.querySelector('.btn-delete').addEventListener('click', () => deleteCourse(course.id))
    tbody.appendChild(row)
  }
}

// Asks for confirmation then deletes the course and refreshes the table
async function deleteCourse(id) {
  const confirmed = confirm('Are you sure you want to delete this course?')
  if (!confirmed) return

  const response = await fetch('/api/admin/courses/' + id, { method: 'DELETE' })

  if (response.ok) {
    await loadCourses()
  } else {
    alert('Failed to delete course.')
  }
}

// Fetches all students and renders them into the students table
async function loadStudents() {
  const response = await fetch('/api/admin/students')

  if (response.status === 401) {
    window.location.href = '/login'
    return
  }

  const students = await response.json()
  const tbody = document.getElementById('studentsTableBody')
  tbody.innerHTML = ''

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="table-loading">No students found.</td></tr>'
    return
  }

  for (const student of students) {
    const status = student.isActive ? 'Active' : 'Inactive'
    const statusClass = student.isActive ? 'badge-active' : 'badge-inactive'
    const registered = student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '—'

    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${escapeHTML(student.username)}</td>
      <td>${registered}</td>
      <td><span class="badge ${statusClass}">${status}</span></td>
    `
    tbody.appendChild(row)
  }
}
