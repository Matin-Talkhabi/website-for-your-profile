const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

// for intro motion
let mouseMoved = false;

const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 40,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5,
    hue: 0,
    saturation: 1
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}

window.addEventListener("click", e => {
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);

function update(t) {
    // for intro motion
    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.strokeStyle = `hsl(${params.hue}, ${params.saturation * 100}%, 50%)`;
        ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.strokeStyle = `hsl(${params.hue}, ${params.saturation * 100}%, 50%)`;
    ctx.stroke();

    params.hue += 0.1; // Increment the hue value for color change

    window.requestAnimationFrame(update);
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Resume icon canvas effect
function createResumeCanvas() {
    const resumeLink = document.querySelector('.resume-link');
    if (!resumeLink) return;

    const resumeCanvas = document.createElement('canvas');
    resumeCanvas.className = 'resume-canvas';
    resumeCanvas.width = 120;
    resumeCanvas.height = 120;

    const ctx = resumeCanvas.getContext('2d');
    const resumeTrail = [];
    const resumeParams = {
        pointsNumber: 12,
        widthFactor: 0.3,
        spring: 0.4,
        friction: 0.5,
        hue: 0,
        saturation: 1
    };

    for (let i = 0; i < resumeParams.pointsNumber; i++) {
        resumeTrail[i] = {
            x: 60,
            y: 60,
            dx: 0,
            dy: 0,
        };
    }

    function updateResumeTrail() {
        ctx.clearRect(0, 0, resumeCanvas.width, resumeCanvas.height);

        resumeTrail.forEach((p, pIdx) => {
            const prev = pIdx === 0 ? { x: 60 + Math.sin(Date.now() * 0.003) * 30, y: 60 + Math.cos(Date.now() * 0.003) * 30 } : resumeTrail[pIdx - 1];
            const spring = pIdx === 0 ? 0.4 * resumeParams.spring : resumeParams.spring;
            p.dx += (prev.x - p.x) * spring;
            p.dy += (prev.y - p.y) * spring;
            p.dx *= resumeParams.friction;
            p.dy *= resumeParams.friction;
            p.x += p.dx;
            p.y += p.dy;
        });

        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(resumeTrail[0].x, resumeTrail[0].y);

        for (let i = 1; i < resumeTrail.length - 1; i++) {
            const xc = 0.5 * (resumeTrail[i].x + resumeTrail[i + 1].x);
            const yc = 0.5 * (resumeTrail[i].y + resumeTrail[i + 1].y);
            ctx.quadraticCurveTo(resumeTrail[i].x, resumeTrail[i].y, xc, yc);
            ctx.lineWidth = resumeParams.widthFactor * (resumeParams.pointsNumber - i);
            ctx.strokeStyle = `hsl(${resumeParams.hue}, ${resumeParams.saturation * 100}%, 50%)`;
            ctx.stroke();
        }

        ctx.lineTo(resumeTrail[resumeTrail.length - 1].x, resumeTrail[resumeTrail.length - 1].y);
        ctx.strokeStyle = `hsl(${resumeParams.hue}, ${resumeParams.saturation * 100}%, 50%)`;
        ctx.stroke();

        resumeParams.hue += 0.3;

        requestAnimationFrame(updateResumeTrail);
    }

    resumeLink.appendChild(resumeCanvas);
    updateResumeTrail();
}

// Initialize resume canvas when DOM is loaded
document.addEventListener('DOMContentLoaded', createResumeCanvas);