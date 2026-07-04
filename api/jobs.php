<?php
// api/jobs.php
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'list') {
        $stmt = $pdo->query("SELECT * FROM jobs ORDER BY id DESC");
        $jobs = $stmt->fetchAll();

        $studentId = $_SESSION['user_id'] ?? null;
        $sessionType = $_SESSION['session_type'] ?? null;

        // If a student is logged in, attach their application status
        $appliedMap = [];
        if ($studentId && $sessionType === 'student') {
            $stmtApp = $pdo->prepare("SELECT job_id, status, match_score, match_explanation FROM applications WHERE student_id = ?");
            $stmtApp->execute([$studentId]);
            $apps = $stmtApp->fetchAll();
            foreach ($apps as $a) {
                $appliedMap[$a['job_id']] = [
                    "applied" => true,
                    "status" => $a['status'],
                    "matchScore" => $a['match_score'],
                    "matchExplanation" => $a['match_explanation']
                ];
            }
        }

        foreach ($jobs as &$j) {
            $j['skills'] = json_decode($j['skills'], true) ?: [];
            $j['application'] = $appliedMap[$j['id']] ?? ["applied" => false];
        }

        sendResponse($jobs);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'apply') {
        // Auth check
        if (!isset($_SESSION['user_id']) || $_SESSION['session_type'] !== 'student') {
            sendResponse(["error" => "Unauthorized. Please login as student to apply."], 401);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $jobId = $input['jobId'] ?? '';
        $resumeFile = trim($input['resumeFile'] ?? '');

        if (empty($jobId) || empty($resumeFile)) {
            sendResponse(["error" => "Job ID and resume file are required."], 400);
        }

        $studentId = $_SESSION['user_id'];
        
        // Define resume path
        $resumeDir = __DIR__ . '/../resumes';
        if (!file_exists($resumeDir)) {
            mkdir($resumeDir, 0777, true);
        }
        $resumePath = $resumeDir . '/' . basename($resumeFile);

        // Run python screening script
        $dbPath = __DIR__ . '/../db/offcampuscareer.db';
        $pyScript = __DIR__ . '/../ai/screening.py';

        // Prepare cmd
        $cmd = "python " . escapeshellarg($pyScript) . " --db " . escapeshellarg($dbPath) . " --resume " . escapeshellarg($resumePath) . " --job_id " . escapeshellarg($jobId);
        
        $output = shell_exec($cmd);
        $screenResult = json_decode($output, true);

        $matchScore = 35;
        $matchExplanation = "AI Screening failed to execute. Base score assigned.";
        
        if ($screenResult && isset($screenResult['match_score'])) {
            $matchScore = intval($screenResult['match_score']);
            $matchExplanation = $screenResult['match_explanation'];
        }

        $appId = generateId('APP');
        $appliedAt = date('Y-m-d');

        try {
            $stmt = $pdo->prepare("INSERT INTO applications (id, job_id, student_id, applied_at, status, resume_url, match_score, match_explanation) VALUES (?, ?, ?, ?, 'Under Review', ?, ?, ?)");
            $stmt->execute([$appId, $jobId, $studentId, $appliedAt, $resumeFile, $matchScore, $matchExplanation]);
            
            sendResponse([
                "success" => true,
                "message" => "Application submitted successfully!",
                "screening" => [
                    "matchScore" => $matchScore,
                    "matchExplanation" => $matchExplanation
                ]
            ]);
        } catch (PDOException $e) {
            sendResponse(["error" => "You have already applied to this job."], 400);
        }
    }
}

sendResponse(["error" => "Invalid request method or action."], 400);
?>
