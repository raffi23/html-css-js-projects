const container = document.querySelector("#container");
const gradient = document.querySelector("#gradient");

container.addEventListener("pointermove", (event) => {
  const styles = window.getComputedStyle(container);
  const width = parseFloat(styles.width);
  const height = parseFloat(styles.height);
  const x = Math.abs(event.offsetX - width / 2);
  const y = Math.abs(event.offsetY - height / 2);

  gradient.style.backgroundPosition = `${x}px ${y}px`;
});
