-- Create Database
CREATE DATABASE IF NOT EXISTS online_exam;
USE online_exam;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) DEFAULT NULL,
    bio TEXT,
    role ENUM('student', 'admin', 'instructor') DEFAULT 'student',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(100) DEFAULT NULL,
    reset_token VARCHAR(100) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL,
    last_login DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'fa-folder',
    color VARCHAR(7) DEFAULT '#4361ee',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active)
);

-- Tests Table
CREATE TABLE IF NOT EXISTS tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    instructions TEXT,
    total_questions INT NOT NULL DEFAULT 10,
    duration_minutes INT NOT NULL DEFAULT 60,
    difficulty ENUM('easy', 'intermediate', 'advanced') DEFAULT 'intermediate',
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    is_free BOOLEAN DEFAULT TRUE,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    attempts_count INT DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category_id (category_id),
    INDEX idx_slug (slug),
    INDEX idx_difficulty (difficulty),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_created_at (created_at)
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('single_choice', 'multiple_choice', 'true_false', 'short_answer') DEFAULT 'single_choice',
    explanation TEXT,
    marks DECIMAL(5,2) DEFAULT 1.00,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_test_id (test_id),
    INDEX idx_question_type (question_type),
    INDEX idx_sort_order (sort_order)
);

-- Options Table
CREATE TABLE IF NOT EXISTS options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_question_id (question_id),
    INDEX idx_is_correct (is_correct)
);

-- User Tests Table (Test Attempts)
CREATE TABLE IF NOT EXISTS user_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0.00,
    total_questions INT NOT NULL,
    correct_answers INT DEFAULT 0,
    wrong_answers INT DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    time_taken_seconds INT DEFAULT 0,
    status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'completed',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_test_id (test_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_user_test (user_id, test_id, created_at)
);

-- User Answers Table
CREATE TABLE IF NOT EXISTS user_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_test_id INT NOT NULL,
    question_id INT NOT NULL,
    option_id INT DEFAULT NULL,
    answer_text TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    marks_obtained DECIMAL(5,2) DEFAULT 0.00,
    time_taken_seconds INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_test_id) REFERENCES user_tests(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE SET NULL,
    INDEX idx_user_test_id (user_test_id),
    INDEX idx_question_id (question_id),
    INDEX idx_is_correct (is_correct)
);

-- Test Reviews Table
CREATE TABLE IF NOT EXISTS test_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_test_id (test_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_user_test_review (user_id, test_id)
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    last_attempt_id INT DEFAULT NULL,
    best_score DECIMAL(5,2) DEFAULT 0.00,
    best_percentage DECIMAL(5,2) DEFAULT 0.00,
    attempts_count INT DEFAULT 0,
    total_time_spent INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    FOREIGN KEY (last_attempt_id) REFERENCES user_tests(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_test_id (test_id),
    INDEX idx_is_completed (is_completed),
    UNIQUE KEY unique_user_test_progress (user_id, test_id)
);

-- Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_test_id (test_id),
    UNIQUE KEY unique_user_test_bookmark (user_id, test_id)
);

-- Leaderboard Table
CREATE TABLE IF NOT EXISTS leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0.00,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    time_taken_seconds INT DEFAULT 0,
    rank_position INT DEFAULT 0,
    week_number INT,
    month_number INT,
    year_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_test_id (test_id),
    INDEX idx_score (score DESC),
    INDEX idx_rank_position (rank_position),
    INDEX idx_week (week_number, year_number),
    INDEX idx_month (month_number, year_number)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('test_completed', 'test_created', 'score_improvement', 'system', 'promotional') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Transactions Table (for paid tests)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_gateway VARCHAR(50),
    gateway_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_test_id (test_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'integer', 'boolean', 'json', 'array') DEFAULT 'string',
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key),
    INDEX idx_category (category)
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Insert Default Categories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Programming', 'programming', 'Programming languages, frameworks, and development tools', 'fa-code', '#4361ee', 1),
('General Knowledge', 'general-knowledge', 'General knowledge about various subjects', 'fa-globe', '#4cc9f0', 2),
('Current Affairs', 'current-affairs', 'Latest news and current events', 'fa-newspaper', '#f72585', 3),
('Certification', 'certification', 'Professional certification preparation tests', 'fa-certificate', '#ff9e00', 4),
('Language', 'language', 'Language learning and proficiency tests', 'fa-language', '#7209b7', 5),
('Aptitude', 'aptitude', 'Aptitude and reasoning tests', 'fa-brain', '#3a0ca3', 6),
('Science', 'science', 'Science and technology tests', 'fa-flask', '#38b000', 7),
('Mathematics', 'mathematics', 'Mathematics and statistics tests', 'fa-calculator', '#ff0054', 8),
('Business', 'business', 'Business and management tests', 'fa-briefcase', '#0077b6', 9),
('Creative Arts', 'creative-arts', 'Art, design, and creative tests', 'fa-palette', '#ff5400', 10);

