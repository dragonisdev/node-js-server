## Course Management System

A simple web application for managing courses, students, and instructors. Built with vanilla Node.js for a school project and internship practice.

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
student-crud-app/
├── node_modules/
├── backend/              # Backend files
│   ├── db.js             # Database connection logic (cleaner than putting it in server.js)
│   └── server.js         # Main entry point (Backend logic)
├── client/               # All frontend files (Client-side)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── tests/                # Unit tests
    └── test.js
├── .env
├── .gitignore
```

The final project will be hosted on Railway PaaS and uses their MySQL database

Cross site request forgery (CSRF) protection is implemented using SameSite=Strict cookies