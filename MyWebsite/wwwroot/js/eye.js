window.initEyeTracking = () => {
    const eye = document.querySelector('.eye-ball');
    const pupil = document.querySelector('.eye-pupil');

    document.addEventListener('mousemove', (e) => {
        if (!eye || !pupil) return;

        const eyeRect = eye.getBoundingClientRect();

        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);

        const distance = Math.min(eyeRect.width / 4, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY));

        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;

        pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    });
};