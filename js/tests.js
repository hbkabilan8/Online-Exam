// tests.js - Updated version
// Tests Page Management
class TestsPage {
    constructor() {
        this.allTests = [];
        this.filteredTests = [];
        this.currentPage = 1;
        this.testsPerPage = 12;
        this.currentCategory = 'all';
        this.currentSort = 'popular';
        this.currentView = 'grid';
        
        this.init();
    }
    
    init() {
        this.loadAllTests();
        this.setupEventListeners();
        this.checkSession(); // This will now check localStorage
    }
    
    checkSession() {
        try {
            const user = JSON.parse(localStorage.getItem('kh_user'));
            if (user && user.name) {
                // Update user welcome element
                const userElement = document.getElementById('user');
                if (userElement) {
                    userElement.innerText = "Hi, " + user.name.split(' ')[0] + " 👋";
                    userElement.style.color = "var(--success)";
                    userElement.style.fontWeight = "600";
                }
                
                // Hide login/register buttons, show logout
                const loginBtns = document.querySelectorAll('.btn-login');
                const registerBtns = document.querySelectorAll('.btn-register');
                const logoutBtns = document.querySelectorAll('.btn-logout');
                
                loginBtns.forEach(b => b.style.display = 'none');
                registerBtns.forEach(b => b.style.display = 'none');
                logoutBtns.forEach(b => {
                    b.style.display = 'inline-flex';
                    b.style.alignItems = 'center';
                    b.style.gap = '8px';
                });
            }
        } catch(e) {
            console.error('Session check error:', e);
        }
    }
    
    loadAllTests() {
        this.generateSampleTests();
        this.filteredTests = [...this.allTests];
        this.renderTests();
        this.renderPagination();
    }
    
