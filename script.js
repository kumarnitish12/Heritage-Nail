// Heritage Nail Design - JavaScript Functionality

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const backToTopBtn = document.getElementById('back-to-top');
const galleryFilters = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const appointmentForm = document.querySelector('.appointment-form');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeGalleryFilters();
    initializeFormHandling();
    initializeSmoothScrolling();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbar.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Scroll effects functionality
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Animate elements on scroll
        animateOnScroll();
    });

    // Back to top button functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update active navigation link based on current section
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current section's nav link
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Gallery filtering functionality
function initializeGalleryFilters() {
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter button
            galleryFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(filterValue);
        });
    });
}

// Filter gallery items based on category
function filterGalleryItems(category) {
    galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.style.opacity = '0';
            
            // Animate item appearance
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Form handling functionality
function initializeFormHandling() {
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const service = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // Validate form
            if (validateForm(name, email, service)) {
                // Create mailto link with form data
                const mailtoLink = createMailtoLink(name, email, phone, service, message);
                
                // Open mail client
                window.location.href = mailtoLink;
                
                // Show success message
                showNotification('Thank you! Your appointment request has been prepared. Please send the email to complete your booking.', 'success');
                
                // Reset form
                this.reset();
            }
        });
    }
}

// Validate form inputs
function validateForm(name, email, service) {
    if (!name.trim()) {
        showNotification('Please enter your name.', 'error');
        return false;
    }
    
    if (!email.trim() || !isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!service) {
        showNotification('Please select a service.', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Create mailto link with form data
function createMailtoLink(name, email, phone, service, message) {
    const subject = `Appointment Request - ${service}`;
    const body = `
Dear Heritage Nail Design Team,

I would like to book an appointment for the following service:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service: ${service}

Additional Message:
${message || 'None'}

Please contact me to confirm the appointment details.

Best regards,
${name}
    `.trim();
    
    return `mailto:heritage@naildesign.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Show notification message
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Animate elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .about-text, .contact-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .gallery-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

// Gallery image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Window resize handler
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Prevent scroll when mobile menu is open
function toggleBodyScroll(disable) {
    if (disable) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Update mobile menu toggle to control body scroll
navToggle.addEventListener('click', function() {
    const isMenuOpen = navMenu.classList.contains('active');
    toggleBodyScroll(isMenuOpen);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    updateActiveNavLink();
    animateOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Fallback for broken images
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not available</text></svg>';
            this.alt = 'Image not available';
        });
    });
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.setAttribute('role', 'main');
        heroSection.id = 'main-content';
    }
});

// Console welcome message
console.log(`
🎨 Heritage Nail Design Website
✨ Timeless Elegance in Every Design
🔗 Built with HTML5, CSS3, and Vanilla JavaScript
💅 Ready to showcase beautiful nail art!
`);
