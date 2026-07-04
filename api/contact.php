<?php
// api/contact.php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $subject = trim($input['subject'] ?? '');
    $message = trim($input['message'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        sendResponse(["error" => "Name, email, and message are required."], 400);
    }

    $id = generateId('CON');
    $date = date('Y-m-d');

    try {
        $stmt = $pdo->prepare("INSERT INTO contacts (id, name, email, phone, subject, message, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $name, $email, $phone, $subject, $message, $date]);
        sendResponse(["success" => true, "message" => "Message sent successfully! We will contact you soon."]);
    } catch (PDOException $e) {
        sendResponse(["error" => "Failed to save contact message: " . $e->getMessage()], 500);
    }
}

sendResponse(["error" => "Invalid request method."], 400);
?>
