<?php
// setup_mysql.php - Creates database tables and seeds data
// Run once: https://tip.offcampuscareer.com/api/setup_mysql.php
// DELETE this file immediately after running!

set_time_limit(120);
header('Content-Type: text/html; charset=utf-8');

$host = 'localhost';
$dbname = 'user_tip';
$user = 'user_tip';
$pass = 'Cz7Ttut@Tqlh|/WR';

echo "<pre>\n";
echo "=== MySQL Database Setup ===\n\n";

// Test connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    echo "[OK] Connected to MySQL database '$dbname'\n\n";
} catch (PDOException $e) {
    echo "[FAIL] MySQL connection failed: " . $e->getMessage() . "\n";
    echo "\nThis means the MySQL database '$dbname' with user '$user' has not been created yet.\n";
    echo "Please create it in HestiaCP: DB -> Add Database\n";
    echo "  Database: tip (becomes user_tip)\n";
    echo "  User: tip (becomes user_tip)\n";
    echo "  Password: Cz7Ttut@Tqlh|/WR\n";
    exit("</pre>");
}

// Check if already seeded
$count = $pdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$dbname'")->fetchColumn();
echo "Existing tables: $count\n";

if ($count > 0) {
    $users = $pdo->query("SELECT COUNT(*) FROM users 2>/dev/null")->fetchColumn() ?? 0;
    if ($users > 0) {
        echo "[OK] Database already seeded ($users users). Nothing to do.\n";
        exit("</pre>");
    }
}

// Create tables
echo "\n--- Creating Tables ---\n";

$tables = [
    "users" => "CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        college VARCHAR(150),
        year VARCHAR(50),
        role VARCHAR(20) NOT NULL DEFAULT 'student',
        avatar VARCHAR(10),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_users_email (email),
        INDEX idx_users_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "courses" => "CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        category VARCHAR(100),
        duration VARCHAR(50),
        level VARCHAR(50),
        price INT NOT NULL DEFAULT 0,
        rating DECIMAL(3,1) DEFAULT 0.0,
        enrolled INT DEFAULT 0,
        published TINYINT(1) DEFAULT 1,
        icon VARCHAR(20),
        instructor VARCHAR(100),
        description TEXT,
        modules TEXT,
        image VARCHAR(255) DEFAULT ''
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "enrollments" => "CREATE TABLE IF NOT EXISTS enrollments (
        id VARCHAR(50) PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        course_id VARCHAR(50) NOT NULL,
        progress INT DEFAULT 0,
        start_date DATE NOT NULL,
        completed_modules TEXT,
        certificate_issued TINYINT(1) DEFAULT 0,
        UNIQUE KEY uq_enrollment (student_id, course_id),
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "classes" => "CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(50) PRIMARY KEY,
        course_id VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(50),
        instructor VARCHAR(100),
        meeting_link VARCHAR(255),
        attendees TEXT,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "assignments" => "CREATE TABLE IF NOT EXISTS assignments (
        id VARCHAR(50) PRIMARY KEY,
        course_id VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        due_date DATE NOT NULL,
        description TEXT,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "submissions" => "CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(50) PRIMARY KEY,
        assignment_id VARCHAR(50) NOT NULL,
        student_id VARCHAR(50) NOT NULL,
        submitted_at DATE NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        grade INT DEFAULT NULL,
        UNIQUE KEY uq_submission (assignment_id, student_id),
        FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "jobs" => "CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(50) PRIMARY KEY,
        company VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        type VARCHAR(50),
        domain VARCHAR(100),
        location VARCHAR(100),
        stipend VARCHAR(50),
        skills TEXT,
        description TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "applications" => "CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(50) PRIMARY KEY,
        job_id VARCHAR(50) NOT NULL,
        student_id VARCHAR(50) NOT NULL,
        applied_at DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'Under Review',
        resume_url VARCHAR(255),
        match_score INT DEFAULT 0,
        match_explanation TEXT,
        UNIQUE KEY uq_application (job_id, student_id),
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "contacts" => "CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200),
        message TEXT NOT NULL,
        date DATE NOT NULL,
        is_read TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    "payments" => "CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(50) PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        course_id VARCHAR(50) NOT NULL,
        amount INT NOT NULL,
        method VARCHAR(50),
        date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'Completed',
        receipt_no VARCHAR(50) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
];

foreach ($tables as $name => $sql) {
    try {
        $pdo->exec($sql);
        echo "[OK] Created table: $name\n";
    } catch (Exception $e) {
        echo "[ERROR] Failed to create $name: " . $e->getMessage() . "\n";
    }
}

// Seed Users
echo "\n--- Seeding Users ---\n";
$pdo->beginTransaction();

