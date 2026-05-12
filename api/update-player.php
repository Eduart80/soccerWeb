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

$COACH_TOKEN = 'eagles-coach-2026';
if (($data['token'] ?? '') !== $COACH_TOKEN) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Unauthorized.']);
    exit;
}

$id    = isset($data['id'])    ? (int) $data['id'] : 0;
$table = isset($data['table']) ? $data['table']     : '';

$allowed_tables = ['contact_registrations', 'tryout_registrations'];
if (!$id || !in_array($table, $allowed_tables, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid id or table.']);
    exit;
}

$preferred_days = htmlspecialchars(trim($data['preferred_days'] ?? ''), ENT_QUOTES, 'UTF-8');
$preferred_time = htmlspecialchars(trim($data['preferred_time'] ?? ''), ENT_QUOTES, 'UTF-8');
$level          = htmlspecialchars(trim($data['level']          ?? ''), ENT_QUOTES, 'UTF-8');
$medical_notes  = htmlspecialchars(trim($data['medical_notes']  ?? ''), ENT_QUOTES, 'UTF-8');
$goals          = htmlspecialchars(trim($data['goals']          ?? ''), ENT_QUOTES, 'UTF-8');

$stmt = $link->prepare(
    "UPDATE `$table` SET preferred_days=?, preferred_time=?, player_level=?, medical_notes=?, goals=? WHERE id=?"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Query preparation failed.']);
    exit;
}

$stmt->bind_param('sssssi', $preferred_days, $preferred_time, $level, $medical_notes, $goals, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to update record.']);
}

$stmt->close();
$link->close();
