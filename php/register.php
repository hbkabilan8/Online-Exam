<?php
include "config.php";

$name = $_POST['fullname'];
$email = $_POST['email'];
$pass = password_hash($_POST['password'], PASSWORD_DEFAULT);

// ✅ FIX: Use prepared statement (safe + gives real errors)
$stmt = $conn->prepare("INSERT INTO users(fullname, email, password) VALUES(?, ?, ?)");

if (!$stmt) {
    echo "error: " . $conn->error;
    exit;
}

$stmt->bind_param("sss", $name, $email, $pass);

if ($stmt->execute()) {
    echo "success";
} else {
    // Error code 1062 = duplicate entry (email already exists)
    if ($conn->errno == 1062) {
        echo "duplicate";
    } else {
        echo "error: " . $stmt->error;
    }
}
?>