-- Insert Sample Tests (150+ tests)
INSERT INTO tests (category_id, name, slug, description, total_questions, duration_minutes, difficulty, is_featured) VALUES
-- Programming Category (30 tests)
(1, 'JavaScript Fundamentals', 'javascript-fundamentals', 'Master the basics of JavaScript programming language', 50, 60, 'easy', TRUE),
(1, 'Advanced JavaScript', 'advanced-javascript', 'Deep dive into advanced JavaScript concepts', 60, 90, 'advanced', TRUE),
(1, 'Python Programming', 'python-programming', 'Learn Python from basics to advanced topics', 45, 75, 'intermediate', TRUE),
(1, 'Python for Data Science', 'python-data-science', 'Python programming for data analysis and visualization', 55, 90, 'advanced', FALSE),
(1, 'Java Core Concepts', 'java-core-concepts', 'Fundamental Java programming concepts', 50, 80, 'intermediate', TRUE),
(1, 'Java Spring Framework', 'java-spring-framework', 'Master Spring Framework for Java applications', 60, 120, 'advanced', FALSE),
(1, 'C++ Programming', 'cplusplus-programming', 'Learn C++ programming language', 40, 60, 'intermediate', FALSE),
(1, 'C# and .NET', 'csharp-dotnet', 'C# programming with .NET framework', 50, 75, 'intermediate', FALSE),
(1, 'PHP Web Development', 'php-web-development', 'PHP for server-side web development', 45, 60, 'easy', FALSE),
(1, 'React.js Fundamentals', 'reactjs-fundamentals', 'Learn React.js for frontend development', 50, 75, 'intermediate', TRUE),
(1, 'React.js Advanced', 'reactjs-advanced', 'Advanced React.js patterns and best practices', 55, 90, 'advanced', FALSE),
(1, 'Vue.js Mastery', 'vuejs-mastery', 'Complete Vue.js framework guide', 45, 70, 'intermediate', FALSE),
(1, 'Angular Framework', 'angular-framework', 'Learn Angular for enterprise applications', 60, 100, 'advanced', FALSE),
(1, 'Node.js Backend', 'nodejs-backend', 'Node.js for server-side development', 50, 80, 'intermediate', TRUE),
(1, 'Express.js API Development', 'expressjs-api-development', 'Build RESTful APIs with Express.js', 40, 60, 'intermediate', FALSE),
(1, 'MongoDB Database', 'mongodb-database', 'NoSQL database with MongoDB', 35, 50, 'easy', FALSE),
(1, 'MySQL Database Design', 'mysql-database-design', 'Relational database design with MySQL', 45, 70, 'intermediate', FALSE),
(1, 'PostgreSQL Advanced', 'postgresql-advanced', 'Advanced PostgreSQL features and optimization', 50, 80, 'advanced', FALSE),
(1, 'Docker Containers', 'docker-containers', 'Containerization with Docker', 40, 60, 'intermediate', TRUE),
(1, 'Kubernetes Orchestration', 'kubernetes-orchestration', 'Container orchestration with Kubernetes', 55, 90, 'advanced', FALSE),
(1, 'AWS Cloud Practitioner', 'aws-cloud-practitioner', 'AWS cloud services fundamentals', 65, 110, 'intermediate', TRUE),
(1, 'Azure Fundamentals', 'azure-fundamentals', 'Microsoft Azure cloud basics', 50, 85, 'intermediate', FALSE),
(1, 'Google Cloud Platform', 'google-cloud-platform', 'GCP services and deployment', 55, 95, 'advanced', FALSE),
(1, 'DevOps Practices', 'devops-practices', 'DevOps culture and practices', 45, 70, 'intermediate', FALSE),
(1, 'Git Version Control', 'git-version-control', 'Master Git for version control', 30, 45, 'easy', FALSE),
(1, 'Linux Administration', 'linux-administration', 'Linux system administration', 50, 80, 'intermediate', FALSE),
(1, 'Shell Scripting', 'shell-scripting', 'Bash and shell scripting', 35, 55, 'easy', FALSE),
(1, 'Cybersecurity Basics', 'cybersecurity-basics', 'Introduction to cybersecurity', 40, 60, 'easy', FALSE),
(1, 'Ethical Hacking', 'ethical-hacking', 'Ethical hacking techniques', 60, 120, 'advanced', FALSE),
(1, 'Machine Learning Basics', 'machine-learning-basics', 'Introduction to machine learning', 50, 85, 'intermediate', TRUE),