$insertUser = $pdo->prepare("INSERT IGNORE INTO users (id,name,email,password,phone,college,year,role,avatar,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)");
$students = [
    ['STU001','Rahul Sharma','rahul@demo.com','demo123','9876543210','IIT Delhi','3rd Year','student','RS','2025-01-15'],
    ['STU002','Priya Patel','priya@demo.com','demo123','9876543211','NIT Trichy','4th Year','student','PP','2025-02-10'],
    ['STU003','Amit Kumar','amit@demo.com','demo123','9876543212','BITS Pilani','2nd Year','student','AK','2025-03-05'],
    ['STU004','Sneha Gupta','sneha@demo.com','demo123','9876543213','VIT Vellore','4th Year','student','SG','2025-03-20'],
    ['STU005','Vikram Singh','vikram@demo.com','demo123','9876543214','DTU Delhi','3rd Year','student','VS','2025-04-01'],
    ['STU006','Anjali Verma','anjali@demo.com','demo123','9876543215','IIIT Hyderabad','2nd Year','student','AV','2025-04-15'],
    ['STU007','Rohan Joshi','rohan@demo.com','demo123','9876543216','SRM Chennai','3rd Year','student','RJ','2025-05-01'],
    ['STU008','Kavita Reddy','kavita@demo.com','demo123','9876543217','LNMIIT Jaipur','4th Year','student','KR','2025-05-15'],
    ['STU009','Deepak Mishra','deepak@demo.com','demo123','9876543218','NIT Rourkela','2nd Year','student','DM','2025-06-01'],
    ['STU010','Neha Agarwal','neha@demo.com','demo123','9876543219','KIIT Bhubaneswar','3rd Year','student','NA','2025-06-10'],
    ['ADMIN','Admin User','admin@oc2.in','admin123','0000000000','OCC Headquarters','N/A','admin','AD','2025-01-01'],
];
foreach ($students as $s) { $insertUser->execute($s); }
echo "[OK] 11 users seeded\n";

