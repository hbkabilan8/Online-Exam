// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create animated particles
    createParticles();
    
    // Check user session
    checkSession();
    
    // Add mobile menu functionality
    setupMobileMenu();
    
    // Initialize popup event listeners
    setupPopupListeners();
    
    // Add hover effects to test cards
    setupTestCardEffects();
    
    // Setup filter buttons
    setupFilterButtons();
});

// ========== ANIMATION FUNCTIONS ==========

function createParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
        
        container.appendChild(particle);
    }
    
    // Add CSS for particles if not already present
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            .particle {
                position: absolute;
                border-radius: 50%;
                animation: particle-float linear infinite;
                pointer-events: none;
            }
            
            @keyframes particle-float {
                0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========== MOBILE MENU ==========

function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (nav && mobileMenuBtn && 
                !nav.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                nav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }
}

// ========== POPUP FUNCTIONS ==========

function setupPopupListeners() {
    // Close popups when clicking outside
    document.querySelectorAll('.popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAll();
            }
        });
    });
    
    // Close popups with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAll();
        }
    });
}

// Make these functions globally available
window.openLogin = function() {
    const loginOverlay = document.getElementById('loginOverlay');
    const registerOverlay = document.getElementById('registerOverlay');
    
    if (loginOverlay) {
        loginOverlay.style.display = 'flex';
    }
    if (registerOverlay) {
        registerOverlay.style.display = 'none';
    }
    
    // Prevent body scrolling
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
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
};

window.closeAll = function() {
    document.querySelectorAll('.popup-overlay').forEach(popup => {
        popup.style.display = 'none';
    });
    
    // Restore body scrolling
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

// ========== AUTHENTICATION FUNCTIONS ==========

window.login = function() {
    const email = document.getElementById('lemail').value.trim();
    const password = document.getElementById('lpass').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simple email validation
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const loginBtn = document.querySelector('#loginOverlay .btn-submit') || document.querySelector('#loginOverlay .primary-btn');
    if(loginBtn) {
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
                showNotification('Login successful! Redirecting...', 'success');
                closeAll();
                setTimeout(() => location.reload(), 600);
            } else {
                showNotification('Invalid email or password. Please try again.', 'error');
            }
        }, 800);
    }
};

window.register = function() {
    const name = document.getElementById('rname').value.trim();
    const email = document.getElementById('remail').value.trim();
    const password = document.getElementById('rpass').value;
    const confirmPass = document.getElementById('rcpass').value;
    const termsChecked = document.querySelector('#registerOverlay input[type="checkbox"]')?.checked;
    
    if (!name || !email || !password || !confirmPass) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password !== confirmPass) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    if (!termsChecked) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        return;
    }
    
    // Show loading state
    const registerBtn = document.querySelector('#registerOverlay .btn-submit') || document.querySelector('#registerOverlay .primary-btn');
    if(registerBtn) {
        const originalText = registerBtn.innerHTML;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        registerBtn.disabled = true;
        
        setTimeout(() => {
            const stored = JSON.parse(localStorage.getItem('kh_users') || '[]');
            
            if (stored.find(u => u.email === email)) {
                registerBtn.innerHTML = originalText;
                registerBtn.disabled = false;
                showNotification('This email is already registered. Please login instead.', 'error');
                return;
            }
            
            stored.push({name: name, email: email, pass: btoa(password)});
            localStorage.setItem('kh_users', JSON.stringify(stored));
            
            registerBtn.innerHTML = originalText;
            registerBtn.disabled = false;
            showNotification('Registered successfully! You can now login.', 'success');
            closeAll();
            setTimeout(() => openLogin(), 600);
        }, 800);
    }
};

window.logout = function() {
    localStorage.removeItem('kh_user');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => location.reload(), 600);
};