    generateSampleTests() {
        // Categories and their icons
        const categories = {
            'programming': { icon: 'fa-code', color: '#4361ee' },
            'gk': { icon: 'fa-globe', color: '#4cc9f0' },
            'courses': { icon: 'fa-graduation-cap', color: '#f72585' },
            'certification': { icon: 'fa-certificate', color: '#ff9e00' },
            'language': { icon: 'fa-language', color: '#7209b7' },
            'aptitude': { icon: 'fa-calculator', color: '#3a0ca3' }
        };
        
        // Clear existing tests
        this.allTests = [];
        let testId = 1;
        
        // Generate 150+ tests with proper data
        const testNames = [
            // Programming (30 tests)
            { name: 'JavaScript Fundamentals', category: 'programming', questions: 50, duration: 60, difficulty: 'easy' },
            { name: 'Advanced JavaScript', category: 'programming', questions: 60, duration: 90, difficulty: 'advanced' },
            { name: 'Python Programming', category: 'programming', questions: 45, duration: 75, difficulty: 'intermediate' },
            { name: 'Python for Data Science', category: 'programming', questions: 55, duration: 90, difficulty: 'advanced' },
            { name: 'Java Core Concepts', category: 'programming', questions: 50, duration: 80, difficulty: 'intermediate' },
            { name: 'Java Spring Framework', category: 'programming', questions: 60, duration: 120, difficulty: 'advanced' },
            { name: 'C++ Programming', category: 'programming', questions: 40, duration: 60, difficulty: 'intermediate' },
            { name: 'C# and .NET', category: 'programming', questions: 50, duration: 75, difficulty: 'intermediate' },
            { name: 'PHP Web Development', category: 'programming', questions: 45, duration: 60, difficulty: 'easy' },
            { name: 'React.js Fundamentals', category: 'programming', questions: 50, duration: 75, difficulty: 'intermediate' },
            { name: 'React.js Advanced', category: 'programming', questions: 55, duration: 90, difficulty: 'advanced' },
            { name: 'Vue.js Mastery', category: 'programming', questions: 45, duration: 70, difficulty: 'intermediate' },
            { name: 'Angular Framework', category: 'programming', questions: 60, duration: 100, difficulty: 'advanced' },
            { name: 'Node.js Backend', category: 'programming', questions: 50, duration: 80, difficulty: 'intermediate' },
            { name: 'Express.js API Development', category: 'programming', questions: 40, duration: 60, difficulty: 'intermediate' },
            { name: 'MongoDB Database', category: 'programming', questions: 35, duration: 50, difficulty: 'easy' },
            { name: 'MySQL Database Design', category: 'programming', questions: 45, duration: 70, difficulty: 'intermediate' },
            { name: 'PostgreSQL Advanced', category: 'programming', questions: 50, duration: 80, difficulty: 'advanced' },
            { name: 'Docker Containers', category: 'programming', questions: 40, duration: 60, difficulty: 'intermediate' },
            { name: 'Kubernetes Orchestration', category: 'programming', questions: 55, duration: 90, difficulty: 'advanced' },
            { name: 'AWS Cloud Practitioner', category: 'programming', questions: 65, duration: 110, difficulty: 'intermediate' },
            { name: 'Azure Fundamentals', category: 'programming', questions: 50, duration: 85, difficulty: 'intermediate' },
            { name: 'Google Cloud Platform', category: 'programming', questions: 55, duration: 95, difficulty: 'advanced' },
            { name: 'DevOps Practices', category: 'programming', questions: 45, duration: 70, difficulty: 'intermediate' },
            { name: 'Git Version Control', category: 'programming', questions: 30, duration: 45, difficulty: 'easy' },
            { name: 'Linux Administration', category: 'programming', questions: 50, duration: 80, difficulty: 'intermediate' },
            { name: 'Shell Scripting', category: 'programming', questions: 35, duration: 55, difficulty: 'easy' },
            { name: 'Cybersecurity Basics', category: 'programming', questions: 40, duration: 60, difficulty: 'easy' },
            { name: 'Ethical Hacking', category: 'programming', questions: 60, duration: 120, difficulty: 'advanced' },
            { name: 'Machine Learning Basics', category: 'programming', questions: 50, duration: 85, difficulty: 'intermediate' },
            
            // General Knowledge (25 tests)
            { name: 'World History', category: 'gk', questions: 60, duration: 90, difficulty: 'intermediate' },
            { name: 'Ancient Civilizations', category: 'gk', questions: 45, duration: 70, difficulty: 'easy' },
            { name: 'Medieval History', category: 'gk', questions: 50, duration: 75, difficulty: 'intermediate' },
            { name: 'Modern History', category: 'gk', questions: 55, duration: 85, difficulty: 'advanced' },
            { name: 'World Geography', category: 'gk', questions: 50, duration: 75, difficulty: 'intermediate' },
            { name: 'Physical Geography', category: 'gk', questions: 45, duration: 70, difficulty: 'intermediate' },
            { name: 'Human Geography', category: 'gk', questions: 40, duration: 60, difficulty: 'easy' },
            { name: 'Art History', category: 'gk', questions: 35, duration: 55, difficulty: 'intermediate' },
            { name: 'Music Theory', category: 'gk', questions: 30, duration: 45, difficulty: 'easy' },
            { name: 'Film and Cinema', category: 'gk', questions: 40, duration: 60, difficulty: 'easy' },
            { name: 'Literature Classics', category: 'gk', questions: 45, duration: 70, difficulty: 'intermediate' },
            { name: 'Modern Literature', category: 'gk', questions: 40, duration: 60, difficulty: 'easy' },
            { name: 'Philosophy Basics', category: 'gk', questions: 35, duration: 55, difficulty: 'easy' },
            { name: 'World Religions', category: 'gk', questions: 50, duration: 75, difficulty: 'intermediate' },
            { name: 'Mythology', category: 'gk', questions: 45, duration: 70, difficulty: 'easy' },
            { name: 'Current Affairs 2024', category: 'gk', questions: 40, duration: 45, difficulty: 'easy' },
            { name: 'Politics Today', category: 'gk', questions: 35, duration: 40, difficulty: 'easy' },
            { name: 'International Relations', category: 'gk', questions: 45, duration: 60, difficulty: 'intermediate' },
            { name: 'Economic Updates', category: 'gk', questions: 40, duration: 50, difficulty: 'intermediate' },
            { name: 'Technology News', category: 'gk', questions: 35, duration: 40, difficulty: 'easy' },
            { name: 'Science Discoveries', category: 'gk', questions: 30, duration: 35, difficulty: 'easy' },
            { name: 'Environmental Issues', category: 'gk', questions: 40, duration: 50, difficulty: 'intermediate' },
            { name: 'Healthcare Updates', category: 'gk', questions: 35, duration: 45, difficulty: 'easy' },
            { name: 'Sports Events', category: 'gk', questions: 30, duration: 35, difficulty: 'easy' },
            { name: 'Entertainment News', category: 'gk', questions: 25, duration: 30, difficulty: 'easy' },
            
            // Courses (20 tests)
            { name: 'Database Management', category: 'courses', questions: 35, duration: 50, difficulty: 'intermediate' },
            { name: 'Cyber Security', category: 'courses', questions: 55, duration: 90, difficulty: 'advanced' },
            { name: 'Data Science', category: 'courses', questions: 60, duration: 120, difficulty: 'advanced' },
            { name: 'Artificial Intelligence', category: 'courses', questions: 50, duration: 90, difficulty: 'advanced' },
            { name: 'Digital Marketing', category: 'courses', questions: 40, duration: 60, difficulty: 'intermediate' },
            { name: 'Project Management', category: 'courses', questions: 45, duration: 75, difficulty: 'intermediate' },
            { name: 'Business Analytics', category: 'courses', questions: 50, duration: 80, difficulty: 'intermediate' },
            { name: 'Financial Planning', category: 'courses', questions: 40, duration: 60, difficulty: 'intermediate' },
            { name: 'Entrepreneurship', category: 'courses', questions: 35, duration: 50, difficulty: 'easy' },
            { name: 'Public Speaking', category: 'courses', questions: 30, duration: 45, difficulty: 'easy' },
            
            // Certification (15 tests)
            { name: 'AWS Certified Solutions Architect', category: 'certification', questions: 65, duration: 130, difficulty: 'advanced' },
            { name: 'Google Cloud Professional', category: 'certification', questions: 60, duration: 120, difficulty: 'advanced' },
            { name: 'Microsoft Azure Fundamentals', category: 'certification', questions: 40, duration: 60, difficulty: 'intermediate' },
            { name: 'Cisco CCNA', category: 'certification', questions: 55, duration: 90, difficulty: 'advanced' },
            { name: 'CompTIA Security+', category: 'certification', questions: 50, duration: 90, difficulty: 'intermediate' },
            { name: 'PMP Certification', category: 'certification', questions: 60, duration: 120, difficulty: 'advanced' },
            { name: 'Scrum Master', category: 'certification', questions: 45, duration: 60, difficulty: 'intermediate' },
            { name: 'Six Sigma Green Belt', category: 'certification', questions: 50, duration: 90, difficulty: 'intermediate' },
            { name: 'ITIL Foundation', category: 'certification', questions: 40, duration: 60, difficulty: 'intermediate' },
            { name: 'CEH (Ethical Hacking)', category: 'certification', questions: 55, duration: 120, difficulty: 'advanced' },
            
            // Language (15 tests)
            { name: 'English Proficiency', category: 'language', questions: 50, duration: 60, difficulty: 'intermediate' },
            { name: 'Spanish Language', category: 'language', questions: 45, duration: 60, difficulty: 'intermediate' },
            { name: 'French Grammar', category: 'language', questions: 40, duration: 50, difficulty: 'intermediate' },
            { name: 'German Vocabulary', category: 'language', questions: 35, duration: 45, difficulty: 'easy' },
            { name: 'Japanese Basics', category: 'language', questions: 30, duration: 40, difficulty: 'easy' },
            { name: 'Chinese Characters', category: 'language', questions: 40, duration: 60, difficulty: 'advanced' },
            { name: 'Business English', category: 'language', questions: 45, duration: 60, difficulty: 'intermediate' },
            { name: 'TOEFL Preparation', category: 'language', questions: 60, duration: 120, difficulty: 'advanced' },
            { name: 'IELTS Practice', category: 'language', questions: 55, duration: 120, difficulty: 'advanced' },
            { name: 'Grammar Mastery', category: 'language', questions: 40, duration: 50, difficulty: 'intermediate' },
            
            // Aptitude (15 tests)
            { name: 'Quantitative Aptitude', category: 'aptitude', questions: 50, duration: 60, difficulty: 'intermediate' },
            { name: 'Logical Reasoning', category: 'aptitude', questions: 45, duration: 50, difficulty: 'intermediate' },
            { name: 'Verbal Ability', category: 'aptitude', questions: 40, duration: 45, difficulty: 'easy' },
            { name: 'Data Interpretation', category: 'aptitude', questions: 35, duration: 50, difficulty: 'intermediate' },
            { name: 'Critical Thinking', category: 'aptitude', questions: 30, duration: 40, difficulty: 'easy' },
            { name: 'Problem Solving', category: 'aptitude', questions: 45, duration: 60, difficulty: 'intermediate' },
            { name: 'Analytical Skills', category: 'aptitude', questions: 40, duration: 50, difficulty: 'intermediate' },
            { name: 'Numerical Ability', category: 'aptitude', questions: 50, duration: 60, difficulty: 'intermediate' },
            { name: 'Spatial Reasoning', category: 'aptitude', questions: 35, duration: 45, difficulty: 'easy' },
            { name: 'Abstract Reasoning', category: 'aptitude', questions: 40, duration: 50, difficulty: 'intermediate' }
        ];
        
        // Add all tests with unique IDs
        testNames.forEach(test => {
            this.allTests.push({
                id: testId++,
                ...test,
                categoryInfo: categories[test.category] || { icon: 'fa-folder', color: '#6c757d' },
                participants: Math.floor(Math.random() * 5000) + 500,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1)
            });
        });
        
