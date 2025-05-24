document.addEventListener('DOMContentLoaded', () => {
    const animateCounter = (element) => {
        const target = parseInt(element.dataset.target);
        const suffix = element.dataset.suffix || '';
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let current = 0;

        // Format number with commas
        const formatNumber = (num) => {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            }
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        const counter = setInterval(() => {
            current += target / steps;
            if (current >= target) {
                element.textContent = formatNumber(target) + suffix;
                element.classList.add('visible');
                clearInterval(counter);
            } else {
                element.textContent = formatNumber(Math.floor(current)) + suffix;
            }
        }, stepDuration);
    };

    // Initialize counters when visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                stat.classList.add('visible');
                
                const counter = stat.querySelector('.stat__number');
                if (counter && counter.dataset.target) {
                    setTimeout(() => {
                        animateCounter(counter);
                    }, 300);
                }
                statsObserver.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    // Observe each stat individually
    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Quick View Modal Functionality
    document.querySelectorAll('.dish-card__overlay .button').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.dish-card');
            const dishData = {
                name: card.querySelector('h3').textContent,
                price: card.querySelector('.dish-card__price').textContent,
                description: card.querySelector('.dish-card__description').textContent,
                image: card.querySelector('img').src
            };
            showQuickView(dishData);
        });
    });

    function showQuickView(dishData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal__content">
                <img src="${dishData.image}" alt="${dishData.name}" style="width: 100%; border-radius: 0.5rem;">
                <h2>${dishData.name}</h2>
                <p>${dishData.description}</p>
                <div class="modal__footer">
                    <span class="dish-card__price">${dishData.price}</span>
                    <button class="button button--primary">Add to Cart</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    initTestimonialsCarousel();
});

// Testimonials Carousel
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials__track');
    const cards = Array.from(document.querySelectorAll('.testimonial-card'));
    const prevBtn = document.querySelector('.control-btn.prev');
    const nextBtn = document.querySelector('.control-btn.next');
    const progressBar = document.querySelector('.progress-bar');
    
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let isAnimating = false;

    function updateCarousel() {
        if (isAnimating) return;
        isAnimating = true;

        cards.forEach((card, index) => {
            card.className = 'testimonial-card';
            
            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                card.classList.add('prev');
            } else if (index === (currentIndex + 1) % cards.length) {
                card.classList.add('next');
            } else {
                card.classList.add('inactive');
            }
        });

        progressBar.style.width = `${((currentIndex + 1) / cards.length) * 100}%`;

        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    function handleNext() {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }

    function handlePrev() {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    }

    // Touch and mouse events
    track.addEventListener('mousedown', e => {
        startX = e.pageX;
        isDragging = true;
    });

    track.addEventListener('touchstart', e => {
        startX = e.touches[0].pageX;
        isDragging = true;
    });

    track.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const diffX = e.pageX - startX;
        handleDrag(diffX);
    });

    track.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const diffX = e.touches[0].pageX - startX;
        handleDrag(diffX);
    });

    function handleDragEnd(diffX) {
        isDragging = false;
        if (Math.abs(diffX) > 100) {
            if (diffX > 0) {
                handlePrev();
            } else {
                handleNext();
            }
        }
        track.style.transform = '';
    }

    track.addEventListener('mouseup', e => {
        if (!isDragging) return;
        const diffX = e.pageX - startX;
        handleDragEnd(diffX);
    });

    track.addEventListener('touchend', e => {
        if (!isDragging) return;
        const diffX = e.changedTouches[0].pageX - startX;
        handleDragEnd(diffX);
    });

    function handleDrag(diffX) {
        const percentage = (diffX / track.offsetWidth) * 30;
        track.style.transform = `translateX(${percentage}px)`;
    }

    // Button controls
    prevBtn.addEventListener('click', handlePrev);
    nextBtn.addEventListener('click', handleNext);

    // Auto-rotation with pause on hover
    let autoRotate = setInterval(handleNext, 5000);
    
    track.addEventListener('mouseenter', () => clearInterval(autoRotate));
    track.addEventListener('mouseleave', () => {
        autoRotate = setInterval(handleNext, 5000);
    });

    // Initialize
    updateCarousel();
}
