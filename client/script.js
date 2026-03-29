// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    
    // Login form
    const loginForm = document.getElementById('loginForm')
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const username = document.getElementById('username').value
            const password = document.getElementById('password').value
            const message = document.getElementById('message')

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                })
                const data = await response.json()
                if (response.ok) {
                    window.location.href = '/dashboard'
                } else {
                    message.textContent = data.error || 'Login failed'
                    message.style.color = 'red'
                }
            } catch (error) {
                message.textContent = 'An error occurred'
            }
        })
    }

    // Register form
    const registerForm = document.getElementById('registerForm')
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
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
                    body: JSON.stringify({ username, password })
                })
                const data = await response.json()
                if (response.ok) {
                    window.location.href = '/dashboard'
                } else {
                    message.textContent = data.error || 'Registration failed'
                    message.style.color = 'red'
                }
            } catch (error) {
                message.textContent = 'An error occurred'
            }
        })
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn')
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/logout', { method: 'POST' })
            } catch (error) {
                console.error('Logout error', error)
            }
            window.location.href = '/'
        })
    }
})