window.addEventListener("load", function () {
  const loadingBar = document.getElementById("loadingBar");
  loadingBar.style.width = "100%";
  setTimeout(() => {
    loadingBar.style.opacity = "0";
  }, 1000);
});

document
  .querySelector(".scroll-indicator")
  .addEventListener("click", function () {
    document.querySelector(".section").scrollIntoView({
      behavior: "smooth",
    });
  });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

document
  .querySelectorAll(".content-card, .feature-card, .team-member")
  .forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

function createSparkle(x, y) {
  const sparkle = document.createElement("div");
  sparkle.innerHTML = "✨";
  sparkle.style.position = "fixed";
  sparkle.style.left = x + "px";
  sparkle.style.top = y + "px";
  sparkle.style.fontSize = "1rem";
  sparkle.style.pointerEvents = "none";
  sparkle.style.zIndex = "1000";
  sparkle.style.animation = "sparkleFloat 2s forwards";
  document.body.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 2000);
}

const style = document.createElement("style");
style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.5);
                }
            }
        `;
document.head.appendChild(style);

document
  .querySelectorAll(".feature-card, .team-member, .cta-button")
  .forEach((element) => {
    element.addEventListener("mouseenter", function (e) {
      const rect = element.getBoundingClientRect();
      createSparkle(
        rect.left + Math.random() * rect.width,
        rect.top + Math.random() * rect.height
      );
    });
  });
