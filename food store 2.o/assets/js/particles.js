class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const density = Math.min(window.innerWidth * 0.08, 150); // Increased density
        for (let i = 0; i < density; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 0.5, // Larger particles
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.1,
                hue: Math.random() * 60 + 330,
                z: Math.random() * 100 // 3D effect
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Use RAF timestamp for smoother animation
        const timestamp = performance.now() * 0.001;
        
        this.particles.forEach(particle => {
            // More natural movement
            particle.x += particle.speedX * Math.sin(timestamp * 0.5) * 0.5;
            particle.y += particle.speedY * Math.cos(timestamp * 0.3) * 0.5;
            
            // Improved particle interaction
            const mouseX = this.canvas.mouseX || 0;
            const mouseY = this.canvas.mouseY || 0;
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) * 0.002;
                particle.x -= Math.cos(angle) * force;
                particle.y -= Math.sin(angle) * force;
            }

            // Enhanced movement
            particle.x += particle.speedX + Math.sin(timestamp) * 0.3;
            particle.y += particle.speedY + Math.cos(timestamp) * 0.3;
            particle.z += Math.sin(timestamp * 0.5) * 0.5;

            // Improved boundary checking
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 80%, 50%, ${particle.opacity})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.classList.add('particle-canvas');
    document.querySelector('.hero').prepend(canvas);
    new ParticleSystem(canvas);
});