-- General Knowledge Category (20 tests)
(2, 'World History', 'world-history', 'Comprehensive world history test', 60, 90, 'intermediate', TRUE),
(2, 'Ancient Civilizations', 'ancient-civilizations', 'History of ancient civilizations', 45, 70, 'easy', FALSE),
(2, 'Medieval History', 'medieval-history', 'Medieval period history', 50, 75, 'intermediate', FALSE),
(2, 'Modern History', 'modern-history', 'Modern world history', 55, 85, 'advanced', FALSE),
(2, 'World Geography', 'world-geography', 'Geography of countries and continents', 50, 75, 'intermediate', TRUE),
(2, 'Physical Geography', 'physical-geography', 'Earth physical features and processes', 45, 70, 'intermediate', FALSE),
(2, 'Human Geography', 'human-geography', 'Human societies and cultures', 40, 60, 'easy', FALSE),
(2, 'Art History', 'art-history', 'History of art and artists', 35, 55, 'intermediate', FALSE),
(2, 'Music Theory', 'music-theory', 'Fundamentals of music theory', 30, 45, 'easy', FALSE),
(2, 'Film and Cinema', 'film-cinema', 'World cinema and film history', 40, 60, 'easy', FALSE),
(2, 'Literature Classics', 'literature-classics', 'Classical literature works', 45, 70, 'intermediate', FALSE),
(2, 'Modern Literature', 'modern-literature', 'Contemporary literary works', 40, 60, 'easy', FALSE),
(2, 'Philosophy Basics', 'philosophy-basics', 'Introduction to philosophy', 35, 55, 'easy', FALSE),
(2, 'World Religions', 'world-religions', 'Major world religions', 50, 75, 'intermediate', FALSE),
(2, 'Mythology', 'mythology', 'World mythology and legends', 45, 70, 'easy', FALSE),
(2, 'Archaeology', 'archaeology', 'Archaeological discoveries and methods', 40, 65, 'intermediate', FALSE),
(2, 'Anthropology', 'anthropology', 'Study of human societies', 35, 55, 'easy', FALSE),
(2, 'Sociology', 'sociology', 'Social relationships and institutions', 40, 60, 'intermediate', FALSE),
(2, 'Psychology Basics', 'psychology-basics', 'Introduction to psychology', 45, 70, 'easy', FALSE),
(2, 'Cultural Studies', 'cultural-studies', 'Cultural theories and practices', 35, 55, 'easy', FALSE),

-- Current Affairs Category (15 tests)
(3, 'Current Affairs 2024', 'current-affairs-2024', 'Latest events of 2024', 40, 45, 'easy', TRUE),
(3, 'Politics Today', 'politics-today', 'Current political developments', 35, 40, 'easy', FALSE),
(3, 'International Relations', 'international-relations', 'Global diplomatic relations', 45, 60, 'intermediate', FALSE),
(3, 'Economic Updates', 'economic-updates', 'Current economic trends', 40, 50, 'intermediate', FALSE),
(3, 'Technology News', 'technology-news', 'Latest tech innovations', 35, 40, 'easy', TRUE),
(3, 'Science Discoveries', 'science-discoveries', 'Recent scientific breakthroughs', 30, 35, 'easy', FALSE),
(3, 'Environmental Issues', 'environmental-issues', 'Current environmental challenges', 40, 50, 'intermediate', FALSE),
(3, 'Healthcare Updates', 'healthcare-updates', 'Medical and healthcare news', 35, 45, 'easy', FALSE),
(3, 'Sports Events', 'sports-events', 'Current sports competitions', 30, 35, 'easy', FALSE),
(3, 'Entertainment News', 'entertainment-news', 'Latest entertainment updates', 25, 30, 'easy', FALSE),
(3, 'Business News', 'business-news', 'Corporate and business updates', 40, 50, 'intermediate', FALSE),
(3, 'Financial Markets', 'financial-markets', 'Stock market and finance news', 45, 60, 'advanced', FALSE),
(3, 'Legal Updates', 'legal-updates', 'Recent legal developments', 35, 45, 'intermediate', FALSE),
(3, 'Education News', 'education-news', 'Latest in education sector', 30, 40, 'easy', FALSE),
(3, 'Global Summit Updates', 'global-summit-updates', 'International conferences and summits', 40, 55, 'intermediate', FALSE),

