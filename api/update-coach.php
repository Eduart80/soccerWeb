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

$id    = isset($data['id'])    ? (int) $data['id']                              : 0;
$table = isset($data['table']) ? $data['table']                                 : '';
$coach = isset($data['coach']) ? htmlspecialchars(trim($data['coach']), ENT_QUOTES, 'UTF-8') : '';

$allowed_tables = ['contact_registrations', 'tryout_registrations'];
if ($id <= 0 || !in_array($table, $allowed_tables)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request.']);
    exit;
}

require_once 'db.php';

$stmt = $link->prepare("UPDATE `$table` SET assigned_coach = ? WHERE id = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Query preparation failed.']);
    exit;
}

$stmt->bind_param('si', $coach, $id);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to update.']);
}

$stmt->close();
$link->close();
