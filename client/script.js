// Login form submission
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            const data = await response.json()
            if (response.ok) {
                window.location.href = '/dashboard'
            } else {
                message.textContent = data.error || 'Registration failed'; message.style.color = 'red'
            }
        } catch (error) {
            message.textContent = 'An error occurred'
        }
    })
}

// Register form submission
const registerForm = document.getElementById('registerForm')
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const username = document.getElementById('registerUsername').value
        const password = document.getElementById('registerPassword').value
        const message = document.getElementById('registerMessage')

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            const data = await response.json()
            if (response.ok) {
                window.location.href = '/dashboard'
            } else {
                message.textContent = data.error || 'Registration failed'; message.style.color = 'red'
            }
        } catch (error) {
            message.textContent = 'An error occurred'
        }
    })
}

// Logout function
async function logout() {
    try {
        await fetch('/logout', { method: 'POST' })
    } catch (error) {
        console.error('Logout error', error)
    }
    window.location.href = '/'
}

// For dashboard page
if (window.location.pathname === '/dashboard') {
    // Add logout button
    const logoutBtn = document.createElement('button')
    logoutBtn.textContent = 'Logout'
    logoutBtn.onclick = logout
    document.body.appendChild(logoutBtn)
}
