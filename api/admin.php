<?php
// api/admin.php
require_once __DIR__ . '/db.php';

// Auth Check
if (!isset($_SESSION['user_id']) || $_SESSION['session_type'] !== 'admin') {
    sendResponse(["error" => "Unauthorized access. Please login as admin."], 401);
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'dashboard') {
        // Total students
        $stuCount = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
        // Active courses
        $courseCount = $pdo->query("SELECT COUNT(*) FROM courses WHERE published = 1")->fetchColumn();
        // Total revenue
        $revenue = $pdo->query("SELECT SUM(amount) FROM payments WHERE status = 'Completed'")->fetchColumn() ?: 0;
        
        // Recent Enrollments
        $stmt = $pdo->query("SELECT e.*, u.name as student_name, c.title as course_title FROM enrollments e JOIN users u ON e.student_id = u.id JOIN courses c ON e.course_id = c.id ORDER BY e.start_date DESC LIMIT 5");
        $recentEnrollments = $stmt->fetchAll();

        // Chart enrollment trend (count per month)
        // Group by month from start_date
        $chartData = [
            "Jan" => 2, "Feb" => 3, "Mar" => 1, "Apr" => 3, "May" => 2, "Jun" => 1
        ];

        sendResponse([
            "success" => true,
            "kpis" => [
                "totalStudents" => $stuCount,
                "activeCourses" => $courseCount,
                "totalRevenue" => (int)$revenue,
                "placementRate" => 95
            ],
            "recentEnrollments" => $recentEnrollments,
            "chart" => $chartData
        ]);

    } elseif ($action === 'students') {
        $stmt = $pdo->query("SELECT * FROM users WHERE role = 'student' ORDER BY created_at DESC");
        $students = $stmt->fetchAll();
        
        // Get enrolled courses count for each student
        $stmtEnroll = $pdo->prepare("SELECT student_id, COUNT(*) as count FROM enrollments GROUP BY student_id");
        $stmtEnroll->execute();
        $enrollCounts = $stmtEnroll->fetchAll(PDO::FETCH_KEY_PAIR);

        foreach ($students as &$s) {
            unset($s['password']);
            $s['enrolledCoursesCount'] = $enrollCounts[$s['id']] ?? 0;
        }
        sendResponse($students);

    } elseif ($action === 'courses') {
        $stmt = $pdo->query("SELECT * FROM courses ORDER BY id DESC");
        $courses = $stmt->fetchAll();
        
        // Count enrollments for each course
        $stmtEnroll = $pdo->prepare("SELECT course_id, COUNT(*) as count FROM enrollments GROUP BY course_id");
        $stmtEnroll->execute();
        $enrollCounts = $stmtEnroll->fetchAll(PDO::FETCH_KEY_PAIR);

        foreach ($courses as &$c) {
            $c['enrolled'] = $enrollCounts[$c['id']] ?? 0;
            $c['modules'] = json_decode($c['modules'], true) ?: [];
        }
        sendResponse($courses);

    } elseif ($action === 'classes') {
        $stmt = $pdo->query("SELECT cl.*, c.title as course_title FROM classes cl JOIN courses c ON cl.course_id = c.id ORDER BY cl.date DESC, cl.time DESC");
        $classes = $stmt->fetchAll();
        foreach ($classes as &$cl) {
            $cl['attendees'] = json_decode($cl['attendees'], true) ?: [];
        }
        sendResponse($classes);

    } elseif ($action === 'assignments') {
        $stmt = $pdo->query("SELECT a.*, c.title as course_title FROM assignments a JOIN courses c ON a.course_id = c.id ORDER BY a.id DESC");
        $assignments = $stmt->fetchAll();

        // Get submissions for each assignment
        foreach ($assignments as &$a) {
            $stmtSub = $pdo->prepare("SELECT s.*, u.name as student_name FROM submissions s JOIN users u ON s.student_id = u.id WHERE s.assignment_id = ?");
            $stmtSub->execute([$a['id']]);
            $a['submissions'] = $stmtSub->fetchAll();
        }
        sendResponse($assignments);

    } elseif ($action === 'payments') {
        $payments = $pdo->query("SELECT p.*, u.name as student_name, c.title as course_title FROM payments p JOIN users u ON p.student_id = u.id JOIN courses c ON p.course_id = c.id ORDER BY p.date DESC")->fetchAll();
        sendResponse($payments);

    } elseif ($action === 'jobs') {
        $jobs = $pdo->query("SELECT * FROM jobs ORDER BY id DESC")->fetchAll();
        
        foreach ($jobs as &$j) {
            $j['skills'] = json_decode($j['skills'], true) ?: [];
            
            // Fetch applications for this job
            $stmtApp = $pdo->prepare("SELECT a.*, u.name as student_name, u.email as student_email FROM applications a JOIN users u ON a.student_id = u.id WHERE a.job_id = ?");
            $stmtApp->execute([$j['id']]);
            $j['applications'] = $stmtApp->fetchAll();
        }
        sendResponse($jobs);

    } elseif ($action === 'contacts') {
        $contacts = $pdo->query("SELECT * FROM contacts ORDER BY date DESC")->fetchAll();
        sendResponse($contacts);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if ($action === 'add_student') {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $college = trim($input['college'] ?? '');
        $year = trim($input['year'] ?? '1st Year');

        if (empty($name) || empty($email)) {
            sendResponse(["error" => "Name and Email are required."], 400);
        }

        // Initials for avatar
        $parts = explode(' ', $name);
        $initials = '';
        foreach ($parts as $p) {
            if (!empty($p)) $initials .= $p[0];
        }
        $avatar = strtoupper(substr($initials, 0, 2));
        
        $id = generateId('STU');
        $password = 'demo123'; // Default demo password
        
        try {
            $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password, phone, college, year, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, 'student', ?)");
            $stmt->execute([$id, $name, $email, $password, $phone, $college, $year, $avatar]);
            sendResponse(["success" => true, "message" => "Student added successfully!"]);
        } catch (PDOException $e) {
            sendResponse(["error" => "Failed to add student. Email may already be registered."], 400);
        }

    } elseif ($action === 'delete_student') {
        $studentId = $input['studentId'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ? AND role = 'student'");
        $stmt->execute([$studentId]);
        sendResponse(["success" => true, "message" => "Student deleted successfully."]);

    } elseif ($action === 'add_course') {
        $title = trim($input['title'] ?? '');
        $category = trim($input['category'] ?? 'Career');
        $duration = trim($input['duration'] ?? '');
        $level = trim($input['level'] ?? 'Beginner');
        $price = intval($input['price'] ?? 0);
        $instructor = trim($input['instructor'] ?? '');
        $description = trim($input['description'] ?? '');

        if (empty($title) || empty($price)) {
            sendResponse(["error" => "Title and Price are required."], 400);
        }

        $id = generateId('CRS');
        $icon = '📦';
        $modules = json_encode([]);

        $stmt = $pdo->prepare("INSERT INTO courses (id, title, category, duration, level, price, icon, instructor, description, modules) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $title, $category, $duration, $level, $price, $icon, $instructor, $description, $modules]);
        
        sendResponse(["success" => true, "message" => "Course added successfully!"]);

    } elseif ($action === 'toggle_publish') {
        $courseId = $input['courseId'] ?? '';
        $stmt = $pdo->prepare("SELECT published FROM courses WHERE id = ?");
        $stmt->execute([$courseId]);
        $published = $stmt->fetchColumn();
        
        $newStatus = $published ? 0 : 1;
        $stmtUpdate = $pdo->prepare("UPDATE courses SET published = ? WHERE id = ?");
        $stmtUpdate->execute([$newStatus, $courseId]);
        
        sendResponse(["success" => true, "message" => "Course visibility toggled successfully."]);

    } elseif ($action === 'delete_course') {
        $courseId = $input['courseId'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM courses WHERE id = ?");
        $stmt->execute([$courseId]);
        sendResponse(["success" => true, "message" => "Course deleted successfully."]);

    } elseif ($action === 'add_class') {
        $courseId = $input['courseId'] ?? '';
        $title = trim($input['title'] ?? '');
        $date = $input['date'] ?? '';
        $time = trim($input['time'] ?? '');
        $instructor = trim($input['instructor'] ?? '');
        $meetingLink = trim($input['meetingLink'] ?? '');

        if (empty($courseId) || empty($title) || empty($date)) {
            sendResponse(["error" => "Course, Title and Date are required."], 400);
        }

        $id = generateId('CLS');
        $attendees = json_encode([]);

        $stmt = $pdo->prepare("INSERT INTO classes (id, course_id, title, date, time, instructor, meeting_link, attendees) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $courseId, $title, $date, $time, $instructor, $meetingLink, $attendees]);
        sendResponse(["success" => true, "message" => "Class scheduled successfully!"]);

    } elseif ($action === 'add_assignment') {
        $courseId = $input['courseId'] ?? '';
        $title = trim($input['title'] ?? '');
        $dueDate = $input['dueDate'] ?? '';
        $description = trim($input['description'] ?? '');

        if (empty($courseId) || empty($title) || empty($dueDate)) {
            sendResponse(["error" => "Course, Title and Due Date are required."], 400);
        }

        $id = generateId('ASG');
        $stmt = $pdo->prepare("INSERT INTO assignments (id, course_id, title, due_date, description) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$id, $courseId, $title, $dueDate, $description]);
        sendResponse(["success" => true, "message" => "Assignment created successfully!"]);

    } elseif ($action === 'add_job') {
        $company = trim($input['company'] ?? '');
        $role = trim($input['role'] ?? '');
        $type = $input['type'] ?? 'Job';
        $domain = trim($input['domain'] ?? '');
        $location = trim($input['location'] ?? '');
        $stipend = trim($input['stipend'] ?? '');
        $skillsText = trim($input['skills'] ?? '');
        $description = trim($input['description'] ?? '');

        if (empty($company) || empty($role)) {
            sendResponse(["error" => "Company and Role are required."], 400);
        }

        // Split comma-separated skills
        $skills = array_filter(array_map('trim', explode(',', $skillsText)));
        $skillsJson = json_encode(array_values($skills));
        
        $id = generateId('JOB');
        
        $stmt = $pdo->prepare("INSERT INTO jobs (id, company, role, type, domain, location, stipend, skills, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $company, $role, $type, $domain, $location, $stipend, $skillsJson, $description]);
        sendResponse(["success" => true, "message" => "Job posted successfully!"]);
    }
}

sendResponse(["error" => "Invalid request method or action."], 400);
?>
