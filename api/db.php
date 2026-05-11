<?php
// Credentials are loaded from a file ABOVE the web root so they are never
// reachable via HTTP. On Ionos the web root is typically /httpdocs/ — place
// db-credentials.php one level up at /db-credentials.php (see below).
$credentials_file = dirname($_SERVER['DOCUMENT_ROOT']) . '/db-credentials.php';

if (!file_exists($credentials_file)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server configuration error.']);
    exit;
}

require $credentials_file;
// After require, $host_name, $database, $user_name and $password are defined.

$link = new mysqli($host_name, $user_name, $password, $database);

if ($link->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
    exit;
}

$link->set_charset('utf8mb4');
