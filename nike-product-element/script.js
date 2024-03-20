const wrappers = document.querySelectorAll(".wrapper");
const containers = document.querySelectorAll(".container");
const buttons = document.querySelectorAll(".expand-button");

buttons.forEach((button, index) => {
  button.addEventListener("click", (event) => {
    const attribute = "data-open";
    const isOpen =
      containers[index].getAttribute(attribute) === "true" ? true : false;
    if (isOpen) {
      wrappers[index].setAttribute(attribute, "false");
      containers[index].setAttribute(attribute, "false");
    } else {
      wrappers[index].setAttribute(attribute, "true");
      containers[index].setAttribute(attribute, "true");
    }
  });
});
