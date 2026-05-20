export const triggerConfetti = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Создаем конфети элементы
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.pointerEvents = 'none';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = ['#FF4444', '#FF6B6B', '#FFB3B3', '#FF1744', '#F50057'][Math.floor(Math.random() * 5)];
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);

        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 5 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 2;

        let posX = x;
        let posY = y;
        let currentVx = vx;
        let currentVy = vy;
        const gravity = 0.2;
        let opacity = 1;

        const animate = () => {
            posX += currentVx;
            posY += currentVy;
            currentVy += gravity;
            opacity -= 0.02;

            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity.toString();

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };

        animate();
    }
};
