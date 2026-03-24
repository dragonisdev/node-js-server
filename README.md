## Vanilla Node JS Server

I am trying to create an HTTP web server using vanilla Node.js for my upcoming developer internship practice as well as for my school project.

The scope of the project is as follows: 
- Login system that is secure for students and admins
    - Only admins can create, update or remove students
    - Students can add, update, or remove their own courses
- A third party API? 
- bcrypt for password hashing
- jsonwebtoken for JWT
- Basic SQL database for storing data


### How to run this?

`npm i` to install dependencies

`npm run dev` to run the server via nodemon for in real time changes

for real db connection, use your own mysql db and the correct database variables, run the schema and you should be fine

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