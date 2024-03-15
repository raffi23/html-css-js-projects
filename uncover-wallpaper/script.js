const overlay = document.querySelector(".overlay");

document.addEventListener("pointermove", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  overlay.style.clipPath = `circle(25% at ${x}px ${y}px)`;
});

document.addEventListener("pointerleave", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  overlay.style.clipPath = `circle(0% at ${x}px ${y}px)`;
});
