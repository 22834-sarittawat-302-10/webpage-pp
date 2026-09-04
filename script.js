// ==========================================================================
// Canvas Fire Effect & Phoenix Wings Engine
// ==========================================================================
const canvas = document.getElementById('fire-canvas');
const ctx = canvas.getContext('2d');
const wingEffect = document.getElementById('wing-effect');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const particles = [];

class FireParticle {
    constructor(x, y, isExplosion = false) {
        this.x = x;
        this.y = y;
        this.isExplosion = isExplosion;
        this.size = isExplosion ? Math.random() * 8 + 4 : Math.random() * 4 + 1;
        this.speedX = isExplosion ? (Math.random() - 0.5) * 12 : (Math.random() - 0.5) * 2;
        this.speedY = isExplosion ? (Math.random() - 0.5) * 12 : -Math.random() * 3 - 1;
        this.life = 1;
        this.decay = isExplosion ? Math.random() * 0.03 + 0.015 : Math.random() * 0.04 + 0.02;
        this.color = ['#FF3D00', '#FF6D00', '#FFAB00', '#FFD700', '#D50000'][Math.floor(Math.random() * 5)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        if (this.size > 0.2) this.size -= 0.1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// Spawns fire trail on mouse move
window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 3; i++) {
        particles.push(new FireParticle(e.clientX, e.clientY));
    }
    wingEffect.style.left = `${e.clientX}px`;
    wingEffect.style.top = `${e.clientY}px`;
});

// Show Phoenix Wing Flap effect on mousedown / hold
window.addEventListener('mousedown', (e) => {
    wingEffect.style.display = 'block';
});
window.addEventListener('mouseup', () => {
    wingEffect.style.display = 'none';
});

// Phoenix Impact Explosion Function
function triggerPhoenixExplosion(targetX, targetY, callback) {
    const explosionCount = 120;
    for (let i = 0; i < explosionCount; i++) {
        particles.push(new FireParticle(targetX, targetY, true));
    }

    // Flash Effect Overlay
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.backgroundColor = 'rgba(255, 61, 0, 0.4)';
    flash.style.zIndex = '99999';
    flash.style.pointerEvents = 'none';
    flash.style.transition = 'opacity 0.5s ease-out';
    document.body.appendChild(flash);

    setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 500);
        if (callback) callback();
    }, 200);
}

// Attach Explosion Effect to Links & Buttons
document.querySelectorAll('a, .cta-trigger').forEach(item => {
    item.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
            e.preventDefault();
            triggerPhoenixExplosion(e.clientX, e.clientY, () => {
                window.location.href = href;
            });
        } else {
            triggerPhoenixExplosion(e.clientX, e.clientY);
        }
    });
});

// Main Animation Loop
function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animate);
}
animate();