-- Certification Category (25 tests)
(4, 'AWS Certified Solutions Architect', 'aws-solutions-architect', 'AWS certification preparation', 65, 130, 'advanced', TRUE),
(4, 'AWS Certified Developer', 'aws-certified-developer', 'AWS developer certification', 60, 120, 'advanced', FALSE),
(4, 'Google Cloud Professional', 'google-cloud-professional', 'GCP professional certification', 55, 110, 'advanced', TRUE),
(4, 'Microsoft Azure Fundamentals', 'azure-fundamentals-cert', 'Azure fundamentals certification', 40, 60, 'intermediate', FALSE),
(4, 'Cisco CCNA', 'cisco-ccna', 'Cisco Certified Network Associate', 55, 90, 'advanced', FALSE),
(4, 'Cisco CCNP', 'cisco-ccnp', 'Cisco Certified Network Professional', 70, 150, 'advanced', FALSE),
(4, 'CompTIA A+', 'comptia-a-plus', 'CompTIA A+ certification', 90, 180, 'intermediate', FALSE),
(4, 'CompTIA Security+', 'comptia-security-plus', 'Security+ certification', 90, 180, 'advanced', TRUE),
(4, 'CompTIA Network+', 'comptia-network-plus', 'Network+ certification', 85, 170, 'intermediate', FALSE),
(4, 'PMP Certification', 'pmp-certification', 'Project Management Professional', 180, 240, 'advanced', TRUE),
(4, 'CAPM Certification', 'capm-certification', 'Certified Associate in Project Management', 150, 180, 'intermediate', FALSE),
(4, 'Scrum Master Certification', 'scrum-master-certification', 'Scrum Master certification', 50, 60, 'intermediate', FALSE),
(4, 'Product Owner Certification', 'product-owner-certification', 'Product Owner certification', 45, 60, 'intermediate', FALSE),
(4, 'Six Sigma Green Belt', 'six-sigma-green-belt', 'Six Sigma Green Belt certification', 100, 120, 'intermediate', FALSE),
(4, 'Six Sigma Black Belt', 'six-sigma-black-belt', 'Six Sigma Black Belt certification', 150, 180, 'advanced', FALSE),
(4, 'ITIL Foundation', 'itil-foundation', 'ITIL Foundation certification', 40, 60, 'intermediate', FALSE),
(4, 'CEH v12', 'ceh-v12', 'Certified Ethical Hacker v12', 125, 240, 'advanced', TRUE),
(4, 'CISSP', 'cissp', 'Certified Information Systems Security Professional', 150, 240, 'advanced', FALSE),
(4, 'CISA', 'cisa', 'Certified Information Systems Auditor', 150, 240, 'advanced', FALSE),
(4, 'Salesforce Administrator', 'salesforce-administrator', 'Salesforce Admin certification', 60, 105, 'intermediate', FALSE),
(4, 'Salesforce Developer', 'salesforce-developer', 'Salesforce Developer certification', 60, 105, 'advanced', FALSE),
(4, 'Oracle Java Certification', 'oracle-java-certification', 'Oracle Java certification', 80, 150, 'advanced', FALSE),
(4, 'Microsoft .NET Certification', 'microsoft-dotnet-certification', '.NET developer certification', 70, 140, 'advanced', FALSE),
(4, 'Google Data Analytics', 'google-data-analytics', 'Google Data Analytics certification', 55, 120, 'intermediate', FALSE),
(4, 'HubSpot Inbound Marketing', 'hubspot-inbound-marketing', 'Inbound Marketing certification', 60, 90, 'easy', FALSE),

-- Language Category (20 tests)
(5, 'English Proficiency', 'english-proficiency', 'English language proficiency test', 50, 60, 'intermediate', TRUE),
(5, 'TOEFL Preparation', 'toefl-preparation', 'TOEFL exam preparation', 60, 120, 'advanced', TRUE),
(5, 'IELTS Academic', 'ielts-academic', 'IELTS Academic preparation', 55, 120, 'advanced', FALSE),
(5, 'IELTS General', 'ielts-general', 'IELTS General Training', 55, 120, 'intermediate', FALSE),
(5, 'Spanish Language A1', 'spanish-a1', 'Spanish beginner level', 30, 45, 'easy', FALSE),
(5, 'Spanish Language A2', 'spanish-a2', 'Spanish elementary level', 35, 50, 'easy', FALSE),
(5, 'Spanish Language B1', 'spanish-b1', 'Spanish intermediate level', 40, 60, 'intermediate', FALSE),
(5, 'French Language A1', 'french-a1', 'French beginner level', 30, 45, 'easy', FALSE),
(5, 'French Language A2', 'french-a2', 'French elementary level', 35, 50, 'easy', FALSE),
(5, 'French Language B1', 'french-b1', 'French intermediate level', 40, 60, 'intermediate', FALSE),
(5, 'German Language A1', 'german-a1', 'German beginner level', 30, 45, 'easy', FALSE),
(5, 'German Language A2', 'german-a2', 'German elementary level', 35, 50, 'easy', FALSE),
(5, 'Japanese Language N5', 'japanese-n5', 'Japanese beginner level', 30, 45, 'easy', FALSE),
(5, 'Japanese Language N4', 'japanese-n4', 'Japanese elementary level', 35, 50, 'easy', FALSE),
(5, 'Chinese Language HSK 1', 'chinese-hsk1', 'Chinese beginner level', 30, 45, 'easy', FALSE),
(5, 'Chinese Language HSK 2', 'chinese-hsk2', 'Chinese elementary level', 35, 50, 'easy', FALSE),
(5, 'Business English', 'business-english', 'English for business communication', 45, 60, 'intermediate', TRUE),
(5, 'Technical Writing', 'technical-writing', 'Technical documentation skills', 40, 60, 'intermediate', FALSE),
(5, 'Creative Writing', 'creative-writing', 'Creative writing techniques', 35, 50, 'easy', FALSE),
(5, 'Public Speaking', 'public-speaking', 'Public speaking and presentation', 30, 45, 'easy', FALSE),

