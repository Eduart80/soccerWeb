<?php
header('Content-Type: application/json');
$allowed = ['https://eaglestarssc.com', 'https://www.eaglestarssc.com'];
$origin  = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
// Must match COACH_TOKEN in schedule.js
define('COACH_TOKEN', 'eagles-coach-2026');

$token = isset($_GET['token']) ? $_GET['token'] : '';
if ($token !== COACH_TOKEN) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied.']);
    exit;
}

// ── DB ────────────────────────────────────────────────────────────────────────
require_once 'db.php';

$records = [];

// ── Registrations (contact_registrations) ────────────────────────────────────
$res = $link->query(
    "SELECT
        id,
        CONCAT(first_name, ' ', last_name) AS player_name,
        age,
        DATE_FORMAT(dob, '%Y-%m-%d')       AS dob,
        player_level,
        parent_name,
        parent_phone,
        parent_email,
        preferred_days,
        preferred_time,
        COALESCE(assigned_coach, '')        AS assigned_coach,
        medical_notes,
        goals,
        waiver_accepted,
        DATE_FORMAT(submitted_at, '%m/%d/%Y %H:%i:%s') AS submitted_at
     FROM contact_registrations
     ORDER BY submitted_at DESC"
);

if ($res) {
    while ($row = $res->fetch_assoc()) {
        $records[] = [
            '_sheet'         => 'Registrations',
            '_id'            => (int) $row['id'],
            '_table'         => 'contact_registrations',
            'Submitted At'   => $row['submitted_at'],
            'Player Name'    => $row['player_name'],
            'Age'            => (int) $row['age'],
            'Date of Birth'  => $row['dob'],
            'Level'          => $row['player_level'],
            'Parent Name'    => $row['parent_name'],
            'Parent Phone'   => $row['parent_phone'],
            'Parent Email'   => $row['parent_email'],
            'Preferred Days' => $row['preferred_days'],
            'Preferred Time' => $row['preferred_time'],
            'Assigned Coach' => $row['assigned_coach'],
            'Medical Notes'  => $row['medical_notes'],
            'Goals'          => $row['goals'],
            'Waiver'         => $row['waiver_accepted'],
        ];
    }
    $res->free();
}

// ── Tryouts (tryout_registrations) ───────────────────────────────────────────
$res = $link->query(
    "SELECT
        id,
        CONCAT(first_name, ' ', last_name) AS player_name,
        age,
        DATE_FORMAT(dob, '%Y-%m-%d')       AS dob,
        player_level,
        parent_name,
        parent_phone,
        parent_email,
        preferred_days,
        preferred_time,
        COALESCE(assigned_coach, '')        AS assigned_coach,
        referral,
        medical_notes,
        goals,
        waiver_accepted,
        DATE_FORMAT(submitted_at, '%m/%d/%Y %H:%i:%s') AS submitted_at
     FROM tryout_registrations
     ORDER BY submitted_at DESC"
);

if ($res) {
    while ($row = $res->fetch_assoc()) {
        $records[] = [
            '_sheet'         => 'Tryouts',
            '_id'            => (int) $row['id'],
            '_table'         => 'tryout_registrations',
            'Submitted At'   => $row['submitted_at'],
            'Player Name'    => $row['player_name'],
            'Age'            => (int) $row['age'],
            'Date of Birth'  => $row['dob'],
            'Level'          => $row['player_level'],
            'Parent Name'    => $row['parent_name'],
            'Parent Phone'   => $row['parent_phone'],
            'Parent Email'   => $row['parent_email'],
            'Preferred Days' => $row['preferred_days'],
            'Preferred Time' => $row['preferred_time'],
            'Assigned Coach' => $row['assigned_coach'],
            'Medical Notes'  => $row['medical_notes'],
            'Goals'          => $row['goals'],
            'Waiver'         => $row['waiver_accepted'],
        ];
    }
    $res->free();
}

$link->close();

echo json_encode(['status' => 'ok', 'data' => $records]);
