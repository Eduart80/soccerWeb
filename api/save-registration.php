<?php
header('Content-Type: application/json');
$allowed = ['https://eaglestarssc.com', 'https://www.eaglestarssc.com'];
$origin  = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON.']);
    exit;
}

require_once 'db.php';

$stmt = $link->prepare(
    'INSERT INTO contact_registrations
        (first_name, last_name, age, dob, parent_name, parent_phone, parent_email,
         player_level, preferred_days, preferred_time, assigned_coach, medical_notes, goals, waiver_accepted)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Query preparation failed.']);
    exit;
}

$first_name     = htmlspecialchars(trim($data['first_name'] ?? ''), ENT_QUOTES, 'UTF-8');
$last_name      = htmlspecialchars(trim($data['last_name'] ?? ''), ENT_QUOTES, 'UTF-8');
$age            = isset($data['age']) ? (int) $data['age'] : null;
$dob            = !empty($data['dob']) ? $data['dob'] : null;
$parent_name    = htmlspecialchars(trim($data['parent_name'] ?? ''), ENT_QUOTES, 'UTF-8');
$parent_phone   = htmlspecialchars(trim($data['parent_phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$parent_email   = filter_var(trim($data['parent_email'] ?? ''), FILTER_SANITIZE_EMAIL);
$level          = htmlspecialchars(trim($data['level'] ?? ''), ENT_QUOTES, 'UTF-8');
$preferred_days = htmlspecialchars(trim($data['preferred_days'] ?? ''), ENT_QUOTES, 'UTF-8');
$preferred_time = htmlspecialchars(trim($data['preferred_time'] ?? ''), ENT_QUOTES, 'UTF-8');
$assigned_coach = htmlspecialchars(trim($data['assigned_coach'] ?? ''), ENT_QUOTES, 'UTF-8');
$medical_notes  = htmlspecialchars(trim($data['medical_notes'] ?? ''), ENT_QUOTES, 'UTF-8');
$goals          = htmlspecialchars(trim($data['goals'] ?? ''), ENT_QUOTES, 'UTF-8');
$waiver         = ($data['waiver'] ?? 'No') === 'Yes' ? 'Yes' : 'No';

$stmt->bind_param(
    'ssisssssssssss',
    $first_name, $last_name, $age, $dob, $parent_name, $parent_phone,
    $parent_email, $level, $preferred_days, $preferred_time,
    $assigned_coach, $medical_notes, $goals, $waiver
);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save record.']);
}

$stmt->close();
$link->close();