-- Aptitude Category (20 tests)
(6, 'Quantitative Aptitude', 'quantitative-aptitude', 'Mathematics and numerical ability', 50, 60, 'intermediate', TRUE),
(6, 'Logical Reasoning', 'logical-reasoning', 'Logical thinking and problem solving', 45, 50, 'intermediate', TRUE),
(6, 'Verbal Ability', 'verbal-ability', 'English grammar and vocabulary', 40, 45, 'easy', FALSE),
(6, 'Data Interpretation', 'data-interpretation', 'Data analysis and interpretation', 35, 50, 'intermediate', FALSE),
(6, 'Critical Thinking', 'critical-thinking', 'Critical analysis and evaluation', 30, 40, 'easy', FALSE),
(6, 'Problem Solving', 'problem-solving', 'Analytical problem solving', 45, 60, 'intermediate', FALSE),
(6, 'Analytical Skills', 'analytical-skills', 'Data analysis and logical reasoning', 40, 55, 'intermediate', FALSE),
(6, 'Numerical Ability', 'numerical-ability', 'Basic mathematics and calculations', 35, 45, 'easy', FALSE),
(6, 'Spatial Reasoning', 'spatial-reasoning', 'Spatial visualization and orientation', 30, 40, 'easy', FALSE),
(6, 'Abstract Reasoning', 'abstract-reasoning', 'Pattern recognition and analysis', 40, 50, 'intermediate', FALSE),
(6, 'Non-Verbal Reasoning', 'non-verbal-reasoning', 'Visual reasoning and patterns', 35, 45, 'easy', FALSE),
(6, 'Mechanical Aptitude', 'mechanical-aptitude', 'Mechanical concepts and principles', 40, 55, 'intermediate', FALSE),
(6, 'Electrical Aptitude', 'electrical-aptitude', 'Electrical concepts and principles', 40, 55, 'intermediate', FALSE),
(6, 'Civil Engineering Aptitude', 'civil-engineering-aptitude', 'Civil engineering concepts', 45, 60, 'intermediate', FALSE),
(6, 'Computer Science Aptitude', 'computer-science-aptitude', 'CS concepts and programming logic', 50, 70, 'intermediate', FALSE),
(6, 'Business Aptitude', 'business-aptitude', 'Business concepts and analysis', 40, 55, 'intermediate', FALSE),
(6, 'Management Aptitude', 'management-aptitude', 'Management principles and decision making', 45, 60, 'intermediate', FALSE),
(6, 'Legal Aptitude', 'legal-aptitude', 'Legal reasoning and principles', 40, 55, 'intermediate', FALSE),
(6, 'Medical Aptitude', 'medical-aptitude', 'Medical concepts and reasoning', 50, 70, 'advanced', FALSE),
(6, 'Teaching Aptitude', 'teaching-aptitude', 'Teaching skills and pedagogy', 35, 50, 'easy', FALSE),

-- Science Category (10 tests)
(7, 'Physics Fundamentals', 'physics-fundamentals', 'Basic physics concepts', 40, 60, 'easy', FALSE),
(7, 'Advanced Physics', 'advanced-physics', 'Advanced physics topics', 55, 90, 'advanced', FALSE),
(7, 'Chemistry Basics', 'chemistry-basics', 'Basic chemistry concepts', 35, 50, 'easy', FALSE),
(7, 'Organic Chemistry', 'organic-chemistry', 'Organic chemistry principles', 50, 80, 'advanced', FALSE),
(7, 'Biology Fundamentals', 'biology-fundamentals', 'Basic biology concepts', 40, 60, 'easy', FALSE),
(7, 'Cell Biology', 'cell-biology', 'Cellular structure and function', 45, 70, 'intermediate', FALSE),
(7, 'Genetics', 'genetics', 'Genetic principles and inheritance', 50, 80, 'advanced', FALSE),
(7, 'Astronomy', 'astronomy', 'Space and celestial bodies', 40, 65, 'intermediate', FALSE),
(7, 'Earth Science', 'earth-science', 'Earth systems and processes', 45, 70, 'intermediate', FALSE),
(7, 'Environmental Science', 'environmental-science', 'Environmental systems and issues', 40, 65, 'intermediate', FALSE),

