import Accordion from "accordion-js";

document.addEventListener("DOMContentLoaded", () => {
  new Accordion("#faq-accordion", {
    duration: 300,
    collapse: true,
    showMultiple: false,
    elementClass: "ac",
    triggerClass: "ac-trigger",
    panelClass: "ac-panel",
  });
});