        // Add more tests to reach 150+
        const categories_list = ['programming', 'gk', 'courses', 'certification', 'language', 'aptitude'];
        const difficulty_list = ['easy', 'intermediate', 'advanced'];
        
        while (this.allTests.length < 150) {
            const category = categories_list[Math.floor(Math.random() * categories_list.length)];
            const difficulty = difficulty_list[Math.floor(Math.random() * difficulty_list.length)];
            const questions = Math.floor(Math.random() * 40) + 25;
            
            this.allTests.push({
                id: testId++,
                name: `${category.charAt(0).toUpperCase() + category.slice(1)} Test ${this.allTests.length + 1}`,
                category: category,
                categoryInfo: categories[category] || { icon: 'fa-folder', color: '#6c757d' },
                questions: questions,
                duration: Math.floor(questions * 1.2) + 10,
                difficulty: difficulty,
                participants: Math.floor(Math.random() * 3000) + 100,
                rating: (Math.random() * 1.2 + 3.8).toFixed(1)
            });
        }
        
        // Update total tests count
        const totalTestsElement = document.getElementById('totalTests');
        if (totalTestsElement) {
            totalTestsElement.textContent = this.allTests.length + '+';
        }
    }
    
    renderTests() {
        const testsGrid = document.getElementById('testsGrid');
        if (!testsGrid) return;
        
        const startIndex = (this.currentPage - 1) * this.testsPerPage;
        const endIndex = startIndex + this.testsPerPage;
        const currentTests = this.filteredTests.slice(startIndex, endIndex);
        
        testsGrid.className = this.currentView === 'grid' ? 'tests-grid' : 'tests-grid list-view';
        testsGrid.innerHTML = currentTests.map(test => 
            this.currentView === 'grid' ? this.createTestCard(test) : this.createTestListItem(test)
        ).join('');
        
        this.updateActiveCategoryTab();
    }
    
    createTestCard(test) {
        const difficultyColors = {
            'easy': '#4cc9f0',
            'intermediate': '#ff9e00',
            'advanced': '#f72585'
        };
        
        return `
            <div class="test-card" data-category="${test.category}">
                <div class="test-card-header">
                    <div class="test-category" style="background: ${test.categoryInfo.color}20; color: ${test.categoryInfo.color}; border-color: ${test.categoryInfo.color}40;">
                        <i class="fas ${test.categoryInfo.icon}"></i>
                        <span>${test.category.charAt(0).toUpperCase() + test.category.slice(1)}</span>
                    </div>
                    <div class="test-rating">
                        <i class="fas fa-star"></i>
                        <span>${test.rating}</span>
                    </div>
                </div>
                
                <div class="test-card-body">
                    <h3 class="test-title">${test.name}</h3>
                    <p class="test-description">Test your knowledge with ${test.questions} carefully crafted questions</p>
                    
                    <div class="test-meta">
                        <div class="meta-item">
                            <i class="fas fa-question-circle"></i>
                            <span>${test.questions} Qs</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${test.duration} min</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${this.formatNumber(test.participants)}</span>
                        </div>
                    </div>
                    
                    <div class="test-difficulty">
                        <span class="difficulty-badge" style="background: ${difficultyColors[test.difficulty]}20; color: ${difficultyColors[test.difficulty]}; border-color: ${difficultyColors[test.difficulty]}40;">
                            ${test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                        </span>
                    </div>
                </div>
                
                <div class="test-card-footer">
                    <button class="start-test-btn" onclick="startTest(${test.id}, '${test.name}')">
                        <i class="fas fa-play-circle"></i> Start Test
                    </button>
                </div>
            </div>
        `;
    }
    
    createTestListItem(test) {
        const difficultyColors = {
            'easy': '#4cc9f0',
            'intermediate': '#ff9e00',
            'advanced': '#f72585'
        };
        
        return `
            <div class="test-list-item" data-category="${test.category}">
                <div class="list-item-header">
                    <div class="list-category" style="background: ${test.categoryInfo.color}20; color: ${test.categoryInfo.color}; border-color: ${test.categoryInfo.color}40;">
                        <i class="fas ${test.categoryInfo.icon}"></i>
                    </div>
                    <div class="list-title-section">
                        <h3 class="list-title">${test.name}</h3>
                        <div class="list-meta">
                            <span class="list-meta-item">
                                <i class="fas fa-question-circle"></i> ${test.questions} Questions
                            </span>
                            <span class="list-meta-item">
                                <i class="fas fa-clock"></i> ${test.duration} Minutes
                            </span>
                            <span class="list-meta-item">
                                <i class="fas fa-users"></i> ${this.formatNumber(test.participants)} Participants
                            </span>
                            <span class="list-meta-item">
                                <i class="fas fa-star"></i> ${test.rating} Rating
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="list-item-body">
                    <div class="list-difficulty">
                        <span class="difficulty-badge" style="background: ${difficultyColors[test.difficulty]}20; color: ${difficultyColors[test.difficulty]}; border-color: ${difficultyColors[test.difficulty]}40;">
                            ${test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                        </span>
                    </div>
                    
                    <div class="list-actions">
                        <button class="start-test-btn" onclick="startTest(${test.id}, '${test.name}')">
                            <i class="fas fa-play-circle"></i> Start Test
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.filteredTests.length / this.testsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        paginationHTML += `
            <button class="page-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="testsPage.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="testsPage.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        paginationHTML += `
            <button class="page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="testsPage.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        if (page < 1 || page > Math.ceil(this.filteredTests.length / this.testsPerPage)) {
            return;
        }
        
        this.currentPage = page;
        this.renderTests();
        this.renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    filterTestsByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        
        if (category === 'all') {
            this.filteredTests = [...this.allTests];
        } else {
            this.filteredTests = this.allTests.filter(test => test.category === category);
        }
        
        this.sortTests();
        this.renderTests();
        this.renderPagination();
        this.updateActiveCategoryTab();
    }
    
    searchTests() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.filterTestsByCategory(this.currentCategory);
            return;
        }
        
        this.filteredTests = this.allTests.filter(test => 
            test.name.toLowerCase().includes(searchTerm) ||
            test.category.toLowerCase().includes(searchTerm) ||
            test.difficulty.toLowerCase().includes(searchTerm)
        );
        
        this.currentPage = 1;
        this.renderTests();
        this.renderPagination();
    }
    
    sortTests() {
        const sortSelect = document.getElementById('sortSelect');
        if (!sortSelect) return;
        
        const sortValue = sortSelect.value;
        this.currentSort = sortValue;
        
        switch(sortValue) {
            case 'popular':
                this.filteredTests.sort((a, b) => b.participants - a.participants);
                break;
            case 'newest':
                this.filteredTests.sort((a, b) => b.id - a.id);
                break;
            case 'name':
                this.filteredTests.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'difficulty':
                const difficultyOrder = { 'easy': 1, 'intermediate': 2, 'advanced': 3 };
                this.filteredTests.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
                break;
            case 'duration':
                this.filteredTests.sort((a, b) => a.duration - b.duration);
                break;
        }
        
        this.renderTests();
    }
    
    changeView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`.view-btn[onclick*="${view}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        this.renderTests();
    }
    
    updateActiveCategoryTab() {
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`.category-tab[data-category="${this.currentCategory}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
    
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchTests();
                }
            });
        }
    }
}

