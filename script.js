// FIXED COUNTER ANIMATION
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.getAttribute('data-target');
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const numericTarget = parseInt(target.replace(/[%+]/g, ''));
        
        let current = 0;
        const increment = numericTarget / 80; // Smoother animation
        
        const updateCounter = () => {
            if (current < numericTarget) {
                current += increment;
                let displayValue = Math.ceil(current);
                
                // Add + or % suffix
                if (isPlus) {
                    displayValue += '+';
                } else if (isPercentage) {
                    displayValue += '%';
                }
                
                counter.textContent = displayValue;
                requestAnimationFrame(updateCounter);
            } else {
                // Final exact value with suffix
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}
// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (entry.target.querySelector('.stat-number')) {
                animateCounters();
            }
        }
    });
}, { threshold: 0.5 });

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form Submission
document.querySelector('.appointment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('✅ Appointment booked! We will call you to confirm within 30 minutes.');
    e.target.reset();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card, .doctor-card, .stats').forEach(el => {
        observer.observe(el);
    });

    const slides = document.querySelectorAll('.slider-image');
    const prevButton = document.querySelector('.slider-btn.prev');
    const nextButton = document.querySelector('.slider-btn.next');
    let currentSlide = 0;

    const showSlide = (index) => {
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === index);
        });
    };

    const moveSlide = (direction) => {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        showSlide(currentSlide);
    };

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => moveSlide(-1));
        nextButton.addEventListener('click', () => moveSlide(1));
    }
});