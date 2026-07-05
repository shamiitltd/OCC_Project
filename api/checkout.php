<?php
// api/checkout.php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $college = trim($input['college'] ?? '');
    $year = trim($input['year'] ?? '1st Year');
    $courseId = $input['courseId'] ?? '';
    $amount = intval($input['amount'] ?? 0);
    $method = $input['method'] ?? 'UPI';

    if (empty($name) || empty($email) || empty($courseId) || empty($amount)) {
        sendResponse(["error" => "Student name, email, course, and amount are required."], 400);
    }

    try {
        $pdo->beginTransaction();

        // 1. Check if student already exists
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = 'student'");
        $stmt->execute([$email]);
        $student = $stmt->fetch();

        if (!$student) {
            // Create student
            $studentId = generateId('STU');
            
            // Avatar initials
            $parts = explode(' ', $name);
            $initials = '';
            foreach ($parts as $p) {
                if (!empty($p)) $initials .= $p[0];
            }
            $avatar = strtoupper(substr($initials, 0, 2));
            
            $password = 'demo123'; // Default demo password
            
            $stmtInsert = $pdo->prepare("INSERT INTO users (id, name, email, password, phone, college, year, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, 'student', ?)");
            $stmtInsert->execute([$studentId, $name, $email, $password, $phone, $college, $year, $avatar]);
            
            // Refetch created student
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$studentId]);
            $student = $stmt->fetch();
        } else {
            $studentId = $student['id'];
        }

        // 2. Create enrollment (ignore if already enrolled)
        $enrollmentId = generateId('ENR');
        $startDate = date('Y-m-d');
        $completedModules = json_encode([]);
        
        $stmtEnroll = $pdo->prepare("INSERT IGNORE INTO enrollments (id, student_id, course_id, progress, start_date, completed_modules, certificate_issued) VALUES (?, ?, ?, 0, ?, ?, 0)");

        $stmtEnroll->execute([$enrollmentId, $studentId, $courseId, $startDate, $completedModules]);

        // 3. Create payment
        $paymentId = generateId('PAY');
        
        // Count payments to generate receipt number
        $payCount = $pdo->query("SELECT COUNT(*) FROM payments")->fetchColumn();
        $receiptNo = 'OC2-R-' . str_pad($payCount + 1, 3, '0', STR_PAD_LEFT);
        
        $stmtPay = $pdo->prepare("INSERT INTO payments (id, student_id, course_id, amount, method, date, status, receipt_no) VALUES (?, ?, ?, ?, ?, ?, 'Completed', ?)");
        $stmtPay->execute([$paymentId, $studentId, $courseId, $amount, $method, $startDate, $receiptNo]);

        // 4. Log the student in
        $_SESSION['session_type'] = 'student';
        $_SESSION['user_id'] = $studentId;

        $pdo->commit();

        sendResponse([
            "success" => true,
            "message" => "Enrollment and payment completed successfully!",
            "student" => [
                "id" => $studentId,
                "name" => $student['name'],
                "email" => $student['email']
            ],
            "payment" => [
                "receiptNo" => $receiptNo,
                "amount" => $amount,
                "method" => $method,
                "date" => $startDate
            ]
        ]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        sendResponse(["error" => "Checkout failed: " . $e->getMessage()], 500);
    }
} else {
    sendResponse(["error" => "Invalid request method."], 400);
}
?>
