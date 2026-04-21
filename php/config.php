<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'knowledgehub_user');
define('DB_PASS', 'SecurePassword123!');
define('DB_NAME', 'online_exam');

// Site configuration
define('SITE_NAME', 'KnowledgeHub');
define('SITE_URL', 'http://localhost/knowledgehub');
define('SITE_EMAIL', 'support@knowledgehub.com');

// Security
define('SECRET_KEY', 'your-secret-key-here-change-in-production');
define('PASSWORD_HASH_COST', 12);

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 in production with HTTPS

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1); // Set to 0 in production

// Timezone
date_default_timezone_set('UTC');

// ✅ FIX: Create $conn directly so all files that include config.php can use it
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$conn->set_charset("utf8mb4");

// Also keep getConnection() for files that use it (db_functions.php)
function getConnection() {
    global $conn;
    return $conn;
}

// Start session safely (avoids "already started" warning)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>