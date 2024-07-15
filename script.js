let lastMoveTime = Date.now();
let lastEyeX = 0;
let lastEyeY = 0;
let lastCursorX = 0;
let lastCursorY = 0;
const speedThreshold = 2500; 
const smoothFactor = 0.1; 

const mouth = document.getElementById('mouth');
let rapidMovement = false;
let shakeTimeout;

document.addEventListener('mousemove', function(event) {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastMoveTime) / 1000; 

    const cursorX = event.clientX;
    const cursorY = event.clientY;

    const deltaX = cursorX - lastCursorX;
    const deltaY = cursorY - lastCursorY;

    const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime; 
    lastMoveTime = currentTime;
    lastCursorX = cursorX;
    lastCursorY = cursorY;

    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(function(eye) {
        const rect = eye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        const angle = Math.atan2(cursorY - eyeY, cursorX - eyeX);

        const maxDistance = 25;
        const distance = Math.min(maxDistance, Math.hypot(cursorX - eyeX, cursorY - eyeY) / 4);
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;

        const pupil = eye.querySelector('.pupil');
        pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;

        lastEyeX = eyeX;
        lastEyeY = eyeY;
    });

    if (speed > speedThreshold) {
        rapidMovement = true;
        mouth.innerText = 'M';
        document.body.classList.add('shake');
        clearTimeout(shakeTimeout);
    } else {
        rapidMovement = false;
        clearTimeout(shakeTimeout);
        shakeTimeout = setTimeout(() => {
            mouth.innerText = 'w';
            document.body.classList.remove('shake');
        }, 500); 
    }
});

function smoothTransitionBack() {
    if (!rapidMovement && mouth.innerText !== 'w') {
        mouth.innerText = 'w';
        document.body.classList.remove('shake');
    }
    requestAnimationFrame(smoothTransitionBack);
}

document.querySelectorAll('.eye').forEach(function(eye) {
    const pupil = document.createElement('div');
    pupil.classList.add('pupil');
    eye.appendChild(pupil);
});

smoothTransitionBack();
