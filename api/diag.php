<?php
// Diagnostic script — remove after troubleshooting!
header('Content-Type: text/plain');
echo "=== PHP Environment ===\n";
echo "PHP Version: " . PHP_VERSION . "\n";
echo "Server Software: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'unknown') . "\n";
echo "Running as user: " . (function_exists('posix_getpwuid') ? posix_getpwuid(posix_geteuid())['name'] : 'unknown') . "\n\n";

echo "=== Extensions ===\n";
echo "PDO: " . (extension_loaded('pdo') ? 'YES' : 'NO') . "\n";
echo "PDO_MySQL: " . (extension_loaded('pdo_mysql') ? 'YES' : 'NO') . "\n";
echo "PDO_SQLite: " . (extension_loaded('pdo_sqlite') ? 'YES' : 'NO') . "\n";
echo "SQLite3: " . (extension_loaded('sqlite3') ? 'YES' : 'NO') . "\n\n";

echo "=== File Paths ===\n";
$dbPath = __DIR__ . '/../db/offcampuscareer.db';
echo "SQLite DB Path: $dbPath\n";
echo "SQLite DB Exists: " . (file_exists($dbPath) ? 'YES' : 'NO') . "\n";
echo "SQLite DB Readable: " . (is_readable($dbPath) ? 'YES' : 'NO') . "\n";
echo "SQLite DB Writable: " . (is_writable($dbPath) ? 'YES' : 'NO') . "\n";
$dbDir = dirname($dbPath);
echo "DB Dir Writable: " . (is_writable($dbDir) ? 'YES' : 'NO') . "\n\n";

echo "=== MySQL Connection Test ===\n";
try {
    $pdo = new PDO('mysql:host=localhost;dbname=user_tip;charset=utf8mb4', 'user_tip', 'Cz7Ttut@Tqlh|/WR');
    echo "MySQL Connection: SUCCESS\n";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables: " . implode(', ', $tables) . "\n";
} catch (Exception $e) {
    echo "MySQL Connection: FAILED\n";
    echo "MySQL Error: " . $e->getMessage() . "\n\n";
}

echo "=== SQLite Connection Test ===\n";
try {
    $pdo2 = new PDO('sqlite:' . $dbPath);
    $count = $pdo2->query("SELECT COUNT(*) FROM users")->fetchColumn();
    echo "SQLite Connection: SUCCESS\n";
    echo "Users in SQLite DB: $count\n";
} catch (Exception $e) {
    echo "SQLite Connection: FAILED\n";
    echo "SQLite Error: " . $e->getMessage() . "\n";
}

echo "\n=== Apache/PHP Configuration ===\n";
echo "display_errors: " . ini_get('display_errors') . "\n";
echo "error_log: " . ini_get('error_log') . "\n";
echo "document_root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'n/a') . "\n";
echo "AllowOverride: Check apache config\n";
?>
