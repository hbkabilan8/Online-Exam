<?php
include "config.php";

// Check if user is logged in
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit();
}

// Get JSON data from request
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit();
}

$user_id = $_SESSION['user_id'];
$test_id = $data['testId'];
$score = $data['score'];
$total_questions = $data['totalQuestions'];
$percentage = $data['percentage'];
$time_taken = $data['timeTaken'];

// Save test result to database
$query = "INSERT INTO user_tests (user_id, test_id, score, total_questions, percentage, time_taken) 
          VALUES ('$user_id', '$test_id', '$score', '$total_questions', '$percentage', '$time_taken')";

if (mysqli_query($conn, $query)) {
    // Get the inserted test result
    $result_id = mysqli_insert_id($conn);
    
    // Save individual answers to another table (if needed)
    if (isset($data['answers'])) {
        $answers = $data['answers'];
        // You would need to create an answers table and save each answer
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Test result saved successfully',
        'result_id' => $result_id
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save test result: ' . mysqli_error($conn)]);
}
?>