// Seed Courses
$insertCourse = $pdo->prepare("INSERT IGNORE INTO courses (id,title,category,duration,level,price,rating,enrolled,published,icon,instructor,description,modules,image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
$courses = [
    ['CRS001','Job Bootcamp','Career','8 Weeks','Beginner',9999,4.8,245,1,'🚀','Vinay Prem Upadhyay','Intensive bootcamp covering aptitude, interview prep, group discussions, and personality development.',json_encode(['Aptitude & Reasoning','Communication Skills','Resume Building','Mock Interviews','Group Discussions','HR Round Prep','Company-Specific Prep','Final Assessment']),''],
    ['CRS002','Software AI Training','AI/ML','12 Weeks','Intermediate',14999,4.9,189,1,'🤖','King Upadhyay','Master AI & Machine Learning from fundamentals to deployment.',json_encode(['Python for AI','Data Science Fundamentals','Machine Learning Algorithms','Deep Learning & Neural Nets','Natural Language Processing','Computer Vision','Model Deployment','Capstone AI Project']),''],
    ['CRS003','Full Stack Web Development','Web Dev','16 Weeks','Beginner',12999,4.7,312,1,'💻','Akash Dash','Build production-grade web applications from scratch.',json_encode(['HTML5 & CSS3 Mastery','JavaScript Deep Dive','React.js Frontend','Node.js & Express Backend','MongoDB & Databases','REST API Design','Authentication & Security','Deployment & DevOps']),''],
    ['CRS004','Guaranteed Job Program','Career','24 Weeks','All Levels',29999,4.9,156,1,'🎯','Monika Upadhyay','Our flagship program with 100% job guarantee.',json_encode(['Foundation Tech Skills','DSA & Problem Solving','Full Stack Development','AI/ML Essentials','System Design','Interview Mastery','Company Placement Drives','Career Mentorship']),''],
    ['CRS005','Resume Writing','Career','2 Weeks','Beginner',1999,4.6,520,1,'📝','Monika Upadhyay','Craft ATS-friendly resumes that get noticed.',json_encode(['Resume Fundamentals','ATS Optimization','Achievement Statements','Portfolio & Cover Letter','Review & Feedback']),''],
    ['CRS006','LinkedIn Optimization','Career','1 Week','Beginner',1499,4.5,430,1,'🔗','Vinay Prem Upadhyay','Transform your LinkedIn profile into a recruiter magnet.',json_encode(['Profile Overhaul','Headline & Summary','Content Strategy','Networking & Outreach','Analytics & Growth']),''],
];
foreach ($courses as $c) { $insertCourse->execute($c); }
echo "[OK] 6 courses seeded\n";

// Seed Jobs
$insertJob = $pdo->prepare("INSERT IGNORE INTO jobs (id,company,role,type,domain,location,stipend,skills,description) VALUES (?,?,?,?,?,?,?,?,?)");
$jobs = [
    ['JOB001','TCS','Software Developer Intern','Internship','Web Dev','Mumbai','15000/month',json_encode(['JavaScript','React','Node.js']),'6-month internship with TCS Digital team.'],
    ['JOB002','Infosys','AI/ML Engineer','Job','AI/ML','Bangalore','800000/year',json_encode(['Python','TensorFlow','NLP']),'Full-time role in Infosys AI lab.'],
    ['JOB003','Wipro','Full Stack Developer','Job','Web Dev','Hyderabad','650000/year',json_encode(['React','Node.js','MongoDB']),'Build and maintain full-stack web applications.'],
    ['JOB004','Cognizant','Data Analyst Intern','Internship','Data Science','Chennai','12000/month',json_encode(['Python','SQL','Power BI']),'3-month internship analyzing business data.'],
    ['JOB005','HCL Tech','Cloud Engineer','Job','Cloud','Noida','750000/year',json_encode(['AWS','Docker','Kubernetes']),'Manage cloud infrastructure and deploy scalable applications.'],
    ['JOB006','Offcampuscareer','Frontend Developer (Freelance)','Freelance','Web Dev','Remote','500/hour',json_encode(['HTML','CSS','JavaScript','Figma']),'Freelance opportunity to build landing pages.'],
];
foreach ($jobs as $j) { $insertJob->execute($j); }
echo "[OK] 6 jobs seeded\n";

// Seed Enrollments
$insertEnroll = $pdo->prepare("INSERT IGNORE INTO enrollments (id,student_id,course_id,progress,start_date,completed_modules,certificate_issued) VALUES (?,?,?,?,?,?,?)");
$enrollments = [
    ['ENR001','STU001','CRS001',75,'2025-01-20',json_encode(['Aptitude & Reasoning','Communication Skills','Resume Building','Mock Interviews']),0],
    ['ENR002','STU001','CRS003',40,'2025-02-01',json_encode(['HTML5 & CSS3 Mastery','JavaScript Deep Dive']),0],
    ['ENR003','STU002','CRS002',100,'2025-02-15',json_encode(['Python for AI','Data Science Fundamentals','Machine Learning Algorithms','Deep Learning & Neural Nets']),1],
    ['ENR004','STU002','CRS004',60,'2025-03-01',json_encode(['Foundation Tech Skills','DSA & Problem Solving']),0],
    ['ENR005','STU003','CRS003',25,'2025-03-10',json_encode(['HTML5 & CSS3 Mastery']),0],
    ['ENR006','STU004','CRS001',100,'2025-03-25',json_encode(['Aptitude & Reasoning','Communication Skills','Resume Building','Mock Interviews','Group Discussions','HR Round Prep','Company-Specific Prep','Final Assessment']),1],
    ['ENR007','STU004','CRS005',80,'2025-04-01',json_encode(['Resume Fundamentals','ATS Optimization','Achievement Statements']),0],
    ['ENR008','STU004','CRS006',100,'2025-04-10',json_encode(['Profile Overhaul','Headline & Summary','Content Strategy','Networking & Outreach','Analytics & Growth']),1],
];
foreach ($enrollments as $e) { $insertEnroll->execute($e); }
echo "[OK] 8 enrollments seeded\n";

// Seed Payments
$insertPay = $pdo->prepare("INSERT IGNORE INTO payments (id,student_id,course_id,amount,method,date,status,receipt_no) VALUES (?,?,?,?,?,?,?,?)");
$payments = [
    ['PAY001','STU001','CRS001',9999,'UPI','2025-01-20','Completed','OC2-R-001'],
    ['PAY002','STU001','CRS003',12999,'Card','2025-02-01','Completed','OC2-R-002'],
    ['PAY003','STU002','CRS002',14999,'UPI','2025-02-15','Completed','OC2-R-003'],
    ['PAY004','STU002','CRS004',29999,'Net Banking','2025-03-01','Completed','OC2-R-004'],
    ['PAY005','STU003','CRS003',12999,'UPI','2025-03-10','Completed','OC2-R-005'],
    ['PAY006','STU004','CRS001',9999,'Card','2025-03-25','Completed','OC2-R-006'],
    ['PAY007','STU004','CRS005',1999,'UPI','2025-04-01','Completed','OC2-R-007'],
    ['PAY008','STU004','CRS006',1499,'UPI','2025-04-10','Completed','OC2-R-008'],
];
foreach ($payments as $p) { $insertPay->execute($p); }
echo "[OK] 8 payments seeded\n";

// Seed Contacts
$insertContact = $pdo->prepare("INSERT IGNORE INTO contacts (id,name,email,phone,subject,message,date,is_read) VALUES (?,?,?,?,?,?,?,?)");
$contacts = [
    ['CON001','Rajesh Kumar','rajesh@example.com','9988776655','Course Inquiry','I want to know more about the Guaranteed Job Program.','2025-06-20',0],
    ['CON002','Priti Singh','priti@example.com','9988776656','Partnership','We are a college in UP and want to collaborate for campus placements.','2025-06-22',1],
];
foreach ($contacts as $c) { $insertContact->execute($c); }
echo "[OK] 2 contacts seeded\n";

$pdo->commit();

echo "\n[SUCCESS] MySQL database fully initialized and seeded!\n";
echo "\nDELETE this file now: rm /home/user/web/tip.offcampuscareer.com/public_html/api/setup_mysql.php\n";
echo "</pre>";
?>
