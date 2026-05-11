<?php
header('Content-Type: application/json');
$allowed = ['https://eaglestarssc.com', 'https://www.eaglestarssc.com'];
$origin  = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

$token = $data['token'] ?? '';
if ($token !== 'eagles-coach-2026') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Access denied.']);
    exit;
}

$id = isset($data['id']) ? (int) $data['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid ID.']);
    exit;
}

require_once 'db.php';

// Copy the tryout row into contact_registrations, then delete it
$stmt = $link->prepare(
    "INSERT INTO contact_registrations
        (first_name, last_name, age, dob, parent_name, parent_phone, parent_email,
         player_level, preferred_days, preferred_time, assigned_coach, medical_notes, goals, waiver_accepted)
     SELECT first_name, last_name, age, dob, parent_name, parent_phone, parent_email,
            player_level, preferred_days, preferred_time, assigned_coach, medical_notes, goals, waiver_accepted
     FROM tryout_registrations WHERE id = ?"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Query preparation failed.']);
    exit;
}

$stmt->bind_param('i', $id);
if (!$stmt->execute() || $stmt->affected_rows === 0) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Tryout record not found or copy failed.']);
    $stmt->close();
    $link->close();
    exit;
}
$stmt->close();

// Remove from tryouts
$del = $link->prepare("DELETE FROM tryout_registrations WHERE id = ?");
$del->bind_param('i', $id);
$del->execute();
$del->close();

$link->close();

echo json_encode(['success' => true]);
