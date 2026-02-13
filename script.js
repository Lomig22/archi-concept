/* ========================================
   ARCHI CONCEPT - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollReveal();
    initProjectFilter();
    initLightbox();
    initCountUp();
    initSmoothScroll();
    initFormHandling();
});

/* ========================================
   NAVIGATION
   ======================================== */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Scroll behavior
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ========================================
   SCROLL REVEAL ANIMATIONS
   ======================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
}

/* ========================================
   PROJECT FILTER
   ======================================== */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ========================================
   LIGHTBOX
   ======================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const highResSrc = img.src.replace('w=600', 'w=1600');
            lightboxImg.src = highResSrc;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* ========================================
   COUNT UP ANIMATION
   ======================================== */
function initCountUp() {
    const numbers = document.querySelectorAll('.trust-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.dataset.count);
                animateCount(target, countTo);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    numbers.forEach(num => observer.observe(num));
}

function animateCount(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   FORM HANDLING
   ======================================== */
function initFormHandling() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Create mailto link with form data
            const subject = encodeURIComponent(`Demande de ${data.service || 'contact'} - ${data.name}`);
            const body = encodeURIComponent(
                `Nom: ${data.name}\n` +
                `Email: ${data.email}\n` +
                `Téléphone: ${data.phone || 'Non renseigné'}\n` +
                `Service: ${data.service || 'Non spécifié'}\n\n` +
                `Message:\n${data.message}`
            );
            
            // Open email client
            window.location.href = `mailto:archiconcept974@gmail.com?subject=${subject}&body=${body}`;
            
            // Show success feedback
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Message préparé !';
            btn.style.backgroundColor = '#B8A88A';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                form.reset();
            }, 3000);
        });
    }
}

/* ========================================
   PARALLAX EFFECT (subtle)
   ======================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Hero parallax
    const heroImg = document.querySelector('.hero-img');
    if (heroImg && scrolled < window.innerHeight) {
        heroImg.style.transform = `scale(${1 + scrolled * 0.0001}) translateY(${scrolled * 0.3}px)`;
    }
    
    // CTA parallax
    const ctaBg = document.querySelector('.cta-bg img');
    if (ctaBg) {
        const ctaSection = document.querySelector('.cta');
        const ctaRect = ctaSection.getBoundingClientRect();
        if (ctaRect.top < window.innerHeight && ctaRect.bottom > 0) {
            const parallaxValue = (ctaRect.top - window.innerHeight) * 0.2;
            ctaBg.style.transform = `translateY(${parallaxValue}px)`;
        }
    }
});

/* ========================================
   FADE IN ANIMATION KEYFRAMES (CSS in JS)
   ======================================== */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
