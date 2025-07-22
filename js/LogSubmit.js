function createConfetti() {
  const colors = [
    "#f39c12",
    "#e74c3c",
    "#3498db",
    "#2ecc71",
    "#9b59b6",
    "#f1c40f",
  ];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";

      const randomLeft = Math.random() * 90 + 5;
      confetti.style.left = randomLeft + "vw";

      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = Math.random() * 8 + 6 + "px";
      confetti.style.height = confetti.style.width;

      confetti.style.animationDelay = Math.random() * 2 + "s";
      confetti.style.animationDuration = Math.random() * 3 + 2 + "s";

      confetti.style.top = "-" + (Math.random() * 50 + 10) + "px";

      document.body.appendChild(confetti);

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 6000);
    }, i * 100);
  }
}

function goToDashboard() {
  document.querySelector(".success-container").style.transform = "scale(0.9)";
  document.querySelector(".success-container").style.opacity = "0.7";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 300);
}

window.addEventListener("load", () => {
  setTimeout(createConfetti, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
  const checkmarkContainer = document.querySelector(".checkmark-container");

  checkmarkContainer.addEventListener("mouseenter", () => {
    checkmarkContainer.style.transform = "scale(1.1)";
  });

  checkmarkContainer.addEventListener("mouseleave", () => {
    checkmarkContainer.style.transform = "scale(1)";
  });
});

document.querySelector(".btn.btn-primary").addEventListener("click", () => {
  goToDashboard();
});