// Initialize tests page
let testsPage;

document.addEventListener('DOMContentLoaded', function() {
    testsPage = new TestsPage();
});

// Global functions for button clicks
function startTest(testId, testName) {
    // Check if user is logged in via localStorage
    try {
        const user = JSON.parse(localStorage.getItem('kh_user'));
        if (user && user.name) {
            // User is logged in, redirect to test page
            window.location.href = `test.html?test=${testId}`;
        } else {
            // User is not logged in, show login popup
            if (typeof showNotification === 'function') {
                showNotification('Please login to take the test', 'info');
            } else {
                alert('Please login to take the test');
            }
            openLogin();
        }
    } catch(err) {
        console.error('Error checking session:', err);
        openLogin();
    }
}

// Make these functions globally available for the popups
window.openLogin = function() {
    const loginOverlay = document.getElementById('loginOverlay');
    const registerOverlay = document.getElementById('registerOverlay');
    
    if (loginOverlay) {
        loginOverlay.style.display = 'flex';
    }
    if (registerOverlay) {
        registerOverlay.style.display = 'none';
    }
    document.body.style.overflow = 'hidden';
};

window.openRegister = function() {
    const loginOverlay = document.getElementById('loginOverlay');
    const registerOverlay = document.getElementById('registerOverlay');
    
    if (loginOverlay) {
        loginOverlay.style.display = 'none';
    }
    if (registerOverlay) {
        registerOverlay.style.display = 'flex';
    }
    document.body.style.overflow = 'hidden';
};