-- Mathematics Category (10 tests)
(8, 'Basic Mathematics', 'basic-mathematics', 'Fundamental mathematics', 30, 45, 'easy', FALSE),
(8, 'Algebra', 'algebra', 'Algebraic expressions and equations', 40, 60, 'intermediate', FALSE),
(8, 'Geometry', 'geometry', 'Geometric shapes and properties', 35, 55, 'intermediate', FALSE),
(8, 'Trigonometry', 'trigonometry', 'Trigonometric functions and identities', 40, 65, 'intermediate', FALSE),
(8, 'Calculus', 'calculus', 'Differential and integral calculus', 50, 85, 'advanced', FALSE),
(8, 'Statistics', 'statistics', 'Statistical methods and analysis', 45, 70, 'intermediate', FALSE),
(8, 'Probability', 'probability', 'Probability theory and applications', 40, 65, 'intermediate', FALSE),
(8, 'Discrete Mathematics', 'discrete-mathematics', 'Discrete mathematical structures', 45, 75, 'advanced', FALSE),
(8, 'Linear Algebra', 'linear-algebra', 'Vector spaces and linear transformations', 50, 85, 'advanced', FALSE),
(8, 'Number Theory', 'number-theory', 'Properties of numbers', 40, 70, 'advanced', FALSE),

-- Business Category (10 tests)
(9, 'Business Fundamentals', 'business-fundamentals', 'Basic business concepts', 35, 50, 'easy', FALSE),
(9, 'Marketing Principles', 'marketing-principles', 'Marketing concepts and strategies', 40, 60, 'intermediate', FALSE),
(9, 'Financial Management', 'financial-management', 'Financial planning and analysis', 45, 75, 'intermediate', FALSE),
(9, 'Human Resources', 'human-resources', 'HR management and practices', 35, 55, 'intermediate', FALSE),
(9, 'Operations Management', 'operations-management', 'Business operations and processes', 40, 65, 'intermediate', FALSE),
(9, 'Strategic Management', 'strategic-management', 'Business strategy formulation', 45, 75, 'advanced', FALSE),
(9, 'Entrepreneurship', 'entrepreneurship', 'Starting and managing businesses', 40, 65, 'intermediate', FALSE),
(9, 'International Business', 'international-business', 'Global business operations', 45, 75, 'advanced', FALSE),
(9, 'Supply Chain Management', 'supply-chain-management', 'Supply chain and logistics', 40, 70, 'intermediate', FALSE),
(9, 'Business Ethics', 'business-ethics', 'Ethical business practices', 30, 45, 'easy', FALSE),

-- Creative Arts Category (10 tests)
(10, 'Art Fundamentals', 'art-fundamentals', 'Basic art principles and techniques', 30, 45, 'easy', FALSE),
(10, 'Digital Art', 'digital-art', 'Digital art creation and tools', 35, 55, 'intermediate', FALSE),
(10, 'Graphic Design', 'graphic-design', 'Graphic design principles', 40, 65, 'intermediate', FALSE),
(10, 'UI/UX Design', 'ui-ux-design', 'User interface and experience design', 45, 75, 'intermediate', FALSE),
(10, 'Photography', 'photography', 'Photography techniques and composition', 35, 55, 'easy', FALSE),
(10, 'Video Editing', 'video-editing', 'Video editing and production', 40, 70, 'intermediate', FALSE),
(10, 'Animation Basics', 'animation-basics', 'Basic animation principles', 35, 60, 'easy', FALSE),
(10, '3D Modeling', '3d-modeling', '3D modeling and rendering', 45, 80, 'advanced', FALSE),
(10, 'Game Design', 'game-design', 'Game design principles', 40, 70, 'intermediate', FALSE),
(10, 'Creative Writing', 'creative-writing-arts', 'Creative writing techniques', 30, 50, 'easy', FALSE);

-- Insert Sample Questions for First Test (JavaScript Fundamentals)
INSERT INTO questions (test_id, question_text, question_type, explanation, marks, sort_order) VALUES
(1, 'What does JavaScript primarily add to web pages?', 'single_choice', 'JavaScript is mainly used for adding interactivity and dynamic behavior to web pages.', 1.00, 1),
(1, 'Which keyword is used to declare a variable in JavaScript?', 'single_choice', 'JavaScript supports var, let, and const for variable declaration.', 1.00, 2),
(1, 'What is the result of: console.log(typeof null)?', 'single_choice', 'typeof null returns "object" which is a known quirk in JavaScript.', 1.00, 3),
(1, 'Which method is used to add an element to the end of an array?', 'single_choice', 'The push() method adds elements to the end of an array.', 1.00, 4),
(1, 'What does the "===" operator do?', 'single_choice', 'The === operator checks for strict equality without type conversion.', 1.00, 5);

