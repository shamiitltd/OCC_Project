-- Offcampuscareer Database Schema (SQLite)

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    college VARCHAR(150),
    year VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'student', -- 'student', 'admin'
    avatar VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    duration VARCHAR(50),
    level VARCHAR(50),
    price INTEGER NOT NULL,
    rating REAL DEFAULT 0.0,
    enrolled INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT 1,
    icon VARCHAR(10),
    instructor VARCHAR(100),
    description TEXT,
    modules TEXT, -- JSON string array
    image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    progress INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    completed_modules TEXT, -- JSON string array
    certificate_issued BOOLEAN DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50),
    instructor VARCHAR(100),
    meeting_link VARCHAR(255),
    attendees TEXT, -- JSON string array of student IDs
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(50) PRIMARY KEY,
    assignment_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    submitted_at DATE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    grade INTEGER DEFAULT NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(50) PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    domain VARCHAR(100),
    location VARCHAR(100),
    stipend VARCHAR(50),
    skills TEXT, -- JSON string array
    description TEXT
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    job_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    applied_at DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Under Review',
    resume_url VARCHAR(255),
    match_score INTEGER DEFAULT 0,
    match_explanation TEXT,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(job_id, student_id)
);

CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    date DATE NOT NULL,
    read BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    method VARCHAR(50),
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed',
    receipt_no VARCHAR(50) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
