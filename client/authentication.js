document.addEventListener('DOMContentLoaded', () => {
  redirectIfOnWrongDashboard()

  const loginForm = document.getElementById('loginForm')
  if (loginForm) loginForm.addEventListener('submit', handleLogin)

  const registerForm = document.getElementById('registerForm')
  if (registerForm) registerForm.addEventListener('submit', handleRegister)

  const logoutBtn = document.getElementById('logoutBtn')
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout)
})

async function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const message = document.getElementById('message')

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await response.json()

    if (response.ok) {
      const profileRes = await fetch('/api/user/profile')
      const user = await profileRes.json()
      window.location.href = user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'
    } else {
      message.textContent = data.error || 'Login failed'
      message.style.color = 'red'
    }
  } catch {
    message.textContent = 'An error occurred'
  }
}

async function handleRegister(e) {
  e.preventDefault()

  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const confirmPassword = document.getElementById('confirmPassword').value
  const message = document.getElementById('message')

  if (password !== confirmPassword) {
    message.textContent = 'Passwords do not match'
    message.style.color = 'red'
    return
  }

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await response.json()

    if (response.ok) {
      window.location.href = '/student-dashboard'
    } else {
      message.textContent = data.error || 'Registration failed'
      message.style.color = 'red'
    }
  } catch {
    message.textContent = 'An error occurred'
  }
}

async function handleLogout() {
  try {
    await fetch('/logout', { method: 'POST' })
  } catch (error) {
    console.error('Logout error:', error)
  }
  window.location.href = '/'
}

// If the user is already logged in and lands on a dashboard page,
// make sure they're on the correct one for their role
async function redirectIfOnWrongDashboard() {
  if (!window.location.pathname.includes('dashboard')) return

  try {
    const response = await fetch('/api/user/profile')
    if (!response.ok) {
      window.location.href = '/'
      return
    }

    const user = await response.json()
    const correctPath = user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'

    if (window.location.pathname !== correctPath) {
      window.location.href = correctPath
    }
  } catch {
    window.location.href = '/'
  }
}