window.closeAll = function() {
    document.querySelectorAll('.popup-overlay').forEach(popup => {
        popup.style.display = 'none';
    });
    document.body.style.overflow = '';
};

window.switchToRegister = function() {
    closeAll();
    setTimeout(() => openRegister(), 10);
};

window.switchToLogin = function() {
    closeAll();
    setTimeout(() => openLogin(), 10);
};

window.togglePassword = function(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const icon = field.parentNode.querySelector('.toggle-password') || field.parentNode.querySelector('.toggle-pw');
    
    if (field.type === 'password') {
        field.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        field.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
};

// Login function
window.login = function() {
    const email = document.getElementById('lemail')?.value.trim();
    const password = document.getElementById('lpass')?.value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const loginBtn = document.querySelector('#loginOverlay .btn-submit');
    if (loginBtn) {
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        loginBtn.disabled = true;
        
        setTimeout(() => {
            const stored = JSON.parse(localStorage.getItem('kh_users') || '[]');
            const found = stored.find(u => u.email === email && u.pass === btoa(password));
            
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
            
            if (found) {
                localStorage.setItem('kh_user', JSON.stringify({name: found.name, email: found.email}));
                
                if (typeof showNotification === 'function') {
                    showNotification('Login successful! Redirecting...', 'success');
                } else {
                    alert('Login successful!');
                }
                
                closeAll();
                setTimeout(() => location.reload(), 600);
            } else {
                alert('Invalid email or password. Please try again.');
            }
        }, 800);
    }
};

// Register function
window.register = function() {
    const name = document.getElementById('rname')?.value.trim();
    const email = document.getElementById('remail')?.value.trim();
    const password = document.getElementById('rpass')?.value;
    const confirmPass = document.getElementById('rcpass')?.value;
    const termsChecked = document.getElementById('termsCheck')?.checked;
    
    if (!name || !email || !password || !confirmPass) {
        alert('Please fill in all fields');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (password !== confirmPass) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }
    
    if (!termsChecked) {
        alert('Please agree to the Terms & Conditions');
        return;
    }
    
    const registerBtn = document.querySelector('#registerOverlay .btn-submit');
    if (registerBtn) {
        const originalText = registerBtn.innerHTML;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        registerBtn.disabled = true;
        
        setTimeout(() => {
            const stored = JSON.parse(localStorage.getItem('kh_users') || '[]');
            
            if (stored.find(u => u.email === email)) {
                registerBtn.innerHTML = originalText;
                registerBtn.disabled = false;
                alert('This email is already registered. Please login instead.');
                return;
            }
            
            stored.push({name: name, email: email, pass: btoa(password)});
            localStorage.setItem('kh_users', JSON.stringify(stored));
            
            registerBtn.innerHTML = originalText;
            registerBtn.disabled = false;
            alert('Registered successfully! You can now login.');
            closeAll();
            setTimeout(() => openLogin(), 600);
        }, 800);
    }
};

// Logout function
window.logout = function() {
    localStorage.removeItem('kh_user');
    
    if (typeof showNotification === 'function') {
        showNotification('Logged out successfully', 'success');
    } else {
        alert('Logged out successfully');
    }
    
    setTimeout(() => location.reload(), 600);
};

// Make filter functions available globally
window.filterTestsByCategory = function(category) {
    if (testsPage) {
        testsPage.filterTestsByCategory(category);
    }
};

window.sortTests = function() {
    if (testsPage) {
        testsPage.sortTests();
    }
};

window.changeView = function(view) {
    if (testsPage) {
        testsPage.changeView(view);
    }
};

window.searchTests = function() {
    if (testsPage) {
        testsPage.searchTests();
    }
};