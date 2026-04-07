## Course Management System

A simple web app for managing courses, students, and instructors. Built with vanilla Node.js for a school project and internship practice.

You have my full permission to hack this app. If it is vulnerable, email me please

Server link: https://node-js-server-production-6590.up.railway.app/

### What it does:
- Login system for students and admins
- Admins can create and manage courses with schedules
- Students can enroll in courses and view their schedules
- Track student grades and enrollment status

### Security Features:
- Password hashing with bcrypt
- Session-based authentication with HTTP-only, SameSite=Strict cookies
- Role-based access control (admin, student)
- Rate limiting on auth endpoints (in-memory)
- Content Security Policy (CSP) headers on all HTML responses

### Database:
- MySQL database with proper relationships
- Uses Drizzle ORM for queries and schema management
- Stores users, courses, schedules, and enrollments
- Handles course capacity and scheduling

## How to run this?

`npm i to install dependencies`

`npm run dev to run the server with nodemon`

For the database, set up your own MySQL database and run the schema file in the backend folder.

## Folder structure:

```
node-js-server/
├── backend/
│   ├── data.sql                // test data
│   ├── db.js
│   ├── helpers.js              // middleware
│   ├── schema.js
│   ├── schema.sql              // db table schema
│   ├── server.js               // main entrypoint
│   └── routes/
│       ├── admin.js
│       ├── auth.js
│       └── student.js
├── client/
│   ├── admin-dashboard.html
│   ├── admin-dashboard.js
│   ├── authentication.js
│   ├── course-management.html
│   ├── course-management.js
│   ├── login.html
│   ├── register.html
│   ├── student-dashboard.html
│   ├── student-dashboard.js
│   └── style.css
├── tests/
│   ├── db.test.js
│   └── test.js
├── package.json
├── README.md
├── to-do.md
├── .env
├── .env.example
└── .gitignore
```

## The final project will be hosted on Railway PaaS and uses their MySQL database

Security notes:
- CSRF protection via SameSite=Strict cookies (same-origin requests only)
- SQL injection prevention: Drizzle ORM uses parameterized queries exclusively
- Username enumeration prevention: login always returns a generic "Invalid credentials" response
- Input validation on registration: username is alphanumeric/underscore, 1–50 chars; password is 8–128 chars
- Sessions expire after 1 hour; expired sessions are also purged from memory every 10 minutes