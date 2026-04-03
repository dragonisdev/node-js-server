## Course Management System

A simple web application for managing courses, students, and instructors. Built with vanilla Node.js for a school project and internship practice.

## You have my full permission to hack this app. If it is vulnerable, email me please and I'll give you a reward.

### What it does
- Login system for students, instructors, and admins
- Instructors can create and manage courses with schedules
- Students can enroll in courses and view their schedules
- Track student grades and enrollment status

### Security Features
- Password hashing with bcrypt
- JWT tokens for secure login
- Role-based access control (admin, instructor, student)

### Database
- MySQL database with proper relationships
- Stores users, courses, schedules, and enrollments
- Handles course capacity and scheduling

### How to run this?

`npm i` to install dependencies

`npm run dev` to run the server with nodemon

For the database, set up your own MySQL database and run the schema file in the backend folder.

### Folder structure

```
node-js-server/
├── backend/                      # Backend files
│   ├── middleware/                # Express-style middleware
│   ├── db.js                     # Database connection and Drizzle ORM setup
│   ├── schema.js                 # Drizzle ORM table definitions
│   ├── schema.sql                # Raw SQL schema for reference
│   └── server.js                 # Main entry point (all route handling)
├── client/                       # All frontend files (Client-side)
│   ├── public/                   # Statically served assets
│   ├── admin-dashboard.html      # Admin dashboard page
│   ├── admin-dashboard.js        # Admin dashboard logic
│   ├── authentication.js         # Login and registration logic
│   ├── course-management.html    # Course management page
│   ├── course-management.js      # Course management logic
│   ├── login.html                # Login page
│   ├── register.html             # Registration page
│   ├── student-dashboard.html    # Student dashboard page
│   ├── student-dashboard.js      # Student dashboard logic
│   └── style.css                 # Global stylesheet
├── tests/                        # Unit tests
│   ├── db.test.js                # Database tests
│   └── test.js                   # Server/route tests
├── .env                          # Environment variables (not committed)
├── .env.example                  # Example environment variables
├── .gitignore
└── package.json
```

The final project will be hosted on Railway PaaS and uses their MySQL database

Cross site request forgery (CSRF) protection is implemented using SameSite=Strict cookies