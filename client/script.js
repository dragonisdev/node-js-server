// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    
    // Check user role and redirect accordingly
    checkUserRole();
    
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
                    window.location.href = '/admin-dashboard'
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
                    window.location.href = '/admin-dashboard'
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

async function checkUserRole() {
    // Only run this check if we're on the dashboard page
    if (!window.location.pathname.includes('dashboard')) {
        return;
    }
    
    try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
            window.location.href = '/';
            return;
        }
        
        const user = await response.json();
        
        // Redirect based on role
        const currentPath = window.location.pathname;
        const adminRoute = '/admin-dashboard';
        const studentRoute = '/student-dashboard';
        
        if (user.role === 'admin') {
            // Redirect to admin dashboard if not already there
            if (currentPath !== adminRoute) {
                window.location.href = adminRoute;
            }
        } else if (user.role === 'student') {
            // Redirect to student dashboard if not already there
            if (currentPath !== studentRoute) {
                window.location.href = studentRoute;
            }
        } else {
            // Handle unknown roles - redirect to home
            console.warn('Unknown user role:', user.role);
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error checking user role:', error);
        window.location.href = '/';
    }
}