<?php
// Database connection function
function getDatabaseConnection() {
    static $conn = null;
    
    if ($conn === null) {
        $host = 'localhost';
        $username = 'knowledgehub_user';
        $password = 'SecurePassword123!';
        $database = 'online_exam';
        
        $conn = new mysqli($host, $username, $password, $database);
        
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        
        $conn->set_charset("utf8mb4");
    }
    
    return $conn;
}

// Sanitize input
function sanitizeInput($input) {
    $conn = getDatabaseConnection();
    return mysqli_real_escape_string($conn, htmlspecialchars(trim($input)));
}

// Get all tests with pagination
function getAllTests($page = 1, $perPage = 12, $category = null, $search = null) {
    $conn = getDatabaseConnection();
    $offset = ($page - 1) * $perPage;
    
    $query = "SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
              FROM tests t
              JOIN categories c ON t.category_id = c.id
              WHERE t.is_active = 1";
    
    $params = [];
    $types = "";
    
    if ($category) {
        $query .= " AND c.slug = ?";
        $params[] = $category;
        $types .= "s";
    }
    
    if ($search) {
        $query .= " AND (t.name LIKE ? OR t.description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $types .= "ss";
    }
    
    $query .= " ORDER BY t.is_featured DESC, t.created_at DESC
                LIMIT ? OFFSET ?";
    
    $params[] = $perPage;
    $params[] = $offset;
    $types .= "ii";
    
    $stmt = $conn->prepare($query);
    
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $tests = [];
    while ($row = $result->fetch_assoc()) {
        $tests[] = $row;
    }
    
    // Get total count for pagination
    $countQuery = "SELECT COUNT(*) as total FROM tests t
                   JOIN categories c ON t.category_id = c.id
                   WHERE t.is_active = 1";
    
    if ($category) {
        $countQuery .= " AND c.slug = '$category'";
    }
    
    if ($search) {
        $countQuery .= " AND (t.name LIKE '%$search%' OR t.description LIKE '%$search%')";
    }
    
    $countResult = $conn->query($countQuery);
    $total = $countResult->fetch_assoc()['total'];
    
    return [
        'tests' => $tests,
        'total' => $total,
        'pages' => ceil($total / $perPage)
    ];
}

// Get test by ID
function getTestById($testId) {
    $conn = getDatabaseConnection();
    
    $query = "SELECT t.*, c.name as category_name, c.icon as category_icon, 
                     c.color as category_color, c.description as category_description
              FROM tests t
              JOIN categories c ON t.category_id = c.id
              WHERE t.id = ? AND t.is_active = 1";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $testId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_assoc();
}

// Get test questions with options
function getTestQuestions($testId) {
    $conn = getDatabaseConnection();
    
    $query = "SELECT q.*, 
                     GROUP_CONCAT(
                         JSON_OBJECT(
                             'id', o.id,
                             'text', o.option_text,
                             'is_correct', o.is_correct,
                             'order', o.sort_order
                         )
                     ) as options_json
              FROM questions q
              LEFT JOIN options o ON q.id = o.question_id
              WHERE q.test_id = ? AND q.is_active = 1
              GROUP BY q.id
              ORDER BY q.sort_order ASC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $testId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $row['options'] = json_decode('[' . $row['options_json'] . ']', true);
        unset($row['options_json']);
        $questions[] = $row;
    }
    
    return $questions;
}

// Save test result
function saveTestResult($userId, $testId, $score, $totalQuestions, $answers, $timeTaken) {
    $conn = getDatabaseConnection();
    
    // Calculate percentage
    $percentage = ($score / $totalQuestions) * 100;
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Save test attempt
        $query = "INSERT INTO user_tests (user_id, test_id, score, total_questions, 
                  correct_answers, wrong_answers, percentage, time_taken_seconds, status, completed_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', NOW())";
        
        $wrongAnswers = $totalQuestions - $score;
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iiiiddii", $userId, $testId, $score, $totalQuestions, 
                         $score, $wrongAnswers, $percentage, $timeTaken);
        $stmt->execute();
        $attemptId = $stmt->insert_id;
        
        // Save individual answers
        $answerQuery = "INSERT INTO user_answers (user_test_id, question_id, option_id, is_correct, marks_obtained)
                        VALUES (?, ?, ?, ?, ?)";
        
        $answerStmt = $conn->prepare($answerQuery);
        
        foreach ($answers as $answer) {
            $isCorrect = $answer['is_correct'] ? 1 : 0;
            $marks = $answer['is_correct'] ? 1.00 : 0.00;
            
            $answerStmt->bind_param("iiiid", $attemptId, $answer['question_id'], 
                                   $answer['option_id'], $isCorrect, $marks);
            $answerStmt->execute();
        }
        
        // Commit transaction
        $conn->commit();
        
        return [
            'success' => true,
            'attempt_id' => $attemptId,
            'score' => $score,
            'percentage' => $percentage
        ];
        
    } catch (Exception $e) {
        $conn->rollback();
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}

