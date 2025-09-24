// REEX Multi-page Website JavaScript
class REEXWebsite {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.languageDropdownOpen = false;
        this.init();
    }

    init() {
        this.initializeLanguage();
        this.setupEventListeners();
        this.initializeAnimations();
        this.setActiveNavigation();
    }

    // Language switching functionality
    switchLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Update all elements with data attributes
        document.querySelectorAll('[data-en][data-id]').forEach(element => {
            element.textContent = element.getAttribute('data-' + lang);
        });
        
        // Update placeholders
        document.querySelectorAll('[placeholder]').forEach(element => {
            if (element.hasAttribute('data-en') && element.hasAttribute('data-id')) {
                element.placeholder = element.getAttribute('data-' + lang);
            }
        });
        
        // Update current language display
        const currentLangDisplay = lang === 'en' ? '🇺🇸 English' : '🇮🇩 Bahasa Indonesia';
        const currentLangElement = document.getElementById('current-lang');
        if (currentLangElement) {
            currentLangElement.innerHTML = currentLangDisplay;
        }
        
        // Update mobile select
        const mobileSelect = document.getElementById('mobile-language-select');
        if (mobileSelect) {
            mobileSelect.value = lang;
        }
        
        // Close dropdown after selection
        this.closeLanguageDropdown();
    }

    toggleLanguageDropdown() {
        const dropdown = document.querySelector('.language-dropdown');
        if (!dropdown) return;
        
        if (this.languageDropdownOpen) {
            dropdown.style.display = 'none';
            this.languageDropdownOpen = false;
        } else {
            dropdown.style.display = 'block';
            this.languageDropdownOpen = true;
        }
    }

    closeLanguageDropdown() {
        const dropdown = document.querySelector('.language-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        this.languageDropdownOpen = false;
    }

    initializeLanguage() {
        this.switchLanguage(this.currentLanguage);
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                
                const icon = mobileMenuButton.querySelector('i');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.setAttribute('data-feather', 'menu');
                } else {
                    icon.setAttribute('data-feather', 'x');
                }
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            });
        }

        // Language switcher click event
        const languageButton = document.getElementById('language-button');
        if (languageButton) {
            languageButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleLanguageDropdown();
            });
        }

        // Mobile language select
        const mobileLanguageSelect = document.getElementById('mobile-language-select');
        if (mobileLanguageSelect) {
            mobileLanguageSelect.addEventListener('change', (e) => {
                this.switchLanguage(e.target.value);
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const languageSwitcher = document.querySelector('.language-switcher');
            if (languageSwitcher && !languageSwitcher.contains(e.target)) {
                this.closeLanguageDropdown();
            }
        });

        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                console.log('Form submission started');
                e.preventDefault(); // Prevent default form submission
                
                const submitButton = document.getElementById('submit-button');
                const buttonText = submitButton ? submitButton.querySelector('.button-text') : null;
                const loadingText = submitButton ? submitButton.querySelector('.loading-text') : null;
                const formMessage = document.getElementById('form-message');
                const successMessage = document.getElementById('success-message');
                const errorMessage = document.getElementById('error-message');
                
                console.log('DOM Elements:', {
                    submitButton,
                    buttonText,
                    loadingText,
                    formMessage,
                    successMessage,
                    errorMessage
                });
                
                // Show loading state
                if (submitButton) submitButton.disabled = true;
                if (buttonText) buttonText.classList.add('hidden');
                if (loadingText) loadingText.classList.remove('hidden');
                
                // Hide previous messages
                if (formMessage) formMessage.classList.add('hidden');
                if (successMessage) successMessage.classList.add('hidden');
                if (errorMessage) errorMessage.classList.add('hidden');
                
                // Collect form data
                const formData = new FormData(contactForm);
                
                // Log form data for debugging
                console.log('Form data being submitted:');
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }
                
                // Send form data using fetch
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    console.log('Form submission response:', response);
                    console.log('Response status:', response.status);
                    console.log('Response ok?', response.ok);
                    
                    // Formspree returns a 200 status with JSON on success
                    if (response.status === 200) {
                        console.log('Form submitted successfully');
                        // Show success message
                        if (formMessage) formMessage.classList.remove('hidden');
                        if (successMessage) successMessage.classList.remove('hidden');
                        // Reset form
                        contactForm.reset();
                    } else {
                        throw new Error('Form submission failed with status: ' + response.status);
                    }
                }).catch(error => {
                    console.error('Form submission error:', error);
                    // Show error message
                    if (formMessage) formMessage.classList.remove('hidden');
                    if (errorMessage) errorMessage.classList.remove('hidden');
                }).finally(() => {
                    // Reset button state
                    if (submitButton) submitButton.disabled = false;
                    if (buttonText) buttonText.classList.remove('hidden');
                    if (loadingText) loadingText.classList.add('hidden');
                });
            });
        }

        // Smooth scrolling for navigation links (for same-page anchors)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add global language switch function to window
        window.switchLanguage = (lang) => this.switchLanguage(lang);
    }

    initializeAnimations() {
        // Initialize AOS animations if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true
            });
        }
        
        // Initialize Feather icons if available
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Page transition effect
        document.body.classList.add('page-transition');
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }

    setActiveNavigation() {
        // Get current page from URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Remove active class from all nav links
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('nav-active');
        });

        // Add active class to current page navigation
        const pageMapping = {
            'index.html': 'home',
            '': 'home', // for root path
            'about.html': 'about',
            'services.html': 'services', 
            'properties.html': 'properties',
            'contact.html': 'contact'
        };

        const currentSection = pageMapping[currentPage] || 'home';
        const activeNavLink = document.querySelector(`nav a[href*="${currentSection}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('nav-active');
        }
    }
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new REEXWebsite();
});

// Utility functions for global access
function navigateToPage(page) {
    window.location.href = page;
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
