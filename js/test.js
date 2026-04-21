// test.js - Complete version with questions for ALL tests (1-150)
// Test Management System
class TestManager {
    constructor() {
        this.currentTest = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.startTime = null;
        this.timer = null;
        this.timeLimit = 60 * 60;
        this.timeRemaining = this.timeLimit;
        
        this.init();
    }
    
    init() {
        this.loadTestFromURL();
        this.setupEventListeners();
    }
    
    loadTestFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get('test');
        
        console.log('Loading test ID:', testId);
        
        if (!testId) {
            alert('No test specified. Redirecting to home page.');
            window.location.href = 'index.html';
            return;
        }
        
        this.checkSessionAndLoadTest(testId);
    }
    
    checkSessionAndLoadTest(testId) {
        try {
            const user = JSON.parse(localStorage.getItem('kh_user'));
            if (user && user.name) {
                console.log('User logged in:', user.name);
                this.loadTest(testId);
            } else {
                alert('Please login to take the test');
                window.location.href = 'index.html';
            }
        } catch(err) {
            console.error('Error checking session:', err);
            window.location.href = 'index.html';
        }
    }
    
    loadTest(testId) {
        console.log('Loading test data for ID:', testId);
        
        const numericTestId = parseInt(testId);
        const testInfo = this.getTestInfo(numericTestId);
        this.currentTest = testInfo;
        
        console.log('Test info loaded:', this.currentTest);
        
        this.timeLimit = testInfo.duration * 60;
        this.timeRemaining = this.timeLimit;
        
        this.questions = this.getQuestionsForTest(numericTestId);
        console.log('Questions loaded:', this.questions.length);
        
        this.renderTest();
        this.startTimer();
    }
    
    getTestInfo(testId) {
        const testInfoMap = {
            // Programming Tests (1-30)
            1: { id: 1, name: 'JavaScript Fundamentals', category: 'programming', totalQuestions: 10, duration: 60, difficulty: 'easy' },
            2: { id: 2, name: 'Advanced JavaScript', category: 'programming', totalQuestions: 10, duration: 90, difficulty: 'advanced' },
            3: { id: 3, name: 'Python Programming', category: 'programming', totalQuestions: 10, duration: 75, difficulty: 'intermediate' },
            4: { id: 4, name: 'Python for Data Science', category: 'programming', totalQuestions: 10, duration: 90, difficulty: 'advanced' },
            5: { id: 5, name: 'Java Core Concepts', category: 'programming', totalQuestions: 10, duration: 80, difficulty: 'intermediate' },
            6: { id: 6, name: 'Java Spring Framework', category: 'programming', totalQuestions: 10, duration: 120, difficulty: 'advanced' },
            7: { id: 7, name: 'C++ Programming', category: 'programming', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            8: { id: 8, name: 'C# and .NET', category: 'programming', totalQuestions: 10, duration: 75, difficulty: 'intermediate' },
            9: { id: 9, name: 'PHP Web Development', category: 'programming', totalQuestions: 10, duration: 60, difficulty: 'easy' },
            10: { id: 10, name: 'React.js Fundamentals', category: 'programming', totalQuestions: 10, duration: 75, difficulty: 'intermediate' },
            11: { id: 11, name: 'React.js Advanced', category: 'programming', totalQuestions: 10, duration: 90, difficulty: 'advanced' },
            12: { id: 12, name: 'Vue.js Mastery', category: 'programming', totalQuestions: 10, duration: 70, difficulty: 'intermediate' },
            13: { id: 13, name: 'Angular Framework', category: 'programming', totalQuestions: 10, duration: 100, difficulty: 'advanced' },
            14: { id: 14, name: 'Node.js Backend', category: 'programming', totalQuestions: 10, duration: 80, difficulty: 'intermediate' },
            15: { id: 15, name: 'Express.js API Development', category: 'programming', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            16: { id: 16, name: 'MongoDB Database', category: 'programming', totalQuestions: 10, duration: 50, difficulty: 'easy' },
            17: { id: 17, name: 'MySQL Database Design', category: 'programming', totalQuestions: 10, duration: 70, difficulty: 'intermediate' },
            18: { id: 18, name: 'PostgreSQL Advanced', category: 'programming', totalQuestions: 10, duration: 80, difficulty: 'advanced' },
            19: { id: 19, name: 'Docker Containers', category: 'programming', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            20: { id: 20, name: 'Kubernetes Orchestration', category: 'programming', totalQuestions: 10, duration: 90, difficulty: 'advanced' },
            21: { id: 21, name: 'AWS Cloud Practitioner', category: 'programming', totalQuestions: 10, duration: 110, difficulty: 'intermediate' },
            22: { id: 22, name: 'Azure Fundamentals', category: 'programming', totalQuestions: 10, duration: 85, difficulty: 'intermediate' },
            23: { id: 23, name: 'Google Cloud Platform', category: 'programming', totalQuestions: 10, duration: 95, difficulty: 'advanced' },
            24: { id: 24, name: 'DevOps Practices', category: 'programming', totalQuestions: 10, duration: 70, difficulty: 'intermediate' },
            25: { id: 25, name: 'Git Version Control', category: 'programming', totalQuestions: 10, duration: 45, difficulty: 'easy' },
            26: { id: 26, name: 'Linux Administration', category: 'programming', totalQuestions: 10, duration: 80, difficulty: 'intermediate' },
            27: { id: 27, name: 'Shell Scripting', category: 'programming', totalQuestions: 10, duration: 55, difficulty: 'easy' },
            28: { id: 28, name: 'Cybersecurity Basics', category: 'programming', totalQuestions: 10, duration: 60, difficulty: 'easy' },
            29: { id: 29, name: 'Ethical Hacking', category: 'programming', totalQuestions: 10, duration: 120, difficulty: 'advanced' },
            30: { id: 30, name: 'Machine Learning Basics', category: 'programming', totalQuestions: 10, duration: 85, difficulty: 'intermediate' },
            
            // General Knowledge Tests (31-55)
            31: { id: 31, name: 'World History', category: 'gk', totalQuestions: 10, duration: 90, difficulty: 'intermediate' },
            32: { id: 32, name: 'Ancient Civilizations', category: 'gk', totalQuestions: 10, duration: 70, difficulty: 'easy' },
            33: { id: 33, name: 'Medieval History', category: 'gk', totalQuestions: 10, duration: 75, difficulty: 'intermediate' },
            34: { id: 34, name: 'Modern History', category: 'gk', totalQuestions: 10, duration: 85, difficulty: 'advanced' },
            35: { id: 35, name: 'World Geography', category: 'gk', totalQuestions: 10, duration: 75, difficulty: 'intermediate' },
            36: { id: 36, name: 'Physical Geography', category: 'gk', totalQuestions: 10, duration: 70, difficulty: 'intermediate' },
            37: { id: 37, name: 'Human Geography', category: 'gk', totalQuestions: 10, duration: 60, difficulty: 'easy' },
            38: { id: 38, name: 'Art History', category: 'gk', totalQuestions: 10, duration: 55, difficulty: 'intermediate' },
            39: { id: 39, name: 'Music Theory', category: 'gk', totalQuestions: 10, duration: 45, difficulty: 'easy' },
            40: { id: 40, name: 'Film and Cinema', category: 'gk', totalQuestions: 10, duration: 60, difficulty: 'easy' },
            41: { id: 41, name: 'Literature Classics', category: 'gk', totalQuestions: 10, duration: 70, difficulty: 'intermediate' },
            42: { id: 42, name: 'Modern Literature', category: 'gk', totalQuestions: 10, duration: 60, difficulty: 'easy' },
            43: { id: 43, name: 'Philosophy Basics', category: 'gk', totalQuestions: 10, duration: 55, difficulty: 'easy' },
            44: { id: 44, name: 'World Religions', category: 'gk', totalQuestions: 10, duration: 75, difficulty: 'intermediate' },
            45: { id: 45, name: 'Mythology', category: 'gk', totalQuestions: 10, duration: 70, difficulty: 'easy' },
            46: { id: 46, name: 'Current Affairs 2024', category: 'gk', totalQuestions: 10, duration: 45, difficulty: 'easy' },
            47: { id: 47, name: 'Politics Today', category: 'gk', totalQuestions: 10, duration: 40, difficulty: 'easy' },
            48: { id: 48, name: 'International Relations', category: 'gk', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            49: { id: 49, name: 'Economic Updates', category: 'gk', totalQuestions: 10, duration: 50, difficulty: 'intermediate' },
            50: { id: 50, name: 'Technology News', category: 'gk', totalQuestions: 10, duration: 40, difficulty: 'easy' },
            51: { id: 51, name: 'Science Discoveries', category: 'gk', totalQuestions: 10, duration: 35, difficulty: 'easy' },
            52: { id: 52, name: 'Environmental Issues', category: 'gk', totalQuestions: 10, duration: 50, difficulty: 'intermediate' },
            53: { id: 53, name: 'Healthcare Updates', category: 'gk', totalQuestions: 10, duration: 45, difficulty: 'easy' },
            54: { id: 54, name: 'Sports Events', category: 'gk', totalQuestions: 10, duration: 35, difficulty: 'easy' },
            55: { id: 55, name: 'Entertainment News', category: 'gk', totalQuestions: 10, duration: 30, difficulty: 'easy' },
            
            // Courses (56-75)
            56: { id: 56, name: 'Database Management', category: 'courses', totalQuestions: 10, duration: 50, difficulty: 'intermediate' },
            57: { id: 57, name: 'Cyber Security', category: 'courses', totalQuestions: 10, duration: 90, difficulty: 'advanced' },
            58: { id: 58, name: 'Data Science', category: 'courses', totalQuestions: 10, duration: 120, difficulty: 'advanced' },
            59: { id: 59, name: 'Artificial Intelligence', category: 'courses', totalQuestions: 10, duration: 90, difficulty: 'advanced' },
            60: { id: 60, name: 'Digital Marketing', category: 'courses', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            61: { id: 61, name: 'Project Management', category: 'courses', totalQuestions: 10, duration: 75, difficulty: 'intermediate' },
            62: { id: 62, name: 'Business Analytics', category: 'courses', totalQuestions: 10, duration: 80, difficulty: 'intermediate' },
            63: { id: 63, name: 'Financial Planning', category: 'courses', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            64: { id: 64, name: 'Entrepreneurship', category: 'courses', totalQuestions: 10, duration: 50, difficulty: 'easy' },
            65: { id: 65, name: 'Public Speaking', category: 'courses', totalQuestions: 10, duration: 45, difficulty: 'easy' },
            
            // Certification (66-85)
            66: { id: 66, name: 'AWS Certified Solutions Architect', category: 'certification', totalQuestions: 10, duration: 130, difficulty: 'advanced' },
            67: { id: 67, name: 'Google Cloud Professional', category: 'certification', totalQuestions: 10, duration: 120, difficulty: 'advanced' },
            68: { id: 68, name: 'Microsoft Azure Fundamentals', category: 'certification', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            69: { id: 69, name: 'Cisco CCNA', category: 'certification', totalQuestions: 10, duration: 90, difficulty: 'advanced' },
            70: { id: 70, name: 'CompTIA Security+', category: 'certification', totalQuestions: 10, duration: 90, difficulty: 'intermediate' },
            71: { id: 71, name: 'PMP Certification', category: 'certification', totalQuestions: 10, duration: 120, difficulty: 'advanced' },
            72: { id: 72, name: 'Scrum Master', category: 'certification', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            73: { id: 73, name: 'Six Sigma Green Belt', category: 'certification', totalQuestions: 10, duration: 90, difficulty: 'intermediate' },
            74: { id: 74, name: 'ITIL Foundation', category: 'certification', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            75: { id: 75, name: 'CEH (Ethical Hacking)', category: 'certification', totalQuestions: 10, duration: 120, difficulty: 'advanced' },
            
            // Language (76-95)
            76: { id: 76, name: 'English Proficiency', category: 'language', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            77: { id: 77, name: 'Spanish Language', category: 'language', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            78: { id: 78, name: 'French Grammar', category: 'language', totalQuestions: 10, duration: 50, difficulty: 'intermediate' },
            79: { id: 79, name: 'German Vocabulary', category: 'language', totalQuestions: 10, duration: 45, difficulty: 'easy' },
            80: { id: 80, name: 'Japanese Basics', category: 'language', totalQuestions: 10, duration: 40, difficulty: 'easy' },
            81: { id: 81, name: 'Chinese Characters', category: 'language', totalQuestions: 10, duration: 60, difficulty: 'advanced' },
            82: { id: 82, name: 'Business English', category: 'language', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            83: { id: 83, name: 'TOEFL Preparation', category: 'language', totalQuestions: 10, duration: 120, difficulty: 'advanced' },
            84: { id: 84, name: 'IELTS Practice', category: 'language', totalQuestions: 10, duration: 120, difficulty: 'advanced' },
            85: { id: 85, name: 'Grammar Mastery', category: 'language', totalQuestions: 10, duration: 50, difficulty: 'intermediate' },
            
            // Aptitude (86-105)
            86: { id: 86, name: 'Quantitative Aptitude', category: 'aptitude', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            87: { id: 87, name: 'Logical Reasoning', category: 'aptitude', totalQuestions: 10, duration: 50, difficulty: 'intermediate' },
            88: { id: 88, name: 'Verbal Ability', category: 'aptitude', totalQuestions: 10, duration: 45, difficulty: 'easy' },
            89: { id: 89, name: 'Data Interpretation', category: 'aptitude', totalQuestions: 10, duration: 50, difficulty: 'intermediate' },
            90: { id: 90, name: 'Critical Thinking', category: 'aptitude', totalQuestions: 10, duration: 40, difficulty: 'easy' },
            91: { id: 91, name: 'Problem Solving', category: 'aptitude', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            92: { id: 92, name: 'Analytical Skills', category: 'aptitude', totalQuestions: 10, duration: 50, difficulty: 'intermediate' },
            93: { id: 93, name: 'Numerical Ability', category: 'aptitude', totalQuestions: 10, duration: 60, difficulty: 'intermediate' },
            94: { id: 94, name: 'Spatial Reasoning', category: 'aptitude', totalQuestions: 10, duration: 45, difficulty: 'easy' },
            95: { id: 95, name: 'Abstract Reasoning', category: 'aptitude', totalQuestions: 10, duration: 50, difficulty: 'intermediate' },
            
            // Additional tests (96-150) - Generate dynamic names
        };
        
        // For tests 96-150, generate dynamic test info
        if (testId >= 96 && testId <= 150) {
            const categories = ['programming', 'gk', 'courses', 'certification', 'language', 'aptitude'];
            const difficulties = ['easy', 'intermediate', 'advanced'];
            const category = categories[Math.floor(Math.random() * categories.length)];
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            
            return {
                id: testId,
                name: `${category.charAt(0).toUpperCase() + category.slice(1)} Test ${testId}`,
                category: category,
                totalQuestions: 10,
                duration: 60,
                difficulty: difficulty
            };
        }
        
        return testInfoMap[testId] || { 
            id: parseInt(testId),
            name: `Test ${testId}`, 
            category: 'general', 
            totalQuestions: 10, 
            duration: 60, 
            difficulty: 'intermediate' 
        };
    }
    
    getQuestionsForTest(testId) {
        // Complete question bank for all tests
        const questionBank = {
            // ========== PROGRAMMING TESTS (1-30) ==========
            
            // Test 1: JavaScript Fundamentals
            1: [
                { question: 'Which company developed JavaScript?', options: ['Netscape', 'Microsoft', 'Google', 'Apple'], correctAnswer: 0 },
                { question: 'What is the correct way to declare a variable in JavaScript?', options: ['let x;', 'variable x;', 'var x;', 'Both A and C'], correctAnswer: 3 },
                { question: 'Which symbol is used for single-line comments?', options: ['//', '/*', '#', '<!--'], correctAnswer: 0 },
                { question: 'What is the output of 2 + "2" in JavaScript?', options: ['"22"', '4', 'Error', 'undefined'], correctAnswer: 0 },
                { question: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: 0 },
                { question: 'What does JSON stand for?', options: ['JavaScript Object Notation', 'Java Standard Output Network', 'JavaScript Online Network', 'Java Serialized Object Notation'], correctAnswer: 0 },
                { question: 'Which operator checks both value and type?', options: ['===', '==', '=', '!='], correctAnswer: 0 },
                { question: 'How do you write "Hello World" in an alert box?', options: ['alert("Hello World");', 'msg("Hello World");', 'alertBox("Hello World");', 'show("Hello World");'], correctAnswer: 0 },
                { question: 'What is the correct way to write a JavaScript array?', options: ['var colors = ["red", "green", "blue"]', 'var colors = "red", "green", "blue"', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = {"red", "green", "blue"}'], correctAnswer: 0 },
                { question: 'How do you round the number 7.25 to the nearest integer?', options: ['Math.round(7.25)', 'round(7.25)', 'Math.rnd(7.25)', 'rnd(7.25)'], correctAnswer: 0 }
            ],
            
            // Test 2: Advanced JavaScript
            2: [
                { question: 'What is a closure in JavaScript?', options: ['Function with access to outer scope', 'A closed function', 'A private method', 'A block of code'], correctAnswer: 0 },
                { question: 'What is the purpose of "use strict"?', options: ['Enforces stricter parsing', 'Enables new features', 'Disables debugging', 'Improves performance'], correctAnswer: 0 },
                { question: 'What is a Promise?', options: ['Object representing async operation', 'A guaranteed value', 'A callback function', 'A synchronous operation'], correctAnswer: 0 },
                { question: 'What is the output of [] + []?', options: ['"" (empty string)', '[]', '0', 'undefined'], correctAnswer: 0 },
                { question: 'What does the spread operator do?', options: ['Expands iterable elements', 'Combines arrays', 'Creates a copy', 'All of the above'], correctAnswer: 3 },
                { question: 'What is event bubbling?', options: ['Event propagates from inner to outer', 'Event propagates from outer to inner', 'Event stops propagation', 'Event repeats itself'], correctAnswer: 0 },
                { question: 'What is a generator function?', options: ['Function that can be paused', 'Function that generates code', 'Function that creates objects', 'Function with no return'], correctAnswer: 0 },
                { question: 'What is the difference between null and undefined?', options: ['null is assigned, undefined means not defined', 'They are the same', 'undefined is assigned, null means not defined', 'null is an object, undefined is not'], correctAnswer: 0 },
                { question: 'What is the event loop?', options: ['Handles async operations', 'A loop for events', 'A DOM API', 'A timer function'], correctAnswer: 0 },
                { question: 'What is debouncing?', options: ['Limits function calls', 'Removes bugs', 'Debugs code', 'Optimizes loops'], correctAnswer: 0 }
            ],
            
            // Test 3: Python Programming
            3: [
                { question: 'Who created Python?', options: ['Guido van Rossum', 'Dennis Ritchie', 'James Gosling', 'Brendan Eich'], correctAnswer: 0 },
                { question: 'What is the correct file extension for Python files?', options: ['.py', '.python', '.pt', '.pyt'], correctAnswer: 0 },
                { question: 'How do you output text in Python?', options: ['print()', 'echo()', 'output()', 'console.log()'], correctAnswer: 0 },
                { question: 'Which of these is a Python framework?', options: ['Django', 'React', 'Angular', 'Vue'], correctAnswer: 0 },
                { question: 'What is a list in Python?', options: ['Mutable sequence', 'Immutable sequence', 'Key-value pairs', 'Set of unique values'], correctAnswer: 0 },
                { question: 'What does PEP stand for?', options: ['Python Enhancement Proposal', 'Python Execution Protocol', 'Programming Enhancement Proposal', 'Python Extended Package'], correctAnswer: 0 },
                { question: 'How do you create a function in Python?', options: ['def function():', 'func function():', 'function def():', 'create function():'], correctAnswer: 0 },
                { question: 'What is a dictionary in Python?', options: ['Key-value pairs', 'Ordered sequence', 'Set of values', 'List of tuples'], correctAnswer: 0 },
                { question: 'What is the output of type([])?', options: ["<class 'list'>", 'list', 'array', '[]'], correctAnswer: 0 },
                { question: 'What is pip?', options: ['Package installer', 'Python interpreter', 'Code editor', 'Debug tool'], correctAnswer: 0 }
            ],
            
            // Test 4: Python for Data Science
            4: [
                { question: 'Which library is used for numerical computing in Python?', options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'], correctAnswer: 0 },
                { question: 'What is Pandas mainly used for?', options: ['Data manipulation', 'Machine learning', 'Visualization', 'Web development'], correctAnswer: 0 },
                { question: 'What is a DataFrame in Pandas?', options: ['2D labeled data structure', '1D array', '3D matrix', 'Database table'], correctAnswer: 0 },
                { question: 'Which library is used for data visualization?', options: ['Matplotlib', 'NumPy', 'Pandas', 'SciPy'], correctAnswer: 0 },
                { question: 'What is Jupyter Notebook?', options: ['Interactive computing environment', 'Code editor', 'Python library', 'Database tool'], correctAnswer: 0 },
                { question: 'What does scikit-learn provide?', options: ['Machine learning algorithms', 'Data visualization', 'Deep learning', 'Web frameworks'], correctAnswer: 0 },
                { question: 'How do you handle missing data in Pandas?', options: ['dropna() or fillna()', 'remove()', 'delete()', 'clean()'], correctAnswer: 0 },
                { question: 'What is a Series in Pandas?', options: ['1D labeled array', '2D table', '3D matrix', 'Database'], correctAnswer: 0 },
                { question: 'What is TensorFlow used for?', options: ['Deep learning', 'Data analysis', 'Web development', 'Game development'], correctAnswer: 0 },
                { question: 'What is the purpose of train_test_split?', options: ['Split data for training/testing', 'Split arrays', 'Split strings', 'Split files'], correctAnswer: 0 }
            ],
            
            // Test 5: Java Core Concepts
            5: [
                { question: 'Who created Java?', options: ['James Gosling', 'Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup'], correctAnswer: 0 },
                { question: 'What is the JVM?', options: ['Java Virtual Machine', 'Java Variable Manager', 'Java Version Manager', 'Java Visual Machine'], correctAnswer: 0 },
                { question: 'What is the entry point of a Java program?', options: ['main() method', 'start() method', 'run() method', 'init() method'], correctAnswer: 0 },
                { question: 'What is inheritance in Java?', options: ['Class inherits from another', 'Interface inheritance', 'Method overloading', 'Data encapsulation'], correctAnswer: 0 },
                { question: 'What is a constructor?', options: ['Initializes objects', 'Destroys objects', 'Copies objects', 'Creates objects'], correctAnswer: 0 },
                { question: 'What is polymorphism?', options: ['Many forms', 'Single form', 'No form', 'Inheritance'], correctAnswer: 0 },
                { question: 'What is the difference between abstract class and interface?', options: ['Abstract can have implementation', 'Interface can have implementation', 'Both are same', 'Neither can have implementation'], correctAnswer: 0 },
                { question: 'What is garbage collection?', options: ['Automatic memory management', 'Manual memory deletion', 'Code cleanup', 'Object creation'], correctAnswer: 0 },
                { question: 'What is a thread in Java?', options: ['Lightweight process', 'Heavy process', 'Main method', 'Class'], correctAnswer: 0 },
                { question: 'What is the Collections framework?', options: ['API for storing objects', 'Collection of classes', 'Framework for GUI', 'Database connector'], correctAnswer: 0 }
            ],
            
            // Test 6: Java Spring Framework
            6: [
                { question: 'What is Spring Framework?', options: ['Application framework', 'Web server', 'Database', 'IDE'], correctAnswer: 0 },
                { question: 'What is dependency injection?', options: ['Injects dependencies', 'Creates dependencies', 'Removes dependencies', 'Manages dependencies'], correctAnswer: 0 },
                { question: 'What is Spring Boot?', options: ['Spring with auto-configuration', 'Spring IDE', 'Spring database', 'Spring testing'], correctAnswer: 0 },
                { question: 'What is an IoC container?', options: ['Inversion of Control', 'Internet of Containers', 'Interface of Classes', 'Injection of Components'], correctAnswer: 0 },
                { question: 'What is a bean in Spring?', options: ['Object managed by Spring', 'Java class', 'Database entity', 'XML file'], correctAnswer: 0 },
                { question: 'What is @Autowired used for?', options: ['Automatic dependency injection', 'Automatic bean creation', 'Automatic configuration', 'Automatic testing'], correctAnswer: 0 },
                { question: 'What is Spring MVC?', options: ['Model-View-Controller framework', 'Spring version control', 'Spring method validation', 'Spring model creator'], correctAnswer: 0 },
                { question: 'What is a REST controller?', options: ['Handles REST requests', 'Controls REST', 'REST client', 'REST API'], correctAnswer: 0 },
                { question: 'What is JPA?', options: ['Java Persistence API', 'Java Program Assistant', 'Java Platform API', 'Java Persistence Application'], correctAnswer: 0 },
                { question: 'What is Spring Data?', options: ['Data access framework', 'Data storage', 'Data analysis', 'Data visualization'], correctAnswer: 0 }
            ],
            
            // Test 7: C++ Programming
            7: [
                { question: 'Who created C++?', options: ['Bjarne Stroustrup', 'Dennis Ritchie', 'James Gosling', 'Guido van Rossum'], correctAnswer: 0 },
                { question: 'What is cout used for?', options: ['Output to console', 'Input from console', 'Error output', 'File output'], correctAnswer: 0 },
                { question: 'What is a class in C++?', options: ['Blueprint for objects', 'Function', 'Variable', 'Loop'], correctAnswer: 0 },
                { question: 'What is inheritance?', options: ['Deriving from existing class', 'Creating new class', 'Deleting class', 'Copying class'], correctAnswer: 0 },
                { question: 'What is polymorphism?', options: ['Many forms', 'Single form', 'No form', 'Abstract form'], correctAnswer: 0 },
                { question: 'What is a virtual function?', options: ['Function that can be overridden', 'Virtual function', 'Empty function', 'Static function'], correctAnswer: 0 },
                { question: 'What is the difference between struct and class?', options: ['Default access (public vs private)', 'Same thing', 'Struct has no methods', 'Class has no data'], correctAnswer: 0 },
                { question: 'What is operator overloading?', options: ['Redefining operators', 'Overloading functions', 'Creating operators', 'Deleting operators'], correctAnswer: 0 },
                { question: 'What is a template?', options: ['Generic programming', 'Class template', 'Function template', 'All of the above'], correctAnswer: 3 },
                { question: 'What is RAII?', options: ['Resource Acquisition Is Initialization', 'Random Access Interface', 'Rapid Application Integration', 'Resource Allocation Interface'], correctAnswer: 0 }
            ],
            
            // Test 8: C# and .NET
            8: [
                { question: 'Who developed C#?', options: ['Microsoft', 'Google', 'Apple', 'IBM'], correctAnswer: 0 },
                { question: 'What is .NET?', options: ['Framework for applications', 'Operating system', 'Database', 'Programming language'], correctAnswer: 0 },
                { question: 'What is CLR?', options: ['Common Language Runtime', 'C Language Runtime', 'Common Language Runner', 'C# Language Runtime'], correctAnswer: 0 },
                { question: 'What is the entry point in C#?', options: ['Main() method', 'Start() method', 'Run() method', 'Begin() method'], correctAnswer: 0 },
                { question: 'What is a namespace?', options: ['Container for classes', 'File container', 'Code block', 'Method group'], correctAnswer: 0 },
                { question: 'What is inheritance in C#?', options: ['Deriving from base class', 'Creating interface', 'Implementing methods', 'Delegates'], correctAnswer: 0 },
                { question: 'What is an interface?', options: ['Contract for classes', 'Abstract class', 'Concrete class', 'Static class'], correctAnswer: 0 },
                { question: 'What is LINQ?', options: ['Language Integrated Query', 'Linear Integrated Query', 'Language Interface Query', 'Link Integration'], correctAnswer: 0 },
                { question: 'What is ASP.NET?', options: ['Web framework', 'Desktop framework', 'Mobile framework', 'Game framework'], correctAnswer: 0 },
                { question: 'What is a delegate?', options: ['Type-safe function pointer', 'Event handler', 'Callback', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 9: PHP Web Development
            9: [
                { question: 'What does PHP stand for?', options: ['PHP: Hypertext Preprocessor', 'Personal Home Page', 'Professional Home Page', 'Preprocessed Hypertext Page'], correctAnswer: 0 },
                { question: 'How do you output text in PHP?', options: ['echo', 'print', 'Both', 'output'], correctAnswer: 2 },
                { question: 'What symbol starts a PHP variable?', options: ['$', '@', '&', '%'], correctAnswer: 0 },
                { question: 'What is $_GET used for?', options: ['Collect form data from URL', 'Collect form data from POST', 'Session data', 'Cookie data'], correctAnswer: 0 },
                { question: 'How do you start a session in PHP?', options: ['session_start()', 'start_session()', 'Session::start()', 'session_begin()'], correctAnswer: 0 },
                { question: 'What is PDO?', options: ['PHP Data Objects', 'PHP Database Operator', 'Personal Data Object', 'Primary Data Object'], correctAnswer: 0 },
                { question: 'How do you include a file in PHP?', options: ['include() or require()', 'import()', 'load()', 'add()'], correctAnswer: 0 },
                { question: 'What is Laravel?', options: ['PHP framework', 'JavaScript framework', 'CSS framework', 'Database'], correctAnswer: 0 },
                { question: 'What is Composer?', options: ['Dependency manager', 'Code editor', 'Debug tool', 'Database tool'], correctAnswer: 0 },
                { question: 'What does MVC stand for?', options: ['Model-View-Controller', 'Main-View-Controller', 'Model-View-Component', 'Module-View-Controller'], correctAnswer: 0 }
            ],
            
            // Test 10: React.js Fundamentals
            10: [
                { question: 'Who developed React?', options: ['Facebook', 'Google', 'Microsoft', 'Twitter'], correctAnswer: 0 },
                { question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'JSON XML'], correctAnswer: 0 },
                { question: 'What is a component in React?', options: ['Reusable piece of UI', 'Function', 'Class', 'Element'], correctAnswer: 0 },
                { question: 'What is state in React?', options: ['Component data', 'Global data', 'Props', 'Styles'], correctAnswer: 0 },
                { question: 'What are props?', options: ['Properties passed to components', 'Properties of state', 'Properties of class', 'Properties of function'], correctAnswer: 0 },
                { question: 'What is the virtual DOM?', options: ['Lightweight copy of DOM', 'Real DOM', 'Browser DOM', 'Fake DOM'], correctAnswer: 0 },
                { question: 'What is a hook in React?', options: ['Function for state/lifecycle', 'Hook for data', 'Hook for events', 'Hook for styling'], correctAnswer: 0 },
                { question: 'What is useState used for?', options: ['Add state to function components', 'Manage lifecycle', 'Handle events', 'Style components'], correctAnswer: 0 },
                { question: 'What is useEffect used for?', options: ['Side effects in components', 'State management', 'Event handling', 'Rendering'], correctAnswer: 0 },
                { question: 'What is the key prop used for?', options: ['Identify list items', 'Key for styling', 'Key for events', 'Key for state'], correctAnswer: 0 }
            ],
            
            // Test 11: React.js Advanced
            11: [
                { question: 'What is Redux?', options: ['State management library', 'React framework', 'Testing library', 'Routing library'], correctAnswer: 0 },
                { question: 'What is a reducer?', options: ['Pure function for state updates', 'Reduces code', 'Reducer function', 'State manager'], correctAnswer: 0 },
                { question: 'What is middleware in Redux?', options: ['Between action and reducer', 'Between components', 'Between store and view', 'Between actions'], correctAnswer: 0 },
                { question: 'What is the Context API?', options: ['Prop drilling solution', 'State management', 'Event system', 'Styling system'], correctAnswer: 0 },
                { question: 'What is React Router?', options: ['Routing library', 'State management', 'Testing library', 'UI library'], correctAnswer: 0 },
                { question: 'What is code splitting?', options: ['Lazy loading components', 'Splitting code', 'Dividing code', 'Code organization'], correctAnswer: 0 },
                { question: 'What are Higher-Order Components?', options: ['Components that wrap other components', 'High-level components', 'Parent components', 'Child components'], correctAnswer: 0 },
                { question: 'What is useMemo used for?', options: ['Memoize expensive calculations', 'Memoize components', 'Memoize state', 'Memoize props'], correctAnswer: 0 },
                { question: 'What is useCallback used for?', options: ['Memoize functions', 'Memoize values', 'Memoize components', 'Memoize state'], correctAnswer: 0 },
                { question: 'What is React.memo?', options: ['Memoize component rendering', 'Memoize state', 'Memoize props', 'Memoize functions'], correctAnswer: 0 }
            ],
            
            // Test 12: Vue.js Mastery
            12: [
                { question: 'Who created Vue.js?', options: ['Evan You', 'Vue team', 'Google', 'Facebook'], correctAnswer: 0 },
                { question: 'What is the template syntax in Vue?', options: ['HTML-based template', 'JSX', 'JavaScript', 'CSS'], correctAnswer: 0 },
                { question: 'What is a directive in Vue?', options: ['Special HTML attributes', 'Direct function', 'Vue method', 'Vue component'], correctAnswer: 0 },
                { question: 'What is v-bind used for?', options: ['Bind attributes', 'Bind events', 'Bind models', 'Bind styles'], correctAnswer: 0 },
                { question: 'What is v-model used for?', options: ['Two-way data binding', 'One-way binding', 'Event binding', 'Style binding'], correctAnswer: 0 },
                { question: 'What is a computed property?', options: ['Cached property based on dependencies', 'Computed value', 'Method', 'Data property'], correctAnswer: 0 },
                { question: 'What is a watcher?', options: ['Observes data changes', 'Watches for events', 'Watches components', 'Watches routes'], correctAnswer: 0 },
                { question: 'What is Vuex?', options: ['State management pattern', 'Routing library', 'Testing library', 'UI library'], correctAnswer: 0 },
                { question: 'What is a lifecycle hook?', options: ['Component lifecycle method', 'Hook for events', 'Hook for data', 'Hook for styling'], correctAnswer: 0 },
                { question: 'What is the created hook?', options: ['Called after instance created', 'Called before create', 'Called after mount', 'Called before mount'], correctAnswer: 0 }
            ],
            
            // Test 13: Angular Framework
            13: [
                { question: 'Who developed Angular?', options: ['Google', 'Facebook', 'Microsoft', 'Twitter'], correctAnswer: 0 },
                { question: 'What language does Angular use?', options: ['TypeScript', 'JavaScript', 'Python', 'Java'], correctAnswer: 0 },
                { question: 'What is a component in Angular?', options: ['Building block of UI', 'Service', 'Module', 'Directive'], correctAnswer: 0 },
                { question: 'What is a module in Angular?', options: ['Container for components', 'Block of code', 'Function', 'Class'], correctAnswer: 0 },
                { question: 'What is data binding in Angular?', options: ['Communication between component and DOM', 'Data connection', 'Binding data', 'Linking data'], correctAnswer: 0 },
                { question: 'What is a service in Angular?', options: ['Singleton object for data/shared logic', 'Service class', 'Component', 'Module'], correctAnswer: 0 },
                { question: 'What is dependency injection?', options: ['Design pattern for dependencies', 'Injection of data', 'Dependency creation', 'Dependency removal'], correctAnswer: 0 },
                { question: 'What is a directive?', options: ['Custom HTML elements/attributes', 'Direct function', 'Direct component', 'Direct module'], correctAnswer: 0 },
                { question: 'What is RxJS?', options: ['Reactive programming library', 'Angular library', 'Testing library', 'Styling library'], correctAnswer: 0 },
                { question: 'What is Angular CLI?', options: ['Command line interface', 'Angular compiler', 'Angular runtime', 'Angular debugger'], correctAnswer: 0 }
            ],
            
            // Test 14: Node.js Backend
            14: [
                { question: 'What is Node.js?', options: ['JavaScript runtime', 'JavaScript framework', 'JavaScript library', 'Database'], correctAnswer: 0 },
                { question: 'What is npm?', options: ['Node package manager', 'Node program manager', 'Node project manager', 'Node process manager'], correctAnswer: 0 },
                { question: 'What is the event loop?', options: ['Handles async operations', 'Loop of events', 'Event handler', 'Event emitter'], correctAnswer: 0 },
                { question: 'What is package.json?', options: ['Project metadata file', 'Package file', 'JSON file', 'Configuration file'], correctAnswer: 0 },
                { question: 'What is a callback?', options: ['Function passed as argument', 'Called back function', 'Return function', 'Async function'], correctAnswer: 0 },
                { question: 'What is Express.js?', options: ['Web framework for Node', 'Express framework', 'Node framework', 'JavaScript framework'], correctAnswer: 0 },
                { question: 'What is middleware?', options: ['Functions with access to request/response', 'Middle software', 'Middle code', 'Between layers'], correctAnswer: 0 },
                { question: 'What is the require function used for?', options: ['Import modules', 'Export modules', 'Create modules', 'Delete modules'], correctAnswer: 0 },
                { question: 'What is process.env?', options: ['Environment variables', 'Process variables', 'Environment config', 'Process config'], correctAnswer: 0 },
                { question: 'What is clustering in Node?', options: ['Multiple processes', 'Group of nodes', 'Node groups', 'Server clusters'], correctAnswer: 0 }
            ],
            
            // Test 15: Express.js API Development
            15: [
                { question: 'What is Express.js?', options: ['Web framework', 'Database', 'Template engine', 'Testing tool'], correctAnswer: 0 },
                { question: 'How do you create an Express app?', options: ['express()', 'createExpress()', 'new Express()', 'Express.create()'], correctAnswer: 0 },
                { question: 'What is routing in Express?', options: ['Defining endpoints', 'Routing paths', 'Route handling', 'URL mapping'], correctAnswer: 0 },
                { question: 'How do you define a GET route?', options: ['app.get()', 'app.post()', 'app.route()', 'app.use()'], correctAnswer: 0 },
                { question: 'What is middleware in Express?', options: ['Functions in request pipeline', 'Middle code', 'Express functions', 'Route handlers'], correctAnswer: 0 },
                { question: 'What is req.params?', options: ['Route parameters', 'Query parameters', 'Body parameters', 'Header parameters'], correctAnswer: 0 },
                { question: 'What is res.json()?', options: ['Send JSON response', 'Send JSON file', 'Parse JSON', 'Stringify JSON'], correctAnswer: 0 },
                { question: 'What is CORS?', options: ['Cross-Origin Resource Sharing', 'Cross-Origin Request', 'Cross-Origin Response', 'Cross-Origin Security'], correctAnswer: 0 },
                { question: 'What is body-parser used for?', options: ['Parse request body', 'Parse response body', 'Parse headers', 'Parse cookies'], correctAnswer: 0 },
                { question: 'What is an API endpoint?', options: ['URL where API can be accessed', 'API function', 'API method', 'API route'], correctAnswer: 0 }
            ],
            
            // Test 16: MongoDB Database
            16: [
                { question: 'What type of database is MongoDB?', options: ['NoSQL', 'SQL', 'Relational', 'Graph'], correctAnswer: 0 },
                { question: 'What is a document in MongoDB?', options: ['Record in collection', 'File', 'Text file', 'JSON file'], correctAnswer: 0 },
                { question: 'What is a collection?', options: ['Group of documents', 'Group of databases', 'Group of tables', 'Group of fields'], correctAnswer: 0 },
                { question: 'What format does MongoDB use?', options: ['BSON', 'JSON', 'XML', 'YAML'], correctAnswer: 0 },
                { question: 'What is the _id field?', options: ['Primary key', 'Foreign key', 'Index', 'Unique identifier'], correctAnswer: 0 },
                { question: 'How do you insert a document?', options: ['insertOne() or insertMany()', 'add()', 'create()', 'push()'], correctAnswer: 0 },
                { question: 'How do you query documents?', options: ['find()', 'search()', 'get()', 'select()'], correctAnswer: 0 },
                { question: 'What is an index in MongoDB?', options: ['Improves query performance', 'Data structure', 'Collection', 'Document'], correctAnswer: 0 },
                { question: 'What is aggregation?', options: ['Pipeline for data processing', 'Data grouping', 'Data summing', 'Data filtering'], correctAnswer: 0 },
                { question: 'What is Mongoose?', options: ['ODM for MongoDB', 'Database driver', 'Query builder', 'Schema validator'], correctAnswer: 0 }
            ],
            
            // Test 17: MySQL Database Design
            17: [
                { question: 'What type of database is MySQL?', options: ['Relational', 'NoSQL', 'Graph', 'Document'], correctAnswer: 0 },
                { question: 'What is a primary key?', options: ['Unique identifier', 'Foreign key', 'Index', 'Table key'], correctAnswer: 0 },
                { question: 'What is a foreign key?', options: ['References another table', 'Primary key', 'Unique key', 'Composite key'], correctAnswer: 0 },
                { question: 'What is normalization?', options: ['Reduce redundancy', 'Increase redundancy', 'Optimize queries', 'Create tables'], correctAnswer: 0 },
                { question: 'What is a JOIN?', options: ['Combine rows from tables', 'Join tables', 'Connect tables', 'Link tables'], correctAnswer: 0 },
                { question: 'What is the SELECT statement used for?', options: ['Retrieve data', 'Insert data', 'Update data', 'Delete data'], correctAnswer: 0 },
                { question: 'What is a transaction?', options: ['Unit of work', 'Set of queries', 'Database operation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is ACID?', options: ['Database properties', 'Query properties', 'Table properties', 'Index properties'], correctAnswer: 0 },
                { question: 'What is an index?', options: ['Improves query speed', 'Table structure', 'Data type', 'Constraint'], correctAnswer: 0 },
                { question: 'What is a view?', options: ['Virtual table', 'Physical table', 'Temporary table', 'Backup table'], correctAnswer: 0 }
            ],
            
            // Test 18: PostgreSQL Advanced
            18: [
                { question: 'What type of database is PostgreSQL?', options: ['Object-relational', 'Relational', 'NoSQL', 'Graph'], correctAnswer: 0 },
                { question: 'What is a schema in PostgreSQL?', options: ['Namespace for database objects', 'Table structure', 'Database blueprint', 'Data dictionary'], correctAnswer: 0 },
                { question: 'What is a CTE?', options: ['Common Table Expression', 'Common Table Entry', 'Complex Table Expression', 'Constant Table Expression'], correctAnswer: 0 },
                { question: 'What is a window function?', options: ['Function across rows', 'Window function', 'Aggregate function', 'Analytical function'], correctAnswer: 0 },
                { question: 'What is a trigger?', options: ['Automatic function on events', 'Database trigger', 'Event handler', 'Procedure'], correctAnswer: 0 },
                { question: 'What is a stored procedure?', options: ['Saved SQL code', 'Function', 'Procedure', 'Method'], correctAnswer: 0 },
                { question: 'What is JSONB?', options: ['Binary JSON data type', 'JSON text', 'JSON array', 'JSON object'], correctAnswer: 0 },
                { question: 'What is replication?', options: ['Copying data to another server', 'Data backup', 'Data sync', 'Data mirroring'], correctAnswer: 0 },
                { question: 'What is sharding?', options: ['Horizontal partitioning', 'Vertical partitioning', 'Data splitting', 'Table splitting'], correctAnswer: 0 },
                { question: 'What is VACUUM used for?', options: ['Clean up dead rows', 'Vacuum database', 'Clean space', 'Optimize table'], correctAnswer: 0 }
            ],
            
            // Test 19: Docker Containers
            19: [
                { question: 'What is Docker?', options: ['Container platform', 'Virtual machine', 'Operating system', 'Programming language'], correctAnswer: 0 },
                { question: 'What is a container?', options: ['Lightweight executable package', 'Virtual machine', 'Application', 'Service'], correctAnswer: 0 },
                { question: 'What is an image?', options: ['Template for containers', 'Picture', 'Container snapshot', 'Docker file'], correctAnswer: 0 },
                { question: 'What is a Dockerfile?', options: ['Instructions to build image', 'Docker file', 'Configuration file', 'Text file'], correctAnswer: 0 },
                { question: 'What is the difference between container and image?', options: ['Image is template, container is instance', 'Same thing', 'Container is template', 'Image is instance'], correctAnswer: 0 },
                { question: 'What is Docker Hub?', options: ['Image registry', 'Docker repository', 'Container registry', 'Code repository'], correctAnswer: 0 },
                { question: 'What is docker-compose?', options: ['Multi-container tool', 'Docker compose', 'Container orchestrator', 'Docker tool'], correctAnswer: 0 },
                { question: 'What is a volume?', options: ['Persistent data storage', 'Container storage', 'Docker storage', 'File system'], correctAnswer: 0 },
                { question: 'What is a Docker network?', options: ['Communication between containers', 'Network for Docker', 'Container network', 'Virtual network'], correctAnswer: 0 },
                { question: 'What is the difference between COPY and ADD?', options: ['ADD has more features', 'Same thing', 'COPY has more features', 'Different commands'], correctAnswer: 0 }
            ],
            
            // Test 20: Kubernetes Orchestration
            20: [
                { question: 'What is Kubernetes?', options: ['Container orchestrator', 'Container platform', 'Container runtime', 'Container tool'], correctAnswer: 0 },
                { question: 'What is a pod?', options: ['Smallest deployable unit', 'Container group', 'Application', 'Service'], correctAnswer: 0 },
                { question: 'What is a node?', options: ['Worker machine', 'Master machine', 'Container host', 'Server'], correctAnswer: 0 },
                { question: 'What is a cluster?', options: ['Group of nodes', 'Group of pods', 'Group of containers', 'Group of services'], correctAnswer: 0 },
                { question: 'What is a deployment?', options: ['Manages replica sets', 'Deploy application', 'Scale application', 'Update application'], correctAnswer: 0 },
                { question: 'What is a service?', options: ['Network endpoint for pods', 'Service discovery', 'Load balancer', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a ConfigMap?', options: ['Configuration data', 'Config map', 'Environment variables', 'Secrets'], correctAnswer: 0 },
                { question: 'What is a Secret?', options: ['Sensitive data', 'Secret data', 'Encrypted data', 'Password'], correctAnswer: 0 },
                { question: 'What is kubectl?', options: ['Kubernetes CLI', 'Kubernetes tool', 'Kubernetes controller', 'Kubernetes client'], correctAnswer: 0 },
                { question: 'What is etcd?', options: ['Key-value store for cluster data', 'Database', 'Storage', 'Configuration'], correctAnswer: 0 }
            ],
            
            // Test 21: AWS Cloud Practitioner
            21: [
                { question: 'What is AWS?', options: ['Amazon Web Services', 'Amazon Web System', 'Amazon World Service', 'Amazon Wide Service'], correctAnswer: 0 },
                { question: 'What is EC2?', options: ['Virtual servers', 'Compute service', 'Elastic Compute Cloud', 'All of the above'], correctAnswer: 3 },
                { question: 'What is S3?', options: ['Storage service', 'Simple Storage Service', 'Object storage', 'All of the above'], correctAnswer: 3 },
                { question: 'What is IAM?', options: ['Identity and Access Management', 'Identity Access Management', 'IAM service', 'Access management'], correctAnswer: 0 },
                { question: 'What is a region?', options: ['Geographic area', 'Data center', 'Availability zone', 'Location'], correctAnswer: 0 },
                { question: 'What is an availability zone?', options: ['Isolated location within region', 'Data center', 'Region', 'Zone'], correctAnswer: 0 },
                { question: 'What is VPC?', options: ['Virtual Private Cloud', 'Virtual Public Cloud', 'Virtual Private Network', 'Virtual Private Connection'], correctAnswer: 0 },
                { question: 'What is Lambda?', options: ['Serverless compute', 'Compute service', 'Function service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is RDS?', options: ['Relational Database Service', 'Relational Data Service', 'Remote Database Service', 'Relational Database System'], correctAnswer: 0 },
                { question: 'What is CloudFront?', options: ['CDN service', 'Content delivery', 'Cache service', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 22: Azure Fundamentals
            22: [
                { question: 'What is Microsoft Azure?', options: ['Cloud computing platform', 'Operating system', 'Database', 'Programming language'], correctAnswer: 0 },
                { question: 'What is a resource group?', options: ['Container for resources', 'Group of resources', 'Resource manager', 'Azure resource'], correctAnswer: 0 },
                { question: 'What are Azure Virtual Machines?', options: ['IaaS compute service', 'PaaS service', 'SaaS service', 'FaaS service'], correctAnswer: 0 },
                { question: 'What is Azure App Service?', options: ['PaaS for web apps', 'IaaS service', 'SaaS service', 'FaaS service'], correctAnswer: 0 },
                { question: 'What is Azure Storage?', options: ['Cloud storage service', 'Database service', 'Compute service', 'Network service'], correctAnswer: 0 },
                { question: 'What is Azure SQL Database?', options: ['PaaS database service', 'IaaS database', 'SaaS database', 'On-premise database'], correctAnswer: 0 },
                { question: 'What is Azure Active Directory?', options: ['Identity service', 'Directory service', 'Authentication service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Azure Functions?', options: ['Serverless compute', 'Function service', 'FaaS', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a region in Azure?', options: ['Geographic area', 'Data center', 'Availability zone', 'Location'], correctAnswer: 0 },
                { question: 'What is Azure DevOps?', options: ['Development tools', 'CI/CD service', 'Project management', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 23: Google Cloud Platform
            23: [
                { question: 'What is Google Cloud Platform?', options: ['Cloud computing services', 'Google services', 'Cloud platform', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Compute Engine?', options: ['IaaS compute service', 'VMs on GCP', 'Virtual machines', 'All of the above'], correctAnswer: 3 },
                { question: 'What is App Engine?', options: ['PaaS platform', 'Application engine', 'Web app platform', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Cloud Storage?', options: ['Object storage service', 'File storage', 'Block storage', 'All of the above'], correctAnswer: 3 },
                { question: 'What is BigQuery?', options: ['Data warehouse', 'Analytics service', 'Big data service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Cloud SQL?', options: ['Managed database service', 'SQL database', 'MySQL/PostgreSQL on GCP', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Kubernetes Engine?', options: ['Managed Kubernetes', 'Container service', 'GKE', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Cloud Functions?', options: ['Serverless functions', 'FaaS on GCP', 'Event-driven compute', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a zone in GCP?', options: ['Deployment area', 'Data center', 'Region part', 'Location'], correctAnswer: 0 },
                { question: 'What is Cloud CDN?', options: ['Content delivery network', 'Cache service', 'Global distribution', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 24: DevOps Practices
            24: [
                { question: 'What is DevOps?', options: ['Development + Operations', 'Software practice', 'Culture and practice', 'All of the above'], correctAnswer: 3 },
                { question: 'What is CI/CD?', options: ['Continuous Integration/Continuous Delivery', 'Continuous Improvement', 'Code Integration', 'Continuous Deployment'], correctAnswer: 0 },
                { question: 'What is Infrastructure as Code?', options: ['Managing infrastructure with code', 'IaC', 'Automation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a CI pipeline?', options: ['Automated build/test process', 'Code pipeline', 'Integration pipeline', 'Delivery pipeline'], correctAnswer: 0 },
                { question: 'What is configuration management?', options: ['Managing system configuration', 'Tool like Ansible', 'Automation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is monitoring in DevOps?', options: ['System observation', 'Performance tracking', 'Alerting', 'All of the above'], correctAnswer: 3 },
                { question: 'What is logging?', options: ['Recording events', 'System logs', 'Application logs', 'All of the above'], correctAnswer: 3 },
                { question: 'What is version control?', options: ['Code management', 'Git', 'Tracking changes', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Agile?', options: ['Development methodology', 'Project management', 'Iterative approach', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a microservice?', options: ['Small independent service', 'Architecture style', 'Service-oriented', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 25: Git Version Control
            25: [
                { question: 'Who created Git?', options: ['Linus Torvalds', 'Linus Torvalds', 'Git team', 'GitHub'], correctAnswer: 0 },
                { question: 'What is Git?', options: ['Version control system', 'Code management', 'DVCS', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a repository?', options: ['Project storage', 'Code storage', 'Git storage', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a commit?', options: ['Snapshot of changes', 'Save point', 'Version', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a branch?', options: ['Independent line of development', 'Branch in Git', 'Code branch', 'All of the above'], correctAnswer: 3 },
                { question: 'What is git clone used for?', options: ['Copy repository', 'Clone repository', 'Download repository', 'All of the above'], correctAnswer: 3 },
                { question: 'What is git pull?', options: ['Fetch and merge changes', 'Update local repo', 'Download changes', 'All of the above'], correctAnswer: 3 },
                { question: 'What is git push?', options: ['Upload changes to remote', 'Push commits', 'Update remote', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a merge conflict?', options: ['When changes conflict', 'Merge issue', 'Git conflict', 'All of the above'], correctAnswer: 3 },
                { question: 'What is GitHub?', options: ['Git hosting service', 'Code hosting', 'Collaboration platform', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 26: Linux Administration
            26: [
                { question: 'Who created Linux?', options: ['Linus Torvalds', 'Richard Stallman', 'Ken Thompson', 'Dennis Ritchie'], correctAnswer: 0 },
                { question: 'What is the Linux kernel?', options: ['Core of Linux OS', 'Operating system', 'System software', 'Hardware interface'], correctAnswer: 0 },
                { question: 'What is a shell?', options: ['Command interpreter', 'User interface', 'Terminal', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the root user?', options: ['Superuser', 'Administrator', 'Highest privileges', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the ls command used for?', options: ['List directory contents', 'List files', 'Show files', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the cd command?', options: ['Change directory', 'Navigate directories', 'Directory change', 'All of the above'], correctAnswer: 3 },
                { question: 'What is chmod used for?', options: ['Change file permissions', 'Modify permissions', 'Access control', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a process?', options: ['Running program', 'Program instance', 'Task', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a service?', options: ['Background process', 'Daemon', 'System service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is SSH?', options: ['Secure Shell', 'Remote access', 'Secure protocol', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 27: Shell Scripting
            27: [
                { question: 'What is a shell script?', options: ['Text file with commands', 'Script file', 'Shell program', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the shebang line?', options: ['#!/bin/bash', 'Script interpreter', 'First line', 'All of the above'], correctAnswer: 3 },
                { question: 'How do you declare a variable?', options: ['var=value', 'Variable assignment', 'Shell variable', 'All of the above'], correctAnswer: 3 },
                { question: 'What is $1 in a script?', options: ['First argument', 'Positional parameter', 'Command-line argument', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an if statement?', options: ['Conditional statement', 'Decision making', 'Branching', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a for loop?', options: ['Iteration statement', 'Loop through items', 'Repetition', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a function in shell?', options: ['Code block', 'Reusable code', 'Subroutine', 'All of the above'], correctAnswer: 3 },
                { question: 'What is grep?', options: ['Pattern search', 'Text search', 'Filter command', 'All of the above'], correctAnswer: 3 },
                { question: 'What is awk?', options: ['Text processing', 'Pattern scanning', 'Data extraction', 'All of the above'], correctAnswer: 3 },
                { question: 'What is sed?', options: ['Stream editor', 'Text manipulation', 'Find/replace', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 28: Cybersecurity Basics
            28: [
                { question: 'What is cybersecurity?', options: ['Protection of systems', 'Security practices', 'Defense against attacks', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a firewall?', options: ['Network security system', 'Traffic filter', 'Security barrier', 'All of the above'], correctAnswer: 3 },
                { question: 'What is malware?', options: ['Malicious software', 'Virus', 'Trojan', 'All of the above'], correctAnswer: 3 },
                { question: 'What is phishing?', options: ['Fraudulent email attack', 'Social engineering', 'Credential theft', 'All of the above'], correctAnswer: 3 },
                { question: 'What is encryption?', options: ['Data encoding', 'Secure communication', 'Cryptography', 'All of the above'], correctAnswer: 3 },
                { question: 'What is authentication?', options: ['Identity verification', 'Login process', 'Access control', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a VPN?', options: ['Virtual Private Network', 'Secure tunnel', 'Encrypted connection', 'All of the above'], correctAnswer: 3 },
                { question: 'What is 2FA?', options: ['Two-factor authentication', 'Multi-factor auth', 'Security layer', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a DDoS attack?', options: ['Distributed Denial of Service', 'Overwhelming traffic', 'Service disruption', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a vulnerability?', options: ['Security weakness', 'System flaw', 'Attack surface', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 29: Ethical Hacking
            29: [
                { question: 'What is ethical hacking?', options: ['Authorized hacking', 'Security testing', 'Penetration testing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is penetration testing?', options: ['Simulated attack', 'Security assessment', 'Vulnerability testing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is footprinting?', options: ['Information gathering', 'Reconnaissance', 'Data collection', 'All of the above'], correctAnswer: 3 },
                { question: 'What is scanning?', options: ['Network probing', 'Port scanning', 'Vulnerability scanning', 'All of the above'], correctAnswer: 3 },
                { question: 'What is enumeration?', options: ['Extracting information', 'Data gathering', 'System discovery', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a vulnerability assessment?', options: ['Identifying weaknesses', 'Security check', 'Risk analysis', 'All of the above'], correctAnswer: 3 },
                { question: 'What is exploitation?', options: ['Gaining access', 'Using vulnerabilities', 'System compromise', 'All of the above'], correctAnswer: 3 },
                { question: 'What is social engineering?', options: ['Human manipulation', 'Psychological attack', 'Deception', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a zero-day?', options: ['Unknown vulnerability', 'Unpatched flaw', 'New attack', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a white hat?', options: ['Ethical hacker', 'Security professional', 'Good hacker', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 30: Machine Learning Basics
            30: [
                { question: 'What is machine learning?', options: ['AI subset', 'Learning from data', 'Predictive models', 'All of the above'], correctAnswer: 3 },
                { question: 'What is supervised learning?', options: ['Labeled data learning', 'Training with examples', 'Prediction', 'All of the above'], correctAnswer: 3 },
                { question: 'What is unsupervised learning?', options: ['Unlabeled data learning', 'Pattern discovery', 'Clustering', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a neural network?', options: ['Brain-inspired computing', 'Deep learning', 'AI model', 'All of the above'], correctAnswer: 3 },
                { question: 'What is training data?', options: ['Data for learning', 'Examples', 'Model input', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a model?', options: ['Learned representation', 'Algorithm output', 'Predictive system', 'All of the above'], correctAnswer: 3 },
                { question: 'What is accuracy?', options: ['Performance metric', 'Correct predictions', 'Model evaluation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is overfitting?', options: ['Too specific to training', 'Poor generalization', 'Model issue', 'All of the above'], correctAnswer: 3 },
                { question: 'What is feature engineering?', options: ['Input creation', 'Variable selection', 'Data preparation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is regression?', options: ['Predicting numbers', 'Continuous output', 'Linear model', 'All of the above'], correctAnswer: 3 }
            ],
            
            // ========== GENERAL KNOWLEDGE TESTS (31-55) ==========
            
            // Test 31: World History
            31: [
                { question: 'When did World War II end?', options: ['1945', '1939', '1941', '1943'], correctAnswer: 0 },
                { question: 'Who was the first President of the United States?', options: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'John Adams'], correctAnswer: 0 },
                { question: 'When did the French Revolution begin?', options: ['1789', '1776', '1799', '1812'], correctAnswer: 0 },
                { question: 'Who discovered America in 1492?', options: ['Christopher Columbus', 'Vasco da Gama', 'Ferdinand Magellan', 'Marco Polo'], correctAnswer: 0 },
                { question: 'What was the Roman Empire?', options: ['Ancient Roman state', 'Empire', 'Civilization', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Julius Caesar?', options: ['Roman leader', 'Emperor', 'General', 'All of the above'], correctAnswer: 3 },
                { question: 'When did the Cold War end?', options: ['1991', '1989', '1985', '1993'], correctAnswer: 0 },
                { question: 'What was the Industrial Revolution?', options: ['Industrial period', 'Economic change', 'Technological era', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Napoleon Bonaparte?', options: ['French emperor', 'Military leader', 'Conqueror', 'All of the above'], correctAnswer: 3 },
                { question: 'When did the Renaissance begin?', options: ['14th century', '15th century', '13th century', '16th century'], correctAnswer: 0 }
            ],
            
            // Test 32: Ancient Civilizations
            32: [
                { question: 'Which civilization built the pyramids?', options: ['Ancient Egyptians', 'Romans', 'Greeks', 'Mayans'], correctAnswer: 0 },
                { question: 'Where was the Mesopotamian civilization?', options: ['Middle East', 'Iraq region', 'Tigris-Euphrates', 'All of the above'], correctAnswer: 3 },
                { question: 'Who were the Aztecs?', options: ['Mesoamerican civilization', 'Mexican empire', 'Ancient people', 'All of the above'], correctAnswer: 3 },
                { question: 'What was the Indus Valley Civilization?', options: ['Ancient Indian civilization', 'Pakistan region', 'Bronze Age culture', 'All of the above'], correctAnswer: 3 },
                { question: 'Who were the Mayans?', options: ['Central American civilization', 'Mesoamerican culture', 'Ancient people', 'All of the above'], correctAnswer: 3 },
                { question: 'What was Ancient Greece known for?', options: ['Democracy', 'Philosophy', 'Olympics', 'All of the above'], correctAnswer: 3 },
                { question: 'What was the Inca Empire?', options: ['South American civilization', 'Andean empire', 'Peruvian culture', 'All of the above'], correctAnswer: 3 },
                { question: 'Who were the Vikings?', options: ['Norse seafarers', 'Scandinavian warriors', 'Explorers', 'All of the above'], correctAnswer: 3 },
                { question: 'What was the Persian Empire?', options: ['Ancient Iranian empire', 'Middle Eastern power', 'Achaemenid dynasty', 'All of the above'], correctAnswer: 3 },
                { question: 'What was the Byzantine Empire?', options: ['Eastern Roman Empire', 'Medieval empire', 'Constantinople-based', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 33: Medieval History
            33: [
                { question: 'When was the Middle Ages?', options: ['5th-15th century', 'Dark Ages', 'Medieval period', 'All of the above'], correctAnswer: 3 },
                { question: 'What were the Crusades?', options: ['Religious wars', 'Holy wars', 'Christian-Muslim conflicts', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Charlemagne?', options: ['Frankish king', 'Holy Roman Emperor', 'Medieval ruler', 'All of the above'], correctAnswer: 3 },
                { question: 'What was feudalism?', options: ['Social system', 'Land-based hierarchy', 'Medieval structure', 'All of the above'], correctAnswer: 3 },
                { question: 'What was the Black Death?', options: ['Plague pandemic', 'Bubonic plague', '14th century disease', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Joan of Arc?', options: ['French heroine', 'Military leader', 'Saint', 'All of the above'], correctAnswer: 3 },
                { question: 'What were castles used for?', options: ['Fortification', 'Noble residence', 'Defense', 'All of the above'], correctAnswer: 3 },
                { question: 'What was knighthood?', options: ['Chivalric order', 'Warrior class', 'Honorary title', 'All of the above'], correctAnswer: 3 },
                { question: 'What was the Magna Carta?', options: ['English charter', 'Rights document', '1215 treaty', 'All of the above'], correctAnswer: 3 },
                { question: 'Who were the Mongols?', options: ['Asian empire', 'Genghis Khan\'s people', 'Nomadic conquerors', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 34: Modern History
            34: [
                { question: 'When did World War I start?', options: ['1914', '1917', '1915', '1913'], correctAnswer: 0 },
                { question: 'Who was Winston Churchill?', options: ['British PM', 'WWII leader', 'Statesman', 'All of the above'], correctAnswer: 3 },
                { question: 'When did the Russian Revolution happen?', options: ['1917', '1905', '1918', '1916'], correctAnswer: 0 },
                { question: 'What was the Great Depression?', options: ['Economic crisis', '1930s downturn', 'Global recession', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Martin Luther King Jr.?', options: ['Civil rights leader', 'Activist', 'Speaker', 'All of the above'], correctAnswer: 3 },
                { question: 'When did the Vietnam War end?', options: ['1975', '1973', '1968', '1972'], correctAnswer: 0 },
                { question: 'What was the Space Race?', options: ['US-Soviet competition', 'Space exploration', 'Cold War aspect', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Nelson Mandela?', options: ['South African leader', 'Anti-apartheid activist', 'President', 'All of the above'], correctAnswer: 3 },
                { question: 'When did the Berlin Wall fall?', options: ['1989', '1990', '1988', '1987'], correctAnswer: 0 },
                { question: 'What was the European Union formed?', options: ['1993', '1992', '1991', '1994'], correctAnswer: 0 }
            ],
            
            // Test 35: World Geography
            35: [
                { question: 'What is the largest continent?', options: ['Asia', 'Africa', 'North America', 'Europe'], correctAnswer: 0 },
                { question: 'What is the longest river in the world?', options: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], correctAnswer: 0 },
                { question: 'What is the highest mountain?', options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse'], correctAnswer: 0 },
                { question: 'What is the largest ocean?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correctAnswer: 0 },
                { question: 'What is the largest desert?', options: ['Sahara', 'Arabian', 'Gobi', 'Kalahari'], correctAnswer: 0 },
                { question: 'Which country has the most population?', options: ['China', 'India', 'USA', 'Indonesia'], correctAnswer: 0 },
                { question: 'What is the smallest country?', options: ['Vatican City', 'Monaco', 'San Marino', 'Liechtenstein'], correctAnswer: 0 },
                { question: 'What is the deepest ocean?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correctAnswer: 0 },
                { question: 'What is the largest country by area?', options: ['Russia', 'Canada', 'USA', 'China'], correctAnswer: 0 },
                { question: 'What is the capital of Japan?', options: ['Tokyo', 'Kyoto', 'Osaka', 'Nagoya'], correctAnswer: 0 }
            ],
            
            // Test 36: Physical Geography
            36: [
                { question: 'What is the study of landforms called?', options: ['Geomorphology', 'Geology', 'Geography', 'Cartography'], correctAnswer: 0 },
                { question: 'What is the Earth\'s outermost layer?', options: ['Crust', 'Mantle', 'Core', 'Lithosphere'], correctAnswer: 0 },
                { question: 'What causes earthquakes?', options: ['Tectonic plate movement', 'Volcanic activity', 'Landslides', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a volcano?', options: ['Mountain that erupts', 'Opening in Earth\'s crust', 'Magma vent', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the water cycle?', options: ['Movement of water', 'Evaporation and precipitation', 'Hydrologic cycle', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a glacier?', options: ['Mass of ice', 'Slow-moving ice', 'Ice formation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is erosion?', options: ['Wearing away of land', 'Soil movement', 'Wind/water action', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the atmosphere?', options: ['Layer of gases', 'Air around Earth', 'Weather layer', 'All of the above'], correctAnswer: 3 },
                { question: 'What is climate?', options: ['Long-term weather pattern', 'Average weather', 'Regional conditions', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a biome?', options: ['Ecosystem region', 'Climate zone', 'Habitat type', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 37: Human Geography
            37: [
                { question: 'What is population density?', options: ['People per area', 'Population count', 'Urban spread', 'Rural distribution'], correctAnswer: 0 },
                { question: 'What is urbanization?', options: ['Movement to cities', 'City growth', 'Urban development', 'All of the above'], correctAnswer: 3 },
                { question: 'What is migration?', options: ['Movement of people', 'Relocation', 'Population shift', 'All of the above'], correctAnswer: 3 },
                { question: 'What is culture?', options: ['Shared beliefs and customs', 'Social behavior', 'Traditions', 'All of the above'], correctAnswer: 3 },
                { question: 'What is language?', options: ['Communication system', 'Spoken/written words', 'Human expression', 'All of the above'], correctAnswer: 3 },
                { question: 'What is religion?', options: ['Belief system', 'Faith', 'Worship', 'All of the above'], correctAnswer: 3 },
                { question: 'What is economics?', options: ['Production and consumption', 'Resource allocation', 'Wealth study', 'All of the above'], correctAnswer: 3 },
                { question: 'What is political geography?', options: ['Study of boundaries', 'Governments and space', 'Territorial division', 'All of the above'], correctAnswer: 3 },
                { question: 'What is agriculture?', options: ['Farming', 'Crop cultivation', 'Food production', 'All of the above'], correctAnswer: 3 },
                { question: 'What is development?', options: ['Economic growth', 'Standard of living', 'Progress', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 38: Art History
            38: [
                { question: 'Who painted the Mona Lisa?', options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'], correctAnswer: 0 },
                { question: 'What period was the Renaissance?', options: ['14th-17th century', 'Middle Ages', '18th century', '19th century'], correctAnswer: 0 },
                { question: 'Who painted The Starry Night?', options: ['Vincent van Gogh', 'Pablo Picasso', 'Claude Monet', 'Salvador Dali'], correctAnswer: 0 },
                { question: 'What is Impressionism?', options: ['Art movement', '19th century style', 'Light and color focus', 'All of the above'], correctAnswer: 3 },
                { question: 'Who sculpted David?', options: ['Michelangelo', 'Donatello', 'Bernini', 'Rodin'], correctAnswer: 0 },
                { question: 'What is Cubism?', options: ['Abstract art style', 'Geometric forms', 'Picasso/Braque', 'All of the above'], correctAnswer: 3 },
                { question: 'Who painted The Persistence of Memory?', options: ['Salvador Dali', 'Pablo Picasso', 'Henri Matisse', 'Andy Warhol'], correctAnswer: 0 },
                { question: 'What is Baroque art?', options: ['17th century style', 'Dramatic/ornate', 'Caravaggio/Bernini', 'All of the above'], correctAnswer: 3 },
                { question: 'Who painted The Scream?', options: ['Edvard Munch', 'Gustav Klimt', 'Egon Schiele', 'James Ensor'], correctAnswer: 0 },
                { question: 'What is Surrealism?', options: ['Dream-like art', 'Unconscious expression', 'Dali/Magritte', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 39: Music Theory
            39: [
                { question: 'What are the basic elements of music?', options: ['Rhythm, melody, harmony', 'Notes, chords, tempo', 'Pitch, dynamics, timbre', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a scale?', options: ['Series of notes', 'Musical pattern', 'Pitch sequence', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a chord?', options: ['Multiple notes together', 'Harmonic unit', 'Triad', 'All of the above'], correctAnswer: 3 },
                { question: 'What is rhythm?', options: ['Pattern of beats', 'Time element', 'Duration pattern', 'All of the above'], correctAnswer: 3 },
                { question: 'What is melody?', options: ['Sequence of notes', 'Musical line', 'Tune', 'All of the above'], correctAnswer: 3 },
                { question: 'What is harmony?', options: ['Combination of notes', 'Chord progression', 'Vertical aspect', 'All of the above'], correctAnswer: 3 },
                { question: 'What is tempo?', options: ['Speed of music', 'Beats per minute', 'Pace', 'All of the above'], correctAnswer: 3 },
                { question: 'What is dynamics?', options: ['Volume levels', 'Loudness/softness', 'Expression', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a key in music?', options: ['Tonal center', 'Scale basis', 'Key signature', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an interval?', options: ['Distance between notes', 'Pitch difference', 'Musical gap', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 40: Film and Cinema
            40: [
                { question: 'Who directed Citizen Kane?', options: ['Orson Welles', 'Alfred Hitchcock', 'Stanley Kubrick', 'Francis Ford Coppola'], correctAnswer: 0 },
                { question: 'What is the highest-grossing film of all time?', options: ['Avatar', 'Titanic', 'Avengers: Endgame', 'Star Wars'], correctAnswer: 0 },
                { question: 'Who won Best Actor at the 2024 Oscars?', options: ['Cillian Murphy', 'Leonardo DiCaprio', 'Bradley Cooper', 'Colman Domingo'], correctAnswer: 0 },
                { question: 'What is a director responsible for?', options: ['Overseeing film creation', 'Guiding actors', 'Creative vision', 'All of the above'], correctAnswer: 3 },
                { question: 'What is cinematography?', options: ['Art of camera work', 'Lighting and framing', 'Visual storytelling', 'All of the above'], correctAnswer: 3 },
                { question: 'What is editing?', options: ['Assembling footage', 'Post-production', 'Scene sequencing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a screenplay?', options: ['Written script', 'Dialogue and action', 'Story blueprint', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a genre?', options: ['Film category', 'Style type', 'Drama/comedy etc', 'All of the above'], correctAnswer: 3 },
                { question: 'What is animation?', options: ['Moving images', 'Cartoon creation', 'Frame-by-frame', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a documentary?', options: ['Non-fiction film', 'Factual content', 'Educational', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 41: Literature Classics
            41: [
                { question: 'Who wrote Romeo and Juliet?', options: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain'], correctAnswer: 0 },
                { question: 'Who wrote 1984?', options: ['George Orwell', 'Aldous Huxley', 'Ray Bradbury', 'H.G. Wells'], correctAnswer: 0 },
                { question: 'Who wrote Pride and Prejudice?', options: ['Jane Austen', 'Emily Brontë', 'Charles Dickens', 'George Eliot'], correctAnswer: 0 },
                { question: 'Who wrote The Great Gatsby?', options: ['F. Scott Fitzgerald', 'Ernest Hemingway', 'John Steinbeck', 'William Faulkner'], correctAnswer: 0 },
                { question: 'Who wrote Moby Dick?', options: ['Herman Melville', 'Nathaniel Hawthorne', 'Edgar Allan Poe', 'Henry David Thoreau'], correctAnswer: 0 },
                { question: 'Who wrote War and Peace?', options: ['Leo Tolstoy', 'Fyodor Dostoevsky', 'Anton Chekhov', 'Ivan Turgenev'], correctAnswer: 0 },
                { question: 'Who wrote The Odyssey?', options: ['Homer', 'Virgil', 'Sophocles', 'Euripides'], correctAnswer: 0 },
                { question: 'Who wrote Don Quixote?', options: ['Miguel de Cervantes', 'Gabriel García Márquez', 'Jorge Luis Borges', 'Pablo Neruda'], correctAnswer: 0 },
                { question: 'Who wrote The Divine Comedy?', options: ['Dante Alighieri', 'Giovanni Boccaccio', 'Francesco Petrarca', 'Niccolò Machiavelli'], correctAnswer: 0 },
                { question: 'Who wrote Crime and Punishment?', options: ['Fyodor Dostoevsky', 'Leo Tolstoy', 'Alexander Pushkin', 'Nikolai Gogol'], correctAnswer: 0 }
            ],
            
            // Test 42: Modern Literature
            42: [
                { question: 'Who wrote Harry Potter series?', options: ['J.K. Rowling', 'J.R.R. Tolkien', 'C.S. Lewis', 'Philip Pullman'], correctAnswer: 0 },
                { question: 'Who wrote The Lord of the Rings?', options: ['J.R.R. Tolkien', 'C.S. Lewis', 'George R.R. Martin', 'Terry Pratchett'], correctAnswer: 0 },
                { question: 'Who wrote The Da Vinci Code?', options: ['Dan Brown', 'John Grisham', 'Stephen King', 'Michael Crichton'], correctAnswer: 0 },
                { question: 'Who wrote The Girl with the Dragon Tattoo?', options: ['Stieg Larsson', 'Henning Mankell', 'Jo Nesbø', 'Kurt Wallander'], correctAnswer: 0 },
                { question: 'Who wrote The Kite Runner?', options: ['Khaled Hosseini', 'Salman Rushdie', 'Arundhati Roy', 'Vikram Seth'], correctAnswer: 0 },
                { question: 'Who wrote The Road?', options: ['Cormac McCarthy', 'Don DeLillo', 'Philip Roth', 'Jonathan Franzen'], correctAnswer: 0 },
                { question: 'Who wrote Life of Pi?', options: ['Yann Martel', 'Margaret Atwood', 'Michael Ondaatje', 'Alice Munro'], correctAnswer: 0 },
                { question: 'Who wrote The Alchemist?', options: ['Paulo Coelho', 'Gabriel García Márquez', 'Isabel Allende', 'Mario Vargas Llosa'], correctAnswer: 0 },
                { question: 'Who wrote The Hunger Games?', options: ['Suzanne Collins', 'Stephenie Meyer', 'Veronica Roth', 'Cassandra Clare'], correctAnswer: 0 },
                { question: 'Who wrote The Martian?', options: ['Andy Weir', 'Ernest Cline', 'Blake Crouch', 'Neal Stephenson'], correctAnswer: 0 }
            ],
            
            // Test 43: Philosophy Basics
            43: [
                { question: 'Who was Socrates?', options: ['Greek philosopher', 'Teacher of Plato', 'Athenian thinker', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Plato known for?', options: ['Theory of Forms', 'The Republic', 'Student of Socrates', 'All of the above'], correctAnswer: 3 },
                { question: 'Who wrote The Nicomachean Ethics?', options: ['Aristotle', 'Plato', 'Socrates', 'Epicurus'], correctAnswer: 0 },
                { question: 'What is Stoicism?', options: ['Ancient philosophy', 'Virtue and reason', 'Emotional control', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was René Descartes?', options: ['French philosopher', 'Cogito ergo sum', 'Rationalist', 'All of the above'], correctAnswer: 3 },
                { question: 'What is existentialism?', options: ['Philosophical movement', 'Individual freedom', 'Sartre/Camus', 'All of the above'], correctAnswer: 3 },
                { question: 'Who wrote Thus Spoke Zarathustra?', options: ['Friedrich Nietzsche', 'Arthur Schopenhauer', 'Immanuel Kant', 'Georg Hegel'], correctAnswer: 0 },
                { question: 'What is utilitarianism?', options: ['Ethical theory', 'Greatest good', 'Bentham/Mill', 'All of the above'], correctAnswer: 3 },
                { question: 'Who wrote The Social Contract?', options: ['Jean-Jacques Rousseau', 'John Locke', 'Thomas Hobbes', 'Voltaire'], correctAnswer: 0 },
                { question: 'What is metaphysics?', options: ['Study of reality', 'Being and existence', 'First principles', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 44: World Religions
            44: [
                { question: 'What is Christianity based on?', options: ['Life of Jesus Christ', 'Bible teachings', 'Christian faith', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Islam?', options: ['Monotheistic religion', 'Quran teachings', 'Prophet Muhammad', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Judaism?', options: ['Jewish faith', 'Torah teachings', 'Covenant with God', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Hinduism?', options: ['Dharmic religion', 'Karma and reincarnation', 'Many deities', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Buddhism?', options: ['Teachings of Buddha', 'Four Noble Truths', 'Eightfold Path', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Sikhism?', options: ['Monotheistic religion', 'Guru Nanak', 'Punjab region', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Taoism?', options: ['Chinese philosophy', 'Tao Te Ching', 'Lao Tzu', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Confucianism?', options: ['Chinese ethics', 'Confucius teachings', 'Social harmony', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Shinto?', options: ['Japanese religion', 'Kami worship', 'Tradition', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Jainism?', options: ['Indian religion', 'Non-violence', 'Asceticism', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 45: Mythology
            45: [
                { question: 'Who was Zeus in Greek mythology?', options: ['King of gods', 'Sky god', 'Ruler of Olympus', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Thor in Norse mythology?', options: ['God of thunder', 'Son of Odin', 'Hammer wielder', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Ra in Egyptian mythology?', options: ['Sun god', 'King of gods', 'Creator deity', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Odin?', options: ['Norse chief god', 'God of wisdom', 'All-father', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Athena?', options: ['Greek goddess of wisdom', 'Warrior goddess', 'Daughter of Zeus', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Anubis?', options: ['Egyptian god of death', 'Mummification', 'Jackal-headed', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Loki?', options: ['Norse trickster god', 'Shape-shifter', 'Causing chaos', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Hercules?', options: ['Greek hero', 'Son of Zeus', 'Twelve labors', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Quetzalcoatl?', options: ['Aztec feathered serpent', 'God of wind', 'Creator deity', 'All of the above'], correctAnswer: 3 },
                { question: 'Who was Amaterasu?', options: ['Japanese sun goddess', 'Shinto deity', 'Imperial ancestor', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 46: Current Affairs 2024
            46: [
                { question: 'Who won the 2024 US Presidential Election?', options: ['Joe Biden', 'Donald Trump', 'Kamala Harris', 'Robert Kennedy'], correctAnswer: 0 },
                { question: 'Which country hosted the 2024 Summer Olympics?', options: ['France', 'USA', 'Japan', 'UK'], correctAnswer: 0 },
                { question: 'What major AI advancement occurred in 2024?', options: ['GPT-5 release', 'AI regulations', 'New models', 'All of the above'], correctAnswer: 3 },
                { question: 'Which company reached $3 trillion market cap in 2024?', options: ['Apple', 'Microsoft', 'NVIDIA', 'Google'], correctAnswer: 2 },
                { question: 'What climate event affected many regions in 2024?', options: ['Extreme heat', 'Flooding', 'Wildfires', 'All of the above'], correctAnswer: 3 },
                { question: 'Which countries joined BRICS in 2024?', options: ['New members', 'Expansion', 'Multiple nations', 'All of the above'], correctAnswer: 3 },
                { question: 'What was a major tech trend in 2024?', options: ['AI integration', 'Quantum computing', 'AR/VR advancement', 'All of the above'], correctAnswer: 3 },
                { question: 'Which space mission launched in 2024?', options: ['Artemis II', 'Lunar mission', 'Mars sample return', 'All of the above'], correctAnswer: 3 },
                { question: 'What economic trend dominated 2024?', options: ['Inflation control', 'Interest rates', 'Global recovery', 'All of the above'], correctAnswer: 3 },
                { question: 'Which global conflicts continued in 2024?', options: ['Ukraine-Russia', 'Israel-Gaza', 'Multiple regions', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 47: Politics Today
            47: [
                { question: 'What is democracy?', options: ['Rule by the people', 'Voting system', 'Representative government', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a republic?', options: ['State without monarch', 'Representative democracy', 'Elected officials', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a political party?', options: ['Group with common views', 'Election participation', 'Policy advocacy', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a constitution?', options: ['Fundamental laws', 'Governing document', 'Rights framework', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the United Nations?', options: ['International organization', 'Peace and security', 'Global cooperation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is NATO?', options: ['Military alliance', 'North Atlantic Treaty', 'Defense organization', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the European Union?', options: ['Political union', 'Economic integration', 'Member states', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a presidential system?', options: ['Executive branch led by president', 'Separation of powers', 'Head of state/government', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a parliamentary system?', options: ['Prime minister as head', 'Legislative supremacy', 'Cabinet government', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a monarchy?', options: ['Rule by monarch', 'King or queen', 'Hereditary succession', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 48: International Relations
            48: [
                { question: 'What is diplomacy?', options: ['International negotiation', 'Foreign relations', 'State communication', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an embassy?', options: ['Diplomatic mission', 'Ambassador\'s residence', 'Foreign representation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a treaty?', options: ['Formal agreement', 'International contract', 'Binding pact', 'All of the above'], correctAnswer: 3 },
                { question: 'What is globalization?', options: ['Global integration', 'Economic interconnection', 'Cultural exchange', 'All of the above'], correctAnswer: 3 },
                { question: 'What is foreign policy?', options: ['State\'s international strategy', 'Diplomatic approach', 'Global relations', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a sanction?', options: ['Penalty against state', 'Economic restriction', 'Political pressure', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the World Trade Organization?', options: ['Trade regulation', 'Global commerce', 'Dispute resolution', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the International Monetary Fund?', options: ['Financial institution', 'Economic stability', 'Loan provider', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a bilateral relationship?', options: ['Two-state relations', 'Mutual agreements', 'Diplomatic ties', 'All of the above'], correctAnswer: 3 },
                { question: 'What is multilateralism?', options: ['Multiple state cooperation', 'International alliances', 'Global governance', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 49: Economic Updates
            49: [
                { question: 'What is inflation?', options: ['Rising prices', 'Money devaluation', 'Economic indicator', 'All of the above'], correctAnswer: 3 },
                { question: 'What is GDP?', options: ['Gross Domestic Product', 'Economic output', 'National income', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a recession?', options: ['Economic decline', 'Negative growth', 'Downturn', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the stock market?', options: ['Share trading', 'Equity exchange', 'Investment platform', 'All of the above'], correctAnswer: 3 },
                { question: 'What is cryptocurrency?', options: ['Digital currency', 'Blockchain-based', 'Bitcoin/Ethereum', 'All of the above'], correctAnswer: 3 },
                { question: 'What is interest rate?', options: ['Cost of borrowing', 'Lending charge', 'Central bank tool', 'All of the above'], correctAnswer: 3 },
                { question: 'What is unemployment rate?', options: ['Jobless percentage', 'Labor force measure', 'Economic health', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a budget?', options: ['Financial plan', 'Revenue/expense', 'Government spending', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a trade deficit?', options: ['Imports exceed exports', 'Trade imbalance', 'Negative balance', 'All of the above'], correctAnswer: 3 },
                { question: 'What is fiscal policy?', options: ['Government spending/tax', 'Economic management', 'Budget decisions', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 50: Technology News
            50: [
                { question: 'What is artificial intelligence?', options: ['Machine intelligence', 'AI systems', 'Smart technology', 'All of the above'], correctAnswer: 3 },
                { question: 'What is 5G?', options: ['Fifth generation network', 'Mobile technology', 'Fast internet', 'All of the above'], correctAnswer: 3 },
                { question: 'What is cloud computing?', options: ['Internet-based computing', 'Remote servers', 'Data storage', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the Internet of Things?', options: ['Connected devices', 'Smart objects', 'Network integration', 'All of the above'], correctAnswer: 3 },
                { question: 'What is blockchain?', options: ['Distributed ledger', 'Cryptocurrency tech', 'Secure transactions', 'All of the above'], correctAnswer: 3 },
                { question: 'What is virtual reality?', options: ['Immersive simulation', 'Computer-generated environment', 'VR headsets', 'All of the above'], correctAnswer: 3 },
                { question: 'What is augmented reality?', options: ['Digital overlay', 'Real-world enhancement', 'AR applications', 'All of the above'], correctAnswer: 3 },
                { question: 'What is quantum computing?', options: ['Quantum mechanics based', 'Advanced computing', 'Qubit processing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is cybersecurity?', options: ['System protection', 'Data security', 'Threat prevention', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a smartphone?', options: ['Mobile phone', 'Computing device', 'Communication tool', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 51: Science Discoveries
            51: [
                { question: 'Who developed the theory of relativity?', options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Stephen Hawking'], correctAnswer: 0 },
                { question: 'What is DNA?', options: ['Genetic material', 'Deoxyribonucleic acid', 'Heredity molecule', 'All of the above'], correctAnswer: 3 },
                { question: 'Who discovered penicillin?', options: ['Alexander Fleming', 'Louis Pasteur', 'Joseph Lister', 'Robert Koch'], correctAnswer: 0 },
                { question: 'What is the periodic table?', options: ['Element classification', 'Chemical elements', 'Mendeleev\'s creation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is evolution?', options: ['Species change over time', 'Natural selection', 'Darwin\'s theory', 'All of the above'], correctAnswer: 3 },
                { question: 'Who discovered gravity?', options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Nicolaus Copernicus'], correctAnswer: 0 },
                { question: 'What is a black hole?', options: ['Space phenomenon', 'Gravity intense', 'Light cannot escape', 'All of the above'], correctAnswer: 3 },
                { question: 'What is climate change?', options: ['Global warming', 'Weather patterns shift', 'Environmental change', 'All of the above'], correctAnswer: 3 },
                { question: 'Who discovered radioactivity?', options: ['Marie Curie', 'Henri Becquerel', 'Pierre Curie', 'Ernest Rutherford'], correctAnswer: 1 },
                { question: 'What is a vaccine?', options: ['Immunity booster', 'Disease prevention', 'Biological preparation', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 52: Environmental Issues
            52: [
                { question: 'What is climate change?', options: ['Global temperature rise', 'Weather pattern shift', 'Environmental crisis', 'All of the above'], correctAnswer: 3 },
                { question: 'What is global warming?', options: ['Earth\'s warming', 'Greenhouse effect', 'Temperature increase', 'All of the above'], correctAnswer: 3 },
                { question: 'What is pollution?', options: ['Environmental contamination', 'Harmful substances', 'Air/water/land', 'All of the above'], correctAnswer: 3 },
                { question: 'What is deforestation?', options: ['Forest removal', 'Tree clearing', 'Habitat loss', 'All of the above'], correctAnswer: 3 },
                { question: 'What is renewable energy?', options: ['Sustainable power', 'Solar/wind/hydro', 'Clean energy', 'All of the above'], correctAnswer: 3 },
                { question: 'What is recycling?', options: ['Waste processing', 'Material reuse', 'Resource conservation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is biodiversity?', options: ['Species variety', 'Ecosystem diversity', 'Biological richness', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an ecosystem?', options: ['Living community', 'Environment interaction', 'Biological system', 'All of the above'], correctAnswer: 3 },
                { question: 'What is conservation?', options: ['Resource protection', 'Nature preservation', 'Sustainable use', 'All of the above'], correctAnswer: 3 },
                { question: 'What is sustainability?', options: ['Meeting present needs', 'Future generations', 'Balance', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 53: Healthcare Updates
            53: [
                { question: 'What is universal healthcare?', options: ['Healthcare for all', 'Government system', 'Medical access', 'All of the above'], correctAnswer: 3 },
                { question: 'What is telemedicine?', options: ['Remote healthcare', 'Virtual consultations', 'Digital medicine', 'All of the above'], correctAnswer: 3 },
                { question: 'What is mental health?', options: ['Psychological wellbeing', 'Emotional health', 'Mental wellness', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a pandemic?', options: ['Global disease spread', 'Widespread illness', 'COVID-19 example', 'All of the above'], correctAnswer: 3 },
                { question: 'What is preventive medicine?', options: ['Disease prevention', 'Health maintenance', 'Early detection', 'All of the above'], correctAnswer: 3 },
                { question: 'What is personalized medicine?', options: ['Tailored treatment', 'Genetic-based', 'Individual care', 'All of the above'], correctAnswer: 3 },
                { question: 'What is health insurance?', options: ['Medical coverage', 'Risk protection', 'Healthcare payment', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a clinical trial?', options: ['Medical research', 'Treatment testing', 'Drug development', 'All of the above'], correctAnswer: 3 },
                { question: 'What is public health?', options: ['Community health', 'Population wellness', 'Disease prevention', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a vaccine?', options: ['Immunity booster', 'Disease prevention', 'Protection', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 54: Sports Events
            54: [
                { question: 'What are the Olympic Games?', options: ['International sports event', 'Multi-sport competition', 'Summer/Winter games', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the FIFA World Cup?', options: ['Soccer championship', 'Global tournament', 'Football event', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the Super Bowl?', options: ['NFL championship', 'American football final', 'US sports event', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Wimbledon?', options: ['Tennis tournament', 'Grand Slam event', 'UK championship', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the Tour de France?', options: ['Cycling race', 'Bicycle competition', 'French event', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the World Series?', options: ['Baseball championship', 'MLB final', 'US sports', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the UEFA Champions League?', options: ['European soccer', 'Club competition', 'Football tournament', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the NBA Finals?', options: ['Basketball championship', 'US league final', 'Sports event', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the Kentucky Derby?', options: ['Horse race', 'US equestrian event', 'Triple Crown race', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the Masters Tournament?', options: ['Golf championship', 'Major event', 'Augusta National', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 55: Entertainment News
            55: [
                { question: 'Who won the 2024 Oscar for Best Picture?', options: ['Oppenheimer', 'Barbie', 'Killers of the Flower Moon', 'Poor Things'], correctAnswer: 0 },
                { question: 'What is the highest-grossing film of 2024?', options: ['Dune: Part Two', 'Inside Out 2', 'Deadpool & Wolverine', 'Despicable Me 4'], correctAnswer: 0 },
                { question: 'Which artist won the 2024 Grammy for Album of the Year?', options: ['Taylor Swift', 'Billie Eilish', 'SZA', 'Olivia Rodrigo'], correctAnswer: 0 },
                { question: 'What popular TV series released in 2024?', options: ['The Last of Us S2', 'Stranger Things S5', 'House of the Dragon S2', 'All of the above'], correctAnswer: 3 },
                { question: 'Which celebrity had the most followers on Instagram in 2024?', options: ['Cristiano Ronaldo', 'Lionel Messi', 'Selena Gomez', 'Kylie Jenner'], correctAnswer: 0 },
                { question: 'What music tour was the highest-grossing in 2024?', options: ['Taylor Swift - Eras Tour', 'Beyoncé - Renaissance', 'Coldplay - Music of Spheres', 'Ed Sheeran - Mathematics'], correctAnswer: 0 },
                { question: 'Which streaming service dominated 2024?', options: ['Netflix', 'Amazon Prime', 'Disney+', 'Max'], correctAnswer: 0 },
                { question: 'What video game was most popular in 2024?', options: ['GTA VI', 'Call of Duty', 'Fortnite', 'Minecraft'], correctAnswer: 0 },
                { question: 'Who was named Time Person of the Year 2024?', options: ['Taylor Swift', 'Volodymyr Zelenskyy', 'Elon Musk', 'Joe Biden'], correctAnswer: 0 },
                { question: 'What celebrity couple got married in 2024?', options: ['Various couples', 'Celebrity weddings', 'Hollywood marriages', 'Multiple events'], correctAnswer: 3 }
            ],
            
            // ========== COURSES TESTS (56-75) ==========
            
            // Test 56: Database Management
            56: [
                { question: 'What is a database?', options: ['Organized data collection', 'Data storage', 'Information system', 'All of the above'], correctAnswer: 3 },
                { question: 'What is SQL?', options: ['Structured Query Language', 'Database language', 'Query language', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a primary key?', options: ['Unique identifier', 'Table key', 'Record ID', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a foreign key?', options: ['References another table', 'Relationship key', 'Link between tables', 'All of the above'], correctAnswer: 3 },
                { question: 'What is normalization?', options: ['Data organization', 'Reduce redundancy', 'Design process', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a transaction?', options: ['Unit of work', 'Database operation', 'ACID properties', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an index?', options: ['Performance optimization', 'Data structure', 'Fast lookup', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a view?', options: ['Virtual table', 'Saved query', 'Data representation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a stored procedure?', options: ['Saved SQL code', 'Database function', 'Reusable query', 'All of the above'], correctAnswer: 3 },
                { question: 'What is ACID?', options: ['Database properties', 'Atomicity, Consistency, Isolation, Durability', 'Transaction guarantees', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 57: Cyber Security
            57: [
                { question: 'What is a firewall?', options: ['Network security', 'Traffic filter', 'Access control', 'All of the above'], correctAnswer: 3 },
                { question: 'What is encryption?', options: ['Data protection', 'Encoding', 'Secure transmission', 'All of the above'], correctAnswer: 3 },
                { question: 'What is malware?', options: ['Malicious software', 'Virus', 'Trojan', 'All of the above'], correctAnswer: 3 },
                { question: 'What is phishing?', options: ['Email scam', 'Credential theft', 'Social engineering', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a VPN?', options: ['Virtual Private Network', 'Secure connection', 'Privacy tool', 'All of the above'], correctAnswer: 3 },
                { question: 'What is two-factor authentication?', options: ['2FA', 'Extra security', 'MFA', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a DDoS attack?', options: ['Distributed Denial of Service', 'Traffic flooding', 'Service disruption', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a vulnerability?', options: ['Security weakness', 'System flaw', 'Attack vector', 'All of the above'], correctAnswer: 3 },
                { question: 'What is penetration testing?', options: ['Security testing', 'Ethical hacking', 'Vulnerability assessment', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a security policy?', options: ['Security rules', 'Guidelines', 'Best practices', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 58: Data Science
            58: [
                { question: 'What is data science?', options: ['Data analysis field', 'Interdisciplinary', 'Insights extraction', 'All of the above'], correctAnswer: 3 },
                { question: 'What is machine learning?', options: ['AI subset', 'Predictive modeling', 'Pattern recognition', 'All of the above'], correctAnswer: 3 },
                { question: 'What is data visualization?', options: ['Data representation', 'Charts and graphs', 'Visual analytics', 'All of the above'], correctAnswer: 3 },
                { question: 'What is big data?', options: ['Large datasets', 'Complex data', 'Volume, Velocity, Variety', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Python used for in data science?', options: ['Analysis', 'Modeling', 'Visualization', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a dataset?', options: ['Data collection', 'Structured data', 'Information set', 'All of the above'], correctAnswer: 3 },
                { question: 'What is statistical analysis?', options: ['Data analysis', 'Statistics application', 'Numerical methods', 'All of the above'], correctAnswer: 3 },
                { question: 'What is data cleaning?', options: ['Data preprocessing', 'Removing errors', 'Quality improvement', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a predictive model?', options: ['Forecasting tool', 'ML model', 'Prediction algorithm', 'All of the above'], correctAnswer: 3 },
                { question: 'What is artificial intelligence?', options: ['AI', 'Machine intelligence', 'Smart systems', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 59: Artificial Intelligence
            59: [
                { question: 'What is AI?', options: ['Artificial Intelligence', 'Machine intelligence', 'Smart systems', 'All of the above'], correctAnswer: 3 },
                { question: 'What is machine learning?', options: ['AI subset', 'Learning from data', 'Algorithm training', 'All of the above'], correctAnswer: 3 },
                { question: 'What is deep learning?', options: ['Neural networks', 'ML subset', 'Multiple layers', 'All of the above'], correctAnswer: 3 },
                { question: 'What is natural language processing?', options: ['NLP', 'Language understanding', 'Text analysis', 'All of the above'], correctAnswer: 3 },
                { question: 'What is computer vision?', options: ['Image recognition', 'Visual processing', 'Machine sight', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a neural network?', options: ['AI model', 'Brain-inspired', 'Layered structure', 'All of the above'], correctAnswer: 3 },
                { question: 'What is supervised learning?', options: ['Labeled data', 'Training with examples', 'Guided learning', 'All of the above'], correctAnswer: 3 },
                { question: 'What is unsupervised learning?', options: ['Unlabeled data', 'Pattern discovery', 'Clustering', 'All of the above'], correctAnswer: 3 },
                { question: 'What is reinforcement learning?', options: ['Reward-based learning', 'Agent training', 'Decision making', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a chatbot?', options: ['Conversational AI', 'Virtual assistant', 'Dialog system', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 60: Digital Marketing
            60: [
                { question: 'What is SEO?', options: ['Search Engine Optimization', 'Website ranking', 'Traffic growth', 'All of the above'], correctAnswer: 3 },
                { question: 'What is social media marketing?', options: ['Platform promotion', 'Content sharing', 'Audience engagement', 'All of the above'], correctAnswer: 3 },
                { question: 'What is email marketing?', options: ['Email campaigns', 'Newsletter', 'Customer outreach', 'All of the above'], correctAnswer: 3 },
                { question: 'What is content marketing?', options: ['Content creation', 'Value delivery', 'Brand building', 'All of the above'], correctAnswer: 3 },
                { question: 'What is PPC?', options: ['Pay-Per-Click', 'Paid advertising', 'Google Ads', 'All of the above'], correctAnswer: 3 },
                { question: 'What is analytics in marketing?', options: ['Data analysis', 'Performance tracking', 'ROI measurement', 'All of the above'], correctAnswer: 3 },
                { question: 'What is conversion rate?', options: ['Action percentage', 'Goal completion', 'Success metric', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a landing page?', options: ['Campaign page', 'Conversion page', 'Destination page', 'All of the above'], correctAnswer: 3 },
                { question: 'What is CRM?', options: ['Customer Relationship Management', 'Customer data', 'Relationship tool', 'All of the above'], correctAnswer: 3 },
                { question: 'What is influencer marketing?', options: ['Influencer partnership', 'Social promotion', 'Brand advocacy', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 61: Project Management
            61: [
                { question: 'What is project management?', options: ['Planning and organizing', 'Resource management', 'Goal achievement', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a project?', options: ['Temporary endeavor', 'Unique product/service', 'Defined objectives', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the project life cycle?', options: ['Initiation to closure', 'Project phases', 'Development stages', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Gantt chart?', options: ['Project schedule', 'Bar chart', 'Timeline visualization', 'All of the above'], correctAnswer: 3 },
                { question: 'What is risk management?', options: ['Identifying risks', 'Risk assessment', 'Mitigation planning', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a stakeholder?', options: ['Interested party', 'Project affected', 'Involved individual', 'All of the above'], correctAnswer: 3 },
                { question: 'What is scope creep?', options: ['Uncontrolled changes', 'Project expansion', 'Requirement additions', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Agile methodology?', options: ['Iterative approach', 'Flexible development', 'Sprint-based', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Waterfall model?', options: ['Sequential phases', 'Traditional approach', 'Linear development', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a milestone?', options: ['Significant event', 'Project marker', 'Key achievement', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 62: Business Analytics
            62: [
                { question: 'What is business analytics?', options: ['Data analysis for business', 'Decision support', 'Insights generation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is descriptive analytics?', options: ['What happened?', 'Historical data', 'Reporting', 'All of the above'], correctAnswer: 3 },
                { question: 'What is predictive analytics?', options: ['What might happen?', 'Forecasting', 'Future trends', 'All of the above'], correctAnswer: 3 },
                { question: 'What is prescriptive analytics?', options: ['What should we do?', 'Recommendations', 'Optimization', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a KPI?', options: ['Key Performance Indicator', 'Metric', 'Success measure', 'All of the above'], correctAnswer: 3 },
                { question: 'What is data mining?', options: ['Pattern discovery', 'Data exploration', 'Knowledge extraction', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a dashboard?', options: ['Visual display', 'Metrics overview', 'Data visualization', 'All of the above'], correctAnswer: 3 },
                { question: 'What is ROI?', options: ['Return on Investment', 'Profitability measure', 'Financial metric', 'All of the above'], correctAnswer: 3 },
                { question: 'What is segmentation?', options: ['Grouping customers', 'Market division', 'Target classification', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a trend analysis?', options: ['Pattern examination', 'Direction identification', 'Time series', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 63: Financial Planning
            63: [
                { question: 'What is financial planning?', options: ['Money management', 'Goal setting', 'Resource allocation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a budget?', options: ['Income/expense plan', 'Financial roadmap', 'Spending guide', 'All of the above'], correctAnswer: 3 },
                { question: 'What is saving?', options: ['Money preservation', 'Future use', 'Income not spent', 'All of the above'], correctAnswer: 3 },
                { question: 'What is investing?', options: ['Asset purchase', 'Wealth building', 'Future returns', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a stock?', options: ['Company share', 'Equity ownership', 'Security', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a bond?', options: ['Debt security', 'Fixed income', 'Loan to entity', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a mutual fund?', options: ['Pooled investment', 'Diversified portfolio', 'Managed fund', 'All of the above'], correctAnswer: 3 },
                { question: 'What is retirement planning?', options: ['Future income', 'Pension saving', 'Post-work funds', 'All of the above'], correctAnswer: 3 },
                { question: 'What is insurance?', options: ['Risk protection', 'Coverage', 'Financial safety', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a tax?', options: ['Government levy', 'Income charge', 'Obligation', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 64: Entrepreneurship
            64: [
                { question: 'What is entrepreneurship?', options: ['Business creation', 'Innovation', 'Risk-taking', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a startup?', options: ['New business', 'Young company', 'Venture', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a business plan?', options: ['Company roadmap', 'Strategy document', 'Operation guide', 'All of the above'], correctAnswer: 3 },
                { question: 'What is funding?', options: ['Capital raising', 'Investment', 'Financial support', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a pitch?', options: ['Presentation', 'Idea proposal', 'Investor talk', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a market?', options: ['Customer segment', 'Industry', 'Demand source', 'All of the above'], correctAnswer: 3 },
                { question: 'What is competition?', options: ['Rival businesses', 'Market players', 'Competitive force', 'All of the above'], correctAnswer: 3 },
                { question: 'What is innovation?', options: ['New idea', 'Improvement', 'Creative solution', 'All of the above'], correctAnswer: 3 },
                { question: 'What is scalability?', options: ['Growth potential', 'Expansion ability', 'Increasing returns', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a mentor?', options: ['Advisor', 'Guide', 'Experience sharer', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 65: Public Speaking
            65: [
                { question: 'What is public speaking?', options: ['Talking to audience', 'Speech delivery', 'Communication', 'All of the above'], correctAnswer: 3 },
                { question: 'What is stage fright?', options: ['Nervousness', 'Performance anxiety', 'Fear', 'All of the above'], correctAnswer: 3 },
                { question: 'What is body language?', options: ['Nonverbal communication', 'Gestures/posture', 'Physical expression', 'All of the above'], correctAnswer: 3 },
                { question: 'What is eye contact?', options: ['Audience connection', 'Visual engagement', 'Attention holding', 'All of the above'], correctAnswer: 3 },
                { question: 'What is vocal variety?', options: ['Voice modulation', 'Tone/pitch change', 'Expression', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a speech structure?', options: ['Introduction/body/conclusion', 'Organization', 'Framework', 'All of the above'], correctAnswer: 3 },
                { question: 'What is audience analysis?', options: ['Understanding listeners', 'Demographic study', 'Interest assessment', 'All of the above'], correctAnswer: 3 },
                { question: 'What is storytelling?', options: ['Narrative technique', 'Engagement method', 'Example sharing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a visual aid?', options: ['Presentation tool', 'Slides', 'Props', 'All of the above'], correctAnswer: 3 },
                { question: 'What is practice?', options: ['Rehearsal', 'Preparation', 'Skill improvement', 'All of the above'], correctAnswer: 3 }
            ],
            
            // ========== CERTIFICATION TESTS (66-85) ==========
            
            // Test 66: AWS Certified Solutions Architect
            66: [
                { question: 'What is AWS?', options: ['Amazon Web Services', 'Cloud platform', 'Computing services', 'All of the above'], correctAnswer: 3 },
                { question: 'What is EC2?', options: ['Elastic Compute Cloud', 'Virtual servers', 'Compute service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is S3?', options: ['Simple Storage Service', 'Object storage', 'Data lake', 'All of the above'], correctAnswer: 3 },
                { question: 'What is VPC?', options: ['Virtual Private Cloud', 'Network isolation', 'AWS networking', 'All of the above'], correctAnswer: 3 },
                { question: 'What is IAM?', options: ['Identity and Access Management', 'User management', 'Permissions', 'All of the above'], correctAnswer: 3 },
                { question: 'What is RDS?', options: ['Relational Database Service', 'Managed database', 'SQL service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Lambda?', options: ['Serverless compute', 'Function service', 'Event-driven', 'All of the above'], correctAnswer: 3 },
                { question: 'What is CloudFormation?', options: ['Infrastructure as Code', 'Template service', 'Resource provisioning', 'All of the above'], correctAnswer: 3 },
                { question: 'What is ELB?', options: ['Elastic Load Balancing', 'Traffic distribution', 'Load balancer', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Auto Scaling?', options: ['Automatic scaling', 'Resource adjustment', 'Demand handling', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 67: Google Cloud Professional
            67: [
                { question: 'What is GCP?', options: ['Google Cloud Platform', 'Google cloud services', 'Cloud computing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Compute Engine?', options: ['GCP VMs', 'Virtual machines', 'Compute service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Cloud Storage?', options: ['GCP object storage', 'Data storage', 'Bucket service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is BigQuery?', options: ['Data warehouse', 'Analytics service', 'Serverless query', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Kubernetes Engine?', options: ['GKE', 'Container service', 'Orchestration', 'All of the above'], correctAnswer: 3 },
                { question: 'What is App Engine?', options: ['PaaS platform', 'Application hosting', 'Scalable service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Cloud Functions?', options: ['Serverless functions', 'FaaS', 'Event-driven', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Cloud SQL?', options: ['Managed database', 'MySQL/PostgreSQL', 'Database service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is VPC in GCP?', options: ['Virtual Private Cloud', 'Network service', 'Isolation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is IAM in GCP?', options: ['Identity and Access Management', 'Permissions', 'Access control', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 68: Microsoft Azure Fundamentals
            68: [
                { question: 'What is Azure?', options: ['Microsoft cloud', 'Cloud platform', 'Computing services', 'All of the above'], correctAnswer: 3 },
                { question: 'What are Azure Virtual Machines?', options: ['IaaS compute', 'VMs', 'Compute service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Azure App Service?', options: ['PaaS for web apps', 'Application hosting', 'Web service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Azure Storage?', options: ['Cloud storage', 'Data service', 'Blob storage', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Azure SQL Database?', options: ['Managed database', 'PaaS SQL', 'Database service', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Azure Active Directory?', options: ['Identity service', 'Directory service', 'Authentication', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Azure Functions?', options: ['Serverless compute', 'FaaS', 'Event-driven', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Azure DevOps?', options: ['Development tools', 'CI/CD', 'Project management', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a resource group?', options: ['Container for resources', 'Management unit', 'Azure resources', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a region in Azure?', options: ['Geographic area', 'Data center location', 'Deployment region', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 69: Cisco CCNA
            69: [
                { question: 'What is CCNA?', options: ['Cisco certification', 'Networking', 'Routing/Switching', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a router?', options: ['Network device', 'Connects networks', 'Routes packets', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a switch?', options: ['Network device', 'Connects devices', 'Forwards frames', 'All of the above'], correctAnswer: 3 },
                { question: 'What is IP addressing?', options: ['Network addressing', 'IPv4/IPv6', 'Device identification', 'All of the above'], correctAnswer: 3 },
                { question: 'What is subnetting?', options: ['Network division', 'IP subnetworks', 'Efficient addressing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is VLAN?', options: ['Virtual LAN', 'Network segmentation', 'Broadcast domain', 'All of the above'], correctAnswer: 3 },
                { question: 'What is OSPF?', options: ['Open Shortest Path First', 'Routing protocol', 'Link-state', 'All of the above'], correctAnswer: 3 },
                { question: 'What is EIGRP?', options: ['Enhanced IGRP', 'Cisco protocol', 'Routing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is STP?', options: ['Spanning Tree Protocol', 'Loop prevention', 'Redundant paths', 'All of the above'], correctAnswer: 3 },
                { question: 'What is NAT?', options: ['Network Address Translation', 'IP translation', 'Private/public mapping', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 70: CompTIA Security+
            70: [
                { question: 'What is Security+?', options: ['CompTIA certification', 'Security basics', 'IT security', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a security threat?', options: ['Potential danger', 'Attack vector', 'Risk', 'All of the above'], correctAnswer: 3 },
                { question: 'What is authentication?', options: ['Identity verification', 'Login process', 'Access control', 'All of the above'], correctAnswer: 3 },
                { question: 'What is authorization?', options: ['Access rights', 'Permissions', 'Privileges', 'All of the above'], correctAnswer: 3 },
                { question: 'What is encryption?', options: ['Data protection', 'Coding information', 'Security method', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a firewall?', options: ['Security device', 'Traffic filter', 'Access control', 'All of the above'], correctAnswer: 3 },
                { question: 'What is malware?', options: ['Malicious software', 'Virus', 'Threat', 'All of the above'], correctAnswer: 3 },
                { question: 'What is risk management?', options: ['Risk assessment', 'Mitigation', 'Security process', 'All of the above'], correctAnswer: 3 },
                { question: 'What is incident response?', options: ['Security incident handling', 'Response process', 'Breach management', 'All of the above'], correctAnswer: 3 },
                { question: 'What is compliance?', options: ['Regulatory adherence', 'Standards', 'Requirements', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 71: PMP Certification
            71: [
                { question: 'What is PMP?', options: ['Project Management Professional', 'PMI certification', 'Project management', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a project?', options: ['Temporary endeavor', 'Unique output', 'Defined goals', 'All of the above'], correctAnswer: 3 },
                { question: 'What is scope?', options: ['Project boundaries', 'Work included', 'Deliverables', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a WBS?', options: ['Work Breakdown Structure', 'Task decomposition', 'Hierarchical breakdown', 'All of the above'], correctAnswer: 3 },
                { question: 'What is critical path?', options: ['Longest task sequence', 'Project duration', 'Dependency chain', 'All of the above'], correctAnswer: 3 },
                { question: 'What is risk management?', options: ['Uncertainty handling', 'Threat/opportunity', 'Mitigation planning', 'All of the above'], correctAnswer: 3 },
                { question: 'What is stakeholder?', options: ['Project interested party', 'Affected individual', 'Influence source', 'All of the above'], correctAnswer: 3 },
                { question: 'What is quality management?', options: ['Standards meeting', 'Requirements fulfillment', 'Process assurance', 'All of the above'], correctAnswer: 3 },
                { question: 'What is communication management?', options: ['Information flow', 'Stakeholder updates', 'Message distribution', 'All of the above'], correctAnswer: 3 },
                { question: 'What is procurement?', options: ['Acquiring goods/services', 'Contracting', 'Vendor management', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 72: Scrum Master
            72: [
                { question: 'What is Scrum?', options: ['Agile framework', 'Project management', 'Iterative development', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Sprint?', options: ['Time-boxed iteration', 'Development cycle', '1-4 weeks', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Product Owner?', options: ['Backlog manager', 'Value maximizer', 'Stakeholder voice', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Scrum Master?', options: ['Process facilitator', 'Coach', 'Impediment remover', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Development Team?', options: ['Doers', 'Cross-functional', 'Self-organizing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Product Backlog?', options: ['Requirements list', 'Prioritized items', 'Work repository', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Sprint Backlog?', options: ['Selected items', 'Sprint plan', 'Tasks for sprint', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Daily Scrum?', options: ['Daily meeting', '15-minute sync', 'Progress check', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Sprint Review?', options: ['Inspection meeting', 'Demo', 'Feedback session', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Sprint Retrospective?', options: ['Process improvement', 'Team reflection', 'Continuous improvement', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 73: Six Sigma Green Belt
            73: [
                { question: 'What is Six Sigma?', options: ['Quality methodology', 'Process improvement', 'Defect reduction', 'All of the above'], correctAnswer: 3 },
                { question: 'What is DMAIC?', options: ['Define, Measure, Analyze, Improve, Control', 'Problem-solving approach', 'Six Sigma process', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Green Belt?', options: ['Six Sigma role', 'Project leader', 'Process improvement', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a process?', options: ['Steps sequence', 'Activity flow', 'Transformation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is variation?', options: ['Process fluctuation', 'Deviation', 'Inconsistency', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a defect?', options: ['Non-conformance', 'Error', 'Quality issue', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a CTQ?', options: ['Critical to Quality', 'Customer requirement', 'Key characteristic', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a control chart?', options: ['Process monitoring', 'Variation tracking', 'Statistical tool', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a fishbone diagram?', options: ['Cause-effect analysis', 'Ishikawa diagram', 'Root cause tool', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a Pareto chart?', options: ['80/20 rule', 'Priority analysis', 'Bar chart', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 74: ITIL Foundation
            74: [
                { question: 'What is ITIL?', options: ['IT service management', 'Best practices', 'Framework', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a service?', options: ['Value delivery', 'Customer support', 'IT provision', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a service desk?', options: ['Single contact point', 'User support', 'Incident handling', 'All of the above'], correctAnswer: 3 },
                { question: 'What is incident management?', options: ['Restore service', 'Fixing issues', 'Response process', 'All of the above'], correctAnswer: 3 },
                { question: 'What is problem management?', options: ['Root cause analysis', 'Preventing recurrence', 'Issue investigation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is change management?', options: ['Controlled changes', 'Risk assessment', 'Transition process', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a service level agreement?', options: ['SLA', 'Service contract', 'Performance promise', 'All of the above'], correctAnswer: 3 },
                { question: 'What is configuration management?', options: ['CIs tracking', 'Asset control', 'Configuration database', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a release?', options: ['Deployment', 'New version', 'Change implementation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is continual improvement?', options: ['Ongoing enhancement', 'Process optimization', 'Service evolution', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 75: CEH (Ethical Hacking)
            75: [
                { question: 'What is ethical hacking?', options: ['Authorized hacking', 'Security testing', 'Penetration testing', 'All of the above'], correctAnswer: 3 },
                { question: 'What is CEH?', options: ['Certified Ethical Hacker', 'EC-Council cert', 'Hacking certification', 'All of the above'], correctAnswer: 3 },
                { question: 'What is footprinting?', options: ['Information gathering', 'Reconnaissance', 'Data collection', 'All of the above'], correctAnswer: 3 },
                { question: 'What is scanning?', options: ['Network probing', 'Port scanning', 'Vulnerability scanning', 'All of the above'], correctAnswer: 3 },
                { question: 'What is enumeration?', options: ['Extracting information', 'Data gathering', 'System discovery', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a vulnerability assessment?', options: ['Identifying weaknesses', 'Security check', 'Risk analysis', 'All of the above'], correctAnswer: 3 },
                { question: 'What is exploitation?', options: ['Gaining access', 'Using vulnerabilities', 'System compromise', 'All of the above'], correctAnswer: 3 },
                { question: 'What is social engineering?', options: ['Human manipulation', 'Psychological attack', 'Deception', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a zero-day?', options: ['Unknown vulnerability', 'Unpatched flaw', 'New attack', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a penetration test?', options: ['Simulated attack', 'Security assessment', 'Vulnerability testing', 'All of the above'], correctAnswer: 3 }
            ],
            
            // ========== LANGUAGE TESTS (76-85) ==========
            
            // Test 76: English Proficiency
            76: [
                { question: 'What is a noun?', options: ['Person, place, thing', 'Action word', 'Describing word', 'Linking word'], correctAnswer: 0 },
                { question: 'What is a verb?', options: ['Action word', 'Naming word', 'Descriptive word', 'Connecting word'], correctAnswer: 0 },
                { question: 'What is an adjective?', options: ['Describes noun', 'Describes verb', 'Action word', 'Naming word'], correctAnswer: 0 },
                { question: 'What is an adverb?', options: ['Describes verb', 'Describes noun', 'Naming word', 'Action word'], correctAnswer: 0 },
                { question: 'What is a pronoun?', options: ['Replaces noun', 'Describes noun', 'Action word', 'Connecting word'], correctAnswer: 0 },
                { question: 'What is a preposition?', options: ['Shows relationship', 'Action word', 'Describing word', 'Naming word'], correctAnswer: 0 },
                { question: 'What is a conjunction?', options: ['Connects words/phrases', 'Describes words', 'Action words', 'Naming words'], correctAnswer: 0 },
                { question: 'What is an interjection?', options: ['Exclamation', 'Describing word', 'Action word', 'Naming word'], correctAnswer: 0 },
                { question: 'What is the past tense?', options: ['Action already happened', 'Happening now', 'Will happen', 'Continuous action'], correctAnswer: 0 },
                { question: 'What is the present tense?', options: ['Happening now', 'Already happened', 'Will happen', 'Future action'], correctAnswer: 0 }
            ],
            
            // Test 77: Spanish Language
            77: [
                { question: 'How do you say "Hello" in Spanish?', options: ['Hola', 'Adiós', 'Gracias', 'Por favor'], correctAnswer: 0 },
                { question: 'What is "gracias"?', options: ['Thank you', 'Please', 'Hello', 'Goodbye'], correctAnswer: 0 },
                { question: 'How do you say "Goodbye"?', options: ['Adiós', 'Hola', 'Gracias', 'Buenos días'], correctAnswer: 0 },
                { question: 'What is "uno" in English?', options: ['One', 'Two', 'Three', 'Four'], correctAnswer: 0 },
                { question: 'What is "rojo" in English?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "azul" in English?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "casa" in English?', options: ['House', 'Car', 'Dog', 'Cat'], correctAnswer: 0 },
                { question: 'What is "perro" in English?', options: ['Dog', 'Cat', 'Bird', 'Fish'], correctAnswer: 0 },
                { question: 'What is "gato" in English?', options: ['Cat', 'Dog', 'Mouse', 'Rabbit'], correctAnswer: 0 },
                { question: 'What is "agua" in English?', options: ['Water', 'Fire', 'Earth', 'Air'], correctAnswer: 0 }
            ],
            
            // Test 78: French Grammar
            78: [
                { question: 'How do you say "Hello" in French?', options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'], correctAnswer: 0 },
                { question: 'What is "merci"?', options: ['Thank you', 'Please', 'Hello', 'Goodbye'], correctAnswer: 0 },
                { question: 'How do you say "Goodbye" in French?', options: ['Au revoir', 'Bonjour', 'Merci', 'S\'il vous plaît'], correctAnswer: 0 },
                { question: 'What is "un" in English?', options: ['One', 'Two', 'Three', 'Four'], correctAnswer: 0 },
                { question: 'What is "rouge" in English?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "bleu" in English?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "maison" in English?', options: ['House', 'Car', 'Dog', 'Cat'], correctAnswer: 0 },
                { question: 'What is "chien" in English?', options: ['Dog', 'Cat', 'Bird', 'Fish'], correctAnswer: 0 },
                { question: 'What is "chat" in English?', options: ['Cat', 'Dog', 'Mouse', 'Rabbit'], correctAnswer: 0 },
                { question: 'What is "eau" in English?', options: ['Water', 'Fire', 'Earth', 'Air'], correctAnswer: 0 }
            ],
            
            // Test 79: German Vocabulary
            79: [
                { question: 'How do you say "Hello" in German?', options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'], correctAnswer: 0 },
                { question: 'What is "danke"?', options: ['Thank you', 'Please', 'Hello', 'Goodbye'], correctAnswer: 0 },
                { question: 'How do you say "Goodbye"?', options: ['Auf Wiedersehen', 'Hallo', 'Danke', 'Bitte'], correctAnswer: 0 },
                { question: 'What is "eins" in English?', options: ['One', 'Two', 'Three', 'Four'], correctAnswer: 0 },
                { question: 'What is "rot" in English?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "blau" in English?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "Haus" in English?', options: ['House', 'Car', 'Dog', 'Cat'], correctAnswer: 0 },
                { question: 'What is "Hund" in English?', options: ['Dog', 'Cat', 'Bird', 'Fish'], correctAnswer: 0 },
                { question: 'What is "Katze" in English?', options: ['Cat', 'Dog', 'Mouse', 'Rabbit'], correctAnswer: 0 },
                { question: 'What is "Wasser" in English?', options: ['Water', 'Fire', 'Earth', 'Air'], correctAnswer: 0 }
            ],
            
            // Test 80: Japanese Basics
            80: [
                { question: 'How do you say "Hello" in Japanese?', options: ['Konnichiwa', 'Sayonara', 'Arigato', 'Hai'], correctAnswer: 0 },
                { question: 'What is "arigato"?', options: ['Thank you', 'Goodbye', 'Hello', 'Yes'], correctAnswer: 0 },
                { question: 'How do you say "Goodbye"?', options: ['Sayonara', 'Konnichiwa', 'Arigato', 'Hai'], correctAnswer: 0 },
                { question: 'What is "ichi" in English?', options: ['One', 'Two', 'Three', 'Four'], correctAnswer: 0 },
                { question: 'What is "akai" in English?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "aoi" in English?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "ie" in English?', options: ['House', 'Car', 'Dog', 'Cat'], correctAnswer: 0 },
                { question: 'What is "inu" in English?', options: ['Dog', 'Cat', 'Bird', 'Fish'], correctAnswer: 0 },
                { question: 'What is "neko" in English?', options: ['Cat', 'Dog', 'Mouse', 'Rabbit'], correctAnswer: 0 },
                { question: 'What is "mizu" in English?', options: ['Water', 'Fire', 'Earth', 'Air'], correctAnswer: 0 }
            ],
            
            // Test 81: Chinese Characters
            81: [
                { question: 'How do you say "Hello" in Chinese?', options: ['Nǐ hǎo', 'Zài jiàn', 'Xiè xiè', 'Shì'], correctAnswer: 0 },
                { question: 'What is "xiè xiè"?', options: ['Thank you', 'Goodbye', 'Hello', 'Yes'], correctAnswer: 0 },
                { question: 'How do you say "Goodbye"?', options: ['Zài jiàn', 'Nǐ hǎo', 'Xiè xiè', 'Shì'], correctAnswer: 0 },
                { question: 'What is "yī" in English?', options: ['One', 'Two', 'Three', 'Four'], correctAnswer: 0 },
                { question: 'What is "hóng sè" in English?', options: ['Red', 'Blue', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "lán sè" in English?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 0 },
                { question: 'What is "fáng zi" in English?', options: ['House', 'Car', 'Dog', 'Cat'], correctAnswer: 0 },
                { question: 'What is "gǒu" in English?', options: ['Dog', 'Cat', 'Bird', 'Fish'], correctAnswer: 0 },
                { question: 'What is "māo" in English?', options: ['Cat', 'Dog', 'Mouse', 'Rabbit'], correctAnswer: 0 },
                { question: 'What is "shuǐ" in English?', options: ['Water', 'Fire', 'Earth', 'Air'], correctAnswer: 0 }
            ],
            
            // Test 82: Business English
            82: [
                { question: 'What is a business meeting?', options: ['Professional gathering', 'Discussion', 'Decision-making', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a presentation?', options: ['Information delivery', 'Speech', 'Visual aids', 'All of the above'], correctAnswer: 3 },
                { question: 'What is negotiation?', options: ['Discussion for agreement', 'Compromise', 'Deal-making', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a report?', options: ['Documented information', 'Summary', 'Analysis', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an email?', options: ['Electronic message', 'Business communication', 'Correspondence', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a memo?', options: ['Internal message', 'Brief note', 'Communication', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a proposal?', options: ['Business suggestion', 'Plan', 'Offer', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a contract?', options: ['Legal agreement', 'Binding document', 'Terms and conditions', 'All of the above'], correctAnswer: 3 },
                { question: 'What is networking?', options: ['Building contacts', 'Professional relationships', 'Career connections', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a deadline?', options: ['Due date', 'Time limit', 'Completion target', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 83: TOEFL Preparation
            83: [
                { question: 'What is TOEFL?', options: ['Test of English as a Foreign Language', 'English proficiency test', 'Academic English exam', 'All of the above'], correctAnswer: 3 },
                { question: 'What is reading comprehension?', options: ['Understanding text', 'Extracting meaning', 'Answering questions', 'All of the above'], correctAnswer: 3 },
                { question: 'What is listening comprehension?', options: ['Understanding spoken English', 'Audio interpretation', 'Note-taking', 'All of the above'], correctAnswer: 3 },
                { question: 'What is speaking section?', options: ['Oral response', 'Verbal expression', 'Pronunciation test', 'All of the above'], correctAnswer: 3 },
                { question: 'What is writing section?', options: ['Essay writing', 'Expressing ideas', 'Structured response', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an integrated task?', options: ['Multiple skills combined', 'Reading/listening/speaking', 'Comprehensive response', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an independent task?', options: ['Single skill', 'Personal opinion', 'Individual response', 'All of the above'], correctAnswer: 3 },
                { question: 'What is note-taking?', options: ['Recording key points', 'Information capture', 'Study aid', 'All of the above'], correctAnswer: 3 },
                { question: 'What is paraphrasing?', options: ['Rewording', 'Restating', 'Using own words', 'All of the above'], correctAnswer: 3 },
                { question: 'What is summarizing?', options: ['Condensing information', 'Main points', 'Brief overview', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 84: IELTS Practice
            84: [
                { question: 'What is IELTS?', options: ['International English Language Testing System', 'English exam', 'Proficiency test', 'All of the above'], correctAnswer: 3 },
                { question: 'What is academic IELTS?', options: ['For university admission', 'Academic context', 'Higher education', 'All of the above'], correctAnswer: 3 },
                { question: 'What is general training IELTS?', options: ['Work/migration', 'Practical English', 'Everyday context', 'All of the above'], correctAnswer: 3 },
                { question: 'What is listening section?', options: ['Audio comprehension', 'Multiple recordings', 'Answer questions', 'All of the above'], correctAnswer: 3 },
                { question: 'What is reading section?', options: ['Text comprehension', 'Passage analysis', 'Question response', 'All of the above'], correctAnswer: 3 },
                { question: 'What is writing section?', options: ['Task 1 and 2', 'Essay writing', 'Graph description', 'All of the above'], correctAnswer: 3 },
                { question: 'What is speaking section?', options: ['Face-to-face interview', 'Oral assessment', 'Fluency test', 'All of the above'], correctAnswer: 3 },
                { question: 'What is band score?', options: ['IELTS score', '0-9 scale', 'Performance measure', 'All of the above'], correctAnswer: 3 },
                { question: 'What is task achievement?', options: ['Fulfilling requirements', 'Answering prompt', 'Meeting criteria', 'All of the above'], correctAnswer: 3 },
                { question: 'What is coherence and cohesion?', options: ['Logical flow', 'Linking ideas', 'Organization', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 85: Grammar Mastery
            85: [
                { question: 'What is subject-verb agreement?', options: ['Subject matches verb', 'Number agreement', 'Grammar rule', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a tense?', options: ['Time reference', 'Verb form', 'Past/present/future', 'All of the above'], correctAnswer: 3 },
                { question: 'What is active voice?', options: ['Subject performs action', 'Direct construction', 'Clear subject', 'All of the above'], correctAnswer: 3 },
                { question: 'What is passive voice?', options: ['Subject receives action', 'Be + past participle', 'By phrase', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a clause?', options: ['Group of words', 'Has subject/verb', 'Part of sentence', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a phrase?', options: ['Word group', 'No subject/verb', 'Unit', 'All of the above'], correctAnswer: 3 },
                { question: 'What is punctuation?', options: ['Marks in writing', 'Clarity aids', 'Period/comma etc', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a comma splice?', options: ['Comma joining clauses', 'Punctuation error', 'Run-on sentence', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a run-on sentence?', options: ['Two+ sentences joined', 'No punctuation', 'Incorrect', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a fragment?', options: ['Incomplete sentence', 'Missing element', 'Error', 'All of the above'], correctAnswer: 3 }
            ],
            
            // ========== APTITUDE TESTS (86-95) ==========
            
            // Test 86: Quantitative Aptitude
            86: [
                { question: 'What is 15% of 200?', options: ['30', '25', '35', '40'], correctAnswer: 0 },
                { question: 'If a train travels 360 km in 4 hours, what is its speed?', options: ['90 km/h', '80 km/h', '100 km/h', '85 km/h'], correctAnswer: 0 },
                { question: 'What is the average of 10, 20, 30, 40?', options: ['25', '20', '30', '35'], correctAnswer: 0 },
                { question: 'Solve: 5 + 3 × 2 - 4 ÷ 2', options: ['9', '12', '10', '8'], correctAnswer: 0 },
                { question: 'What is the square root of 144?', options: ['12', '14', '16', '18'], correctAnswer: 0 },
                { question: 'If a = 3 and b = 4, what is a² + b²?', options: ['25', '7', '12', '24'], correctAnswer: 0 },
                { question: 'What is the next number: 2, 4, 8, 16?', options: ['32', '24', '18', '30'], correctAnswer: 0 },
                { question: 'What is 20% of 500?', options: ['100', '50', '150', '200'], correctAnswer: 0 },
                { question: 'If x + 5 = 15, what is x?', options: ['10', '20', '5', '15'], correctAnswer: 0 },
                { question: 'What is the area of a square with side 6?', options: ['36', '12', '24', '48'], correctAnswer: 0 }
            ],
            
            // Test 87: Logical Reasoning
            87: [
                { question: 'If all A are B, and all B are C, then?', options: ['All A are C', 'All C are A', 'Some A are C', 'None'], correctAnswer: 0 },
                { question: 'Which is different? Apple, Mango, Carrot, Banana', options: ['Carrot', 'Apple', 'Mango', 'Banana'], correctAnswer: 0 },
                { question: 'Complete: 3, 6, 9, 12, ?', options: ['15', '14', '13', '18'], correctAnswer: 0 },
                { question: 'If yesterday was Tuesday, what is tomorrow?', options: ['Thursday', 'Wednesday', 'Friday', 'Monday'], correctAnswer: 0 },
                { question: 'Which is the odd one out? Circle, Square, Triangle, Red', options: ['Red', 'Circle', 'Square', 'Triangle'], correctAnswer: 0 },
                { question: 'If 2 = 5, 3 = 10, 4 = 17, then 5 = ?', options: ['26', '25', '24', '27'], correctAnswer: 0 },
                { question: 'What comes next in the pattern: ♥, ♦, ♣, ♠, ?', options: ['♥', '♦', '♣', '♠'], correctAnswer: 0 },
                { question: 'If A = 1, B = 2, C = 3, what is E?', options: ['5', '4', '6', '7'], correctAnswer: 0 },
                { question: 'Which word does not belong? Run, Jump, Walk, Book', options: ['Book', 'Run', 'Jump', 'Walk'], correctAnswer: 0 },
                { question: 'If 1 = 1, 2 = 2, 3 = 6, 4 = 24, then 5 = ?', options: ['120', '100', '110', '130'], correctAnswer: 0 }
            ],
            
            // Test 88: Verbal Ability
            88: [
                { question: 'What is a synonym for "happy"?', options: ['Joyful', 'Sad', 'Angry', 'Tired'], correctAnswer: 0 },
                { question: 'What is an antonym for "hot"?', options: ['Cold', 'Warm', 'Boiling', 'Heat'], correctAnswer: 0 },
                { question: 'Complete: "Better late than ______."', options: ['Never', 'Early', 'Soon', 'Quick'], correctAnswer: 0 },
                { question: 'What is the plural of "child"?', options: ['Children', 'Childs', 'Childes', 'Children'], correctAnswer: 0 },
                { question: 'What is the past tense of "run"?', options: ['Ran', 'Run', 'Runned', 'Running'], correctAnswer: 0 },
                { question: 'Choose the correctly spelled word:', options: ['Accommodate', 'Acommodate', 'Accommodait', 'Acomodate'], correctAnswer: 0 },
                { question: 'What is a verb?', options: ['Action word', 'Naming word', 'Describing word', 'Connecting word'], correctAnswer: 0 },
                { question: 'What is a noun?', options: ['Person/place/thing', 'Action', 'Description', 'Connection'], correctAnswer: 0 },
                { question: 'What is an adjective?', options: ['Describes noun', 'Describes verb', 'Action word', 'Naming word'], correctAnswer: 0 },
                { question: 'What is an adverb?', options: ['Describes verb', 'Describes noun', 'Naming word', 'Connecting word'], correctAnswer: 0 }
            ],
            
            // Test 89: Data Interpretation
            89: [
                { question: 'What is a bar chart?', options: ['Data representation', 'Rectangular bars', 'Comparing categories', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a line graph?', options: ['Trend over time', 'Connected points', 'Data series', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a pie chart?', options: ['Circular chart', 'Percentage breakdown', 'Proportional segments', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a table?', options: ['Rows and columns', 'Data organization', 'Structured format', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a histogram?', options: ['Bar chart of frequencies', 'Distribution', 'Continuous data', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a scatter plot?', options: ['Points on axes', 'Correlation', 'Relationship', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a percentage?', options: ['Per hundred', 'Proportion', 'Fraction of 100', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a ratio?', options: ['Comparison', 'Relationship', 'Relative size', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an average?', options: ['Mean', 'Central value', 'Sum divided by count', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a median?', options: ['Middle value', 'Central number', 'Ordered data', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 90: Critical Thinking
            90: [
                { question: 'What is critical thinking?', options: ['Analytical thinking', 'Logical evaluation', 'Reasoned judgment', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an argument?', options: ['Reasoned discussion', 'Point of view', 'Supporting evidence', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a premise?', options: ['Basis for argument', 'Assumption', 'Starting point', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a conclusion?', options: ['Final judgment', 'Result', 'Inference', 'All of the above'], correctAnswer: 3 },
                { question: 'What is an assumption?', options: ['Unstated belief', 'Taken for granted', 'Implicit idea', 'All of the above'], correctAnswer: 3 },
                { question: 'What is evidence?', options: ['Supporting information', 'Facts', 'Proof', 'All of the above'], correctAnswer: 3 },
                { question: 'What is bias?', options: ['Prejudice', 'Partiality', 'Preference', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a fallacy?', options: ['Error in reasoning', 'False argument', 'Mistake', 'All of the above'], correctAnswer: 3 },
                { question: 'What is deduction?', options: ['Reasoning from general to specific', 'Logical conclusion', 'Inference', 'All of the above'], correctAnswer: 3 },
                { question: 'What is induction?', options: ['Reasoning from specific to general', 'Pattern recognition', 'Generalization', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 91: Problem Solving
            91: [
                { question: 'What is problem-solving?', options: ['Finding solutions', 'Analytical process', 'Overcoming obstacles', 'All of the above'], correctAnswer: 3 },
                { question: 'What is the first step in problem-solving?', options: ['Identify the problem', 'Find solution', 'Implement', 'Evaluate'], correctAnswer: 0 },
                { question: 'What is brainstorming?', options: ['Generating ideas', 'Creative thinking', 'Group discussion', 'All of the above'], correctAnswer: 3 },
                { question: 'What is analysis?', options: ['Breaking down', 'Examining parts', 'Detailed study', 'All of the above'], correctAnswer: 3 },
                { question: 'What is evaluation?', options: ['Assessing solutions', 'Judging worth', 'Critical review', 'All of the above'], correctAnswer: 3 },
                { question: 'What is implementation?', options: ['Putting into action', 'Executing plan', 'Carrying out', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a root cause?', options: ['Basic reason', 'Origin', 'Fundamental cause', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a solution?', options: ['Answer to problem', 'Resolution', 'Fix', 'All of the above'], correctAnswer: 3 },
                { question: 'What is decision-making?', options: ['Choosing option', 'Selecting course', 'Making choice', 'All of the above'], correctAnswer: 3 },
                { question: 'What is creativity?', options: ['Original thinking', 'Innovation', 'New ideas', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 92: Analytical Skills
            92: [
                { question: 'What is analysis?', options: ['Detailed examination', 'Breaking down', 'Study of parts', 'All of the above'], correctAnswer: 3 },
                { question: 'What is logic?', options: ['Reasoning', 'Valid arguments', 'Sound thinking', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a pattern?', options: ['Regular sequence', 'Repeating structure', 'Consistent form', 'All of the above'], correctAnswer: 3 },
                { question: 'What is comparison?', options: ['Examining similarities', 'Contrasting', 'Relating items', 'All of the above'], correctAnswer: 3 },
                { question: 'What is classification?', options: ['Grouping', 'Categorizing', 'Organizing by type', 'All of the above'], correctAnswer: 3 },
                { question: 'What is sequencing?', options: ['Ordering', 'Arranging in sequence', 'Logical order', 'All of the above'], correctAnswer: 3 },
                { question: 'What is cause and effect?', options: ['Relationship', 'Action and result', 'Causality', 'All of the above'], correctAnswer: 3 },
                { question: 'What is inference?', options: ['Drawing conclusions', 'Reasoning', 'Implication', 'All of the above'], correctAnswer: 3 },
                { question: 'What is deduction?', options: ['Logical reasoning', 'Specific from general', 'Conclusion', 'All of the above'], correctAnswer: 3 },
                { question: 'What is induction?', options: ['General from specific', 'Pattern generalization', 'Reasoning', 'All of the above'], correctAnswer: 3 }
            ],
            
                        // Test 93: Numerical Ability (continued from previous)
            93: [
                { question: 'What is 25 × 4?', options: ['100', '50', '75', '125'], correctAnswer: 0 },
                { question: 'What is 144 ÷ 12?', options: ['12', '10', '14', '16'], correctAnswer: 0 },
                { question: 'What is 15 + 27?', options: ['42', '40', '45', '38'], correctAnswer: 0 },
                { question: 'What is 81 - 36?', options: ['45', '47', '43', '41'], correctAnswer: 0 },
                { question: 'What is 7²?', options: ['49', '14', '21', '28'], correctAnswer: 0 },
                { question: 'What is ⅓ of 60?', options: ['20', '30', '15', '25'], correctAnswer: 0 },
                { question: 'What is 0.5 as a fraction?', options: ['1/2', '1/4', '3/4', '2/3'], correctAnswer: 0 },
                { question: 'What is 75% of 80?', options: ['60', '50', '70', '65'], correctAnswer: 0 },
                { question: 'What is the square root of 169?', options: ['13', '12', '14', '11'], correctAnswer: 0 },
                { question: 'What is 2⁴?', options: ['16', '8', '12', '24'], correctAnswer: 0 }
            ],
            
            // Test 94: Spatial Reasoning
            94: [
                { question: 'What is spatial reasoning?', options: ['Understanding shapes', 'Visualizing objects', 'Mental rotation', 'All of the above'], correctAnswer: 3 },
                { question: 'How many sides does a cube have?', options: ['6', '4', '8', '12'], correctAnswer: 0 },
                { question: 'What is a 3D shape?', options: ['Three-dimensional', 'Has depth', 'Solid object', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a net in geometry?', options: ['Flat pattern', '3D shape unfolded', 'Surface layout', 'All of the above'], correctAnswer: 3 },
                { question: 'What is rotation?', options: ['Turning around', 'Circular movement', 'Changing orientation', 'All of the above'], correctAnswer: 3 },
                { question: 'What is reflection?', options: ['Mirror image', 'Symmetry', 'Flipping', 'All of the above'], correctAnswer: 3 },
                { question: 'What is translation?', options: ['Sliding movement', 'Changing position', 'Shifting', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a 2D shape?', options: ['Flat shape', 'Two-dimensional', 'Length and width', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a sphere?', options: ['Round 3D shape', 'Ball-shaped', 'No edges', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a cylinder?', options: ['Tube-shaped', 'Circular ends', '3D shape', 'All of the above'], correctAnswer: 3 }
            ],
            
            // Test 95: Abstract Reasoning
            95: [
                { question: 'What is abstract reasoning?', options: ['Pattern recognition', 'Logical thinking', 'Problem-solving', 'All of the above'], correctAnswer: 3 },
                { question: 'What comes next? ○, □, △, ○, □, ?', options: ['△', '○', '□', '◊'], correctAnswer: 0 },
                { question: 'Which is different? ▲, ■, ●, ♥', options: ['♥', '▲', '■', '●'], correctAnswer: 0 },
                { question: 'Complete the pattern: 1, 1, 2, 3, 5, ?', options: ['8', '7', '6', '9'], correctAnswer: 0 },
                { question: 'If A=1, B=2, C=3, what is F?', options: ['6', '5', '4', '7'], correctAnswer: 0 },
                { question: 'Which is the odd one out? 2, 4, 6, 7, 8', options: ['7', '2', '4', '6'], correctAnswer: 0 },
                { question: 'What comes next? ▲, ▲▲, ▲▲▲, ?', options: ['▲▲▲▲', '▲▲', '▲', '▲▲▲▲▲'], correctAnswer: 0 },
                { question: 'Complete: □, ○, □, ○, □, ?', options: ['○', '□', '△', '◊'], correctAnswer: 0 },
                { question: 'If 1=3, 2=6, 3=9, then 4=?', options: ['12', '8', '10', '14'], correctAnswer: 0 },
                { question: 'Which shape does not belong? ●, ▲, ■, ○', options: ['▲', '●', '■', '○'], correctAnswer: 0 }
            ],
            
            // ========== ADDITIONAL TESTS (96-117) ==========
            
            // Test 96: Web Development Fundamentals
            96: [
                { question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'Hyper Transfer Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'], correctAnswer: 0 },
                { question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Sheets'], correctAnswer: 0 },
                { question: 'What is the correct HTML tag for the largest heading?', options: ['<h1>', '<heading>', '<h6>', '<head>'], correctAnswer: 0 },
                { question: 'Which property is used to change the background color in CSS?', options: ['background-color', 'color', 'bgcolor', 'background'], correctAnswer: 0 },
                { question: 'What is the correct HTML for creating a hyperlink?', options: ['<a href="url">link</a>', '<link>url</link>', '<a>url</a>', '<href>url</href>'], correctAnswer: 0 },
                { question: 'Which tag is used for inserting an image?', options: ['<img>', '<image>', '<pic>', '<src>'], correctAnswer: 0 },
                { question: 'What is the correct CSS syntax for making text bold?', options: ['font-weight: bold', 'text-style: bold', 'font: bold', 'text-weight: bold'], correctAnswer: 0 },
                { question: 'Which HTML tag is used for an unordered list?', options: ['<ul>', '<ol>', '<li>', '<list>'], correctAnswer: 0 },
                { question: 'What does the <div> tag create?', options: ['A division/section', 'A line break', 'A heading', 'A paragraph'], correctAnswer: 0 },
                { question: 'Which attribute specifies a unique identifier for an HTML element?', options: ['id', 'class', 'name', 'key'], correctAnswer: 0 }
            ],
            
            // Test 97: Mobile App Development
            97: [
                { question: 'What is iOS developed by?', options: ['Apple', 'Google', 'Microsoft', 'Samsung'], correctAnswer: 0 },
                { question: 'What is Android developed by?', options: ['Google', 'Apple', 'Microsoft', 'Samsung'], correctAnswer: 0 },
                { question: 'What language is primarily used for iOS development?', options: ['Swift', 'Java', 'Kotlin', 'C#'], correctAnswer: 0 },
                { question: 'What language is primarily used for Android development?', options: ['Kotlin/Java', 'Swift', 'Objective-C', 'C#'], correctAnswer: 0 },
                { question: 'What is React Native?', options: ['Cross-platform framework', 'iOS framework', 'Android framework', 'Database'], correctAnswer: 0 },
                { question: 'What is Flutter developed by?', options: ['Google', 'Facebook', 'Apple', 'Microsoft'], correctAnswer: 0 },
                { question: 'What is an APK?', options: ['Android Package Kit', 'Apple Package Kit', 'Application Program Kit', 'Android Program Kit'], correctAnswer: 0 },
                { question: 'What is an IPA file?', options: ['iOS App Store Package', 'Android Package', 'Installable Program', 'Internet Protocol App'], correctAnswer: 0 },
                { question: 'What is Xcode?', options: ['iOS development IDE', 'Android IDE', 'Cross-platform IDE', 'Database tool'], correctAnswer: 0 },
                { question: 'What is Android Studio?', options: ['Android development IDE', 'iOS IDE', 'Cross-platform IDE', 'Code editor'], correctAnswer: 0 }
            ],
            
            // Test 98: Software Testing
            98: [
                { question: 'What is software testing?', options: ['Evaluating software quality', 'Finding bugs', 'Verifying requirements', 'All of the above'], correctAnswer: 3 },
                { question: 'What is unit testing?', options: ['Testing individual components', 'Testing whole system', 'Testing integration', 'Testing performance'], correctAnswer: 0 },
                { question: 'What is integration testing?', options: ['Testing module interaction', 'Testing single module', 'Testing user interface', 'Testing security'], correctAnswer: 0 },
                { question: 'What is system testing?', options: ['Testing complete application', 'Testing components', 'Testing units', 'Testing code'], correctAnswer: 0 },
                { question: 'What is acceptance testing?', options: ['User validation testing', 'Developer testing', 'Automated testing', 'Performance testing'], correctAnswer: 0 },
                { question: 'What is regression testing?', options: ['Re-testing after changes', 'First-time testing', 'Security testing', 'Load testing'], correctAnswer: 0 },
                { question: 'What is a test case?', options: ['Set of test conditions', 'Bug report', 'Test plan', 'Test script'], correctAnswer: 0 },
                { question: 'What is a bug?', options: ['Software defect', 'Feature', 'Requirement', 'Test'], correctAnswer: 0 },
                { question: 'What is automated testing?', options: ['Tests run by software', 'Manual testing', 'User testing', 'Acceptance testing'], correctAnswer: 0 },
                { question: 'What is Selenium?', options: ['Automation testing tool', 'Bug tracking tool', 'Test management tool', 'Database tool'], correctAnswer: 0 }
            ],
            
            // Test 99: Cloud Computing
            99: [
                { question: 'What is cloud computing?', options: ['Internet-based computing', 'Local servers', 'Desktop software', 'Mobile apps'], correctAnswer: 0 },
                { question: 'What is IaaS?', options: ['Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Interface as a Service'], correctAnswer: 0 },
                { question: 'What is PaaS?', options: ['Platform as a Service', 'Program as a Service', 'Protocol as a Service', 'Process as a Service'], correctAnswer: 0 },
                { question: 'What is SaaS?', options: ['Software as a Service', 'System as a Service', 'Storage as a Service', 'Security as a Service'], correctAnswer: 0 },
                { question: 'What is a public cloud?', options: ['Services over public internet', 'Private network', 'Hybrid deployment', 'On-premises'], correctAnswer: 0 },
                { question: 'What is a private cloud?', options: ['Dedicated to one organization', 'Public access', 'Shared resources', 'Community cloud'], correctAnswer: 0 },
                { question: 'What is a hybrid cloud?', options: ['Mix of public and private', 'Only public', 'Only private', 'Community cloud'], correctAnswer: 0 },
                { question: 'What is virtualization?', options: ['Creating virtual resources', 'Physical servers', 'Cloud storage', 'Network security'], correctAnswer: 0 },
                { question: 'What is a hypervisor?', options: ['Virtual machine monitor', 'Cloud manager', 'Storage system', 'Network tool'], correctAnswer: 0 },
                { question: 'What is scalability in cloud?', options: ['Ability to scale resources', 'Fixed capacity', 'Limited growth', 'Manual scaling'], correctAnswer: 0 }
            ],
            
            // Test 100: Blockchain Technology
            100: [
                { question: 'What is blockchain?', options: ['Distributed ledger', 'Centralized database', 'Cloud storage', 'Network protocol'], correctAnswer: 0 },
                { question: 'What is a block in blockchain?', options: ['Data container', 'Network node', 'Cryptocurrency', 'Mining tool'], correctAnswer: 0 },
                { question: 'What is mining in blockchain?', options: ['Validating transactions', 'Creating blocks', 'Earning rewards', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a cryptocurrency?', options: ['Digital currency', 'Physical coin', 'Bank note', 'Stock'], correctAnswer: 0 },
                { question: 'What is Bitcoin?', options: ['First cryptocurrency', 'Blockchain platform', 'Smart contract', 'Exchange'], correctAnswer: 0 },
                { question: 'What is Ethereum?', options: ['Blockchain with smart contracts', 'Cryptocurrency only', 'Exchange', 'Wallet'], correctAnswer: 0 },
                { question: 'What is a smart contract?', options: ['Self-executing contract', 'Legal document', 'Paper contract', 'Digital signature'], correctAnswer: 0 },
                { question: 'What is a wallet in crypto?', options: ['Store private keys', 'Physical wallet', 'Exchange account', 'Bank account'], correctAnswer: 0 },
                { question: 'What is decentralization?', options: ['No central authority', 'Central control', 'Government regulated', 'Bank controlled'], correctAnswer: 0 },
                { question: 'What is a consensus mechanism?', options: ['Agreement protocol', 'Voting system', 'Mining process', 'Validation method'], correctAnswer: 0 }
            ],
            
            // Test 101: Internet of Things
            101: [
                { question: 'What is IoT?', options: ['Internet of Things', 'Internet of Technology', 'Integration of Things', 'Interface of Technology'], correctAnswer: 0 },
                { question: 'What is a smart device?', options: ['Connected device', 'Basic appliance', 'Manual device', 'Analog device'], correctAnswer: 0 },
                { question: 'What is a sensor?', options: ['Detects environment', 'Actuator', 'Processor', 'Memory'], correctAnswer: 0 },
                { question: 'What is an actuator?', options: ['Controls mechanism', 'Detects changes', 'Stores data', 'Processes information'], correctAnswer: 0 },
                { question: 'What is M2M?', options: ['Machine to Machine', 'Man to Machine', 'Mobile to Mobile', 'Main to Memory'], correctAnswer: 0 },
                { question: 'What is a smart home?', options: ['Home with IoT devices', 'Automated house', 'Connected appliances', 'All of the above'], correctAnswer: 3 },
                { question: 'What is a wearable device?', options: ['Body-worn tech', 'Smartphone', 'Tablet', 'Laptop'], correctAnswer: 0 },
                { question: 'What is RFID?', options: ['Radio Frequency Identification', 'Remote Frequency ID', 'Radio Field ID', 'Rapid Frequency ID'], correctAnswer: 0 },
                { question: 'What is a gateway in IoT?', options: ['Connects devices to cloud', 'Network switch', 'Router', 'Modem'], correctAnswer: 0 },
                { question: 'What is edge computing?', options: ['Processing near devices', 'Cloud processing', 'Data center', 'Remote server'], correctAnswer: 0 }
            ],
            
            // Test 102: Big Data Analytics
            102: [
                { question: 'What is Big Data?', options: ['Large datasets', 'Complex data', 'Volume, Velocity, Variety', 'All of the above'], correctAnswer: 3 },
                { question: 'What is Volume in Big Data?', options: ['Amount of data', 'Speed of data', 'Types of data', 'Data quality'], correctAnswer: 0 },
                { question: 'What is Velocity in Big Data?', options: ['Speed of data processing', 'Data size', 'Data types', 'Data accuracy'], correctAnswer: 0 },
                { question: 'What is Variety in Big Data?', options: ['Different data types', 'Data amount', 'Data speed', 'Data value'], correctAnswer: 0 },
                { question: 'What is Hadoop?', options: ['Big Data framework', 'Database', 'Programming language', 'Cloud service'], correctAnswer: 0 },
                { question: 'What is MapReduce?', options: ['Processing model', 'Storage system', 'Database query', 'Network protocol'], correctAnswer: 0 },
                { question: 'What is HDFS?', options: ['Hadoop Distributed File System', 'Hadoop Data Format System', 'High Density File Storage', 'Hadoop Database File System'], correctAnswer: 0 },
                { question: 'What is Apache Spark?', options: ['Fast processing engine', 'Storage system', 'Database', 'Query language'], correctAnswer: 0 },
                { question: 'What is data mining?', options: ['Discovering patterns', 'Data storage', 'Data deletion', 'Data backup'], correctAnswer: 0 },
                { question: 'What is predictive analytics?', options: ['Forecasting future trends', 'Past analysis', 'Current analysis', 'Data storage'], correctAnswer: 0 }
            ],
            
            // Test 103: UI/UX Design
            103: [
                { question: 'What is UI design?', options: ['User Interface design', 'User Interaction design', 'User Integration design', 'Universal Interface design'], correctAnswer: 0 },
                { question: 'What is UX design?', options: ['User Experience design', 'User Extension design', 'Universal Experience', 'User Execution'], correctAnswer: 0 },
                { question: 'What is wireframing?', options: ['Basic layout sketch', 'Final design', 'Code writing', 'Testing'], correctAnswer: 0 },
                { question: 'What is prototyping?', options: ['Interactive mockup', 'Final product', 'Sketch', 'Documentation'], correctAnswer: 0 },
                { question: 'What is usability?', options: ['Ease of use', 'Visual appeal', 'Code quality', 'Performance'], correctAnswer: 0 },
                { question: 'What is accessibility?', options: ['Design for all users', 'Visual design', 'Color scheme', 'Typography'], correctAnswer: 0 },
                { question: 'What is responsive design?', options: ['Adapts to screen size', 'Fixed layout', 'Print design', 'Mobile only'], correctAnswer: 0 },
                { question: 'What is a user persona?', options: ['User representation', 'Design tool', 'Code library', 'Testing script'], correctAnswer: 0 },
                { question: 'What is A/B testing?', options: ['Comparing versions', 'Color testing', 'Code testing', 'Performance test'], correctAnswer: 0 },
                { question: 'What is information architecture?', options: ['Content organization', 'Visual design', 'Code structure', 'Database design'], correctAnswer: 0 }
            ],
            
            // Test 104: Digital Marketing
            104: [
                { question: 'What is SEO?', options: ['Search Engine Optimization', 'Social Engagement Online', 'Site Engine Operation', 'Search Engine Operation'], correctAnswer: 0 },
                { question: 'What is PPC?', options: ['Pay-Per-Click', 'Pay-Per-Conversion', 'Price-Per-Click', 'Program-Per-Click'], correctAnswer: 0 },
                { question: 'What is content marketing?', options: ['Creating valuable content', 'Paid ads', 'Email marketing', 'Social media'], correctAnswer: 0 },
                { question: 'What is social media marketing?', options: ['Promoting on social platforms', 'Email campaigns', 'Search ads', 'TV ads'], correctAnswer: 0 },
                { question: 'What is email marketing?', options: ['Marketing via email', 'Social media posts', 'Search ads', 'Content creation'], correctAnswer: 0 },
                { question: 'What is conversion rate?', options: ['Percentage taking desired action', 'Website traffic', 'Bounce rate', 'Click rate'], correctAnswer: 0 },
                { question: 'What is bounce rate?', options: ['Single-page sessions', 'Conversion rate', 'Click rate', 'Engagement rate'], correctAnswer: 0 },
                { question: 'What is a landing page?', options: ['Destination after click', 'Homepage', 'Blog post', 'About page'], correctAnswer: 0 },
                { question: 'What is Google Analytics?', options: ['Website analytics tool', 'Search engine', 'Ad platform', 'Social media'], correctAnswer: 0 },
                { question: 'What is a keyword?', options: ['Search term', 'Password', 'Code word', 'Tag'], correctAnswer: 0 }
            ],
            
            // Test 105: Business Management
            105: [
                { question: 'What is management?', options: ['Planning and organizing', 'Leading and controlling', 'Resource coordination', 'All of the above'], correctAnswer: 3 },
                { question: 'What is leadership?', options: ['Guiding and inspiring', 'Task assignment', 'Budget planning', 'Hiring'], correctAnswer: 0 },
                { question: 'What is strategic planning?', options: ['Long-term goal setting', 'Daily tasks', 'Weekly meetings', 'Budget review'], correctAnswer: 0 },
                { question: 'What is organizational structure?', options: ['Hierarchy and roles', 'Company culture', 'Office layout', 'Work schedule'], correctAnswer: 0 },
                { question: 'What is human resources?', options: ['Employee management', 'Financial department', 'Marketing team', 'IT support'], correctAnswer: 0 },
                { question: 'What is operations management?', options: ['Overseeing production', 'Employee hiring', 'Marketing campaigns', 'Financial planning'], correctAnswer: 0 },
                { question: 'What is supply chain?', options: ['Product flow from source to customer', 'Employee chain', 'Management chain', 'Command chain'], correctAnswer: 0 },
                { question: 'What is a SWOT analysis?', options: ['Strengths, Weaknesses, Opportunities, Threats', 'Sales, Wins, Operations, Targets', 'Strategy, Work, Output, Time', 'System, Web, Output, Technology'], correctAnswer: 0 },
                { question: 'What is a KPI?', options: ['Key Performance Indicator', 'Key Process Indicator', 'Key Product Index', 'Key Performance Index'], correctAnswer: 0 },
                { question: 'What is corporate culture?', options: ['Shared values and practices', 'Company building', 'Office design', 'Employee salary'], correctAnswer: 0 }
            ],
            
            // Test 106: Accounting Fundamentals
            106: [
                { question: 'What is accounting?', options: ['Recording financial transactions', 'Marketing products', 'Managing employees', 'Developing software'], correctAnswer: 0 },
                { question: 'What is an asset?', options: ['Resource owned', 'Money owed', 'Company expense', 'Employee salary'], correctAnswer: 0 },
                { question: 'What is a liability?', options: ['Debt or obligation', 'Property owned', 'Cash on hand', 'Investment'], correctAnswer: 0 },
                { question: 'What is equity?', options: ['Owner\'s value', 'Company debt', 'Monthly expense', 'Annual revenue'], correctAnswer: 0 },
                { question: 'What is revenue?', options: ['Income from sales', 'Business expense', 'Employee wage', 'Tax payment'], correctAnswer: 0 },
                { question: 'What is an expense?', options: ['Cost incurred', 'Money received', 'Asset purchased', 'Investment return'], correctAnswer: 0 },
                { question: 'What is a balance sheet?', options: ['Financial statement', 'Income report', 'Cash flow', 'Budget plan'], correctAnswer: 0 },
                { question: 'What is an income statement?', options: ['Profit and loss report', 'Asset list', 'Liability record', 'Equity statement'], correctAnswer: 0 },
                { question: 'What is cash flow?', options: ['Money moving in/out', 'Profit amount', 'Revenue total', 'Expense total'], correctAnswer: 0 },
                { question: 'What is depreciation?', options: ['Asset value decrease', 'Price increase', 'Revenue growth', 'Expense reduction'], correctAnswer: 0 }
            ],
            
            // Test 107: Economics Basics
            107: [
                { question: 'What is economics?', options: ['Study of resource allocation', 'Business management', 'Accounting', 'Marketing'], correctAnswer: 0 },
                { question: 'What is microeconomics?', options: ['Individual economic units', 'Entire economy', 'Global trade', 'Government policy'], correctAnswer: 0 },
                { question: 'What is macroeconomics?', options: ['Economy as a whole', 'Individual markets', 'Single firms', 'Household behavior'], correctAnswer: 0 },
                { question: 'What is supply and demand?', options: ['Market forces', 'Price determinants', 'Economic model', 'All of the above'], correctAnswer: 3 },
                { question: 'What is inflation?', options: ['Rising prices', 'Falling prices', 'Stable prices', 'No change'], correctAnswer: 0 },
                { question: 'What is GDP?', options: ['Gross Domestic Product', 'General Domestic Product', 'Gross Development Product', 'General Development Product'], correctAnswer: 0 },
                { question: 'What is unemployment rate?', options: ['Jobless percentage', 'Employment rate', 'Labor force', 'Working population'], correctAnswer: 0 },
                { question: 'What is fiscal policy?', options: ['Government spending/tax', 'Central bank policy', 'Interest rates', 'Money supply'], correctAnswer: 0 },
                { question: 'What is monetary policy?', options: ['Central bank actions', 'Government budget', 'Tax policy', 'Trade policy'], correctAnswer: 0 },
                { question: 'What is a recession?', options: ['Economic decline', 'Economic growth', 'Stable economy', 'Inflation period'], correctAnswer: 0 }
            ],
            
            // Test 108: Psychology Basics
            108: [
                { question: 'What is psychology?', options: ['Study of mind and behavior', 'Study of society', 'Study of brain', 'Study of emotions'], correctAnswer: 0 },
                { question: 'Who is Sigmund Freud?', options: ['Psychoanalysis founder', 'Behaviorist', 'Humanist', 'Cognitive psychologist'], correctAnswer: 0 },
                { question: 'What is consciousness?', options: ['Awareness of self and environment', 'Sleep state', 'Dream state', 'Unconscious mind'], correctAnswer: 0 },
                { question: 'What is memory?', options: ['Information storage', 'Learning process', 'Thinking', 'Perception'], correctAnswer: 0 },
                { question: 'What is learning?', options: ['Acquiring knowledge', 'Innate behavior', 'Reflex action', 'Instinct'], correctAnswer: 0 },
                { question: 'What is motivation?', options: ['Drive for action', 'Emotional state', 'Cognitive process', 'Personality trait'], correctAnswer: 0 },
                { question: 'What is emotion?', options: ['Feeling state', 'Thought process', 'Behavior pattern', 'Social interaction'], correctAnswer: 0 },
                { question: 'What is personality?', options: ['Individual differences', 'Temporary mood', 'Physical appearance', 'Social role'], correctAnswer: 0 },
                { question: 'What is development?', options: ['Growth and change', 'Static state', 'Decline', 'Maturity only'], correctAnswer: 0 },
                { question: 'What is mental health?', options: ['Psychological wellbeing', 'Physical health', 'Social status', 'Economic condition'], correctAnswer: 0 }
            ],
            
            // Test 109: Sociology
            109: [
                { question: 'What is sociology?', options: ['Study of society', 'Study of individual', 'Study of mind', 'Study of culture'], correctAnswer: 0 },
                { question: 'What is social structure?', options: ['Patterned social arrangements', 'Individual behavior', 'Random interactions', 'Personal choices'], correctAnswer: 0 },
                { question: 'What is culture?', options: ['Shared beliefs and practices', 'Personal habits', 'Individual preferences', 'Biological traits'], correctAnswer: 0 },
                { question: 'What is socialization?', options: ['Learning social norms', 'Isolation', 'Individual development', 'Biological growth'], correctAnswer: 0 },
                { question: 'What is social institution?', options: ['Stable social structure', 'Temporary group', 'Individual relationship', 'Casual interaction'], correctAnswer: 0 },
                { question: 'What is family?', options: ['Basic social unit', 'Workplace', 'School', 'Government'], correctAnswer: 0 },
                { question: 'What is education?', options: ['Knowledge transmission', 'Healthcare', 'Economic activity', 'Political process'], correctAnswer: 0 },
                { question: 'What is religion?', options: ['Belief system', 'Economic system', 'Political system', 'Legal system'], correctAnswer: 0 },
                { question: 'What is social inequality?', options: ['Unequal resource distribution', 'Equal opportunity', 'Social justice', 'Fair treatment'], correctAnswer: 0 },
                { question: 'What is social change?', options: ['Societal transformation', 'Static society', 'No change', 'Individual change'], correctAnswer: 0 }
            ],
            
            // Test 110: Political Science
            110: [
                { question: 'What is political science?', options: ['Study of politics and government', 'Study of society', 'Study of economics', 'Study of history'], correctAnswer: 0 },
                { question: 'What is democracy?', options: ['Rule by the people', 'Rule by one', 'Rule by few', 'Rule by none'], correctAnswer: 0 },
                { question: 'What is monarchy?', options: ['Rule by king/queen', 'Rule by people', 'Rule by elite', 'Rule by military'], correctAnswer: 0 },
                { question: 'What is dictatorship?', options: ['Rule by one with absolute power', 'Shared power', 'No government', 'People power'], correctAnswer: 0 },
                { question: 'What is a constitution?', options: ['Fundamental laws', 'Temporary rules', 'Policy document', 'Party manifesto'], correctAnswer: 0 },
                { question: 'What is a state?', options: ['Political entity with sovereignty', 'Geographic region', 'Local government', 'International organization'], correctAnswer: 0 },
                { question: 'What is government?', options: ['Governing body', 'The people', 'The territory', 'The economy'], correctAnswer: 0 },
                { question: 'What is sovereignty?', options: ['Supreme authority', 'Shared power', 'Limited rule', 'No authority'], correctAnswer: 0 },
                { question: 'What is a political party?', options: ['Group with common political goals', 'Government branch', 'International body', 'Non-profit organization'], correctAnswer: 0 },
                { question: 'What is an election?', options: ['Voting process', 'Appointment', 'Selection by lottery', 'Inheritance'], correctAnswer: 0 }
            ],
            
            // Test 111: Environmental Science
            111: [
                { question: 'What is environmental science?', options: ['Study of environment and solutions', 'Study of rocks', 'Study of weather', 'Study of animals'], correctAnswer: 0 },
                { question: 'What is an ecosystem?', options: ['Community of living organisms', 'Single species', 'Physical environment only', 'Human society'], correctAnswer: 0 },
                { question: 'What is biodiversity?', options: ['Variety of life forms', 'Single species', 'Few species', 'No variation'], correctAnswer: 0 },
                { question: 'What is climate change?', options: ['Long-term weather pattern shift', 'Daily weather change', 'Seasonal change', 'Weekly forecast'], correctAnswer: 0 },
                { question: 'What is global warming?', options: ['Earth\'s temperature rise', 'Cooling period', 'Stable temperature', 'Seasonal variation'], correctAnswer: 0 },
                { question: 'What is pollution?', options: ['Harmful substances in environment', 'Natural elements', 'Clean air', 'Pure water'], correctAnswer: 0 },
                { question: 'What is renewable energy?', options: ['Sustainable energy sources', 'Fossil fuels', 'Nuclear power', 'Coal energy'], correctAnswer: 0 },
                { question: 'What is conservation?', options: ['Protecting natural resources', 'Using all resources', 'Wasting resources', 'Ignoring nature'], correctAnswer: 0 },
                { question: 'What is sustainability?', options: ['Meeting needs without compromising future', 'Using all now', 'No resource use', 'Maximum consumption'], correctAnswer: 0 },
                { question: 'What is a carbon footprint?', options: ['CO2 emissions measure', 'Carbon weight', 'Footprint size', 'Energy use'], correctAnswer: 0 }
            ],
            
            // Test 112: Astronomy
            112: [
                { question: 'What is astronomy?', options: ['Study of celestial objects', 'Study of Earth', 'Study of weather', 'Study of oceans'], correctAnswer: 0 },
                { question: 'What is the Sun?', options: ['Star at solar system center', 'Planet', 'Moon', 'Asteroid'], correctAnswer: 0 },
                { question: 'What is a planet?', options: ['Orbits a star', 'Shines by own light', 'Artificial satellite', 'Meteor'], correctAnswer: 0 },
                { question: 'How many planets in our solar system?', options: ['8', '9', '7', '10'], correctAnswer: 0 },
                { question: 'What is the Moon?', options: ['Earth\'s natural satellite', 'Planet', 'Star', 'Asteroid'], correctAnswer: 0 },
                { question: 'What is a galaxy?', options: ['Stars, gas, dust system', 'Single star', 'Planet group', 'Solar system'], correctAnswer: 0 },
                { question: 'What is the Milky Way?', options: ['Our galaxy', 'Another galaxy', 'Star cluster', 'Nebula'], correctAnswer: 0 },
                { question: 'What is a black hole?', options: ['Gravity so strong nothing escapes', 'Empty space', 'Dark star', 'Hole in space'], correctAnswer: 0 },
                { question: 'What is a comet?', options: ['Icy body with tail', 'Rocky asteroid', 'Gas planet', 'Dwarf planet'], correctAnswer: 0 },
                { question: 'What is a light year?', options: ['Distance light travels in year', 'Time measurement', 'Speed unit', 'Age measurement'], correctAnswer: 0 }
            ],
            
            // Test 113: Chemistry Basics
            113: [
                { question: 'What is chemistry?', options: ['Study of matter and its properties', 'Study of living things', 'Study of Earth', 'Study of space'], correctAnswer: 0 },
                { question: 'What is an atom?', options: ['Basic unit of matter', 'Molecule', 'Compound', 'Element'], correctAnswer: 0 },
                { question: 'What is a molecule?', options: ['Two or more atoms bonded', 'Single atom', 'Electron', 'Proton'], correctAnswer: 0 },
                { question: 'What is an element?', options: ['Pure substance of one atom type', 'Compound', 'Mixture', 'Solution'], correctAnswer: 0 },
                { question: 'What is a compound?', options: ['Different elements bonded', 'Single element', 'Mixture', 'Atom'], correctAnswer: 0 },
                { question: 'What is the periodic table?', options: ['Element organization', 'Molecule chart', 'Compound list', 'Reaction table'], correctAnswer: 0 },
                { question: 'What is a chemical reaction?', options: ['Substance transformation', 'Physical change', 'State change', 'Temperature change'], correctAnswer: 0 },
                { question: 'What is an acid?', options: ['pH less than 7', 'pH greater than 7', 'pH equal 7', 'Neutral substance'], correctAnswer: 0 },
                { question: 'What is a base?', options: ['pH greater than 7', 'pH less than 7', 'pH equal 7', 'Neutral'], correctAnswer: 0 },
                { question: 'What is water?', options: ['H2O', 'CO2', 'O2', 'NaCl'], correctAnswer: 0 }
            ],
            
            // Test 114: Physics Fundamentals
            114: [
                { question: 'What is physics?', options: ['Study of matter, energy, and interactions', 'Study of living things', 'Study of chemicals', 'Study of Earth'], correctAnswer: 0 },
                { question: 'What is Newton\'s first law?', options: ['Object at rest stays at rest', 'F=ma', 'Action-reaction', 'Gravity'], correctAnswer: 0 },
                { question: 'What is force?', options: ['Push or pull', 'Mass', 'Weight', 'Energy'], correctAnswer: 0 },
                { question: 'What is mass?', options: ['Amount of matter', 'Weight', 'Volume', 'Density'], correctAnswer: 0 },
                { question: 'What is energy?', options: ['Capacity to do work', 'Force', 'Power', 'Motion'], correctAnswer: 0 },
                { question: 'What is gravity?', options: ['Force attracting masses', 'Magnetic force', 'Electric force', 'Nuclear force'], correctAnswer: 0 },
                { question: 'What is velocity?', options: ['Speed with direction', 'Speed only', 'Acceleration', 'Distance'], correctAnswer: 0 },
                { question: 'What is acceleration?', options: ['Rate of velocity change', 'Constant speed', 'Distance traveled', 'Time taken'], correctAnswer: 0 },
                { question: 'What is electricity?', options: ['Flow of electric charge', 'Magnetic field', 'Light energy', 'Heat energy'], correctAnswer: 0 },
                { question: 'What is magnetism?', options: ['Force from magnets', 'Electric current', 'Gravity', 'Nuclear force'], correctAnswer: 0 }
            ],
            
            // Test 115: Biology Basics
            115: [
                { question: 'What is biology?', options: ['Study of living organisms', 'Study of chemicals', 'Study of Earth', 'Study of space'], correctAnswer: 0 },
                { question: 'What is a cell?', options: ['Basic unit of life', 'Organ', 'Tissue', 'Organism'], correctAnswer: 0 },
                { question: 'What is DNA?', options: ['Genetic material', 'Protein', 'Carbohydrate', 'Lipid'], correctAnswer: 0 },
                { question: 'What is evolution?', options: ['Change in species over time', 'Creation', 'Extinction', 'Mutation'], correctAnswer: 0 },
                { question: 'What is photosynthesis?', options: ['Plants making food from sunlight', 'Animal digestion', 'Cellular respiration', 'Water absorption'], correctAnswer: 0 },
                { question: 'What is an ecosystem?', options: ['Community with environment', 'Single species', 'Population only', 'Habitat only'], correctAnswer: 0 },
                { question: 'What is a gene?', options: ['DNA segment for trait', 'Protein', 'Cell', 'Organ'], correctAnswer: 0 },
                { question: 'What is a species?', options: ['Group of similar organisms', 'Individual', 'Population', 'Community'], correctAnswer: 0 },
                { question: 'What is homeostasis?', options: ['Internal stability', 'Change', 'Growth', 'Development'], correctAnswer: 0 },
                { question: 'What is reproduction?', options: ['Creating offspring', 'Growing', 'Eating', 'Moving'], correctAnswer: 0 }
            ],
            
            // Test 116: Anatomy and Physiology
            116: [
                { question: 'What is anatomy?', options: ['Study of body structure', 'Study of function', 'Study of diseases', 'Study of cells'], correctAnswer: 0 },
                { question: 'What is physiology?', options: ['Study of body function', 'Study of structure', 'Study of tissues', 'Study of organs'], correctAnswer: 0 },
                { question: 'What is the heart?', options: ['Pumps blood', 'Filters blood', 'Produces blood', 'Stores blood'], correctAnswer: 0 },
                { question: 'What are lungs?', options: ['Respiratory organs', 'Blood filters', 'Digestive organs', 'Nerve centers'], correctAnswer: 0 },
                { question: 'What is the brain?', options: ['Control center', 'Pump', 'Filter', 'Storage'], correctAnswer: 0 },
                { question: 'What is the skeleton?', options: ['Bone structure', 'Muscle system', 'Nerve network', 'Blood vessels'], correctAnswer: 0 },
                { question: 'What are muscles?', options: ['Movement tissue', 'Support tissue', 'Nerve tissue', 'Blood tissue'], correctAnswer: 0 },
                { question: 'What is blood?', options: ['Circulating fluid', 'Solid tissue', 'Bone marrow', 'Nerve cells'], correctAnswer: 0 },
                { question: 'What is the nervous system?', options: ['Network of nerves', 'Blood vessels', 'Muscle fibers', 'Bone structure'], correctAnswer: 0 },
                { question: 'What is the digestive system?', options: ['Processes food', 'Circulates blood', 'Breathes air', 'Moves body'], correctAnswer: 0 }
            ],
            
            // Test 117: Genetics
                       // Test 117: Genetics
            117: [
                { question: 'What is genetics?', options: ['Study of heredity', 'Study of cells', 'Study of evolution', 'Study of species'], correctAnswer: 0 },
                { question: 'What is a gene?', options: ['Heredity unit', 'Cell part', 'Protein', 'Organ'], correctAnswer: 0 },
                { question: 'What is DNA?', options: ['Genetic material', 'Protein', 'Carbohydrate', 'Lipid'], correctAnswer: 0 },
                { question: 'What is a chromosome?', options: ['DNA package', 'Gene', 'Protein', 'Cell'], correctAnswer: 0 },
                { question: 'What is a trait?', options: ['Characteristic', 'Gene', 'Chromosome', 'Cell'], correctAnswer: 0 },
                { question: 'What is dominant gene?', options: ['Expressed trait', 'Hidden trait', 'Weak trait', 'No trait'], correctAnswer: 0 },
                { question: 'What is recessive gene?', options: ['Hidden when dominant present', 'Always expressed', 'Strong trait', 'No effect'], correctAnswer: 0 },
                { question: 'What is mutation?', options: ['DNA sequence change', 'Normal gene', 'Protein change', 'Cell division'], correctAnswer: 0 },
                { question: 'What is inheritance?', options: ['Passing traits to offspring', 'Learning traits', 'Acquiring traits', 'Losing traits'], correctAnswer: 0 },
                { question: 'What is a genotype?', options: ['Genetic makeup', 'Physical appearance', 'Trait expression', 'Gene location'], correctAnswer: 0 }
            ],
            
            // Test 118: Marine Biology
            118: [
                { question: 'What is marine biology?', options: ['Study of ocean organisms', 'Study of freshwater life', 'Study of land animals', 'Study of desert plants'], correctAnswer: 0 },
                { question: 'What is a coral reef?', options: ['Marine ecosystem built by corals', 'Rock formation', 'Sand dune', 'Underwater volcano'], correctAnswer: 0 },
                { question: 'What is a fish?', options: ['Aquatic vertebrate with gills', 'Mammal that swims', 'Reptile in water', 'Amphibian'], correctAnswer: 0 },
                { question: 'What is a marine mammal?', options: ['Whale', 'Shark', 'Tuna', 'Eel'], correctAnswer: 0 },
                { question: 'What is plankton?', options: ['Tiny drifting organisms', 'Large predatory fish', 'Seaweed', 'Coral polyps'], correctAnswer: 0 },
                { question: 'What is algae?', options: ['Simple aquatic plants', 'Fish species', 'Type of coral', 'Marine reptile'], correctAnswer: 0 },
                { question: 'What is a crustacean?', options: ['Shellfish like crab', 'Fish with scales', 'Marine mammal', 'Sea bird'], correctAnswer: 0 },
                { question: 'What is a mollusk?', options: ['Soft-bodied animal with shell', 'Fish with backbone', 'Marine reptile', 'Sea plant'], correctAnswer: 0 },
                { question: 'What is the ocean?', options: ['Large saltwater body', 'Freshwater lake', 'River system', 'Inland sea'], correctAnswer: 0 },
                { question: 'What is a tide?', options: ['Regular rise and fall of sea level', 'Ocean wave', 'Underwater current', 'Coastal wind'], correctAnswer: 0 }
            ],
            
            // Test 119: Zoology
            119: [
                { question: 'What is zoology?', options: ['Scientific study of animals', 'Study of plants', 'Study of rocks', 'Study of cells'], correctAnswer: 0 },
                { question: 'What is a mammal?', options: ['Warm-blooded with hair', 'Cold-blooded with scales', 'Has feathers', 'Lays eggs'], correctAnswer: 0 },
                { question: 'What is a reptile?', options: ['Cold-blooded with scales', 'Warm-blooded with fur', 'Has feathers', 'Lives in water'], correctAnswer: 0 },
                { question: 'What is an amphibian?', options: ['Lives both water and land', 'Only in water', 'Only on land', 'Only in air'], correctAnswer: 0 },
                { question: 'What is a bird?', options: ['Feathered vertebrate with beak', 'Furry animal', 'Scaly animal', 'Slimy animal'], correctAnswer: 0 },
                { question: 'What is a fish?', options: ['Aquatic vertebrate with gills', 'Land mammal', 'Airborne animal', 'Amphibious creature'], correctAnswer: 0 },
                { question: 'What is an invertebrate?', options: ['Animal without backbone', 'Animal with backbone', 'Warm-blooded', 'Cold-blooded'], correctAnswer: 0 },
                { question: 'What is a predator?', options: ['Animal that hunts others', 'Animal that is hunted', 'Plant-eater', 'Scavenger'], correctAnswer: 0 },
                { question: 'What is prey?', options: ['Animal hunted by predators', 'Animal that hunts', 'Top predator', 'Carnivore'], correctAnswer: 0 },
                { question: 'What is an endangered species?', options: ['Species at risk of extinction', 'Common species', 'Invasive species', 'Domesticated'], correctAnswer: 0 }
            ],
            
            // Test 120: Botany
            120: [
                { question: 'What is botany?', options: ['Scientific study of plants', 'Study of animals', 'Study of rocks', 'Study of cells'], correctAnswer: 0 },
                { question: 'What is photosynthesis?', options: ['Plants make food from sunlight', 'Plant reproduction', 'Water absorption', 'Seed dispersal'], correctAnswer: 0 },
                { question: 'What is a flower?', options: ['Reproductive structure of plants', 'Plant leaf', 'Plant stem', 'Plant root'], correctAnswer: 0 },
                { question: 'What is a seed?', options: ['Plant embryo with food supply', 'Plant leaf', 'Plant flower', 'Plant stem'], correctAnswer: 0 },
                { question: 'What is a root?', options: ['Plant organ that absorbs water', 'Plant stem', 'Plant leaf', 'Plant flower'], correctAnswer: 0 },
                { question: 'What is a stem?', options: ['Supports leaves and transports', 'Absorbs water', 'Makes food', 'Reproduces'], correctAnswer: 0 },
                { question: 'What is a leaf?', options: ['Plant organ for photosynthesis', 'Absorbs water', 'Anchors plant', 'Reproduces'], correctAnswer: 0 },
                { question: 'What is chlorophyll?', options: ['Green pigment for photosynthesis', 'Plant hormone', 'Root nutrient', 'Flower color'], correctAnswer: 0 },
                { question: 'What is pollination?', options: ['Transfer of pollen to fertilize', 'Seed dispersal', 'Water absorption', 'Food production'], correctAnswer: 0 },
                { question: 'What is a deciduous plant?', options: ['Loses leaves seasonally', 'Evergreen', 'Desert plant', 'Aquatic plant'], correctAnswer: 0 }
            ],            // Test 121: Ecology
            121: [
                { question: 'What is ecology?', options: ['Study of organisms and their environment', 'Study of cells', 'Study of rocks', 'Study of weather'], correctAnswer: 0 },
                { question: 'What is an ecosystem?', options: ['Community with living and non-living', 'Only living things', 'Only non-living', 'Single species'], correctAnswer: 0 },
                { question: 'What is a food chain?', options: ['Energy transfer between organisms', 'Circular energy flow', 'Random feeding', 'Plant relationship'], correctAnswer: 0 },
                { question: 'What is a producer?', options: ['Organism that makes its own food', 'Eats others', 'Decomposer', 'Scavenger'], correctAnswer: 0 },
                { question: 'What is a consumer?', options: ['Organism that eats other organisms', 'Makes its own food', 'Breaks down dead matter', 'Produces oxygen'], correctAnswer: 0 },
                { question: 'What is a decomposer?', options: ['Breaks down dead organisms', 'Makes its own food', 'Eats live prey', 'Produces energy'], correctAnswer: 0 },
                { question: 'What is a habitat?', options: ['Natural home of an organism', 'Food source', 'Species type', 'Climate zone'], correctAnswer: 0 },
                { question: 'What is a niche?', options: ['Role of organism in ecosystem', 'Physical home', 'Species name', 'Population size'], correctAnswer: 0 },
                { question: 'What is biodiversity?', options: ['Variety of life in ecosystem', 'Single species', 'Total organisms', 'Plants only'], correctAnswer: 0 },
                { question: 'What is carrying capacity?', options: ['Maximum population environment supports', 'Minimum population', 'Average population', 'Total species'], correctAnswer: 0 }
            ],
            
            // Test 122: Microbiology
            122: [
                { question: 'What is microbiology?', options: ['Study of microscopic organisms', 'Study of large animals', 'Study of plants', 'Study of rocks'], correctAnswer: 0 },
                { question: 'What is a bacterium?', options: ['Single-celled microorganism', 'Virus', 'Fungus', 'Protozoan'], correctAnswer: 0 },
                { question: 'What is a virus?', options: ['Infectious agent replicating in cells', 'Living cell', 'Bacteria type', 'Fungus'], correctAnswer: 0 },
                { question: 'What is a fungus?', options: ['Organism like mold and yeast', 'Bacteria', 'Virus', 'Protozoan'], correctAnswer: 0 },
                { question: 'What is a protozoan?', options: ['Single-celled eukaryote', 'Bacteria', 'Virus', 'Fungus'], correctAnswer: 0 },
                { question: 'What is a pathogen?', options: ['Disease-causing microorganism', 'Helpful bacteria', 'Food source', 'Plant nutrient'], correctAnswer: 0 },
                { question: 'What is an antibiotic?', options: ['Medicine that kills bacteria', 'Medicine that kills viruses', 'Vaccine', 'Pain reliever'], correctAnswer: 0 },
                { question: 'What is a vaccine?', options: ['Biological preparation for immunity', 'Antibiotic', 'Painkiller', 'Vitamin'], correctAnswer: 0 },
                { question: 'What is fermentation?', options: ['Process using microorganisms', 'Cell division', 'Photosynthesis', 'Respiration'], correctAnswer: 0 },
                { question: 'What is a microscope?', options: ['Instrument to see small objects', 'Telescope', 'Magnifying glass', 'Camera'], correctAnswer: 0 }
            ],
            
            // Test 123: Neuroscience
            123: [
                { question: 'What is neuroscience?', options: ['Study of nervous system', 'Study of brain only', 'Study of muscles', 'Study of cells'], correctAnswer: 0 },
                { question: 'What is a neuron?', options: ['Nerve cell transmitting signals', 'Brain cell only', 'Muscle cell', 'Blood cell'], correctAnswer: 0 },
                { question: 'What is the brain?', options: ['Central organ of nervous system', 'Muscle organ', 'Digestive organ', 'Respiratory organ'], correctAnswer: 0 },
                { question: 'What is a synapse?', options: ['Junction between neurons', 'Brain region', 'Nerve bundle', 'Spinal cord'], correctAnswer: 0 },
                { question: 'What is a neurotransmitter?', options: ['Chemical transmitting signals', 'Brain hormone', 'Nerve cell', 'Muscle signal'], correctAnswer: 0 },
                { question: 'What is the spinal cord?', options: ['Nerve bundle from brain', 'Brain part', 'Muscle group', 'Bone structure'], correctAnswer: 0 },
                { question: 'What is the cerebrum?', options: ['Largest brain part', 'Brain stem', 'Cerebellum', 'Spinal cord'], correctAnswer: 0 },
                { question: 'What is the cerebellum?', options: ['Brain part for coordination', 'Thinking center', 'Memory center', 'Emotion center'], correctAnswer: 0 },
                { question: 'What is the brain stem?', options: ['Connects brain to spinal cord', 'Thinking center', 'Memory center', 'Coordination center'], correctAnswer: 0 },
                { question: 'What is a reflex?', options: ['Automatic response to stimulus', 'Voluntary action', 'Thought process', 'Memory recall'], correctAnswer: 0 }
            ],
            
            // Test 124: Immunology
            124: [
                { question: 'What is immunology?', options: ['Study of immune system', 'Study of blood', 'Study of organs', 'Study of cells'], correctAnswer: 0 },
                { question: 'What is the immune system?', options: ['Body defense against pathogens', 'Circulatory system', 'Digestive system', 'Nervous system'], correctAnswer: 0 },
                { question: 'What is an antibody?', options: ['Protein that fights pathogens', 'Pathogen', 'White blood cell', 'Vaccine'], correctAnswer: 0 },
                { question: 'What is an antigen?', options: ['Substance triggering immune response', 'Antibody', 'Vaccine', 'White blood cell'], correctAnswer: 0 },
                { question: 'What is a white blood cell?', options: ['Immune cell fighting infection', 'Red blood cell', 'Platelet', 'Plasma'], correctAnswer: 0 },
                { question: 'What is a vaccine?', options: ['Prepares immune system for pathogens', 'Antibiotic', 'Painkiller', 'Vitamin'], correctAnswer: 0 },
                { question: 'What is immunity?', options: ['Resistance to disease', 'Illness', 'Infection', 'Inflammation'], correctAnswer: 0 },
                { question: 'What is an allergy?', options: ['Immune reaction to harmless substance', 'Infection', 'Autoimmune', 'Cancer'], correctAnswer: 0 },
                { question: 'What is autoimmune disease?', options: ['Immune system attacks body', 'External infection', 'Allergy', 'Cancer'], correctAnswer: 0 },
                { question: 'What is inflammation?', options: ['Immune response to injury', 'Infection', 'Allergy', 'Autoimmune'], correctAnswer: 0 }
            ],
            
            // Test 125: Epidemiology
            125: [
                { question: 'What is epidemiology?', options: ['Study of disease patterns in populations', 'Study of individual diseases', 'Study of bacteria', 'Study of viruses'], correctAnswer: 0 },
                { question: 'What is a pandemic?', options: ['Worldwide disease outbreak', 'Local outbreak', 'Seasonal flu', 'Common cold'], correctAnswer: 0 },
                { question: 'What is an epidemic?', options: ['Disease outbreak in community', 'Worldwide spread', 'Individual case', 'Endemic disease'], correctAnswer: 0 },
                { question: 'What is endemic?', options: ['Disease constantly present in region', 'New outbreak', 'Worldwide spread', 'Eradicated disease'], correctAnswer: 0 },
                { question: 'What is a vector?', options: ['Organism that transmits disease', 'Disease cause', 'Vaccine', 'Treatment'], correctAnswer: 0 },
                { question: 'What is incubation period?', options: ['Time between infection and symptoms', 'Sickness duration', 'Recovery time', 'Treatment period'], correctAnswer: 0 },
                { question: 'What is herd immunity?', options: ['Population protection from vaccination', 'Individual immunity', 'Natural immunity', 'Antibody resistance'], correctAnswer: 0 },
                { question: 'What is a carrier?', options: ['Infected person without symptoms', 'Sick person', 'Vaccinated person', 'Immune person'], correctAnswer: 0 },
                { question: 'What is quarantine?', options: ['Separating exposed individuals', 'Treating sick', 'Vaccinating', 'Testing'], correctAnswer: 0 },
                { question: 'What is isolation?', options: ['Separating sick individuals', 'Preventing exposure', 'Vaccination', 'Treatment'], correctAnswer: 0 }
            ],
            
            // Test 126: Pharmacology
            126: [
                { question: 'What is pharmacology?', options: ['Study of drugs and their effects', 'Study of poisons', 'Study of cells', 'Study of diseases'], correctAnswer: 0 },
                { question: 'What is a drug?', options: ['Substance that affects body', 'Food', 'Vitamin', 'Mineral'], correctAnswer: 0 },
                { question: 'What is a medication?', options: ['Drug used for treatment', 'Poison', 'Recreational drug', 'Food supplement'], correctAnswer: 0 },
                { question: 'What is a dose?', options: ['Amount of drug administered', 'Drug type', 'Drug form', 'Drug brand'], correctAnswer: 0 },
                { question: 'What is a side effect?', options: ['Unintended drug effect', 'Main effect', 'Drug benefit', 'Therapeutic effect'], correctAnswer: 0 },
                { question: 'What is a prescription?', options: ['Doctor order for medication', 'Drug label', 'Pharmacy receipt', 'Drug ad'], correctAnswer: 0 },
                { question: 'What is an antibiotic?', options: ['Drug that kills bacteria', 'Drug that kills viruses', 'Pain reliever', 'Anti-inflammatory'], correctAnswer: 0 },
                { question: 'What is an analgesic?', options: ['Pain-relieving drug', 'Antibiotic', 'Antiviral', 'Anti-inflammatory'], correctAnswer: 0 },
                { question: 'What is an anesthetic?', options: ['Drug causing numbness', 'Pain reliever', 'Antibiotic', 'Antiviral'], correctAnswer: 0 },
                { question: 'What is a vaccine?', options: ['Biological preparation for immunity', 'Antibiotic', 'Pain reliever', 'Anesthetic'], correctAnswer: 0 }
            ],
            
            // Test 127: Toxicology
            127: [
                { question: 'What is toxicology?', options: ['Study of poisons and their effects', 'Study of drugs', 'Study of cells', 'Study of diseases'], correctAnswer: 0 },
                { question: 'What is a toxin?', options: ['Poisonous substance', 'Medicine', 'Vitamin', 'Mineral'], correctAnswer: 0 },
                { question: 'What is a poison?', options: ['Substance causing harm/death', 'Food', 'Drink', 'Medicine'], correctAnswer: 0 },
                { question: 'What is venom?', options: ['Toxin injected by animal', 'Plant poison', 'Chemical toxin', 'Environmental toxin'], correctAnswer: 0 },
                { question: 'What is toxicity?', options: ['Degree substance is poisonous', 'Medicine strength', 'Drug effectiveness', 'Vitamin content'], correctAnswer: 0 },
                { question: 'What is an antidote?', options: ['Substance counteracting poison', 'Poison', 'Medicine', 'Vitamin'], correctAnswer: 0 },
                { question: 'What is dose-response?', options: ['Relationship between dose and effect', 'Drug interaction', 'Side effect', 'Allergic reaction'], correctAnswer: 0 },
                { question: 'What is LD50?', options: ['Lethal dose for 50% of population', 'Effective dose', 'Maximum dose', 'Minimum dose'], correctAnswer: 0 },
                { question: 'What is chronic toxicity?', options: ['Long-term poison exposure effects', 'Immediate poisoning', 'Acute toxicity', 'Allergic reaction'], correctAnswer: 0 },
                { question: 'What is acute toxicity?', options: ['Short-term poison exposure effects', 'Long-term effects', 'Chronic effects', 'Cumulative effects'], correctAnswer: 0 }
            ],
            
            // Test 128: Nutrition Science
            128: [
                { question: 'What is nutrition?', options: ['Study of nutrients in food', 'Study of exercise', 'Study of medicine', 'Study of diseases'], correctAnswer: 0 },
                { question: 'What is a carbohydrate?', options: ['Body main energy source', 'Body building nutrient', 'Vitamin', 'Mineral'], correctAnswer: 0 },
                { question: 'What is a protein?', options: ['Nutrient for growth and repair', 'Energy source', 'Vitamin', 'Mineral'], correctAnswer: 0 },
                { question: 'What is a fat?', options: ['Concentrated energy source', 'Body builder', 'Vitamin', 'Mineral'], correctAnswer: 0 },
                { question: 'What is a vitamin?', options: ['Essential organic compound', 'Energy source', 'Body builder', 'Mineral'], correctAnswer: 0 },
                { question: 'What is a mineral?', options: ['Inorganic nutrient', 'Organic compound', 'Energy source', 'Vitamin'], correctAnswer: 0 },
                { question: 'What is a calorie?', options: ['Unit of food energy', 'Nutrient type', 'Vitamin measure', 'Mineral measure'], correctAnswer: 0 },
                { question: 'What is metabolism?', options: ['Chemical processes in body', 'Digestion only', 'Exercise only', 'Eating only'], correctAnswer: 0 },
                { question: 'What is a balanced diet?', options: ['Eating varied nutrients right amounts', 'Single food type', 'Only proteins', 'Only carbs'], correctAnswer: 0 },
                { question: 'What is dehydration?', options: ['Excessive water loss', 'Vitamin deficiency', 'Mineral deficiency', 'Protein lack'], correctAnswer: 0 }
            ],
            
            // Test 129: Food Science
            129: [
                { question: 'What is food science?', options: ['Study of food properties and processing', 'Study of eating habits', 'Study of cooking', 'Study of nutrition'], correctAnswer: 0 },
                { question: 'What is food preservation?', options: ['Methods to prevent food spoilage', 'Cooking food', 'Eating food', 'Growing food'], correctAnswer: 0 },
                { question: 'What is pasteurization?', options: ['Heating to kill harmful bacteria', 'Freezing food', 'Drying food', 'Salting food'], correctAnswer: 0 },
                { question: 'What is fermentation?', options: ['Microbial food transformation', 'Heating food', 'Freezing food', 'Drying food'], correctAnswer: 0 },
                { question: 'What is a food additive?', options: ['Substance added to food', 'Natural food only', 'Fresh ingredient', 'Whole food'], correctAnswer: 0 },
                { question: 'What is a preservative?', options: ['Substance preventing spoilage', 'Flavor enhancer', 'Color additive', 'Sweetener'], correctAnswer: 0 },
                { question: 'What is shelf life?', options: ['Time food remains safe to eat', 'Cooking time', 'Storage temperature', 'Food weight'], correctAnswer: 0 },
                { question: 'What is food spoilage?', options: ['Food becoming unfit to eat', 'Food cooking', 'Food preparation', 'Food serving'], correctAnswer: 0 },
                { question: 'What is a pathogen in food?', options: ['Harmful microorganism in food', 'Food nutrient', 'Food vitamin', 'Food mineral'], correctAnswer: 0 },
                { question: 'What is food processing?', options: ['Transforming raw ingredients to food', 'Eating food', 'Growing food', 'Harvesting food'], correctAnswer: 0 }
            ],
            
            // Test 130: Agricultural Science
            130: [
                { question: 'What is agriculture?', options: ['Cultivation of crops and livestock', 'Food processing', 'Cooking', 'Nutrition study'], correctAnswer: 0 },
                { question: 'What is a crop?', options: ['Plant grown for food or product', 'Animal product', 'Processed food', 'Wild plant'], correctAnswer: 0 },
                { question: 'What is livestock?', options: ['Domesticated animals raised for food', 'Wild animals', 'Crops', 'Plants'], correctAnswer: 0 },
                { question: 'What is soil?', options: ['Upper earth layer for plant growth', 'Rock', 'Water', 'Air'], correctAnswer: 0 },
                { question: 'What is irrigation?', options: ['Artificial water supply for crops', 'Natural rainfall', 'Drainage', 'Flooding'], correctAnswer: 0 },
                { question: 'What is fertilizer?', options: ['Substance added to soil for plant growth', 'Pesticide', 'Herbicide', 'Insecticide'], correctAnswer: 0 },
                { question: 'What is a pesticide?', options: ['Chemical to control pests', 'Fertilizer', 'Soil additive', 'Plant nutrient'], correctAnswer: 0 },
                { question: 'What is organic farming?', options: ['Farming without synthetic chemicals', 'Factory farming', 'Industrial farming', 'GMO farming'], correctAnswer: 0 },
                { question: 'What is a GMO?', options: ['Genetically modified organism', 'Organic crop', 'Heirloom variety', 'Wild species'], correctAnswer: 0 },
                { question: 'What is aquaculture?', options: ['Farming of aquatic organisms', 'Land farming', 'Crop rotation', 'Livestock raising'], correctAnswer: 0 }
            ],
            
            // Test 131: Veterinary Science
            131: [
                { question: 'What is veterinary science?', options: ['Medical care of animals', 'Human medicine', 'Plant medicine', 'Environmental science'], correctAnswer: 0 },
                { question: 'What is a veterinarian?', options: ['Animal doctor', 'Human doctor', 'Plant specialist', 'Scientist'], correctAnswer: 0 },
                { question: 'What is a vaccine for animals?', options: ['Prevents animal diseases', 'Animal food', 'Animal medicine', 'Animal vitamin'], correctAnswer: 0 },
                { question: 'What is zoonosis?', options: ['Disease transmitted animal to human', 'Human disease', 'Plant disease', 'Environmental disease'], correctAnswer: 0 },
                { question: 'What is a pet?', options: ['Domesticated animal for companionship', 'Farm animal', 'Wild animal', 'Lab animal'], correctAnswer: 0 },
                { question: 'What is livestock?', options: ['Farm animals raised for food', 'Pets', 'Wild animals', 'Zoo animals'], correctAnswer: 0 },
                { question: 'What is animal husbandry?', options: ['Care and breeding of animals', 'Animal hunting', 'Animal study', 'Animal training'], correctAnswer: 0 },
                { question: 'What is spaying?', options: ['Sterilizing female animals', 'Vaccinating', 'Feeding', 'Grooming'], correctAnswer: 0 },
                { question: 'What is neutering?', options: ['Sterilizing male animals', 'Vaccinating', 'Feeding', 'Training'], correctAnswer: 0 },
                { question: 'What is rabies?', options: ['Viral disease in animals', 'Bacterial infection', 'Fungal disease', 'Parasite'], correctAnswer: 0 }
            ],
            
            // Test 132: Dentistry
            132: [
                { question: 'What is dentistry?', options: ['Medical care of teeth', 'Eye care', 'Ear care', 'Skin care'], correctAnswer: 0 },
                { question: 'What is a dentist?', options: ['Teeth doctor', 'Eye doctor', 'Foot doctor', 'Skin doctor'], correctAnswer: 0 },
                { question: 'What is a cavity?', options: ['Hole in tooth from decay', 'Tooth discoloration', 'Gum disease', 'Tooth gap'], correctAnswer: 0 },
                { question: 'What is plaque?', options: ['Bacterial film on teeth', 'Tooth enamel', 'Gum tissue', 'Saliva'], correctAnswer: 0 },
                { question: 'What is a filling?', options: ['Material to repair tooth cavity', 'Tooth crown', 'Tooth bridge', 'Denture'], correctAnswer: 0 },
                { question: 'What is a root canal?', options: ['Treatment of tooth pulp', 'Tooth cleaning', 'Tooth extraction', 'Tooth whitening'], correctAnswer: 0 },
                { question: 'What is an extraction?', options: ['Removing a tooth', 'Filling a tooth', 'Cleaning teeth', 'Whitening teeth'], correctAnswer: 0 },
                { question: 'What is a crown?', options: ['Tooth-shaped cap', 'False tooth', 'Tooth filling', 'Tooth implant'], correctAnswer: 0 },
                { question: 'What is braces?', options: ['Device to straighten teeth', 'Tooth cleaner', 'Tooth whitener', 'Tooth protector'], correctAnswer: 0 },
                { question: 'What is gum disease?', options: ['Infection of gums', 'Tooth decay', 'Enamel erosion', 'Root infection'], correctAnswer: 0 }
            ],
            
            // Test 133: Optometry
            133: [
                { question: 'What is optometry?', options: ['Eye care and vision testing', 'Ear care', 'Teeth care', 'Skin care'], correctAnswer: 0 },
                { question: 'What is an optometrist?', options: ['Eye doctor', 'Ear doctor', 'Teeth doctor', 'Foot doctor'], correctAnswer: 0 },
                { question: 'What is an ophthalmologist?', options: ['Medical eye specialist', 'Glass fitter', 'Vision tester', 'Lens maker'], correctAnswer: 0 },
                { question: 'What is visual acuity?', options: ['Sharpness of vision', 'Eye color', 'Eye pressure', 'Eye movement'], correctAnswer: 0 },
                { question: 'What is nearsightedness?', options: ['Difficulty seeing far away', 'Difficulty seeing close', 'Blurred vision', 'Double vision'], correctAnswer: 0 },
                { question: 'What is farsightedness?', options: ['Difficulty seeing close', 'Difficulty seeing far', 'Blurred vision', 'Double vision'], correctAnswer: 0 },
                { question: 'What is astigmatism?', options: ['Irregular eye curvature', 'Eye infection', 'Cataract', 'Glaucoma'], correctAnswer: 0 },
                { question: 'What are cataracts?', options: ['Clouding of eye lens', 'Eye pressure increase', 'Retina damage', 'Cornea scratch'], correctAnswer: 0 },
                { question: 'What is glaucoma?', options: ['Increased eye pressure damaging nerve', 'Lens clouding', 'Retina detachment', 'Cornea infection'], correctAnswer: 0 },
                { question: 'What are glasses?', options: ['Lenses to correct vision', 'Eye medicine', 'Eye drops', 'Eye patch'], correctAnswer: 0 }
            ],
            
            // Test 134: Dermatology
            134: [
                { question: 'What is dermatology?', options: ['Study and treatment of skin', 'Study of heart', 'Study of lungs', 'Study of brain'], correctAnswer: 0 },
                { question: 'What is a dermatologist?', options: ['Skin doctor', 'Heart doctor', 'Lung doctor', 'Brain doctor'], correctAnswer: 0 },
                { question: 'What is the skin?', options: ['Body largest organ', 'Smallest organ', 'Internal organ', 'Gland'], correctAnswer: 0 },
                { question: 'What is acne?', options: ['Skin condition with pimples', 'Skin cancer', 'Rash', 'Wrinkle'], correctAnswer: 0 },
                { question: 'What is eczema?', options: ['Inflammatory skin condition', 'Skin infection', 'Skin cancer', 'Burn'], correctAnswer: 0 },
                { question: 'What is psoriasis?', options: ['Autoimmune skin condition', 'Bacterial infection', 'Viral rash', 'Fungal infection'], correctAnswer: 0 },
                { question: 'What is melanoma?', options: ['Serious skin cancer', 'Benign mole', 'Skin rash', 'Burn'], correctAnswer: 0 },
                { question: 'What is a mole?', options: ['Pigmented skin spot', 'Skin cancer', 'Skin rash', 'Wrinkle'], correctAnswer: 0 },
                { question: 'What is sunscreen?', options: ['Lotion protecting from UV rays', 'Moisturizer', 'Anti-aging cream', 'Makeup'], correctAnswer: 0 },
                { question: 'What is a wrinkle?', options: ['Skin fold from aging', 'Skin infection', 'Skin rash', 'Burn'], correctAnswer: 0 }
            ],
            
            // Test 135: Cardiology
            135: [
                { question: 'What is cardiology?', options: ['Study of the heart', 'Study of lungs', 'Study of brain', 'Study of kidneys'], correctAnswer: 0 },
                { question: 'What is a cardiologist?', options: ['Heart doctor', 'Lung doctor', 'Brain doctor', 'Kidney doctor'], correctAnswer: 0 },
                { question: 'What is the heart?', options: ['Organ that pumps blood', 'Filters blood', 'Produces blood', 'Stores blood'], correctAnswer: 0 },
                { question: 'What is blood pressure?', options: ['Force of blood against artery walls', 'Heart rate', 'Blood volume', 'Oxygen level'], correctAnswer: 0 },
                { question: 'What is a heartbeat?', options: ['Pumping action of heart', 'Breathing rate', 'Blood flow', 'Pulse point'], correctAnswer: 0 },
                { question: 'What is an artery?', options: ['Blood vessel from heart', 'Blood vessel to heart', 'Tiny blood vessel', 'Vein'], correctAnswer: 0 },
                { question: 'What is a vein?', options: ['Blood vessel to heart', 'Blood vessel from heart', 'Tiny vessel', 'Artery'], correctAnswer: 0 },
                { question: 'What is a heart attack?', options: ['Blocked blood flow to heart', 'Irregular heartbeat', 'Heart failure', 'Cardiac arrest'], correctAnswer: 0 },
                { question: 'What is arrhythmia?', options: ['Irregular heartbeat', 'Heart attack', 'Heart failure', 'High blood pressure'], correctAnswer: 0 },
                { question: 'What is cholesterol?', options: ['Fatty substance in blood', 'Blood cell', 'Blood protein', 'Blood mineral'], correctAnswer: 0 }
            ],
            
            // Test 136: Pulmonology
            136: [
                { question: 'What is pulmonology?', options: ['Study of lungs and respiratory system', 'Study of heart', 'Study of kidneys', 'Study of liver'], correctAnswer: 0 },
                { question: 'What is a pulmonologist?', options: ['Lung doctor', 'Heart doctor', 'Kidney doctor', 'Liver doctor'], correctAnswer: 0 },
                { question: 'What are lungs?', options: ['Respiratory organs for breathing', 'Blood filters', 'Digestive organs', 'Nerve centers'], correctAnswer: 0 },
                { question: 'What is respiration?', options: ['Process of breathing', 'Heart beating', 'Blood flowing', 'Digesting food'], correctAnswer: 0 },
                { question: 'What is asthma?', options: ['Chronic lung condition with breathing difficulty', 'Lung infection', 'Lung cancer', 'Pneumonia'], correctAnswer: 0 },
                { question: 'What is pneumonia?', options: ['Lung infection with inflammation', 'Asthma attack', 'Bronchitis', 'COPD'], correctAnswer: 0 },
                { question: 'What is bronchitis?', options: ['Inflammation of bronchial tubes', 'Lung infection', 'Asthma', 'Emphysema'], correctAnswer: 0 },
                { question: 'What is COPD?', options: ['Chronic obstructive pulmonary disease', 'Acute infection', 'Asthma', 'Pneumonia'], correctAnswer: 0 },
                { question: 'What is oxygen?', options: ['Gas essential for breathing', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], correctAnswer: 0 },
                { question: 'What is a ventilator?', options: ['Machine that helps breathing', 'Heart monitor', 'Blood pressure cuff', 'Oxygen tank'], correctAnswer: 0 }
            ],
            
            // Test 137: Nephrology
            137: [
                { question: 'What is nephrology?', options: ['Study of kidneys', 'Study of heart', 'Study of lungs', 'Study of liver'], correctAnswer: 0 },
                { question: 'What is a nephrologist?', options: ['Kidney doctor', 'Heart doctor', 'Lung doctor', 'Liver doctor'], correctAnswer: 0 },
                { question: 'What are kidneys?', options: ['Organs that filter blood', 'Pump blood', 'Breathe air', 'Digest food'], correctAnswer: 0 },
                { question: 'What is urine?', options: ['Liquid waste from kidneys', 'Blood waste', 'Digestive waste', 'Sweat'], correctAnswer: 0 },
                { question: 'What is dialysis?', options: ['Artificial blood filtering', 'Kidney surgery', 'Urine test', 'Blood test'], correctAnswer: 0 },
                { question: 'What is a kidney stone?', options: ['Hard deposit in kidneys', 'Kidney infection', 'Kidney cancer', 'Kidney cyst'], correctAnswer: 0 },
                { question: 'What is a UTI?', options: ['Urinary tract infection', 'Kidney disease', 'Bladder cancer', 'Prostate issue'], correctAnswer: 0 },
                { question: 'What is renal failure?', options: ['Kidneys stop working properly', 'Heart failure', 'Lung failure', 'Liver failure'], correctAnswer: 0 },
                { question: 'What is a nephron?', options: ['Functional unit of kidney', 'Kidney stone', 'Kidney cell', 'Kidney tube'], correctAnswer: 0 },
                { question: 'What is a diuretic?', options: ['Substance increasing urine production', 'Pain reliever', 'Antibiotic', 'Vitamin'], correctAnswer: 0 }
            ],
            
            // Test 138: Gastroenterology
            138: [
                { question: 'What is gastroenterology?', options: ['Study of digestive system', 'Study of heart', 'Study of lungs', 'Study of brain'], correctAnswer: 0 },
                { question: 'What is a gastroenterologist?', options: ['Digestive system doctor', 'Heart doctor', 'Lung doctor', 'Brain doctor'], correctAnswer: 0 },
                { question: 'What is the stomach?', options: ['Digestive organ', 'Blood pump', 'Air filter', 'Thinking organ'], correctAnswer: 0 },
                { question: 'What is the liver?', options: ['Organ that filters blood and produces bile', 'Digests food', 'Pumps blood', 'Stores urine'], correctAnswer: 0 },
                { question: 'What is the pancreas?', options: ['Organ producing digestive enzymes and insulin', 'Blood filter', 'Bile producer', 'Waste eliminator'], correctAnswer: 0 },
                { question: 'What is the small intestine?', options: ['Nutrient absorption organ', 'Water absorption organ', 'Waste storage', 'Food grinding'], correctAnswer: 0 },
                { question: 'What is the large intestine?', options: ['Water absorption and waste formation', 'Nutrient absorption', 'Food breakdown', 'Enzyme production'], correctAnswer: 0 },
                { question: 'What is digestion?', options: ['Process of breaking down food', 'Blood circulation', 'Breathing', 'Muscle movement'], correctAnswer: 0 },
                { question: 'What is a enzyme?', options: ['Protein that speeds up chemical reactions', 'Vitamin', 'Mineral', 'Carbohydrate'], correctAnswer: 0 },
                { question: 'What is acid reflux?', options: ['Stomach acid flowing back into esophagus', 'Heart attack', 'Lung infection', 'Kidney stone'], correctAnswer: 0 }
            ],
            
            // Test 139: Endocrinology
            139: [
                { question: 'What is endocrinology?', options: ['Study of hormones and glands', 'Study of heart', 'Study of lungs', 'Study of kidneys'], correctAnswer: 0 },
                { question: 'What is a hormone?', options: ['Chemical messenger in body', 'Digestive enzyme', 'Blood cell', 'Vitamin'], correctAnswer: 0 },
                { question: 'What is the pituitary gland?', options: ['Master gland controlling other glands', 'Thyroid gland', 'Adrenal gland', 'Pancreas'], correctAnswer: 0 },
                { question: 'What is the thyroid gland?', options: ['Gland regulating metabolism', 'Controls blood sugar', 'Produces adrenaline', 'Regulates calcium'], correctAnswer: 0 },
                { question: 'What is the pancreas?', options: ['Produces insulin and glucagon', 'Produces thyroid hormone', 'Produces adrenaline', 'Produces estrogen'], correctAnswer: 0 },
                { question: 'What is insulin?', options: ['Hormone that regulates blood sugar', 'Digestive enzyme', 'Stress hormone', 'Growth hormone'], correctAnswer: 0 },
                { question: 'What is diabetes?', options: ['Condition with high blood sugar', 'Heart disease', 'Lung disease', 'Kidney disease'], correctAnswer: 0 },
                { question: 'What are adrenal glands?', options: ['Glands producing stress hormones', 'Thyroid glands', 'Parathyroid glands', 'Pineal glands'], correctAnswer: 0 },
                { question: 'What is cortisol?', options: ['Stress hormone', 'Blood sugar hormone', 'Growth hormone', 'Sex hormone'], correctAnswer: 0 },
                { question: 'What is metabolism?', options: ['Chemical processes in body', 'Digestion only', 'Breathing only', 'Circulation only'], correctAnswer: 0 }
            ],
            
            // Test 140: Hematology
            140: [
                { question: 'What is hematology?', options: ['Study of blood', 'Study of heart', 'Study of lungs', 'Study of kidneys'], correctAnswer: 0 },
                { question: 'What is blood?', options: ['Body fluid transporting substances', 'Solid tissue', 'Lymph fluid', 'Cerebrospinal fluid'], correctAnswer: 0 },
                { question: 'What are red blood cells?', options: ['Cells that carry oxygen', 'Cells that fight infection', 'Cells that clot blood', 'Cells that carry nutrients'], correctAnswer: 0 },
                { question: 'What are white blood cells?', options: ['Cells that fight infection', 'Cells that carry oxygen', 'Cells that clot blood', 'Cells that transport nutrients'], correctAnswer: 0 },
                { question: 'What are platelets?', options: ['Cell fragments that clot blood', 'Oxygen-carrying cells', 'Infection-fighting cells', 'Nutrient-carrying cells'], correctAnswer: 0 },
                { question: 'What is plasma?', options: ['Liquid part of blood', 'Red blood cells', 'White blood cells', 'Platelets'], correctAnswer: 0 },
                { question: 'What is hemoglobin?', options: ['Protein in red blood cells carrying oxygen', 'Clotting factor', 'Antibody', 'Enzyme'], correctAnswer: 0 },
                { question: 'What is anemia?', options: ['Condition with low red blood cells', 'High white blood cells', 'Low platelets', 'High iron'], correctAnswer: 0 },
                { question: 'What is leukemia?', options: ['Cancer of blood-forming tissues', 'Heart disease', 'Lung disease', 'Kidney disease'], correctAnswer: 0 },
                { question: 'What is blood type?', options: ['Classification of blood based on antigens', 'Blood color', 'Blood thickness', 'Blood pressure'], correctAnswer: 0 }
            ],
            
            // Test 141: Orthopedics
            141: [
                { question: 'What is orthopedics?', options: ['Study of musculoskeletal system', 'Study of heart', 'Study of brain', 'Study of skin'], correctAnswer: 0 },
                { question: 'What are bones?', options: ['Hard tissue forming skeleton', 'Soft tissue', 'Connective tissue', 'Muscle tissue'], correctAnswer: 0 },
                { question: 'What is a joint?', options: ['Where two bones meet', 'Bone end', 'Muscle attachment', 'Ligament connection'], correctAnswer: 0 },
                { question: 'What is a ligament?', options: ['Connects bone to bone', 'Connects muscle to bone', 'Connects muscle to muscle', 'Covers bone end'], correctAnswer: 0 },
                { question: 'What is a tendon?', options: ['Connects muscle to bone', 'Connects bone to bone', 'Covers joint', 'Cushions bone'], correctAnswer: 0 },
                { question: 'What is cartilage?', options: ['Flexible connective tissue at joints', 'Hard bone tissue', 'Muscle tissue', 'Ligament tissue'], correctAnswer: 0 },
                { question: 'What is a fracture?', options: ['Broken bone', 'Dislocated joint', 'Torn ligament', 'Strained muscle'], correctAnswer: 0 },
                { question: 'What is arthritis?', options: ['Inflammation of joints', 'Bone infection', 'Muscle strain', 'Ligament tear'], correctAnswer: 0 },
                { question: 'What is osteoporosis?', options: ['Condition with weak brittle bones', 'Joint inflammation', 'Muscle wasting', 'Cartilage damage'], correctAnswer: 0 },
                { question: 'What is a dislocation?', options: ['Bone displaced from joint', 'Broken bone', 'Torn ligament', 'Strained muscle'], correctAnswer: 0 }
            ],
            
            // Test 142: Rheumatology
            142: [
                { question: 'What is rheumatology?', options: ['Study of rheumatic diseases', 'Study of joints only', 'Study of muscles only', 'Study of bones only'], correctAnswer: 0 },
                { question: 'What is rheumatoid arthritis?', options: ['Autoimmune joint disease', 'Osteoarthritis', 'Gout', 'Lupus'], correctAnswer: 0 },
                { question: 'What is osteoarthritis?', options: ['Wear-and-tear joint disease', 'Autoimmune arthritis', 'Infectious arthritis', 'Gout'], correctAnswer: 0 },
                { question: 'What is gout?', options: ['Arthritis from uric acid crystals', 'Rheumatoid arthritis', 'Osteoarthritis', 'Lupus'], correctAnswer: 0 },
                { question: 'What is lupus?', options: ['Autoimmune disease affecting multiple organs', 'Joint infection', 'Muscle disease', 'Bone disease'], correctAnswer: 0 },
                { question: 'What is fibromyalgia?', options: ['Condition with widespread pain', 'Joint inflammation', 'Muscle wasting', 'Bone disease'], correctAnswer: 0 },
                { question: 'What is an autoimmune disease?', options: ['Body attacks its own tissues', 'External infection', 'Injury', 'Genetic disorder'], correctAnswer: 0 },
                { question: 'What is inflammation?', options: ['Body response to injury or irritation', 'Infection', 'Allergic reaction', 'Autoimmune response'], correctAnswer: 0 },
                { question: 'What is a rheumatologist?', options: ['Doctor treating rheumatic diseases', 'Bone surgeon', 'Joint specialist', 'Muscle doctor'], correctAnswer: 0 },
                { question: 'What is an immunosuppressant?', options: ['Medication that reduces immune response', 'Pain reliever', 'Anti-inflammatory', 'Antibiotic'], correctAnswer: 0 }
            ],
            
            // Test 143: Urology
            143: [
                { question: 'What is urology?', options: ['Study of urinary system', 'Study of kidneys only', 'Study of bladder only', 'Study of reproductive system'], correctAnswer: 0 },
                { question: 'What are the kidneys?', options: ['Organs that filter blood and produce urine', 'Store urine', 'Transport urine', 'Release urine'], correctAnswer: 0 },
                { question: 'What is the bladder?', options: ['Organ that stores urine', 'Filters blood', 'Produces urine', 'Transports urine'], correctAnswer: 0 },
                { question: 'What are ureters?', options: ['Tubes carrying urine from kidneys to bladder', 'Carry urine from bladder out', 'Filter blood', 'Store urine'], correctAnswer: 0 },
                { question: 'What is the urethra?', options: ['Tube carrying urine out of body', 'Carries urine to bladder', 'Filters blood', 'Stores urine'], correctAnswer: 0 },
                { question: 'What is a UTI?', options: ['Urinary tract infection', 'Kidney stone', 'Bladder cancer', 'Prostate problem'], correctAnswer: 0 },
                { question: 'What is a kidney stone?', options: ['Hard deposit in kidneys', 'Kidney infection', 'Kidney cancer', 'Kidney cyst'], correctAnswer: 0 },
                { question: 'What is incontinence?', options: ['Loss of bladder control', 'Painful urination', 'Blood in urine', 'Frequent urination'], correctAnswer: 0 },
                { question: 'What is dialysis?', options: ['Artificial blood filtering for kidney failure', 'Kidney surgery', 'Bladder treatment', 'Urine test'], correctAnswer: 0 },
                { question: 'What is a urologist?', options: ['Doctor treating urinary system', 'Kidney surgeon', 'Bladder specialist', 'Prostate doctor'], correctAnswer: 0 }
            ],
            
            // Test 144: Gynecology
            144: [
                { question: 'What is gynecology?', options: ['Study of female reproductive system', 'Study of pregnancy', 'Study of childbirth', 'Study of female hormones'], correctAnswer: 0 },
                { question: 'What is obstetrics?', options: ['Study of pregnancy and childbirth', 'Female reproductive system', 'Newborn care', 'Female hormones'], correctAnswer: 0 },
                { question: 'What is the uterus?', options: ['Organ where baby develops', 'Produces eggs', 'Female hormone gland', 'Birth canal'], correctAnswer: 0 },
                { question: 'What are ovaries?', options: ['Organs producing eggs and hormones', 'Where baby develops', 'Birth canal', 'External genitals'], correctAnswer: 0 },
                { question: 'What is the cervix?', options: ['Lower part of uterus', 'Birth canal', 'Egg tube', 'Hormone gland'], correctAnswer: 0 },
                { question: 'What is the vagina?', options: ['Birth canal', 'Egg producer', 'Baby develops here', 'Hormone producer'], correctAnswer: 0 },
                { question: 'What is menstruation?', options: ['Monthly shedding of uterine lining', 'Egg release', 'Pregnancy', 'Menopause'], correctAnswer: 0 },
                { question: 'What is menopause?', options: ['End of menstrual cycles', 'Start of menstruation', 'Pregnancy', 'Fertility treatment'], correctAnswer: 0 },
                { question: 'What is a pap smear?', options: ['Test for cervical cancer', 'Pregnancy test', 'STD test', 'Fertility test'], correctAnswer: 0 },
                { question: 'What is a gynecologist?', options: ['Doctor treating female reproductive system', 'Pregnancy doctor', 'Baby doctor', 'Female hormone specialist'], correctAnswer: 0 }
            ],
            
            // Test 145: Pediatrics
            145: [
                { question: 'What is pediatrics?', options: ['Medical care of children', 'Care of elderly', 'Care of adults', 'Care of pregnant women'], correctAnswer: 0 },
                { question: 'What is a pediatrician?', options: ['Children doctor', 'Elderly doctor', 'Adult doctor', 'Newborn specialist'], correctAnswer: 0 },
                { question: 'What is a neonate?', options: ['Newborn baby', 'Toddler', 'Infant', 'Child'], correctAnswer: 0 },
                { question: 'What is an infant?', options: ['Very young child', 'Newborn', 'Toddler', 'School-age child'], correctAnswer: 0 },
                { question: 'What is a toddler?', options: ['Child learning to walk', 'Newborn', 'Infant', 'School-age child'], correctAnswer: 0 },
                { question: 'What is an adolescent?', options: ['Teenager', 'Young child', 'Infant', 'Toddler'], correctAnswer: 0 },
                { question: 'What is growth?', options: ['Increase in size', 'Development of skills', 'Learning', 'Maturation'], correctAnswer: 0 },
                { question: 'What is development?', options: ['Acquisition of skills and abilities', 'Physical growth', 'Increase in size', 'Weight gain'], correctAnswer: 0 },
                { question: 'What is a vaccine?', options: ['Prevents childhood diseases', 'Treats illness', 'Cures infection', 'Pain relief'], correctAnswer: 0 },
                { question: 'What is well-child visit?', options: ['Regular checkup for healthy child', 'Sick visit', 'Emergency care', 'Vaccination only'], correctAnswer: 0 }
            ],
            
            // Test 146: Geriatrics
            146: [
                { question: 'What is geriatrics?', options: ['Medical care of elderly', 'Care of children', 'Care of adults', 'Care of pregnant women'], correctAnswer: 0 },
                { question: 'What is a geriatrician?', options: ['Elderly care doctor', 'Children doctor', 'Adult doctor', 'Specialist doctor'], correctAnswer: 0 },
                { question: 'What is aging?', options: ['Process of growing old', 'Childhood', 'Adolescence', 'Adulthood'], correctAnswer: 0 },
                { question: 'What is dementia?', options: ['Decline in cognitive function', 'Memory loss only', 'Normal aging', 'Depression'], correctAnswer: 0 },
                { question: 'What is Alzheimer disease?', options: ['Common form of dementia', 'Heart disease', 'Arthritis', 'Diabetes'], correctAnswer: 0 },
                { question: 'What is osteoporosis?', options: ['Bone thinning in elderly', 'Joint inflammation', 'Muscle wasting', 'Memory loss'], correctAnswer: 0 },
                { question: 'What is arthritis?', options: ['Joint inflammation common in elderly', 'Bone disease', 'Muscle disease', 'Nerve disease'], correctAnswer: 0 },
                { question: 'What is polypharmacy?', options: ['Taking multiple medications', 'One medication', 'No medication', 'Herbal treatment'], correctAnswer: 0 },
                { question: 'What is fall prevention?', options: ['Measures to prevent elderly falls', 'Exercise program', 'Medication', 'Surgery'], correctAnswer: 0 },
                { question: 'What is palliative care?', options: ['Care focusing on quality of life', 'Curative treatment', 'Emergency care', 'Preventive care'], correctAnswer: 0 }
            ],
            
            // Test 147: Emergency Medicine
            147: [
                { question: 'What is emergency medicine?', options: ['Care for acute illnesses and injuries', 'Routine checkups', 'Chronic disease management', 'Preventive care'], correctAnswer: 0 },
                { question: 'What is an emergency room?', options: ['Facility for emergency care', 'Doctor office', 'Clinic', 'Urgent care'], correctAnswer: 0 },
                { question: 'What is triage?', options: ['Sorting patients by urgency', 'Treatment', 'Diagnosis', 'Discharge'], correctAnswer: 0 },
                { question: 'What is CPR?', options: ['Cardiopulmonary resuscitation', 'Emergency surgery', 'Medication', 'Diagnostic test'], correctAnswer: 0 },
                { question: 'What is a heart attack?', options: ['Blocked blood flow to heart', 'Stroke', 'Cardiac arrest', 'Chest pain'], correctAnswer: 0 },
                { question: 'What is a stroke?', options: ['Blocked or ruptured blood vessel in brain', 'Heart attack', 'Seizure', 'Head injury'], correctAnswer: 0 },
                { question: 'What is trauma?', options: ['Physical injury from external force', 'Medical illness', 'Infection', 'Mental condition'], correctAnswer: 0 },
                { question: 'What is anaphylaxis?', options: ['Severe allergic reaction', 'Asthma attack', 'Heart attack', 'Seizure'], correctAnswer: 0 },
                { question: 'What is a fracture?', options: ['Broken bone', 'Sprain', 'Strain', 'Dislocation'], correctAnswer: 0 },
                { question: 'What is an emergency physician?', options: ['Doctor specializing in emergency care', 'Surgeon', 'Internist', 'Family doctor'], correctAnswer: 0 }
            ],
            
            // Test 148: Anesthesiology
            148: [
                { question: 'What is anesthesiology?', options: ['Medical specialty for pain relief and sedation', 'Surgery', 'Emergency care', 'Internal medicine'], correctAnswer: 0 },
                { question: 'What is an anesthesiologist?', options: ['Doctor administering anesthesia', 'Surgeon', 'Nurse', 'Technician'], correctAnswer: 0 },
                { question: 'What is anesthesia?', options: ['Loss of sensation for medical procedures', 'Pain', 'Sedation', 'Sleep'], correctAnswer: 0 },
                { question: 'What is general anesthesia?', options: ['Complete unconsciousness for surgery', 'Local numbness', 'Regional block', 'Sedation'], correctAnswer: 0 },
                { question: 'What is local anesthesia?', options: ['Numbs small area', 'Unconsciousness', 'Spinal block', 'Epidural'], correctAnswer: 0 },
                { question: 'What is regional anesthesia?', options: ['Numbs larger body region', 'General anesthesia', 'Local anesthesia', 'Topical'], correctAnswer: 0 },
                { question: 'What is an epidural?', options: ['Regional anesthesia for childbirth', 'General anesthesia', 'Local anesthesia', 'Spinal block'], correctAnswer: 0 },
                { question: 'What is sedation?', options: ['Relaxed state during procedure', 'Unconsciousness', 'Pain relief', 'Numbness'], correctAnswer: 0 },
                { question: 'What is intubation?', options: ['Placing breathing tube', 'Giving anesthesia', 'Monitoring vitals', 'Starting IV'], correctAnswer: 0 },
                { question: 'What is pain management?', options: ['Treating pain conditions', 'Surgery', 'Anesthesia only', 'Emergency care'], correctAnswer: 0 }
            ],
            
            // Test 149: Radiology
            149: [
                { question: 'What is radiology?', options: ['Medical imaging to diagnose and treat disease', 'X-rays only', 'Surgery', 'Laboratory tests'], correctAnswer: 0 },
                { question: 'What is a radiologist?', options: ['Doctor interpreting medical images', 'X-ray technician', 'Surgeon', 'Technologist'], correctAnswer: 0 },
                { question: 'What is an X-ray?', options: ['Radiation image of body structures', 'MRI scan', 'CT scan', 'Ultrasound'], correctAnswer: 0 },
                { question: 'What is a CT scan?', options: ['Computed tomography - 3D X-ray images', 'Magnetic resonance imaging', 'Ultrasound', 'Nuclear medicine'], correctAnswer: 0 },
                { question: 'What is an MRI?', options: ['Magnetic resonance imaging', 'X-ray', 'CT scan', 'Ultrasound'], correctAnswer: 0 },
                { question: 'What is an ultrasound?', options: ['Imaging using sound waves', 'X-ray', 'MRI', 'CT scan'], correctAnswer: 0 },
                { question: 'What is a mammogram?', options: ['X-ray of breast for cancer screening', 'Chest X-ray', 'Bone scan', 'CT scan'], correctAnswer: 0 },
                { question: 'What is a PET scan?', options: ['Positron emission tomography', 'CT scan', 'MRI', 'Ultrasound'], correctAnswer: 0 },
                { question: 'What is contrast dye?', options: ['Substance enhancing image visibility', 'Anesthesia', 'Pain reliever', 'Antibiotic'], correctAnswer: 0 },
                { question: 'What is interventional radiology?', options: ['Minimally invasive procedures using imaging', 'Diagnostic imaging only', 'Surgery', 'Medication'], correctAnswer: 0 }
            ],
            
            // Test 150: Pathology
            150: [
                { question: 'What is pathology?', options: ['Study of disease causes and effects', 'Treatment of disease', 'Prevention of disease', 'Diagnosis of disease'], correctAnswer: 0 },
                { question: 'What is a pathologist?', options: ['Doctor studying disease through specimens', 'Surgeon', 'Family doctor', 'Radiologist'], correctAnswer: 0 },
                { question: 'What is a biopsy?', options: ['Removal of tissue for examination', 'Blood test', 'X-ray', 'Physical exam'], correctAnswer: 0 },
                { question: 'What is a diagnosis?', options: ['Identification of disease', 'Treatment plan', 'Prevention method', 'Screening test'], correctAnswer: 0 },
                { question: 'What is etiology?', options: ['Cause of disease', 'Disease progression', 'Disease outcome', 'Disease treatment'], correctAnswer: 0 },
                { question: 'What is pathogenesis?', options: ['Development of disease', 'Cause of disease', 'Study of disease', 'Treatment of disease'], correctAnswer: 0 },
                { question: 'What is a lesion?', options: ['Abnormal tissue change', 'Normal tissue', 'Healthy organ', 'Blood vessel'], correctAnswer: 0 },
                { question: 'What is inflammation?', options: ['Body response to injury', 'Infection', 'Cancer', 'Bleeding'], correctAnswer: 0 },
                { question: 'What is a malignancy?', options: ['Cancerous tumor', 'Benign tumor', 'Infection', 'Inflammation'], correctAnswer: 0 },
                { question: 'What is a benign tumor?', options: ['Non-cancerous growth', 'Cancerous growth', 'Infection', 'Inflammation'], correctAnswer: 0 }
            ]
        };
        
        // For tests 96-150, generate dynamic questions if not in bank
        if (testId >= 96 && testId <= 150) {
            // Return from bank if available, otherwise generate dynamic
            if (questionBank[testId]) {
                return questionBank[testId];
            } else {
                return this.generateDefaultQuestions(testId);
            }
        }
        
        // Return questions for the specific test ID, or generate default questions
        return questionBank[testId] || this.generateDefaultQuestions(testId);
    }
    
    generateDefaultQuestions(testId) {
        const defaultQuestions = [];
        for (let i = 1; i <= 10; i++) {
            defaultQuestions.push({
                id: i,
                question: `Sample Question ${i} for Test ID ${testId}`,
                options: [
                    `Option A for Question ${i}`,
                    `Option B for Question ${i}`,
                    `Option C for Question ${i}`,
                    `Option D for Question ${i}`
                ],
                correctAnswer: 0
            });
        }
        return defaultQuestions;
    }
    
    renderTest() {
        const container = document.getElementById('testContainer');
        if (!container) {
            console.error('Test container not found');
            return;
        }
        
        console.log('Rendering test...');
        
        const testHTML = `
            <div class="test-header">
                <div class="test-info">
                    <div class="test-title-section">
                        <h1>${this.currentTest.name}</h1>
                        <div class="test-meta">
                            <span><i class="fas fa-question-circle"></i> ${this.questions.length} Questions</span>
                            <span><i class="fas fa-clock"></i> ${this.currentTest.duration} Minutes</span>
                            <span><i class="fas fa-signal"></i> ${this.currentTest.difficulty.charAt(0).toUpperCase() + this.currentTest.difficulty.slice(1)}</span>
                        </div>
                    </div>
                    <div class="timer-section">
                        <div class="timer" id="timer">${this.formatTime(this.timeRemaining)}</div>
                        <div class="timer-label">Time Remaining</div>
                    </div>
                </div>
            </div>
            
            <div class="test-content">
                <div class="main-content">
                    <div class="question-section" id="questionSection">
                        <!-- Question will be loaded here -->
                    </div>
                    <div class="navigation-buttons" id="navigationButtons">
                        <!-- Navigation buttons will be loaded here -->
                    </div>
                </div>
                
                <div class="sidebar">
                    <h3>Question Navigation</h3>
                    <div class="questions-grid" id="questionsGrid">
                        <!-- Question indicators will be loaded here -->
                    </div>
                    <div class="legend">
                        <div class="legend-item">
                            <div class="legend-color current"></div>
                            <span>Current Question</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color answered"></div>
                            <span>Answered</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color unanswered"></div>
                            <span>Unanswered</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = testHTML;
        
        // Render the first question
        this.renderCurrentQuestion();
        this.renderQuestionIndicators();
        this.renderNavigationButtons();
    }
    
    renderCurrentQuestion() {
        const questionSection = document.getElementById('questionSection');
        if (!questionSection || !this.questions.length) return;
        
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        const questionHTML = `
            <div class="question-number">Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</div>
            <div class="question-text">${currentQuestion.question}</div>
            <div class="options-container">
                ${currentQuestion.options.map((option, index) => `
                    <div class="option ${this.userAnswers[this.currentQuestionIndex] === index ? 'selected' : ''}" 
                         onclick="testManager.selectAnswer(${index})">
                        <div class="option-radio"></div>
                        <div class="option-text">${option}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        questionSection.innerHTML = questionHTML;
    }
    
    renderQuestionIndicators() {
        const questionsGrid = document.getElementById('questionsGrid');
        if (!questionsGrid) return;
        
        const indicatorsHTML = this.questions.map((_, index) => {
            let className = 'question-indicator';
            if (index === this.currentQuestionIndex) className += ' current';
            if (this.userAnswers[index] !== undefined) className += ' answered';
            
            return `<div class="${className}" onclick="testManager.goToQuestion(${index})">${index + 1}</div>`;
        }).join('');
        
        questionsGrid.innerHTML = indicatorsHTML;
    }
    
    renderNavigationButtons() {
        const navigationButtons = document.getElementById('navigationButtons');
        if (!navigationButtons) return;
        
        const buttonsHTML = `
            <button class="nav-btn" onclick="testManager.prevQuestion()" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                <i class="fas fa-arrow-left"></i> Previous
            </button>
            <button class="nav-btn" onclick="testManager.nextQuestion()" ${this.currentQuestionIndex === this.questions.length - 1 ? 'disabled' : ''}>
                Next <i class="fas fa-arrow-right"></i>
            </button>
            <button class="nav-btn submit-btn" onclick="testManager.submitTest()">
                <i class="fas fa-paper-plane"></i> Submit Test
            </button>
        `;
        
        navigationButtons.innerHTML = buttonsHTML;
    }
    
    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        this.renderCurrentQuestion();
        this.renderQuestionIndicators();
    }
    
    goToQuestion(questionIndex) {
        if (questionIndex >= 0 && questionIndex < this.questions.length) {
            this.currentQuestionIndex = questionIndex;
            this.renderCurrentQuestion();
            this.renderQuestionIndicators();
            this.renderNavigationButtons();
        }
    }
    
    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderCurrentQuestion();
            this.renderQuestionIndicators();
            this.renderNavigationButtons();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderCurrentQuestion();
            this.renderQuestionIndicators();
            this.renderNavigationButtons();
        }
    }
    
    startTimer() {
        this.startTime = Date.now();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            
            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                this.timeRemaining = 0;
                alert('Time is up! Submitting your test...');
                this.submitTest();
            }
            
            this.updateTimerDisplay();
        }, 1000);
    }
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.formatTime(this.timeRemaining);
            
            if (this.timeRemaining < 300) {
                timerElement.style.color = 'var(--accent)';
            }
        }
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    calculateScore() {
        let correctAnswers = 0;
        
        this.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        
        return {
            score: correctAnswers,
            total: this.questions.length,
            percentage: (correctAnswers / this.questions.length) * 100
        };
    }
    
    submitTest() {
        clearInterval(this.timer);
        
        const answeredCount = Object.keys(this.userAnswers).length;
        if (answeredCount < this.questions.length) {
            const confirmSubmit = window.confirm(`You have answered ${answeredCount} out of ${this.questions.length} questions. Are you sure you want to submit?`);
            if (!confirmSubmit) {
                this.startTimer();
                return;
            }
        } else {
            const confirmSubmit = window.confirm('Are you sure you want to submit the test?');
            if (!confirmSubmit) {
                this.startTimer();
                return;
            }
        }
        
        const score = this.calculateScore();
        this.showResults(score);
        
        // Save result to localStorage
        this.saveTestResult(score);
    }
    
    saveTestResult(score) {
        try {
            const user = JSON.parse(localStorage.getItem('kh_user'));
            if (user) {
                const history = JSON.parse(localStorage.getItem('kh_test_history') || '[]');
                history.push({
                    testId: this.currentTest.id,
                    testName: this.currentTest.name,
                    score: score.score,
                    total: score.total,
                    percentage: score.percentage,
                    date: new Date().toISOString()
                });
                localStorage.setItem('kh_test_history', JSON.stringify(history));
            }
        } catch(e) {
            console.error('Error saving test result:', e);
        }
    }
    
    showResults(score) {
        const container = document.getElementById('testContainer');
        if (!container) return;
        
        const resultsHTML = `
            <div class="results-container">
                <div class="results-card">
                    <h1 style="margin-bottom: 20px;">Test Completed!</h1>
                    <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 40px;">You have completed ${this.currentTest.name}</p>
                    
                    <div class="score-circle" style="--percentage: ${score.percentage}%">
                        <div class="score-value">${Math.round(score.percentage)}%</div>
                    </div>
                    
                    <div class="results-details">
                        <div class="result-item">
                            <h3>Correct Answers</h3>
                            <p>${score.score}/${score.total}</p>
                        </div>
                        <div class="result-item">
                            <h3>Score</h3>
                            <p>${score.score * 10}</p>
                        </div>
                        <div class="result-item">
                            <h3>Time Taken</h3>
                            <p>${Math.floor((this.timeLimit - this.timeRemaining) / 60)}:${((this.timeLimit - this.timeRemaining) % 60).toString().padStart(2, '0')}</p>
                        </div>
                        <div class="result-item">
                            <h3>Performance</h3>
                            <p>${score.percentage >= 70 ? 'Excellent' : score.percentage >= 50 ? 'Good' : 'Needs Improvement'}</p>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="action-btn retry-btn" onclick="testManager.retryTest()">
                            <i class="fas fa-redo"></i> Retry Test
                        </button>
                        <button class="action-btn" style="background: linear-gradient(45deg, #4cc9f0, #4361ee); color: white; border: none;" onclick="testManager.sendResultsByEmail(${score.percentage}, '${this.currentTest.name.replace(/'/g, "\\'")}', ${this.timeLimit - this.timeRemaining})">
                            <i class="fas fa-envelope"></i> Email Results
                        </button>
                        <button class="action-btn home-btn" onclick="window.location.href='index.html'">
                            <i class="fas fa-home"></i> Back to Home
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = resultsHTML;
    }
    
    sendResultsByEmail(scorePercentage, testName, timeTakenSeconds) {
        let userEmail = '';
        try {
            const user = JSON.parse(localStorage.getItem('kh_user'));
            if (user && user.email) {
                userEmail = user.email;
            }
        } catch(e) {}
        
        const timeTaken = `${Math.floor(timeTakenSeconds / 60)}:${(timeTakenSeconds % 60).toString().padStart(2, '0')}`;
        
        const subject = encodeURIComponent(`Test Results: ${testName}`);
        const body = encodeURIComponent(`Hello,\n\nI have completed the "${testName}" test on KnowledgeHub.\n\nMy Score: ${Math.round(scorePercentage)}%\nTime Taken: ${timeTaken}\n\nBest regards!`);
        
        window.location.href = `mailto:${userEmail}?subject=${subject}&body=${body}`;
    }
    
    retryTest() {
        this.userAnswers = {};
        this.currentQuestionIndex = 0;
        this.timeRemaining = this.timeLimit;
        this.renderTest();
        this.startTimer();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.prevQuestion();
                    break;
                case 'ArrowRight':
                    this.nextQuestion();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                    const answerIndex = parseInt(e.key) - 1;
                    if (answerIndex >= 0 && answerIndex <= 3) {
                        this.selectAnswer(answerIndex);
                    }
                    break;
            }
        });
    }
}


// Initialize test manager when page loads
let testManager;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing test manager...');
    testManager = new TestManager();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM already loaded, initializing test manager...');
    setTimeout(() => {
        testManager = new TestManager();
    }, 100);
}
