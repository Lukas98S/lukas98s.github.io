window.initMovingEye = () => {
    const container = document.getElementById('background-eyes-layer');
    const maxEye = 4;
    const minSize = 100;

    const maxSpeed = 8;

    let eyes = [];

    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    class Eye {
        constructor(x, y, size, dx, dy, pupilColor, cooldown = 0) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.height = size * 0.5;
            this.dx = Math.abs(dx) > maxSpeed ? (dx > 0 ? maxSpeed : -maxSpeed) : dx;
            this.dy = Math.abs(dy) > maxSpeed ? (dy > 0 ? maxSpeed : -maxSpeed) : dy;

            this.pupilColor = pupilColor || '#00f2fe';

            this.splitCooldown = cooldown;

            this.el = document.createElement('div');
            this.el.className = 'moving-eye';
            this.el.style.width = this.size + 'px';
            this.el.style.height = this.height + 'px';

            this.el.innerHTML = `
                        <div class="eye-pupil" style="background: radial-gradient(circle at 30% 30%, #fff, ${this.pupilColor} 30%, #000 60%); box-shadow: 0 0 10px ${this.pupilColor};"></div>
                        <div class="eye-lid" style="animation-duration: ${Math.random() * 3 + 2}s"></div>
             `;

            container.appendChild(this.el);
        }

        update() {

            if (this.splitCooldown > 0) {
                this.splitCooldown--;
            }

            this.x += this.dx;
            this.y += this.dy;

            let hitWall = false;

            if (this.x <= 0 || this.x + this.size >= window.innerWidth) {
                this.dx *= -1;
                hitWall = true;
                if (this.x <= 0) this.x = 0; else this.x = window.innerWidth - this.size;
            }

            if (this.y <= 0 || this.y + this.height >= window.innerHeight) {
                this.dy *= -1;
                hitWall = true;
                if (this.y <= 0) this.y = 0; else this.y = window.innerHeight - this.height;
            }

            if (hitWall && eyes.length < maxEye && this.size > minSize && this.splitCooldown <= 0) {
                this.split();
                return;
            }

            this.el.style.left = this.x + 'px';
            this.el.style.top = this.y + 'px';
            this.lookAtMouse();
        }

        lookAtMouse() {
            if (!window.mouseX) return;
            const rect = this.el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(window.mouseY - centerY, window.mouseX - centerX);
            const maxDist = this.size / 6;
            const dist = Math.min(maxDist, Math.hypot(window.mouseX - centerX, window.mouseY - centerY));
            const pupilX = Math.cos(angle) * dist;
            const pupilY = Math.sin(angle) * dist;
            const pupil = this.el.querySelector('.eye-pupil');
            if (pupil) {
                pupil.style.transform = `translate(-50%, -50%) translate(${pupilX}px, ${pupilY}px)`;
            }
        }

        split() {
            this.el.remove();
            eyes = eyes.filter(e => e !== this);

            const newSize = this.size * 0.8;

            const speedFactor = 1.05;

            const babyCooldown = 60;

            eyes.push(new Eye(this.x, this.y, newSize, this.dx * speedFactor, this.dy * speedFactor, this.pupilColor, babyCooldown));

            eyes.push(new Eye(this.x, this.y, newSize, -this.dx * speedFactor, -this.dy * speedFactor, getRandomColor(), babyCooldown));
        }
    }

    window.mouseX = window.innerWidth / 2;
    window.mouseY = window.innerHeight / 2;
    document.addEventListener('mousemove', (e) => {
        window.mouseX = e.clientX;
        window.mouseY = e.clientY;
    });

    eyes.push(new Eye(window.innerWidth / 2 - 100, window.innerHeight / 2 - 50, 200, 3, 3, '#00f2fe', 0));

    function animate() {
        for (let i = eyes.length - 1; i >= 0; i--) {
            eyes[i].update();
        }
        requestAnimationFrame(animate);
    }
    animate();
};