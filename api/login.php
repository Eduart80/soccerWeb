<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
$entered = $data['password'] ?? '';

$credentials_file = dirname($_SERVER['DOCUMENT_ROOT']) . '/db-credentials.php';
if (file_exists($credentials_file)) {
    require $credentials_file;
}
$correct = $coach_password ?? '';

if ($correct === '' || $entered !== $correct) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Invalid password.']);
    exit;
}

$_SESSION['coach_auth'] = true;
echo json_encode(['success' => true]);
