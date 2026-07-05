<?php
// api/auth.php
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'login') {
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');
        $type = $input['type'] ?? 'student'; // 'student' or 'admin'
        
        if (empty($email) || empty($password)) {
            sendResponse(["error" => "Email and password are required."], 400);
        }
        
        // Find user by email and role
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = ?");
        $stmt->execute([$email, $type]);
        $user = $stmt->fetch();
        
        // Since seed passwords are plain text 'demo123' and 'admin123', we check directly
        if ($user && $user['password'] === $password) {
            $_SESSION['session_type'] = $type;
            $_SESSION['user_id'] = $user['id'];
            
            // Return user details without password
            unset($user['password']);
            sendResponse([
                "success" => true,
                "message" => "Logged in successfully.",
                "user" => $user
            ]);
        } else {
            sendResponse(["error" => "Invalid email or password."], 401);
        }
    } elseif ($action === 'signup') {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $college = trim($input['college'] ?? '');
        $year = trim($input['year'] ?? '3rd Year');

        if (empty($name) || empty($email) || empty($password)) {
            sendResponse(["error" => "Name, email, and password are required."], 400);
        }

        // Check if email already exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            sendResponse(["error" => "Email address is already registered."], 409);
        }

        $id = generateId('STU');
        $role = 'student';
        $avatar = strtoupper(substr($name, 0, 2));

        $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password, phone, college, year, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $name, $email, $password, $phone, $college, $year, $role, $avatar]);

        // Get user details
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        unset($user['password']);

        $_SESSION['session_type'] = $role;
        $_SESSION['user_id'] = $id;

        sendResponse([
            "success" => true,
            "message" => "Registered successfully.",
            "user" => $user
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'logout') {
        session_unset();
        session_destroy();
        sendResponse(["success" => true, "message" => "Logged out successfully."]);
    } elseif ($action === 'status') {
        if (isset($_SESSION['user_id']) && isset($_SESSION['session_type'])) {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch();
            if ($user) {
                unset($user['password']);
                sendResponse([
                    "loggedIn" => true,
                    "type" => $_SESSION['session_type'],
                    "user" => $user
                ]);
            }
        }
        sendResponse(["loggedIn" => false]);
    }
}

sendResponse(["error" => "Invalid request method or action."], 400);
?>
