<?php
// api/db.php

// ── CORS Configuration ──────────────────────────────────────────────────────
$allowedOrigins = [
    'https://tip.offcampuscareer.com',
    'https://offcampuscareer.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (empty($origin)) {
    header("Access-Control-Allow-Origin: *");
} else {
    header("Access-Control-Allow-Origin: https://tip.offcampuscareer.com");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");

// Handle OPTIONS preflight requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── Secure Session Configuration ────────────────────────────────────────────
if (php_sapi_name() !== 'cli' && session_status() === PHP_SESSION_NONE) {
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
               || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)
               || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

    session_set_cookie_params([
        'lifetime' => 86400 * 7,
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_name('OCC_SESSION');
    session_start();
}

// ── Database Configuration ──────────────────────────────────────────────────
// Production MySQL credentials (HestiaCP VPS)
define('DB_HOST', 'localhost');
define('DB_NAME', 'user_tip');
define('DB_USER', 'user_tip');
define('DB_PASS', 'Cz7Ttut@Tqlh|/WR');
define('DB_CHARSET', 'utf8mb4');

// ── Database Connection ──────────────────────────────────────────────────────
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
    ]);
} catch (PDOException $e) {
    // Fallback to SQLite for local development
    $dbPath = __DIR__ . '/../db/offcampuscareer.db';
    $dbDir  = dirname($dbPath);
    if (!file_exists($dbDir)) {
        mkdir($dbDir, 0755, true);
    }
    try {
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec('PRAGMA journal_mode=WAL;');
        $pdo->exec('PRAGMA foreign_keys=ON;');
        define('DB_TYPE', 'sqlite');
    } catch (PDOException $e2) {
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed: " . $e2->getMessage()]);
        exit();
    }
}

if (!defined('DB_TYPE')) {
    define('DB_TYPE', 'mysql');
}

// ── Helper Functions ─────────────────────────────────────────────────────────
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function generateId($prefix) {
    return $prefix . strtoupper(bin2hex(random_bytes(6)));
}

// MySQL-compatible INSERT OR IGNORE helper
function insertIgnore($pdo, $table, $data) {
    $cols = implode(', ', array_keys($data));
    $placeholders = implode(', ', array_fill(0, count($data), '?'));
    $sql = "INSERT IGNORE INTO $table ($cols) VALUES ($placeholders)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_values($data));
    return $stmt;
}
?>

