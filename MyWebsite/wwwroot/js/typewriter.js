window.typewriterEffect = (elementId, text, speed) => {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.innerHTML = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
};