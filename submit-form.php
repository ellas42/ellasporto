<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$company = isset($_POST['company']) ? trim($_POST['company']) : '';
$projectType = isset($_POST['projectType']) ? trim($_POST['projectType']) : '';
$budget = isset($_POST['budget']) ? trim($_POST['budget']) : '';
$timeline = isset($_POST['timeline']) ? trim($_POST['timeline']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (empty($projectType)) {
    $errors[] = 'Project type is required';
}

if (empty($message)) {
    $errors[] = 'Project details are required';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit();
}

// Email configuration
$to = 'your-email@example.com'; // Change this to your email address
$subject = 'New Client Application: ' . $projectType;

// Email body
$emailBody = "New Client Application Received\n\n";
$emailBody .= "Name: $name\n";
$emailBody .= "Email: $email\n";
$emailBody .= "Company: " . ($company ? $company : 'Not provided') . "\n";
$emailBody .= "Project Type: $projectType\n";
$emailBody .= "Budget Range: " . ($budget ? $budget : 'Not specified') . "\n";
$emailBody .= "Timeline: " . ($timeline ? $timeline : 'Not specified') . "\n\n";
$emailBody .= "Project Details:\n$message\n";

// Email headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mailSent = mail($to, $subject, $emailBody, $headers);

if ($mailSent) {
    // Optionally save to a file or database
    $logEntry = date('Y-m-d H:i:s') . " - New application from: $name ($email) - Project: $projectType\n";
    file_put_contents('applications.log', $logEntry, FILE_APPEND);
    
    echo json_encode([
        'success' => true,
        'message' => 'Application submitted successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please try again later.'
    ]);
}
?>

