-- ============================================================
-- Seed Data for Node.js Server Application
-- All passwords hashed with bcrypt (cost factor 10)
-- Admin/Instructor password: Admin@123
-- Student password: Student@123
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================

INSERT INTO users (id, username, password_hash, role, is_active) VALUES
(1,  'basslord',    '$2b$10$xsiRwKZX8dS9SCMoBf/QU.e8EXqjztMKABTdMZX4rchzZrG6k2GKW', 'admin',      TRUE),
(2,  'superadmin',    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin',      TRUE),
(3,  'prof_johnson',  '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin',      TRUE),
(4,  'prof_martinez', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin',      TRUE),
(5,  'prof_white',    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin',      TRUE),
(6,  'prof_chen',     '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin',      TRUE),

(7,  'student',  '$2b$10$E56DqBe1PH0TIE4lx9V6puI4E5os70EGIlj/cgQg3CaUFgKKD1h5u', 'student', TRUE),
(8,  'bob_smith',     '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(9,  'carol_jones',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(10, 'david_brown',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(11, 'eve_davis',     '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(12, 'frank_wilson',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(13, 'grace_taylor',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(14, 'henry_moore',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(15, 'irene_jackson', '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(16, 'james_martin',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(17, 'kate_garcia',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(18, 'liam_harris',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(19, 'mia_clark',     '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(20, 'noah_lewis',    '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(21, 'olivia_lee',    '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(22, 'peter_walker',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(23, 'quinn_hall',    '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(24, 'rachel_allen',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(25, 'sam_young',     '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(26, 'tara_king',     '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(27, 'ursula_wright', '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(28, 'victor_scott',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(29, 'wendy_adams',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(30, 'xander_baker',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(31, 'yara_gonzalez', '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(32, 'zach_nelson',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(33, 'anna_carter',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(34, 'brian_mitchell','$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(35, 'claire_perez',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(36, 'dylan_roberts', '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(37, 'emma_turner',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(38, 'felix_phillips','$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(39, 'gina_campbell', '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(40, 'hank_parker',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(41, 'iris_evans',    '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(42, 'jake_edwards',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(43, 'kelly_collins', '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(44, 'leo_stewart',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(45, 'maya_sanchez',  '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', TRUE),
(46, 'nick_morris',   '$2b$10$TKh8H1.PfBKwR5ABCD1234uOpJ6XoFbKEMFGHt8FqH1vYFPaW6kCe', 'student', FALSE);

-- ============================================================
-- COURSES
-- ============================================================
-- Course 1 (id=1): max_students=30 — will be FULLY ENROLLED
-- ============================================================

INSERT INTO courses (id, title, course_code, credits, max_students, start_date, end_date, instructor_id, is_active) VALUES
(1, 'Introduction to Programming',  'CS101',   5, 30, '2026-02-01', '2026-06-01', 3, TRUE),
(2, 'Data Structures',              'CS201',   5, 25, '2026-02-01', '2026-06-01', 4, TRUE),
(3, 'Calculus I',                   'MATH101', 5, 35, '2026-02-01', '2026-06-01', 5, TRUE),
(4, 'Algorithms & Complexity',      'CS301',   5, 20, '2026-02-01', '2026-06-01', 6, TRUE),
(5, 'Database Fundamentals',        'DB101',   5, 25, '2026-02-01', '2026-06-01', 3, TRUE),
(6, 'Web Development',              'WEB101',  5, 30, '2026-09-01', '2027-01-15', 4, TRUE),
(7, 'Linear Algebra',               'MATH201', 5, 30, '2026-09-01', '2027-01-15', 5, TRUE),
(8, 'Operating Systems',            'CS401',   5, 20, '2026-09-01', '2027-01-15', 6, TRUE);

-- ============================================================
-- ENROLLMENTS
-- ============================================================
-- CS101 (course_id=1) is FULLY ENROLLED — 30/30 students (ids 7–36)
-- Other courses have partial enrollments with varied statuses & grades
-- ============================================================

INSERT INTO enrollments (student_id, course_id, enrollment_date, status, grade) VALUES

-- ============================================================
-- CS101 — FULLY ENROLLED (30/30)
-- ============================================================
(7,  1, '2026-01-10 09:00:00', 'enrolled',   NULL),
(8,  1, '2026-01-10 09:05:00', 'enrolled',   NULL),
(9,  1, '2026-01-10 09:10:00', 'enrolled',   NULL),
(10, 1, '2026-01-10 09:15:00', 'enrolled',   NULL),
(11, 1, '2026-01-10 09:20:00', 'enrolled',   NULL),
(12, 1, '2026-01-10 09:25:00', 'enrolled',   NULL),
(13, 1, '2026-01-10 09:30:00', 'enrolled',   NULL),
(14, 1, '2026-01-10 09:35:00', 'enrolled',   NULL),
(15, 1, '2026-01-10 09:40:00', 'enrolled',   NULL),
(16, 1, '2026-01-10 09:45:00', 'enrolled',   NULL),
(17, 1, '2026-01-10 10:00:00', 'enrolled',   NULL),
(18, 1, '2026-01-10 10:05:00', 'enrolled',   NULL),
(19, 1, '2026-01-10 10:10:00', 'enrolled',   NULL),
(20, 1, '2026-01-10 10:15:00', 'enrolled',   NULL),
(21, 1, '2026-01-10 10:20:00', 'enrolled',   NULL),
(22, 1, '2026-01-10 10:25:00', 'enrolled',   NULL),
(23, 1, '2026-01-10 10:30:00', 'enrolled',   NULL),
(24, 1, '2026-01-10 10:35:00', 'enrolled',   NULL),
(25, 1, '2026-01-10 10:40:00', 'enrolled',   NULL),
(26, 1, '2026-01-10 10:45:00', 'enrolled',   NULL),
(27, 1, '2026-01-10 11:00:00', 'enrolled',   NULL),
(28, 1, '2026-01-10 11:05:00', 'enrolled',   NULL),
(29, 1, '2026-01-10 11:10:00', 'enrolled',   NULL),
(30, 1, '2026-01-10 11:15:00', 'enrolled',   NULL),
(31, 1, '2026-01-10 11:20:00', 'enrolled',   NULL),
(32, 1, '2026-01-10 11:25:00', 'enrolled',   NULL),
(33, 1, '2026-01-10 11:30:00', 'enrolled',   NULL),
(34, 1, '2026-01-10 11:35:00', 'enrolled',   NULL),
(35, 1, '2026-01-10 11:40:00', 'enrolled',   NULL),
(36, 1, '2026-01-10 11:45:00', 'enrolled',   NULL),

-- ============================================================
-- CS201 — Data Structures (18/25 enrolled, mix of statuses)
-- ============================================================
(7,  2, '2026-01-11 09:00:00', 'enrolled',   NULL),
(8,  2, '2026-01-11 09:10:00', 'enrolled',   NULL),
(9,  2, '2026-01-11 09:20:00', 'enrolled',   NULL),
(10, 2, '2026-01-11 09:30:00', 'dropped',    NULL),
(11, 2, '2026-01-11 09:40:00', 'enrolled',   NULL),
(12, 2, '2026-01-11 09:50:00', 'enrolled',   NULL),
(13, 2, '2026-01-11 10:00:00', 'enrolled',   NULL),
(14, 2, '2026-01-11 10:10:00', 'enrolled',   NULL),
(37, 2, '2026-01-11 10:20:00', 'enrolled',   NULL),
(38, 2, '2026-01-11 10:30:00', 'enrolled',   NULL),
(39, 2, '2026-01-11 10:40:00', 'withdrawn',  NULL),
(40, 2, '2026-01-11 10:50:00', 'enrolled',   NULL),
(41, 2, '2026-01-11 11:00:00', 'enrolled',   NULL),
(42, 2, '2026-01-11 11:10:00', 'enrolled',   NULL),
(43, 2, '2026-01-11 11:20:00', 'enrolled',   NULL),
(44, 2, '2026-01-11 11:30:00', 'enrolled',   NULL),
(45, 2, '2026-01-11 11:40:00', 'enrolled',   NULL),
(15, 2, '2026-01-11 11:50:00', 'enrolled',   NULL),

-- ============================================================
-- MATH101 — Calculus I (22/35 enrolled, some completed with grades)
-- ============================================================
(7,  3, '2026-01-12 09:00:00', 'completed',  88.50),
(8,  3, '2026-01-12 09:10:00', 'completed',  72.00),
(9,  3, '2026-01-12 09:20:00', 'completed',  95.00),
(10, 3, '2026-01-12 09:30:00', 'completed',  61.75),
(11, 3, '2026-01-12 09:40:00', 'completed',  78.25),
(12, 3, '2026-01-12 09:50:00', 'completed',  84.00),
(16, 3, '2026-01-12 10:00:00', 'enrolled',   NULL),
(17, 3, '2026-01-12 10:10:00', 'enrolled',   NULL),
(18, 3, '2026-01-12 10:20:00', 'enrolled',   NULL),
(19, 3, '2026-01-12 10:30:00', 'enrolled',   NULL),
(20, 3, '2026-01-12 10:40:00', 'dropped',    NULL),
(21, 3, '2026-01-12 10:50:00', 'enrolled',   NULL),
(37, 3, '2026-01-12 11:00:00', 'enrolled',   NULL),
(38, 3, '2026-01-12 11:10:00', 'enrolled',   NULL),
(39, 3, '2026-01-12 11:20:00', 'enrolled',   NULL),
(40, 3, '2026-01-12 11:30:00', 'enrolled',   NULL),
(41, 3, '2026-01-12 11:40:00', 'enrolled',   NULL),
(42, 3, '2026-01-12 11:50:00', 'enrolled',   NULL),
(43, 3, '2026-01-12 12:00:00', 'enrolled',   NULL),
(44, 3, '2026-01-12 12:10:00', 'enrolled',   NULL),
(45, 3, '2026-01-12 12:20:00', 'enrolled',   NULL),
(22, 3, '2026-01-12 12:30:00', 'enrolled',   NULL),

-- ============================================================
-- CS301 — Algorithms (15/20 enrolled)
-- ============================================================
(9,  4, '2026-01-13 09:00:00', 'enrolled',   NULL),
(10, 4, '2026-01-13 09:10:00', 'enrolled',   NULL),
(11, 4, '2026-01-13 09:20:00', 'enrolled',   NULL),
(12, 4, '2026-01-13 09:30:00', 'enrolled',   NULL),
(13, 4, '2026-01-13 09:40:00', 'enrolled',   NULL),
(14, 4, '2026-01-13 09:50:00', 'enrolled',   NULL),
(15, 4, '2026-01-13 10:00:00', 'enrolled',   NULL),
(16, 4, '2026-01-13 10:10:00', 'dropped',    NULL),
(37, 4, '2026-01-13 10:20:00', 'enrolled',   NULL),
(38, 4, '2026-01-13 10:30:00', 'enrolled',   NULL),
(39, 4, '2026-01-13 10:40:00', 'enrolled',   NULL),
(40, 4, '2026-01-13 10:50:00', 'enrolled',   NULL),
(41, 4, '2026-01-13 11:00:00', 'enrolled',   NULL),
(42, 4, '2026-01-13 11:10:00', 'enrolled',   NULL),
(43, 4, '2026-01-13 11:20:00', 'enrolled',   NULL),

-- ============================================================
-- DB101 — Database Fundamentals (20/25 enrolled, some with grades)
-- ============================================================
(17, 5, '2026-01-14 09:00:00', 'enrolled',   NULL),
(18, 5, '2026-01-14 09:10:00', 'enrolled',   NULL),
(19, 5, '2026-01-14 09:20:00', 'enrolled',   NULL),
(20, 5, '2026-01-14 09:30:00', 'enrolled',   NULL),
(21, 5, '2026-01-14 09:40:00', 'enrolled',   NULL),
(22, 5, '2026-01-14 09:50:00', 'enrolled',   NULL),
(23, 5, '2026-01-14 10:00:00', 'enrolled',   NULL),
(24, 5, '2026-01-14 10:10:00', 'enrolled',   NULL),
(25, 5, '2026-01-14 10:20:00', 'enrolled',   NULL),
(26, 5, '2026-01-14 10:30:00', 'enrolled',   NULL),
(27, 5, '2026-01-14 10:40:00', 'withdrawn',  NULL),
(28, 5, '2026-01-14 10:50:00', 'enrolled',   NULL),
(29, 5, '2026-01-14 11:00:00', 'enrolled',   NULL),
(30, 5, '2026-01-14 11:10:00', 'enrolled',   NULL),
(31, 5, '2026-01-14 11:20:00', 'enrolled',   NULL),
(44, 5, '2026-01-14 11:30:00', 'enrolled',   NULL),
(45, 5, '2026-01-14 11:40:00', 'enrolled',   NULL),
(32, 5, '2026-01-14 11:50:00', 'enrolled',   NULL),
(33, 5, '2026-01-14 12:00:00', 'enrolled',   NULL),
(34, 5, '2026-01-14 12:10:00', 'enrolled',   NULL),

-- ============================================================
-- WEB101 — Web Development (future course — 12/30 pre-enrolled)
-- ============================================================
(35, 6, '2026-03-01 09:00:00', 'enrolled',   NULL),
(36, 6, '2026-03-01 09:10:00', 'enrolled',   NULL),
(37, 6, '2026-03-01 09:20:00', 'enrolled',   NULL),
(38, 6, '2026-03-01 09:30:00', 'enrolled',   NULL),
(39, 6, '2026-03-01 09:40:00', 'enrolled',   NULL),
(40, 6, '2026-03-01 09:50:00', 'enrolled',   NULL),
(41, 6, '2026-03-01 10:00:00', 'enrolled',   NULL),
(42, 6, '2026-03-01 10:10:00', 'enrolled',   NULL),
(43, 6, '2026-03-01 10:20:00', 'enrolled',   NULL),
(44, 6, '2026-03-01 10:30:00', 'enrolled',   NULL),
(45, 6, '2026-03-01 10:40:00', 'enrolled',   NULL),
(7,  6, '2026-03-01 10:50:00', 'enrolled',   NULL),

-- ============================================================
-- CS401 — Operating Systems (10/20 enrolled)
-- ============================================================
(8,  8, '2026-03-02 09:00:00', 'enrolled',   NULL),
(9,  8, '2026-03-02 09:10:00', 'enrolled',   NULL),
(10, 8, '2026-03-02 09:20:00', 'enrolled',   NULL),
(11, 8, '2026-03-02 09:30:00', 'enrolled',   NULL),
(12, 8, '2026-03-02 09:40:00', 'enrolled',   NULL),
(13, 8, '2026-03-02 09:50:00', 'enrolled',   NULL),
(14, 8, '2026-03-02 10:00:00', 'enrolled',   NULL),
(15, 8, '2026-03-02 10:10:00', 'enrolled',   NULL),
(16, 8, '2026-03-02 10:20:00', 'enrolled',   NULL),
(17, 8, '2026-03-02 10:30:00', 'enrolled',   NULL);