// Helper function to validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification (Toast)
window.showNotification = function(msg, type = 'info') {
    const icons = {success:'fa-check-circle', error:'fa-times-circle', info:'fa-info-circle'};
    let container = document.getElementById('toastContainer');
    
    // Create toast container if it doesn't exist on this page
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.position = 'fixed';
        container.style.bottom = '24px';
        container.style.right = '24px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    
    // Add inline styles for the toast to ensure it works globally
    toast.style.padding = '14px 20px';
    toast.style.borderRadius = '12px';
    toast.style.fontSize = '0.88rem';
    toast.style.fontWeight = '500';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.minWidth = '260px';
    toast.style.maxWidth = '380px';
    toast.style.backdropFilter = 'blur(12px)';
    toast.style.border = '1px solid';
    toast.style.transition = 'all 0.3s ease-out';
    toast.style.transform = 'translateX(30px)';
    toast.style.opacity = '0';
    
    if (type === 'success') {
        toast.style.background = 'rgba(107,203,119,.12)';
        toast.style.borderColor = 'rgba(107,203,119,.25)';
        toast.style.color = '#6bcb77';
    } else if (type === 'error') {
        toast.style.background = 'rgba(255,107,107,.12)';
        toast.style.borderColor = 'rgba(255,107,107,.25)';
        toast.style.color = '#ff6b6b';
    } else {
        toast.style.background = 'rgba(108,99,255,.12)';
        toast.style.borderColor = 'rgba(108,99,255,.25)';
        toast.style.color = '#a09fff';
    }
    
    toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${msg}`;
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

window.checkSession = function() {
    try {
        const user = JSON.parse(localStorage.getItem('kh_user'));
        if (user && user.name) {
            const userElements = document.querySelectorAll('#user, #userGreet');
            userElements.forEach(el => {
                el.innerText = "Hi, " + user.name.split(' ')[0] + " 👋";
                el.style.color = "var(--success)";
                el.style.fontWeight = "600";
            });
            
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
};

// ========== TEST FUNCTIONS ==========

// FIXED: This is the main function that handles all test button clicks
window.startTest = function(testId, testName) {
    console.log('Starting test:', testId, testName); // For debugging
    
    // Check if user is logged in
    try {
        const user = JSON.parse(localStorage.getItem('kh_user'));
        if (user && user.name) {
            // User is logged in, redirect to test page with the correct test ID
            window.location.href = `test.html?test=${testId}`;
        } else {
            // User is not logged in, show login popup
            showNotification('Please login to take the test', 'info');
            openLogin();
        }
    } catch(err) {
        console.error('Error checking session:', err);
        openLogin();
    }
};

// Filter tests on index page
window.filterTests = function(category) {
    const cards = document.querySelectorAll('.test-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if ((category === 'all' && btn.textContent.trim() === 'All') || 
            (category === 'programming' && btn.textContent.trim() === 'Programming') ||
            (category === 'gk' && btn.textContent.trim() === 'General Knowledge') ||
            (category === 'courses' && btn.textContent.trim() === 'Courses')) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide cards based on category
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
};

window.scrollToTests = function() {
    const testsSection = document.getElementById('testsSection');
    if (testsSection) {
        testsSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// ========== UI HELPER FUNCTIONS ==========

function setupTestCardEffects() {
    const testCards = document.querySelectorAll('.test-card');
    
    testCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.card-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent.trim().toLowerCase();
            if (text === 'all') {
                filterTests('all');
            } else if (text === 'programming') {
                filterTests('programming');
            } else if (text === 'general knowledge') {
                filterTests('gk');
            } else if (text === 'courses') {
                filterTests('courses');
            }
        });
    });
}
window.openRegister = function() {
    const loginOverlay = document.getElementById('loginOverlay');
    const registerOverlay = document.getElementById('registerOverlay');
    
    if (loginOverlay) {
        loginOverlay.style.display = 'none';
    }
    if (registerOverlay) {
        registerOverlay.style.display = 'flex';
        // Scroll to top when opening
        setTimeout(() => {
            registerOverlay.scrollTop = 0;
        }, 10);
    }
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
};