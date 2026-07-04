<?php
// api/db.php

// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start PHP session
if (php_sapi_name() !== 'cli' && session_status() === PHP_SESSION_NONE) {
    session_start();
}

$dbPath = __DIR__ . '/../db/offcampuscareer.db';
$dbDir = dirname($dbPath);

if (!file_exists($dbDir)) {
    mkdir($dbDir, 0777, true);
}

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

// Helper function to send JSON response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

// Helper to generate unique ID
function generateId($prefix) {
    return $prefix . strtoupper(bin2hex(random_bytes(6)));
}
?>
