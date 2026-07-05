<?php
// api/init_db.php
// ⚠️  Run ONCE to initialize and seed the database.
// ⚠️  DELETE this file from server immediately after running!

require_once __DIR__ . '/db.php';

set_time_limit(120);
$isHtml = (php_sapi_name() !== 'cli');

function out($msg) {
    global $isHtml;
    echo $isHtml ? "$msg<br>\n" : "$msg\n";
}

out("<h2>Offcampuscareer — Database Initialization</h2>");

try {
    // ── 1. Create Tables ────────────────────────────────────────────────────
    $schemaSql = file_get_contents(__DIR__ . '/../db/mysql-schema.sql');

    // MySQL PDO doesn't support multi-statement exec() unless emulation is on
    // Split on semicolons and execute each statement
    $statements = array_filter(
        array_map('trim', explode(';', $schemaSql)),
        fn($s) => !empty($s) && !preg_match('/^(--|SET\s+NAMES|SET\s+foreign_key)/i', $s)
    );

    foreach ($statements as $stmt) {
        if (!empty(trim($stmt))) {
            $pdo->exec($stmt);
        }
    }
    out("✅ Database tables created successfully.");

    // ── 2. Check if already seeded ──────────────────────────────────────────
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($userCount > 0) {
        out("ℹ️ Database is already seeded ($userCount users found). Skipping.");
        sendResponse(["success" => true, "message" => "Database already initialized."]);
        exit();
    }

    $pdo->beginTransaction();

    // ── 3. Seed Users ───────────────────────────────────────────────────────
    $insertUser = $pdo->prepare(
        "INSERT INTO users (id, name, email, password, phone, college, year, role, avatar, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $students = [
        ['STU001', 'Rahul Sharma',   'rahul@demo.com',  'demo123', '9876543210', 'IIT Delhi',         '3rd Year', 'student', 'RS', '2025-01-15'],
        ['STU002', 'Priya Patel',    'priya@demo.com',  'demo123', '9876543211', 'NIT Trichy',         '4th Year', 'student', 'PP', '2025-02-10'],
        ['STU003', 'Amit Kumar',     'amit@demo.com',   'demo123', '9876543212', 'BITS Pilani',        '2nd Year', 'student', 'AK', '2025-03-05'],
        ['STU004', 'Sneha Gupta',    'sneha@demo.com',  'demo123', '9876543213', 'VIT Vellore',        '4th Year', 'student', 'SG', '2025-03-20'],
        ['STU005', 'Vikram Singh',   'vikram@demo.com', 'demo123', '9876543214', 'DTU Delhi',          '3rd Year', 'student', 'VS', '2025-04-01'],
        ['STU006', 'Anjali Verma',   'anjali@demo.com', 'demo123', '9876543215', 'IIIT Hyderabad',     '2nd Year', 'student', 'AV', '2025-04-15'],
        ['STU007', 'Rohan Joshi',    'rohan@demo.com',  'demo123', '9876543216', 'SRM Chennai',        '3rd Year', 'student', 'RJ', '2025-05-01'],
        ['STU008', 'Kavita Reddy',   'kavita@demo.com', 'demo123', '9876543217', 'LNMIIT Jaipur',      '4th Year', 'student', 'KR', '2025-05-15'],
        ['STU009', 'Deepak Mishra',  'deepak@demo.com', 'demo123', '9876543218', 'NIT Rourkela',       '2nd Year', 'student', 'DM', '2025-06-01'],
        ['STU010', 'Neha Agarwal',   'neha@demo.com',   'demo123', '9876543219', 'KIIT Bhubaneswar',   '3rd Year', 'student', 'NA', '2025-06-10'],
        ['ADMIN',  'Admin User',     'admin@oc2.in',    'admin123','0000000000', 'OCC Headquarters',   'N/A',      'admin',   'AD', '2025-01-01'],
    ];

    foreach ($students as $s) {
        $insertUser->execute($s);
    }
    out("✅ Users seeded (10 students + 1 admin).");

    // ── 4. Seed Courses ─────────────────────────────────────────────────────
    $insertCourse = $pdo->prepare(
        "INSERT INTO courses (id, title, category, duration, level, price, rating, enrolled, published, icon, instructor, description, modules, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $courses = [
        [
            'CRS001', 'Job Bootcamp', 'Career', '8 Weeks', 'Beginner', 9999, 4.8, 245, 1, '🚀', 'Vinay Prem Upadhyay',
            'Intensive bootcamp covering aptitude, interview prep, group discussions, and personality development to make you job-ready in 8 weeks.',
            json_encode(['Aptitude & Reasoning', 'Communication Skills', 'Resume Building', 'Mock Interviews', 'Group Discussions', 'HR Round Prep', 'Company-Specific Prep', 'Final Assessment']), ''
        ],
        [
            'CRS002', 'Software AI Training', 'AI/ML', '12 Weeks', 'Intermediate', 14999, 4.9, 189, 1, '🤖', 'King Upadhyay',
            'Master AI & Machine Learning from fundamentals to deployment. Covers Python, TensorFlow, NLP, Computer Vision, and real-world AI projects.',
            json_encode(['Python for AI', 'Data Science Fundamentals', 'Machine Learning Algorithms', 'Deep Learning & Neural Nets', 'Natural Language Processing', 'Computer Vision', 'Model Deployment', 'Capstone AI Project']), ''
        ],
        [
            'CRS003', 'Full Stack Web Development', 'Web Dev', '16 Weeks', 'Beginner', 12999, 4.7, 312, 1, '💻', 'Akash Dash',
            'Build production-grade web applications from scratch. HTML, CSS, JavaScript, React, Node.js, MongoDB, and deployment to cloud.',
            json_encode(['HTML5 & CSS3 Mastery', 'JavaScript Deep Dive', 'React.js Frontend', 'Node.js & Express Backend', 'MongoDB & Databases', 'REST API Design', 'Authentication & Security', 'Deployment & DevOps']), ''
        ],
        [
            'CRS004', 'Guaranteed Job Program', 'Career', '24 Weeks', 'All Levels', 29999, 4.9, 156, 1, '🎯', 'Monika Upadhyay',
            "Our flagship program — complete tech training + placement assistance with a job guarantee. If you don't get placed, get 100% refund.",
            json_encode(['Foundation Tech Skills', 'DSA & Problem Solving', 'Full Stack Development', 'AI/ML Essentials', 'System Design', 'Interview Mastery', 'Company Placement Drives', 'Career Mentorship']), ''
        ],
        [
            'CRS005', 'Resume Writing', 'Career', '2 Weeks', 'Beginner', 1999, 4.6, 520, 1, '📝', 'Monika Upadhyay',
            'Craft ATS-friendly resumes that get noticed. Learn formatting, keyword optimization, achievement quantification, and cover letter writing.',
            json_encode(['Resume Fundamentals', 'ATS Optimization', 'Achievement Statements', 'Portfolio & Cover Letter', 'Review & Feedback']), ''
        ],
        [
            'CRS006', 'LinkedIn Optimization', 'Career', '1 Week', 'Beginner', 1499, 4.5, 430, 1, '🔗', 'Vinay Prem Upadhyay',
            'Transform your LinkedIn profile into a recruiter magnet. Profile optimization, content strategy, networking techniques, and personal branding.',
            json_encode(['Profile Overhaul', 'Headline & Summary', 'Content Strategy', 'Networking & Outreach', 'Analytics & Growth']), ''
        ],
    ];

    foreach ($courses as $c) {
        $insertCourse->execute($c);
    }
    out("✅ Courses seeded (6 courses).");

    // ── 5. Seed Enrollments ─────────────────────────────────────────────────
    $insertEnroll = $pdo->prepare(
        "INSERT IGNORE INTO enrollments (id, student_id, course_id, progress, start_date, completed_modules, certificate_issued)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    $enrollments = [
        ['ENR001', 'STU001', 'CRS001',  75, '2025-01-20', json_encode(['Aptitude & Reasoning', 'Communication Skills', 'Resume Building', 'Mock Interviews', 'Group Discussions', 'HR Round Prep']), 0],
        ['ENR002', 'STU001', 'CRS003',  40, '2025-02-01', json_encode(['HTML5 & CSS3 Mastery', 'JavaScript Deep Dive', 'React.js Frontend']), 0],
        ['ENR003', 'STU002', 'CRS002', 100, '2025-02-15', json_encode(['Python for AI', 'Data Science Fundamentals', 'Machine Learning Algorithms', 'Deep Learning & Neural Nets', 'Natural Language Processing', 'Computer Vision', 'Model Deployment', 'Capstone AI Project']), 1],
        ['ENR004', 'STU002', 'CRS004',  60, '2025-03-01', json_encode(['Foundation Tech Skills', 'DSA & Problem Solving', 'Full Stack Development', 'AI/ML Essentials']), 0],
        ['ENR005', 'STU003', 'CRS003',  25, '2025-03-10', json_encode(['HTML5 & CSS3 Mastery', 'JavaScript Deep Dive']), 0],
        ['ENR006', 'STU004', 'CRS001', 100, '2025-03-25', json_encode(['Aptitude & Reasoning', 'Communication Skills', 'Resume Building', 'Mock Interviews', 'Group Discussions', 'HR Round Prep', 'Company-Specific Prep', 'Final Assessment']), 1],
        ['ENR007', 'STU004', 'CRS005',  80, '2025-04-01', json_encode(['Resume Fundamentals', 'ATS Optimization', 'Achievement Statements', 'Portfolio & Cover Letter']), 0],
        ['ENR008', 'STU004', 'CRS006', 100, '2025-04-10', json_encode(['Profile Overhaul', 'Headline & Summary', 'Content Strategy', 'Networking & Outreach', 'Analytics & Growth']), 1],
    ];

    foreach ($enrollments as $e) {
        $insertEnroll->execute($e);
    }
    out("✅ Enrollments seeded (8 records).");

    // ── 6. Seed Classes ─────────────────────────────────────────────────────
    $insertClass = $pdo->prepare(
        "INSERT INTO classes (id, course_id, title, date, time, instructor, meeting_link, attendees)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $classes = [
        ['CLS001', 'CRS001', 'Aptitude Masterclass',   '2026-07-10', '10:00 AM', 'Vinay Prem Upadhyay', 'https://meet.google.com/abc-defg-hij', json_encode(['STU001', 'STU004', 'STU007', 'STU010'])],
        ['CLS002', 'CRS002', 'Deep Learning Workshop', '2026-07-11', '2:00 PM',  'King Upadhyay',       'https://meet.google.com/klm-nopq-rst', json_encode(['STU002', 'STU005', 'STU007'])],
        ['CLS003', 'CRS003', 'React.js Live Coding',   '2026-07-12', '11:00 AM', 'Akash Dash',          'https://meet.google.com/uvw-xyza-bcd', json_encode(['STU001', 'STU003', 'STU008'])],
        ['CLS004', 'CRS004', 'System Design Basics',   '2026-07-13', '4:00 PM',  'Monika Upadhyay',     'https://meet.google.com/efg-hijk-lmn', json_encode(['STU002', 'STU006', 'STU010'])],
        ['CLS005', 'CRS005', 'ATS Resume Workshop',    '2026-07-14', '10:00 AM', 'Monika Upadhyay',     'https://meet.google.com/opq-rstu-vwx', json_encode(['STU004', 'STU008'])],
    ];

    foreach ($classes as $cl) {
        $insertClass->execute($cl);
    }
    out("✅ Classes seeded (5 classes).");

    // ── 7. Seed Assignments ─────────────────────────────────────────────────
    $insertAsg = $pdo->prepare(
        "INSERT INTO assignments (id, course_id, title, due_date, description) VALUES (?, ?, ?, ?, ?)"
    );

    $assignments = [
        ['ASG001', 'CRS001', 'Mock Interview Recording', '2026-07-20', 'Record a 10-minute mock interview and upload the video link.'],
        ['ASG002', 'CRS002', 'Build a CNN Classifier',   '2026-07-25', 'Build a CNN model to classify CIFAR-10 images with >85% accuracy.'],
        ['ASG003', 'CRS003', 'Full Stack Todo App',      '2026-07-30', 'Build a complete Todo app with React frontend and Node.js backend.'],
        ['ASG004', 'CRS004', 'System Design Document',   '2026-08-05', 'Design a scalable URL shortener. Include architecture diagram, DB schema, and API design.'],
    ];

    foreach ($assignments as $asg) {
        $insertAsg->execute($asg);
    }
    out("✅ Assignments seeded (4 assignments).");

    // ── 8. Seed Submissions ─────────────────────────────────────────────────
    $insertSub = $pdo->prepare(
        "INSERT IGNORE INTO submissions (id, assignment_id, student_id, submitted_at, file_name, grade) VALUES (?, ?, ?, ?, ?, ?)"
    );

    $submissions = [
        ['SUB001', 'ASG001', 'STU001', '2026-07-15', 'mock_interview_rahul.mp4',  85],
        ['SUB002', 'ASG001', 'STU004', '2026-07-17', 'mock_interview_sneha.mp4',  92],
        ['SUB003', 'ASG002', 'STU002', '2026-07-22', 'cnn_classifier_priya.ipynb',95],
    ];

    foreach ($submissions as $sub) {
        $insertSub->execute($sub);
    }
    out("✅ Submissions seeded (3 records).");

    // ── 9. Seed Jobs ────────────────────────────────────────────────────────
    $insertJob = $pdo->prepare(
        "INSERT INTO jobs (id, company, role, type, domain, location, stipend, skills, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $jobs = [
        ['JOB001', 'TCS',            'Software Developer Intern',    'Internship', 'Web Dev',      'Mumbai',    '₹15,000/month',    json_encode(['JavaScript','React','Node.js','HTML','CSS']),          '6-month internship with TCS Digital team. Work on enterprise web applications.'],
        ['JOB002', 'Infosys',        'AI/ML Engineer',               'Job',        'AI/ML',        'Bangalore', '₹8,00,000/year',   json_encode(['Python','TensorFlow','NLP','Machine Learning','Deep Learning']), 'Full-time role in Infosys AI lab. Develop ML models for enterprise solutions.'],
        ['JOB003', 'Wipro',          'Full Stack Developer',         'Job',        'Web Dev',      'Hyderabad', '₹6,50,000/year',   json_encode(['React','Node.js','MongoDB','JavaScript','SQL']),        'Build and maintain full-stack web applications for global clients.'],
        ['JOB004', 'Cognizant',      'Data Analyst Intern',          'Internship', 'Data Science', 'Chennai',   '₹12,000/month',    json_encode(['Python','SQL','Excel','Power BI']),                    '3-month internship analyzing business data and creating dashboards.'],
        ['JOB005', 'HCL Tech',       'Cloud Engineer',               'Job',        'Cloud',        'Noida',     '₹7,50,000/year',   json_encode(['AWS','Docker','Kubernetes','Linux']),                  'Manage cloud infrastructure and deploy scalable applications.'],
        ['JOB006', 'Offcampuscareer','Frontend Developer (Freelance)','Freelance',  'Web Dev',     'Remote',    '₹500/hour',        json_encode(['HTML','CSS','JavaScript','Figma']),                    'Freelance opportunity to build landing pages and UI components.'],
    ];

    foreach ($jobs as $j) {
        $insertJob->execute($j);
    }
    out("✅ Jobs seeded (6 jobs).");

    // ── 10. Seed Payments ────────────────────────────────────────────────────
    $insertPay = $pdo->prepare(
        "INSERT INTO payments (id, student_id, course_id, amount, method, date, status, receipt_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $payments = [
        ['PAY001', 'STU001', 'CRS001',  9999, 'UPI',         '2025-01-20', 'Completed', 'OC2-R-001'],
        ['PAY002', 'STU001', 'CRS003', 12999, 'Card',        '2025-02-01', 'Completed', 'OC2-R-002'],
        ['PAY003', 'STU002', 'CRS002', 14999, 'UPI',         '2025-02-15', 'Completed', 'OC2-R-003'],
        ['PAY004', 'STU002', 'CRS004', 29999, 'Net Banking', '2025-03-01', 'Completed', 'OC2-R-004'],
        ['PAY005', 'STU003', 'CRS003', 12999, 'UPI',         '2025-03-10', 'Completed', 'OC2-R-005'],
        ['PAY006', 'STU004', 'CRS001',  9999, 'Card',        '2025-03-25', 'Completed', 'OC2-R-006'],
        ['PAY007', 'STU004', 'CRS005',  1999, 'UPI',         '2025-04-01', 'Completed', 'OC2-R-007'],
        ['PAY008', 'STU004', 'CRS006',  1499, 'UPI',         '2025-04-10', 'Completed', 'OC2-R-008'],
    ];

    foreach ($payments as $p) {
        $insertPay->execute($p);
    }
    out("✅ Payments seeded (8 records).");

    // ── 11. Seed Contacts ────────────────────────────────────────────────────
    $insertContact = $pdo->prepare(
        "INSERT INTO contacts (id, name, email, phone, subject, message, date, is_read) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $contacts = [
        ['CON001', 'Rajesh Kumar', 'rajesh@example.com', '9988776655', 'Course Inquiry',  'I want to know more about the Guaranteed Job Program. What is the refund policy?', '2025-06-20', 0],
        ['CON002', 'Priti Singh',  'priti@example.com',  '9988776656', 'Partnership',     'We are a college in UP and want to collaborate for campus placements.',             '2025-06-22', 1],
    ];

    foreach ($contacts as $c) {
        $insertContact->execute($c);
    }
    out("✅ Contacts seeded (2 records).");

    $pdo->commit();

    out("<br><strong>🎉 Database successfully initialized and seeded!</strong>");
    out("<br>⚠️ <strong>IMPORTANT: Delete this file (init_db.php) from the server now for security!</strong>");

    sendResponse([
        "success" => true,
        "message" => "Database successfully initialized and seeded.",
        "tables"  => ["users", "courses", "enrollments", "classes", "assignments", "submissions", "jobs", "applications", "contacts", "payments"],
        "counts"  => ["users" => 11, "courses" => 6, "enrollments" => 8, "jobs" => 6, "payments" => 8]
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    out("<strong>❌ Error:</strong> " . htmlspecialchars($e->getMessage()));
    echo json_encode(["error" => "Database initialization failed: " . $e->getMessage()]);
    exit();
}
?>
