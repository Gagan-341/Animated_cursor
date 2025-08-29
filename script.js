const canvas = document.getElementById('smokeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let smokeEnabled = true;
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let hue = 0;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Update mouse position
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function drawTrail() {
  if (smokeEnabled) {
    ctx.fillStyle = `rgba(0, 0, 0, 0.05)`; // soft fade effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 10, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fill();

    hue += 2;
    if (hue >= 360) hue = 0;
  }

  requestAnimationFrame(drawTrail);
}

drawTrail();

// Toggle button functionality
document.getElementById('toggle').addEventListener('click', () => {
  smokeEnabled = !smokeEnabled;
  if (!smokeEnabled) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

