/**
 * ASTRO LIGHTING - Main JavaScript
 * Handles slider, carousels, scroll animations, mobile menu, and cookie consent
 */

document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');

    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Check on load

    // ============================================
    // MOBILE MENU
    // ============================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const overlay = document.getElementById('overlay');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);

    // ============================================
    // HERO SLIDER
    // ============================================
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds

    function goToSlide(index) {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        // Update current slide
        currentSlide = index;

        // Add active class to new slide
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlider();
            goToSlide(index);
            startSlider();
        });
    });

    // Pause on hover
    const heroSlider = document.getElementById('heroSlider');
    heroSlider.addEventListener('mouseenter', stopSlider);
    heroSlider.addEventListener('mouseleave', startSlider);

    // Start slider
    startSlider();

    // ============================================
    // CAROUSELS
    // ============================================
    function initCarousel(prevBtnId, nextBtnId, carouselId) {
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const carousel = document.getElementById(carouselId);

        if (!carousel) return;

        const scrollAmount = 400;

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // Initialize carousels
    initCarousel('categoriesPrev', 'categoriesNext', 'categoriesCarousel');
    initCarousel('typesPrev', 'typesNext', 'typesCarousel');
    initCarousel('projectsPrev', 'projectsNext', 'projectsCarousel');

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ============================================
    // COOKIE CONSENT
    // ============================================
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieSettings = document.getElementById('cookieSettings');
    const acceptAllCookies = document.getElementById('acceptAllCookies');
    const cookieModal = document.getElementById('cookieModal');
    const modalClose = document.getElementById('modalClose');
    const savePreferences = document.getElementById('savePreferences');

    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookie-consent');

    if (!cookieChoice) {
        // Show cookie consent after a short delay
        setTimeout(() => {
            cookieConsent.classList.add('active');
        }, 1000);
    }

    // Accept all cookies
    acceptAllCookies.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'all');
        cookieConsent.classList.remove('active');
    });

    // Open cookie settings modal
    cookieSettings.addEventListener('click', () => {
        cookieModal.classList.add('active');
    });

    // Close modal
    function closeModal() {
        cookieModal.classList.remove('active');
    }

    modalClose.addEventListener('click', closeModal);

    // Close modal on overlay click
    cookieModal.addEventListener('click', (e) => {
        if (e.target === cookieModal) {
            closeModal();
        }
    });

    // Save preferences
    savePreferences.addEventListener('click', () => {
        const analytics = document.getElementById('analyticsCookies').checked;
        const marketing = document.getElementById('marketingCookies').checked;

        localStorage.setItem('cookie-consent', 'custom');
        localStorage.setItem('cookie-analytics', analytics);
        localStorage.setItem('cookie-marketing', marketing);

        cookieConsent.classList.remove('active');
        closeModal();
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (href === '#' || !href) return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });

    // ============================================
    // PARALLAX EFFECT FOR SUSTAINABILITY SECTION
    // ============================================
    const sustainabilitySection = document.querySelector('.sustainability-section');
    const sustainabilityBg = document.querySelector('.sustainability-bg img');

    if (sustainabilitySection && sustainabilityBg) {
        window.addEventListener('scroll', () => {
            const rect = sustainabilitySection.getBoundingClientRect();
            const scrollProgress = -rect.top / window.innerHeight;

            if (scrollProgress > -1 && scrollProgress < 2) {
                const translateY = scrollProgress * 50;
                sustainabilityBg.style.transform = `translateY(${translateY}px) scale(1.1)`;
            }
        }, { passive: true });
    }

    // ============================================
    // PRODUCT CARD HOVER EFFECTS
    // ============================================
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const overlay = card.querySelector('.product-overlay');

        if (overlay) {
            card.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
            });
        }
    });

    // ============================================
    // KEYBOARD NAVIGATION FOR SLIDER
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopSlider();
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prev);
            startSlider();
        } else if (e.key === 'ArrowRight') {
            stopSlider();
            nextSlide();
            startSlider();
        }
    });

    // ============================================
    // VISIBILITY API - PAUSE SLIDER WHEN TAB HIDDEN
    // ============================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate network request
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }

    console.log('Astro Lighting website initialized successfully!');
});