-- Insert Options for Questions
-- Question 1 Options
INSERT INTO options (question_id, option_text, is_correct, sort_order) VALUES
(1, 'Styling and layout', FALSE, 1),
(1, 'Interactivity and dynamic behavior', TRUE, 2),
(1, 'Database connectivity', FALSE, 3),
(1, 'Server-side processing', FALSE, 4);

-- Question 2 Options
INSERT INTO options (question_id, option_text, is_correct, sort_order) VALUES
(2, 'var', FALSE, 1),
(2, 'let', FALSE, 2),
(2, 'const', FALSE, 3),
(2, 'All of the above', TRUE, 4);

-- Question 3 Options
INSERT INTO options (question_id, option_text, is_correct, sort_order) VALUES
(3, '"null"', FALSE, 1),
(3, '"object"', TRUE, 2),
(3, '"undefined"', FALSE, 3),
(3, '"number"', FALSE, 4);

-- Question 4 Options
INSERT INTO options (question_id, option_text, is_correct, sort_order) VALUES
(4, 'push()', TRUE, 1),
(4, 'pop()', FALSE, 2),
(4, 'shift()', FALSE, 3),
(4, 'unshift()', FALSE, 4);

-- Question 5 Options
INSERT INTO options (question_id, option_text, is_correct, sort_order) VALUES
(5, 'Checks equality without type conversion', TRUE, 1),
(5, 'Checks equality with type conversion', FALSE, 2),
(5, 'Assigns a value', FALSE, 3),
(5, 'Compares two values', FALSE, 4);

-- Insert Default Settings
INSERT INTO settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', 'KnowledgeHub', 'string', 'general', 'Website name', TRUE),
('site_description', 'Online Examination Platform', 'string', 'general', 'Website description', TRUE),
('contact_email', 'support@knowledgehub.com', 'string', 'general', 'Contact email address', TRUE),
('items_per_page', '12', 'integer', 'general', 'Number of items per page', FALSE),
('default_timezone', 'UTC', 'string', 'general', 'Default timezone', FALSE),
('test_time_warning', '5', 'integer', 'tests', 'Minutes before warning about test time', FALSE),
('max_test_attempts', '3', 'integer', 'tests', 'Maximum attempts per test', FALSE),
('min_pass_percentage', '70', 'integer', 'tests', 'Minimum percentage to pass test', TRUE),
('allow_test_retake', '1', 'boolean', 'tests', 'Allow test retake', TRUE),
('enable_registration', '1', 'boolean', 'users', 'Enable user registration', TRUE),
('require_email_verification', '0', 'boolean', 'users', 'Require email verification', FALSE),
('enable_social_login', '1', 'boolean', 'users', 'Enable social media login', TRUE);

-- Create Views
CREATE VIEW test_statistics AS
SELECT 
    t.id,
    t.name,
    t.category_id,
    c.name as category_name,
    COUNT(ut.id) as total_attempts,
    AVG(ut.percentage) as average_score,
    MAX(ut.percentage) as highest_score,
    MIN(ut.percentage) as lowest_score,
    COUNT(DISTINCT ut.user_id) as unique_users
FROM tests t
LEFT JOIN user_tests ut ON t.id = ut.test_id
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY t.id, t.name, t.category_id, c.name;

CREATE VIEW user_leaderboard AS
SELECT 
    u.id as user_id,
    u.fullname,
    u.email,
    COUNT(ut.id) as tests_taken,
    SUM(ut.score) as total_score,
    AVG(ut.percentage) as average_percentage,
    MAX(ut.percentage) as best_percentage
FROM users u
LEFT JOIN user_tests ut ON u.id = ut.user_id
WHERE ut.status = 'completed'
GROUP BY u.id, u.fullname, u.email
ORDER BY average_percentage DESC;

-- Create Stored Procedures
DELIMITER //

-- Procedure to calculate test statistics
CREATE PROCEDURE CalculateTestStatistics(IN test_id_param INT)
BEGIN
    DECLARE total_attempts INT;
    DECLARE avg_score DECIMAL(5,2);
    
    SELECT COUNT(*), AVG(percentage)
    INTO total_attempts, avg_score
    FROM user_tests
    WHERE test_id = test_id_param AND status = 'completed';
    
    UPDATE tests
    SET attempts_count = total_attempts,
        average_score = COALESCE(avg_score, 0.00),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = test_id_param;
END //

