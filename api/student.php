<?php
// api/student.php
require_once __DIR__ . '/db.php';

// Auth Check
if (!isset($_SESSION['user_id']) || $_SESSION['session_type'] !== 'student') {
    sendResponse(["error" => "Unauthorized access. Please login as student."], 401);
}

$studentId = $_SESSION['user_id'];
$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'dashboard') {
        // Fetch enrollments
        $stmt = $pdo->prepare("SELECT e.*, c.title, c.duration, c.modules, c.icon FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?");
        $stmt->execute([$studentId]);
        $enrollments = $stmt->fetchAll();
        
        // Parse modules and completed modules
        foreach ($enrollments as &$e) {
            $e['modules'] = json_decode($e['modules'], true) ?: [];
            $e['completed_modules'] = json_decode($e['completed_modules'], true) ?: [];
        }

        // Fetch upcoming classes
        $stmt = $pdo->prepare("SELECT cl.*, c.title as course_title FROM classes cl JOIN courses c ON cl.course_id = c.id WHERE cl.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?) ORDER BY cl.date ASC, cl.time ASC");
        $stmt->execute([$studentId]);
        $classes = $stmt->fetchAll();

        // Calculate KPIs
        $totalProgress = 0;
        $completedCount = 0;
        foreach ($enrollments as $e) {
            $totalProgress += $e['progress'];
            if ($e['progress'] === 100) {
                $completedCount++;
            }
        }
        $avgProgress = count($enrollments) > 0 ? round($totalProgress / count($enrollments)) : 0;

        sendResponse([
            "success" => true,
            "enrollments" => $enrollments,
            "classes" => array_slice($classes, 0, 3), // slice first 3
            "kpis" => [
                "enrolledCourses" => count($enrollments),
                "completed" => $completedCount,
                "avgProgress" => $avgProgress,
                "upcomingClasses" => count($classes)
            ]
        ]);

    } elseif ($action === 'courses') {
        $stmt = $pdo->prepare("SELECT e.*, c.title, c.duration, c.modules, c.icon, c.instructor, c.description, e.start_date FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?");
        $stmt->execute([$studentId]);
        $enrollments = $stmt->fetchAll();
        
        foreach ($enrollments as &$e) {
            $e['modules'] = json_decode($e['modules'], true) ?: [];
            $e['completed_modules'] = json_decode($e['completed_modules'], true) ?: [];
        }
        sendResponse($enrollments);

    } elseif ($action === 'classes') {
        $stmt = $pdo->prepare("SELECT cl.*, c.title as course_title FROM classes cl JOIN courses c ON cl.course_id = c.id WHERE cl.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?) ORDER BY cl.date ASC, cl.time ASC");
        $stmt->execute([$studentId]);
        $classes = $stmt->fetchAll();
        sendResponse($classes);

    } elseif ($action === 'assignments') {
        // Fetch assignments for student's enrolled courses
        $stmt = $pdo->prepare("SELECT a.*, c.title as course_title FROM assignments a JOIN courses c ON a.course_id = c.id WHERE a.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?)");
        $stmt->execute([$studentId]);
        $assignments = $stmt->fetchAll();

        // Fetch submissions for this student
        $stmt = $pdo->prepare("SELECT * FROM submissions WHERE student_id = ?");
        $stmt->execute([$studentId]);
        $submissions = $stmt->fetchAll();
        $subMap = [];
        foreach ($submissions as $sub) {
            $subMap[$sub['assignment_id']] = $sub;
        }

        foreach ($assignments as &$a) {
            $a['submission'] = $subMap[$a['id']] ?? null;
        }
        sendResponse($assignments);

    } elseif ($action === 'certificates') {
        $stmt = $pdo->prepare("SELECT e.*, c.title FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = ? AND e.certificate_issued = 1");
        $stmt->execute([$studentId]);
        $certs = $stmt->fetchAll();
        sendResponse($certs);

    } elseif ($action === 'payments') {
        $stmt = $pdo->prepare("SELECT p.*, c.title as course_title FROM payments p JOIN courses c ON p.course_id = c.id WHERE p.student_id = ?");
        $stmt->execute([$studentId]);
        $payments = $stmt->fetchAll();
        sendResponse($payments);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if ($action === 'submit_assignment') {
        $asgId = $input['assignmentId'] ?? '';
        $fileName = trim($input['fileName'] ?? '');

        if (empty($asgId) || empty($fileName)) {
            sendResponse(["error" => "Assignment ID and file name are required."], 400);
        }

        $id = generateId('SUB');
        $submittedAt = date('Y-m-d');

        try {
            $stmt = $pdo->prepare("INSERT INTO submissions (id, assignment_id, student_id, submitted_at, file_name) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$id, $asgId, $studentId, $submittedAt, $fileName]);
            sendResponse(["success" => true, "message" => "Assignment submitted successfully!"]);
        } catch (PDOException $e) {
            sendResponse(["error" => "Failed to submit assignment. You may have already submitted it."], 400);
        }

    } elseif ($action === 'update_profile') {
        $name = trim($input['name'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $college = trim($input['college'] ?? '');
        $year = trim($input['year'] ?? '');

        if (empty($name)) {
            sendResponse(["error" => "Name is required."], 400);
        }

        // Generate avatar initials
        $parts = explode(' ', $name);
        $initials = '';
        foreach ($parts as $p) {
            if (!empty($p)) $initials .= $p[0];
        }
        $avatar = strtoupper(substr($initials, 0, 2));

        $stmt = $pdo->prepare("UPDATE users SET name = ?, phone = ?, college = ?, year = ?, avatar = ? WHERE id = ?");
        $stmt->execute([$name, $phone, $college, $year, $avatar, $studentId]);

        sendResponse(["success" => true, "message" => "Profile updated successfully!"]);
    }
}

sendResponse(["error" => "Invalid request method or action."], 400);
?>
