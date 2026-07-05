-- =====================================================================
-- Offcampuscareer MySQL Database Schema
-- Database: user_tip
-- User: user_tip
-- =====================================================================

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ── Users ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         VARCHAR(50)  PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    phone      VARCHAR(20),
    college    VARCHAR(150),
    year       VARCHAR(50),
    role       VARCHAR(20)  NOT NULL DEFAULT 'student',
    avatar     VARCHAR(10),
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Courses ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
    id          VARCHAR(50)  PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    category    VARCHAR(100),
    duration    VARCHAR(50),
    level       VARCHAR(50),
    price       INT          NOT NULL DEFAULT 0,
    rating      DECIMAL(3,1) DEFAULT 0.0,
    enrolled    INT          DEFAULT 0,
    published   TINYINT(1)   DEFAULT 1,
    icon        VARCHAR(20),
    instructor  VARCHAR(100),
    description TEXT,
    modules     TEXT,
    image       VARCHAR(255) DEFAULT '',
    INDEX idx_courses_category  (category),
    INDEX idx_courses_published (published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Enrollments ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
    id                 VARCHAR(50) PRIMARY KEY,
    student_id         VARCHAR(50) NOT NULL,
    course_id          VARCHAR(50) NOT NULL,
    progress           INT         DEFAULT 0,
    start_date         DATE        NOT NULL,
    completed_modules  TEXT,
    certificate_issued TINYINT(1)  DEFAULT 0,
    UNIQUE KEY uq_enrollment (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Classes ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
    id           VARCHAR(50)  PRIMARY KEY,
    course_id    VARCHAR(50)  NOT NULL,
    title        VARCHAR(200) NOT NULL,
    date         DATE         NOT NULL,
    time         VARCHAR(50),
    instructor   VARCHAR(100),
    meeting_link VARCHAR(255),
    attendees    TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_classes_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Assignments ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
    id          VARCHAR(50)  PRIMARY KEY,
    course_id   VARCHAR(50)  NOT NULL,
    title       VARCHAR(200) NOT NULL,
    due_date    DATE         NOT NULL,
    description TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Submissions ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
    id            VARCHAR(50)  PRIMARY KEY,
    assignment_id VARCHAR(50)  NOT NULL,
    student_id    VARCHAR(50)  NOT NULL,
    submitted_at  DATE         NOT NULL,
    file_name     VARCHAR(255) NOT NULL,
    grade         INT          DEFAULT NULL,
    UNIQUE KEY uq_submission (assignment_id, student_id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id)    REFERENCES users(id)       ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Jobs ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
    id          VARCHAR(50)  PRIMARY KEY,
    company     VARCHAR(100) NOT NULL,
    role        VARCHAR(100) NOT NULL,
    type        VARCHAR(50),
    domain      VARCHAR(100),
    location    VARCHAR(100),
    stipend     VARCHAR(50),
    skills      TEXT,
    description TEXT,
    INDEX idx_jobs_type   (type),
    INDEX idx_jobs_domain (domain)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Applications ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
    id                VARCHAR(50)  PRIMARY KEY,
    job_id            VARCHAR(50)  NOT NULL,
    student_id        VARCHAR(50)  NOT NULL,
    applied_at        DATE         NOT NULL,
    status            VARCHAR(50)  DEFAULT 'Under Review',
    resume_url        VARCHAR(255),
    match_score       INT          DEFAULT 0,
    match_explanation TEXT,
    UNIQUE KEY uq_application (job_id, student_id),
    FOREIGN KEY (job_id)     REFERENCES jobs(id)  ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Contacts ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
    id      VARCHAR(50)  PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    email   VARCHAR(100) NOT NULL,
    phone   VARCHAR(20),
    subject VARCHAR(200),
    message TEXT         NOT NULL,
    date    DATE         NOT NULL,
    is_read TINYINT(1)   DEFAULT 0,
    INDEX idx_contacts_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Payments ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id         VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id  VARCHAR(50) NOT NULL,
    amount     INT         NOT NULL,
    method     VARCHAR(50),
    date       DATE        NOT NULL,
    status     VARCHAR(50) DEFAULT 'Completed',
    receipt_no VARCHAR(50) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_payments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET foreign_key_checks = 1;
