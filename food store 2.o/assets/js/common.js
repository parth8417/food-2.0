document.addEventListener('DOMContentLoaded', () => {
    // Load navbar and footer with better error handling
    const loadComponents = async () => {
        try {
            const [navResponse, footerResponse] = await Promise.all([
                fetch('components/navbar.html'),
                fetch('components/footer.html')
            ]);

            if (!navResponse.ok) throw new Error(`Failed to load navbar: ${navResponse.status}`);
            if (!footerResponse.ok) throw new Error(`Failed to load footer: ${footerResponse.status}`);

            const [navData, footerData] = await Promise.all([
                navResponse.text(),
                footerResponse.text()
            ]);

            const navElement = document.getElementById('navbar');
            const footerElement = document.getElementById('footer');

            if (!navElement || !footerElement) {
                throw new Error('Required DOM elements not found');
            }

            navElement.innerHTML = navData;
            footerElement.innerHTML = footerData;
            initializeNavbar();

            // Initialize footer interactions
            initializeFooter();
        } catch (error) {
            console.error('Error loading components:', error);
            // Show user-friendly error message
            showErrorMessage();
        }
    };

    function initializeNavbar() {
        try {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            // Scroll effect with throttling
            let lastScroll = 0;
            let scrollTimeout;
            
            window.addEventListener('scroll', () => {
                if (scrollTimeout) return;
                
                scrollTimeout = setTimeout(() => {
                    const currentScroll = window.scrollY;
                    if (currentScroll > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    lastScroll = currentScroll;
                    scrollTimeout = null;
                }, 100);
            });

            // Mobile menu
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');

            if (navToggle && navMenu) {
                navToggle.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                    const icon = navToggle.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-bars');
                        icon.classList.toggle('fa-times');
                    }
                });
            }

            // Set active link
            const currentPath = location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.navbar__link').forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPath || 
                    (currentPath === 'index.html' && href === '/')) {
                    link.classList.add('active');
                }
            });
        } catch (error) {
            console.error('Error initializing navbar:', error);
        }
    }

    function initializeFooter() {
        // Add footer interaction handlers
        const chatButton = document.querySelector('.chat-button');
        if (chatButton) {
            chatButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Implement chat functionality
                console.log('Chat functionality to be implemented');
            });
        }

        // Newsletter form handling
        const newsletterForm = document.querySelector('.footer__form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                // Implement newsletter signup
                console.log('Newsletter signup for:', email);
            });
        }
    }

    function showErrorMessage() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #fff3f3; color: #d63031;">
                <p>Sorry, we're having trouble loading the page.</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
        document.body.prepend(errorMessage);
    }

    // Initialize components
    loadComponents();
});
