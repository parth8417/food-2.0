document.addEventListener('DOMContentLoaded', () => {
    // Enhanced AOS initialization
    AOS.init({
        duration: 1000,
        offset: 50,
        once: true,
        easing: 'ease-out-cubic',
        delay: 100,
        anchorPlacement: 'top-bottom',
        mirror: true
    });

    // Improved counter animation
    const counters = document.querySelectorAll('.counter');
    
    const startCounter = (el) => {
        const target = parseInt(el.closest('.stat-item').dataset.count);
        const duration = 2500;
        const easeOutQuart = t => 1 - (--t) * t * t * t;
        
        let startTime = null;
        const animation = currentTime => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);
            
            el.textContent = current.toLocaleString();
            if (progress < 1) requestAnimationFrame(animation);
        };
        
        requestAnimationFrame(animation);

        // Add progress bar animation
        const statItem = el.closest('.stat-item');
        setTimeout(() => {
            statItem.classList.add('animate');
        }, 200);
    };

    // Intersection Observer for counters
    const observerOptions = {
        threshold: 0.5,
        rootMargin: "0px"
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroSection) {
            heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });

    // Video player
    const video = document.getElementById('cultureVideo');
    const playBtn = document.querySelector('.play-btn');

    if (playBtn && video) {
        playBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playBtn.style.opacity = '0';
            } else {
                video.pause();
                playBtn.style.opacity = '1';
            }
        });

        video.addEventListener('ended', () => {
            playBtn.style.opacity = '1';
        });
    }

    // Scroll to Top functionality
    const scrollTop = document.createElement('div');
    scrollTop.classList.add('scroll-top');
    scrollTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Loading animation
    const loadingOverlay = document.createElement('div');
    loadingOverlay.classList.add('loading-overlay');
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);

    window.addEventListener('load', () => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    });

    // Accessibility improvements
    document.querySelectorAll('a, button').forEach(el => {
        if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
            const icon = el.querySelector('i');
            if (icon) {
                const className = icon.className;
                el.setAttribute('aria-label', className.split('-').pop());
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    });

    // Add animation order to cards
    document.querySelectorAll('.mission-card, .team-card, .achievement-card').forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });
});
