<?php
include "config.php";

$email = $_POST['email'];
$pass = $_POST['password'];

// ✅ FIX: Use prepared statement
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows == 1) {
    $row = $res->fetch_assoc();
    if (password_verify($pass, $row['password'])) {
        $_SESSION['user'] = $row['fullname'];
        $_SESSION['user_id'] = $row['id'];
        echo "success";
    } else {
        echo "wrong";
    }
} else {
    echo "wrong";
}
?>