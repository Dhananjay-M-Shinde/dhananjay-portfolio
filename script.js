// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initScrollToTop();
    initContactForm();
    initScrollAnimations();
    initActiveNavigation();
    initNavbarScroll();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
        
        // Add smooth transition for theme change
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

function updateThemeToggleIcon(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (theme === 'dark') {
        sunIcon.style.display = 'inline';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline';
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to Top Button
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Contact Form Functionality with Formspree
function initContactForm() {
    const form = document.getElementById('my-form');
    const button = document.getElementById('my-form-button');
    const status = document.getElementById('my-form-status');
    
    if (!form) return; // Exit if form doesn't exist
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showFormStatus('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span> Sending...';
        button.disabled = true;
        status.textContent = '';
        
        try {
            // Submit to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                form.reset();
                showFormStatus('Thank you for your message! I\'ll get back to you soon.', 'success');
            } else {
                // Error from Formspree
                const data = await response.json();
                if (data.errors) {
                    showFormStatus(data.errors.map(error => error.message).join(', '), 'error');
                } else {
                    showFormStatus('Oops! There was a problem submitting your form. Please try again.', 'error');
                }
            }
        } catch (error) {
            // Network error
            showFormStatus('Oops! There was a problem submitting your form. Please check your connection and try again.', 'error');
        } finally {
            // Reset button
            button.textContent = originalText;
            button.disabled = false;
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormStatus(message, type) {
    const status = document.getElementById('my-form-status');
    if (status) {
        status.textContent = message;
        status.className = `form-status ${type}`;
        
        // Remove message after 5 seconds for success, keep error messages
        if (type === 'success') {
            setTimeout(() => {
                status.textContent = '';
                status.className = 'form-status';
            }, 5000);
        }
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards for scroll animations
    const animatedElements = document.querySelectorAll(
        'section, .skill-category, .project-card, .education-card, .timeline-item, .stat'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Active Navigation Highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Add active class styling
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: var(--primary-color) !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation(); // Initial call
}

// Typing Animation for Hero Section
function initTypingAnimation() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const texts = ['MERN Stack Developer', 'Backend Developer', 'System Engineer', 'Full Stack Developer'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeAnimation() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            heroSubtitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            heroSubtitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next word
        }
        
        setTimeout(typeAnimation, typeSpeed);
    }
    
    // Start typing animation after a delay
    setTimeout(typeAnimation, 1000);
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to let other animations complete
    setTimeout(initTypingAnimation, 500);
});

// Navbar Background on Scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Skill Tag Hover Effect
function initSkillTagEffects() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            // Add pulse effect
            this.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        tag.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
    
    // Add pulse keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize skill tag effects
document.addEventListener('DOMContentLoaded', initSkillTagEffects);

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize parallax effect (optional - can be enabled)
// document.addEventListener('DOMContentLoaded', initParallaxEffect);

// Copy to Clipboard Functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showMessage('Copied to clipboard!', 'success');
    }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showMessage('Copied to clipboard!', 'success');
    });
}

// Add click to copy functionality to contact details
document.addEventListener('DOMContentLoaded', function() {
    const contactLinks = document.querySelectorAll('.contact-text a');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.startsWith('mailto:') || this.href.startsWith('tel:')) {
                return; // Allow default behavior for email and phone links
            }
            
            e.preventDefault();
            copyToClipboard(this.textContent);
        });
    });
});

// Preloader (optional)
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="loading"></div>
            <p>Loading...</p>
        </div>
    `;
    
    const preloaderStyles = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-primary);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
        }
        
        .preloader-content p {
            margin-top: 1rem;
            color: var(--text-secondary);
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = preloaderStyles;
    document.head.appendChild(style);
    
    document.body.appendChild(preloader);
    
    // Hide preloader when page is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

// Initialize preloader (uncomment to enable)
// document.addEventListener('DOMContentLoaded', initPreloader);

// Console welcome message
console.log(`
🚀 Welcome to Dhananjay Shinde's Portfolio!
📧 Contact: dmshinde2212@gmail.com
💼 GitHub: https://github.com/Dhananjay-M-Shinde
🌐 LinkedIn: https://linkedin.com/in/dhananjay-shinde-109921a0
📱 Phone: +91 7218384604
📍 Location: Pune, India

This portfolio is built with vanilla HTML, CSS, and JavaScript.
Feel free to explore the code and get in touch!
`);

// Performance monitoring (optional)
function initPerformanceMonitoring() {
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page loaded in ${perfData.loadEventEnd - perfData.fetchStart}ms`);
    });
}

document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
