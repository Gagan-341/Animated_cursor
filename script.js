// script.js
// console.log("JavaScript is working!");

// let smokeEnabled = false;
// const toggleBtn = document.getElementById('toggle');
// const container = document.getElementById('smoke-cursor-container');

// toggleBtn.addEventListener('click', () => {
//   smokeEnabled = !smokeEnabled;
//   toggleBtn.textContent = smokeEnabled ? "Turn Smoke Off" : "Turn Smoke On";
// });

// document.addEventListener('mousemove', (e) => {
//   if (!smokeEnabled) return;

//   const smoke = document.createElement('div');
//   smoke.className = 'smoke';
//   smoke.style.left = `${e.pageX}px`;
//   smoke.style.top = `${e.pageY}px`;
//   container.appendChild(smoke);

//   setTimeout(() => {
//     smoke.remove();
//   }, 1000);
// });

// // window.addEventListener('DOMContentLoaded', () => {
// //   const toggleButton = document.getElementById('toggle');

// //   setTimeout(() => {
// //     toggleButton.style.opacity = '0'; // fade out
// //     setTimeout(() => {
// //       toggleButton.style.display = 'none'; // fully hide
// //     }, 1000);
// //   }, 5000);
// // });

// window.addEventListener('DOMContentLoaded', () => {
//   const { ipcRenderer } = require('electron');
//   const toggleButton = document.getElementById('toggle');

//   setTimeout(() => {
//     toggleButton.style.opacity = '0'; // fade out
//     setTimeout(() => {
//       toggleButton.style.display = 'none'; // hide after fade
//       ipcRenderer.send('toggle-hidden'); // tell main process to ignore mouse forever
//     }, 1000); // after fade duration
//   }, 5000);
// });

// let hue = 0; // starting point of the rainbow
// let baseOpacity = 0.2; // smoke opacity

// function drawSmoke() {
//   // Example: in your draw loop for each particle:

//   const color = `hsla(${hue}, 100%, 70%, ${baseOpacity})`; 
//   ctx.fillStyle = color;
//   ctx.beginPath();
//   ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
//   ctx.fill();

//   // Update the hue slowly
//   hue += 0.5; // adjust speed here
//   if (hue >= 360) hue = 0; // reset after full circle
// }

// function animate() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   for (let particle of particles) {
//     drawSmoke(particle);
//     // update particle movement too
//   }

//   requestAnimationFrame(animate);
// }
// animate();

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
