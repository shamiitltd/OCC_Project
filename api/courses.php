<?php
// api/courses.php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $courseId = $_GET['id'] ?? '';
    
    if ($courseId) {
        $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ? AND published = 1");
        $stmt->execute([$courseId]);
        $course = $stmt->fetch();
        if ($course) {
            $course['modules'] = json_decode($course['modules'], true) ?: [];
            sendResponse($course);
        } else {
            sendResponse(["error" => "Course not found."], 404);
        }
    } else {
        $stmt = $pdo->query("SELECT * FROM courses WHERE published = 1 ORDER BY id ASC");
        $courses = $stmt->fetchAll();
        foreach ($courses as &$c) {
            $c['modules'] = json_decode($c['modules'], true) ?: [];
        }
        sendResponse($courses);
    }
} else {
    sendResponse(["error" => "Invalid request method."], 400);
}
?>