-- Procedure to update user progress
CREATE PROCEDURE UpdateUserProgress(IN user_id_param INT, IN test_id_param INT)
BEGIN
    DECLARE best_score DECIMAL(5,2);
    DECLARE attempts_count INT;
    DECLARE last_attempt_id INT;
    
    -- Get user's best score and attempts count
    SELECT MAX(percentage), COUNT(*), MAX(id)
    INTO best_score, attempts_count, last_attempt_id
    FROM user_tests
    WHERE user_id = user_id_param AND test_id = test_id_param AND status = 'completed';
    
    -- Update or insert user progress
    INSERT INTO user_progress (user_id, test_id, best_score, attempts_count, last_attempt_id, updated_at)
    VALUES (user_id_param, test_id_param, COALESCE(best_score, 0.00), attempts_count, last_attempt_id, CURRENT_TIMESTAMP)
    ON DUPLICATE KEY UPDATE
        best_score = GREATEST(best_score, VALUES(best_score)),
        attempts_count = VALUES(attempts_count),
        last_attempt_id = VALUES(last_attempt_id),
        updated_at = VALUES(updated_at);
END //

-- Procedure to update leaderboard
CREATE PROCEDURE UpdateLeaderboard(IN test_id_param INT)
BEGIN
    DECLARE current_week INT;
    DECLARE current_month INT;
    DECLARE current_year INT;
    
    SET current_week = WEEK(CURRENT_DATE);
    SET current_month = MONTH(CURRENT_DATE);
    SET current_year = YEAR(CURRENT_DATE);
    
    -- Delete old entries for this week
    DELETE FROM leaderboard 
    WHERE test_id = test_id_param 
    AND week_number = current_week 
    AND year_number = current_year;
    
    -- Insert new rankings
    INSERT INTO leaderboard (user_id, test_id, score, percentage, time_taken_seconds, week_number, month_number, year_number)
    SELECT 
        ut.user_id,
        ut.test_id,
        ut.score,
        ut.percentage,
        ut.time_taken_seconds,
        current_week,
        current_month,
        current_year
    FROM user_tests ut
    WHERE ut.test_id = test_id_param 
    AND ut.status = 'completed'
    AND WEEK(ut.created_at) = current_week
    AND YEAR(ut.created_at) = current_year
    ORDER BY ut.percentage DESC, ut.time_taken_seconds ASC;
    
    -- Update rank positions
    SET @rank = 0;
    UPDATE leaderboard l
    JOIN (
        SELECT id, (@rank := @rank + 1) as new_rank
        FROM leaderboard
        WHERE test_id = test_id_param 
        AND week_number = current_week 
        AND year_number = current_year
        ORDER BY percentage DESC, time_taken_seconds ASC
    ) ranks ON l.id = ranks.id
    SET l.rank_position = ranks.new_rank;
END //

DELIMITER ;

-- Create Triggers
DELIMITER //

-- Trigger to update test statistics after a test attempt
CREATE TRIGGER after_user_test_insert
AFTER INSERT ON user_tests
FOR EACH ROW
BEGIN
    -- Update test statistics
    CALL CalculateTestStatistics(NEW.test_id);
    
    -- Update user progress
    CALL UpdateUserProgress(NEW.user_id, NEW.test_id);
    
    -- Update leaderboard if test is completed
    IF NEW.status = 'completed' THEN
        CALL UpdateLeaderboard(NEW.test_id);
    END IF;
    
    -- Create notification for test completion
    IF NEW.status = 'completed' THEN
        INSERT INTO notifications (user_id, title, message, type, metadata)
        VALUES (
            NEW.user_id,
            'Test Completed',
            CONCAT('You have completed the test with score: ', NEW.score, '/', NEW.total_questions),
            'test_completed',
            JSON_OBJECT('test_id', NEW.test_id, 'score', NEW.score, 'percentage', NEW.percentage)
        );
    END IF;
END //

-- Trigger to update test views count
CREATE TRIGGER before_test_update_views
BEFORE UPDATE ON tests
FOR EACH ROW
BEGIN
    -- Increment views count when test is accessed
    IF NEW.views_count IS NOT NULL AND OLD.views_count IS NOT NULL THEN
        SET NEW.views_count = OLD.views_count + 1;
    END IF;
END //

DELIMITER ;

-- Create Indexes for Performance
CREATE INDEX idx_user_tests_completed ON user_tests(user_id, test_id, status, created_at);
CREATE INDEX idx_questions_test_active ON questions(test_id, is_active, sort_order);
CREATE INDEX idx_options_question_correct ON options(question_id, is_correct);
CREATE INDEX idx_user_progress_completed ON user_progress(user_id, is_completed, best_score DESC);
CREATE INDEX idx_leaderboard_ranking ON leaderboard(test_id, percentage DESC, time_taken_seconds ASC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read, created_at DESC);

-- Create Database User with Privileges
CREATE USER IF NOT EXISTS 'knowledgehub_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON online_exam.* TO 'knowledgehub_user'@'localhost';
FLUSH PRIVILEGES;

-- Insert Sample Admin User (password: admin123)
INSERT INTO users (fullname, email, password, role, is_verified) 
VALUES ('Admin User', 'admin@knowledgehub.com', '$2y$10$YourHashedPasswordHere', 'admin', TRUE);