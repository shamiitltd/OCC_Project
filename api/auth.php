<?php
// api/auth.php
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($action === 'login') {
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');
        $type = $input['type'] ?? 'student';
        
        if (empty($email) || empty($password)) {
            sendResponse(["error" => "Email and password are required."], 400);
        }
        
        // Find user by email (automatically detect role)
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        // Support both legacy plain text and hashed passwords
        if ($user && ($user['password'] === $password || password_verify($password, $user['password']))) {
            $type = $user['role'];
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
    } elseif ($action === 'register') {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $type = trim($input['type'] ?? 'student'); // 'student', 'mentor', 'corporate', 'institute'
        
        if (empty($name) || empty($email) || empty($password)) {
            sendResponse(["error" => "Name, email, and password are required."], 400);
        }
        
        // Check if email already registered
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            sendResponse(["error" => "Email is already registered."], 400);
        }
        
        // Determine ID prefix
        $prefix = 'STU';
        if ($type === 'corporate') $prefix = 'CRP';
        elseif ($type === 'mentor') $prefix = 'MNT';
        elseif ($type === 'admin') $prefix = 'ADM';
        elseif ($type === 'institute') $prefix = 'INS';
        $id = generateId($prefix);
        
        // Securely hash password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Generate avatar initials
        $parts = array_filter(explode(' ', $name));
        $initials = '';
        foreach ($parts as $p) {
            $initials .= $p[0];
        }
        $avatar = strtoupper(substr($initials, 0, 2)) ?: 'U';
        
        // Mapping detail fields to standard columns
        $college = '';
        if ($type === 'student') {
            $college = $input['college'] ?? '';
        } elseif ($type === 'corporate') {
            $college = $input['company'] ?? '';
        } elseif ($type === 'mentor') {
            $college = $input['title'] ?? '';
        }
        
        $year = $type === 'student' ? ($input['year'] ?? '1st Year') : 'N/A';
        
        try {
            $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password, phone, college, year, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $name, $email, $hashedPassword, $phone, $college, $year, $type, $avatar]);
            
            $_SESSION['session_type'] = $type;
            $_SESSION['user_id'] = $id;
            
            $stmtSelect = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmtSelect->execute([$id]);
            $user = $stmtSelect->fetch();
            unset($user['password']);
            
            sendResponse([
                "success" => true,
                "message" => "Account created successfully.",
                "user" => $user
            ]);
        } catch (PDOException $e) {
            sendResponse(["error" => "Registration failed: " . $e->getMessage()], 500);
        }
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
                exit();
            }
        }
        sendResponse(["loggedIn" => false]);
    }
}

sendResponse(["error" => "Invalid request method or action."], 400);
?>