// Get user test history
function getUserTestHistory($userId, $limit = 10) {
    $conn = getDatabaseConnection();
    
    $query = "SELECT ut.*, t.name as test_name, c.name as category_name,
                     c.color as category_color
              FROM user_tests ut
              JOIN tests t ON ut.test_id = t.id
              JOIN categories c ON t.category_id = c.id
              WHERE ut.user_id = ? AND ut.status = 'completed'
              ORDER BY ut.completed_at DESC
              LIMIT ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $userId, $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $history = [];
    while ($row = $result->fetch_assoc()) {
        $history[] = $row;
    }
    
    return $history;
}

// Get user progress
function getUserProgress($userId) {
    $conn = getDatabaseConnection();
    
    $query = "SELECT up.*, t.name as test_name, c.name as category_name,
                     t.total_questions, t.duration_minutes
              FROM user_progress up
              JOIN tests t ON up.test_id = t.id
              JOIN categories c ON t.category_id = c.id
              WHERE up.user_id = ?
              ORDER BY up.updated_at DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $progress = [];
    while ($row = $result->fetch_assoc()) {
        $progress[] = $row;
    }
    
    return $progress;
}

// Get leaderboard for test
function getTestLeaderboard($testId, $limit = 10) {
    $conn = getDatabaseConnection();
    
    $query = "SELECT l.*, u.fullname, u.email
              FROM leaderboard l
              JOIN users u ON l.user_id = u.id
              WHERE l.test_id = ?
              ORDER BY l.rank_position ASC
              LIMIT ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $testId, $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $leaderboard = [];
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = $row;
    }
    
    return $leaderboard;
}

// Get all categories
function getAllCategories() {
    $conn = getDatabaseConnection();
    
    $query = "SELECT c.*, COUNT(t.id) as test_count
              FROM categories c
              LEFT JOIN tests t ON c.id = t.category_id AND t.is_active = 1
              WHERE c.is_active = 1
              GROUP BY c.id
              ORDER BY c.sort_order ASC";
    
    $result = $conn->query($query);
    
    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
    
    return $categories;
}

// Get featured tests
function getFeaturedTests($limit = 6) {
    $conn = getDatabaseConnection();
    
    $query = "SELECT t.*, c.name as category_name, c.icon as category_icon,
                     c.color as category_color
              FROM tests t
              JOIN categories c ON t.category_id = c.id
              WHERE t.is_active = 1 AND t.is_featured = 1
              ORDER BY t.created_at DESC
              LIMIT ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $tests = [];
    while ($row = $result->fetch_assoc()) {
        $tests[] = $row;
    }
    
    return $tests;
}

// Check if user has taken test
function hasUserTakenTest($userId, $testId) {
    $conn = getDatabaseConnection();
    
    $query = "SELECT COUNT(*) as count
              FROM user_tests
              WHERE user_id = ? AND test_id = ? AND status = 'completed'";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $userId, $testId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    return $row['count'] > 0;
}

// Get test statistics
function getTestStatistics($testId) {
    $conn = getDatabaseConnection();
    
    $query = "SELECT 
                COUNT(DISTINCT ut.user_id) as total_users,
                COUNT(ut.id) as total_attempts,
                AVG(ut.percentage) as average_score,
                MAX(ut.percentage) as highest_score,
                MIN(ut.percentage) as lowest_score
              FROM user_tests ut
              WHERE ut.test_id = ? AND ut.status = 'completed'";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $testId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_assoc();
}

// Close database connection
function closeDatabaseConnection() {
    $conn = getDatabaseConnection();
    if ($conn) {
        $conn->close();
    }
}
?>