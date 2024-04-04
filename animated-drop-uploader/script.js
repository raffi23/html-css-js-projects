const card = document.getElementById("card");
const cardBefore = document.getElementById("card--before");
const cardAfter = document.getElementById("card--after");
const cardImages = document.getElementById("card--images");
const dropArea = document.getElementById("drop-area");
const text = document.querySelector("h1");
const button = document.getElementById("upload--button");

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

function highlightDropArea() {
  card.classList.add("highlight");
}

function unhighlightDropArea() {
  card.classList.remove("highlight");
}

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlightDropArea, false);
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlightDropArea, false);
});

dropArea.addEventListener("drop", handleDrop, false);

function dataUrlToFile(dataUrl) {
  const [, base64Data] = dataUrl.split(",");
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: "image/png" });
}

async function animateIn(image, index) {
  return new Promise((res) => {
    // timeout is necessary here because it
    // is running right after creating an image element
    setTimeout(() => {
      image.style.opacity = "1";
      image.style.transform =
        index === 0
          ? "rotate(0deg)"
          : (index + 1) % 2 === 1
          ? `rotate(${index * 10}deg)`
          : `rotate(-${index * 10}deg)`;
    }, 10);
    image.addEventListener("transitionend", () => res(), { once: true });
  });
}

async function animateOut(image) {
  return new Promise((res) => {
    image.style.opacity = "0";
    image.style.transform = "rotate(0deg)";
    image.addEventListener("transitionend", () => res(), { once: true });
  });
}

async function createImageElement(dataUrl, index) {
  const image = document.createElement("img");
  image.src = dataUrl;

  cardImages.appendChild(image);

  await animateIn(image, index);
}

async function loadFile(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.onload = function () {
      res(reader.result);
    };
    reader.onerror = function () {
      rej("something went wrong when reading the file");
    };

    reader.readAsDataURL(file);
  });
}

async function handleDrop(event) {
  const droppedFiles = event.dataTransfer.files;
  const imageFiles = [...droppedFiles].filter((file) =>
    file.type.includes("image")
  );

  if (imageFiles.length > 0) {
    if (cardImages.hasChildNodes()) {
      cardImages.replaceChildren();
    }

    button.disabled = "true";

    highlightDropArea();
    text.classList.add("hidden");
    button.classList.remove("hidden");

    for (let i = 0; i < imageFiles.length; i++) {
      const dataUrl = await loadFile(imageFiles[i], i);
      await createImageElement(dataUrl, i);
    }

    button.disabled = undefined;
  }
}

async function sendToServer(file) {
  // simulate upload
  return new Promise((res) => {
    setTimeout(() => {
      res(file);
    }, 350);
  });
  // Example
  // return fetch("/upload", {
  //   method: "POST",
  //   body: file,
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log("Upload successful:", data);
  //   })
  //   .catch((error) => {
  //     console.error("Error during upload:", error);
  //   });
}

function reset() {
  cardImages.replaceChildren();

  text.textContent = "Upload complete ✅";
  text.classList.remove("hidden");

  const timeout_1 = setTimeout(() => {
    unhighlightDropArea();
    button.classList.add("hidden");
    button.textContent = "Upload";
    button.disabled = undefined;

    const timeout_2 = setTimeout(() => {
      text.textContent = "Drop files here";
      clearTimeout(timeout_1);
      clearTimeout(timeout_2);
    }, 1000);
  }, 1000);
}

async function upload() {
  button.disabled = "true";

  const images = [...cardImages.childNodes].reverse();

  for (let i = 0; i < images.length; i++) {
    button.textContent = `Uploading ${i + 1}/${images.length}`;
    const image = images[i];
    const dataUrl = image.src;
    const file = dataUrlToFile(dataUrl);
    await sendToServer(file);
    await animateOut(image);
  }

  reset();
}
