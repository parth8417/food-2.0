document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea, select');

    // Form validation
    inputs.forEach(input => {
        input.addEventListener('input', validateField);
        input.addEventListener('blur', validateField);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formStatus = form.querySelector('.form-status');
        formStatus.className = 'form-status loading';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            formStatus.className = 'form-status success';
            form.reset();
        } catch (error) {
            formStatus.className = 'form-status error';
        }
    });

    function validateField(e) {
        const input = e.target;
        const errorDiv = input.nextElementSibling;
        const isValid = input.checkValidity();

        if (!isValid) {
            input.classList.add('invalid');
            errorDiv.textContent = input.dataset.error || 'This field is required';
        } else {
            input.classList.remove('invalid');
            errorDiv.textContent = '';
        }
    }

    function validateForm() {
        let isValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                validateField({ target: input });
                isValid = false;
            }
        });
        return isValid;
    }

    // FAQ Accordion
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const isOpen = toggle.classList.contains('active');

            // Close all other FAQs
            faqToggles.forEach(t => {
                t.classList.remove('active');
                t.nextElementSibling.style.maxHeight = null;
            });

            // Toggle current FAQ
            if (!isOpen) {
                toggle.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});
