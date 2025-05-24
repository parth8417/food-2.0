document.addEventListener('DOMContentLoaded', () => {
    // Entry animations
    const animateItems = document.querySelectorAll('.animate-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, { threshold: 0.1 });

    animateItems.forEach(item => observer.observe(item));
});
