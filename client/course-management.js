let editingId = null

// Escapes special HTML characters to prevent XSS when inserting user data into the DOM
function escapeHTML(str) {
  const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(str).replace(/[&<>"']/g, char => escapeMap[char])
}

document.addEventListener('DOMContentLoaded', () => {
  loadProfile()

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  if (id) {
    editingId = parseInt(id)
    document.getElementById('pageTitle').textContent = 'Edit Course'
    document.getElementById('submitBtn').textContent = 'Update Course'
    document.getElementById('activeGroup').style.display = ''
    loadCourse(editingId)
  }

  document.getElementById('courseForm').addEventListener('submit', handleSubmit)
  document.getElementById('logoutBtn').addEventListener('click', logout)
})

async function loadProfile() {
  try {
    const res = await fetch('/api/user/profile')
    if (res.status === 401) {
      window.location.href = '/login'
      return
    }
    const user = await res.json()
    document.getElementById('adminUsername').textContent = user.username
  } catch {
    window.location.href = '/login'
  }
}

async function loadCourse(id) {
  try {
    const res = await fetch(`/api/admin/courses/${id}`)
    if (res.status === 401) { window.location.href = '/login'; return }
    if (!res.ok) { showMessage('Course not found.', 'error'); return }
    const course = await res.json()
    document.getElementById('courseCode').value = course.courseCode
    document.getElementById('title').value = course.title
    document.getElementById('credits').value = course.credits
    document.getElementById('maxStudents').value = course.maxStudents
    document.getElementById('startDate').value = course.startDate ? course.startDate.slice(0, 10) : ''
    document.getElementById('endDate').value = course.endDate ? course.endDate.slice(0, 10) : ''
    document.getElementById('isActive').checked = Boolean(course.isActive)
  } catch {
    showMessage('Failed to load course.', 'error')
  }
}

async function handleSubmit(e) {
  e.preventDefault()
  const btn = document.getElementById('submitBtn')
  btn.disabled = true

  const payload = {
    courseCode: document.getElementById('courseCode').value.trim(),
    title: document.getElementById('title').value.trim(),
    credits: parseInt(document.getElementById('credits').value),
    maxStudents: parseInt(document.getElementById('maxStudents').value),
    startDate: document.getElementById('startDate').value || null,
    endDate: document.getElementById('endDate').value || null,
    isActive: document.getElementById('isActive').checked,
  }

  try {
    const url = editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (res.ok) {
      window.location.href = '/admin-dashboard'
    } else {
      showMessage(data.error || 'Failed to save course.', 'error')
      btn.disabled = false
    }
  } catch {
    showMessage('Failed to save course.', 'error')
    btn.disabled = false
  }
}

async function logout() {
  await fetch('/logout', { method: 'POST' })
  window.location.href = '/login'
}

function showMessage(msg, type) {
  const el = document.getElementById('formMessage')
  el.textContent = msg
  el.className = type
}
