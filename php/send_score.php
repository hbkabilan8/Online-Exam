<?php
// send_score.php
require_once 'config.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit();
}

$user_id = $_SESSION['user_id'];
$test_id = $data['testId'];
$test_name = $data['testName'];
$score = $data['score'];
$totalQuestions = $data['totalQuestions'];
$percentage = $data['percentage'];
$timeTaken = $data['timeTaken'];
$user_email = $data['email'];
$user_name = $_SESSION['user'] ?? 'User';

// Determine performance level
$performance = $percentage >= 70 ? 'Excellent' : ($percentage >= 50 ? 'Good' : 'Needs Improvement');

// Create email content
$to = $user_email;
$subject = "Your KnowledgeHub Test Score - $test_name";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: KnowledgeHub <support@knowledgehub.com>" . "\r\n";
$headers .= "Reply-To: support@knowledgehub.com" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Email content
$message = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 2.5rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        .logo span {
            color: #f72585;
        }
        .score-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            margin: 20px 0;
        }
        .score-circle {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: conic-gradient(#fff 0% " . round($percentage) . "%, rgba(255,255,255,0.3) " . round($percentage) . "% 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
        }
        .score-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: white;
        }
        .details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 30px 0;
        }
        .detail-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }
        .detail-label {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 5px;
        }
        .detail-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
        }
        .performance {
            text-align: center;
            padding: 15px;
            border-radius: 10px;
            background: " . ($percentage >= 70 ? '#4caf50' : ($percentage >= 50 ? '#ff9800' : '#f44336')) . ";
            color: white;
            font-weight: bold;
            font-size: 1.2rem;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #999;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <div class='logo'>KnowledgeHub<span>.</span></div>
            <h2>Your Test Results</h2>
        </div>
        
        <h3 style='text-align: center;'>$test_name</h3>
        
        <div class='score-box'>
            <div class='score-circle'>
                <div class='score-value'>" . round($percentage) . "%</div>
            </div>
        </div>
        
        <div class='details'>
            <div class='detail-item'>
                <div class='detail-label'>Score</div>
                <div class='detail-value'>$score/$totalQuestions</div>
            </div>
            <div class='detail-item'>
                <div class='detail-label'>Correct Answers</div>
                <div class='detail-value'>$score</div>
            </div>
            <div class='detail-item'>
                <div class='detail-label'>Time Taken</div>
                <div class='detail-value'>$timeTaken min</div>
            </div>
            <div class='detail-item'>
                <div class='detail-label'>Accuracy</div>
                <div class='detail-value'>" . round($percentage) . "%</div>
            </div>
        </div>
        
        <div class='performance'>
            Performance: $performance
        </div>
        
        <div style='text-align: center; margin-top: 30px;'>
            <a href='http://localhost/knowledgehub/test.html?test=$test_id' class='button'>Retry Test</a>
            <a href='http://localhost/knowledgehub/tests.html' class='button' style='background: #f72585;'>More Tests</a>
        </div>
        
        <div class='footer'>
            <p>Thank you for using KnowledgeHub!</p>
            <p>© 2024 KnowledgeHub. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Score sent to your email']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again.']);
}
?>