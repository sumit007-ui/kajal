// Navigation Menu Toggle
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Add scrolled class to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navbar.contains(e.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date('March 11, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    } else {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Add reveal class to elements that should animate on scroll
    const revealElements = document.querySelectorAll('.timeline-item, .event-card, .gallery-item');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// Gallery Lightbox
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <img src="" alt="">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">&larr;</button>
            <button class="lightbox-next">&rarr;</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const overlay = lightbox.querySelector('.lightbox-overlay');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const images = Array.from(galleryItems);

    function showImage(index) {
        lightboxImg.src = images[index].src;
        lightboxImg.alt = images[index].alt;
        currentIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    galleryItems.forEach((img, index) => {
        img.addEventListener('click', () => showImage(index));
    });

    overlay.addEventListener('click', hideLightbox);
    closeBtn.addEventListener('click', hideLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                hideLightbox();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });
}

// RSVP Form Handling
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    
    // Check if form exists before adding event listener
    if (!form) {
        console.warn('RSVP form not found in HTML');
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const rsvpData = {
            fullName: formData.get('full-name'),
            email: formData.get('email'),
            attendance: formData.get('attendance'),
            guestCount: formData.get('guest-count'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        // Validate form
        if (!rsvpData.fullName || !rsvpData.email || !rsvpData.attendance) {
            alert('Please fill in all required fields.');
            return;
        }

        // Store in localStorage (in a real app, this would be sent to a server)
        const existingRSVPs = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        existingRSVPs.push(rsvpData);
        localStorage.setItem('wedding_rsvps', JSON.stringify(existingRSVPs));

        // Show success message
        alert('Thank you for your RSVP! We look forward to celebrating with you.');

        // Reset form
        form.reset();
    });
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero-section');
    let lastScrollY = window.scrollY;

    function updateParallax() {
        const scrollY = window.scrollY;
        const rate = scrollY * 0.5;
        hero.style.backgroundPositionY = `-${rate}px`;
        lastScrollY = scrollY;
        requestAnimationFrame(updateParallax);
    }

    if (window.innerWidth > 768) {
        requestAnimationFrame(updateParallax);
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();

    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize gallery lightbox
    initGalleryLightbox();

    // Initialize RSVP form
    initRSVPForm();

    // Initialize parallax effect
    initParallax();
});

// Add lightbox styles dynamically
const lightboxStyles = `
#lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: none;
}

#lightbox.active {
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    cursor: pointer;
}

.lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    z-index: 1001;
}

.lightbox-content img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.lightbox-close,
.lightbox-prev,
.lightbox-next {
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 24px;
    transition: background 0.3s ease;
}

.lightbox-close:hover,
.lightbox-prev:hover,
.lightbox-next:hover {
    background: rgba(0, 0, 0, 0.9);
}

.lightbox-close {
    top: -25px;
    right: -25px;
}

.lightbox-prev {
    top: 50%;
    left: -75px;
    transform: translateY(-50%);
}

.lightbox-next {
    top: 50%;
    right: -75px;
    transform: translateY(-50%);
}

@media (max-width: 768px) {
    .lightbox-prev,
    .lightbox-next {
        display: none;
    }

    .lightbox-close {
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        font-size: 20px;
    }
}
`;

// Inject lightbox styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);