<?php
require_once 'config.php';
require_once 'db_functions.php';

header('Content-Type: application/json');
session_start();

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_tests':
        $page = $_GET['page'] ?? 1;
        $perPage = $_GET['per_page'] ?? 12;
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        
        $result = getAllTests($page, $perPage, $category, $search);
        echo json_encode($result);
        break;
        
    case 'get_test':
        $testId = $_GET['id'] ?? 0;
        if ($testId) {
            $test = getTestById($testId);
            if ($test) {
                $test['questions'] = getTestQuestions($testId);
                echo json_encode(['success' => true, 'test' => $test]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Test not found']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid test ID']);
        }
        break;
        
    case 'submit_test':
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Please login first']);
            break;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['test_id'], $data['score'], $data['total_questions'], $data['answers'], $data['time_taken'])) {
            echo json_encode(['success' => false, 'error' => 'Invalid data']);
            break;
        }
        
        $result = saveTestResult(
            $_SESSION['user_id'],
            $data['test_id'],
            $data['score'],
            $data['total_questions'],
            $data['answers'],
            $data['time_taken']
        );
        
        echo json_encode($result);
        break;
        
    case 'get_user_history':
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Please login first']);
            break;
        }
        
        $limit = $_GET['limit'] ?? 10;
        $history = getUserTestHistory($_SESSION['user_id'], $limit);
        echo json_encode(['success' => true, 'history' => $history]);
        break;
        
    case 'get_user_progress':
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Please login first']);
            break;
        }
        
        $progress = getUserProgress($_SESSION['user_id']);
        echo json_encode(['success' => true, 'progress' => $progress]);
        break;
        
    case 'get_leaderboard':
        $testId = $_GET['test_id'] ?? 0;
        if ($testId) {
            $leaderboard = getTestLeaderboard($testId);
            echo json_encode(['success' => true, 'leaderboard' => $leaderboard]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid test ID']);
        }
        break;
        
    case 'get_categories':
        $categories = getAllCategories();
        echo json_encode(['success' => true, 'categories' => $categories]);
        break;
        
    case 'get_featured_tests':
        $limit = $_GET['limit'] ?? 6;
        $tests = getFeaturedTests($limit);
        echo json_encode(['success' => true, 'tests' => $tests]);
        break;
        
    case 'get_test_statistics':
        $testId = $_GET['test_id'] ?? 0;
        if ($testId) {
            $stats = getTestStatistics($testId);
            echo json_encode(['success' => true, 'statistics' => $stats]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid test ID']);
        }
        break;
        
    case 'check_test_taken':
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'Please login first']);
            break;
        }
        
        $testId = $_GET['test_id'] ?? 0;
        if ($testId) {
            $taken = hasUserTakenTest($_SESSION['user_id'], $testId);
            echo json_encode(['success' => true, 'taken' => $taken]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid test ID']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}
?>