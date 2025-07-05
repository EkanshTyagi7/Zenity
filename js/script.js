// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add scroll effect to header
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.background =
      "linear-gradient(135deg, rgba(255, 154, 139, 0.95), rgba(255, 211, 165, 0.95))";
  } else {
    header.style.background =
      "linear-gradient(135deg, var(--primary-coral), var(--primary-peach))";
  }
});

// Animate feature cards on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Apply animation to feature cards
document.querySelectorAll(".feature-card, .why-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

// Animate Join Us section elements on scroll
const joinImage = document.querySelector(".join-image img");
const joinText = document.querySelector(".join-text");

if (joinImage && joinText) {
  // Start hidden
  joinImage.style.opacity = "0";
  joinImage.style.transform = "translateY(30px)";
  joinImage.style.transition = "opacity 0.8s ease, transform 0.8s ease";

  joinText.style.opacity = "0";
  joinText.style.transform = "translateY(30px)";
  joinText.style.transition = "opacity 0.8s ease, transform 0.8s ease";

  const joinObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          joinImage.style.opacity = "1";
          joinImage.style.transform = "translateY(0)";
          joinText.style.opacity = "1";
          joinText.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.4 }
  );

  joinObserver.observe(joinImage);
}
// Fade in/out for Join Us section
const fadeSection = document.querySelector('.fade-toggle');

const joinobserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fadeSection.classList.add('visible');
      } else {
        fadeSection.classList.remove('visible');
      }
    });
  },
  { threshold: 0.3 }
);

if (fadeSection) {
  joinobserver.observe(fadeSection);
}

document.addEventListener("DOMContentLoaded", async () => {
  const ctaContainer = document.getElementById("nav-cta");
  const heroBtn = document.getElementById("hero-cta");
  if (!ctaContainer || !heroBtn) return;

  try {
    const res = await fetch("http://localhost:8001/api/profile", {
      credentials: "include",
    });

    if (res.ok) {
      const { user } = await res.json();

      // Replace buttons with profile icon
      const profileBtn = document.createElement("a");
      profileBtn.href = "#";
      profileBtn.className = "btn btn-outline";
      profileBtn.textContent = `👤 ${user.name?.split(" ")[0] || "Profile"}`;
      ctaContainer.innerHTML = "";
      ctaContainer.appendChild(profileBtn);

      // Change hero button
      heroBtn.textContent = "➡ Continue to Dashboard";
      heroBtn.href = "dashboard.html";
    }
  } catch (err) {
    console.error("Auth check failed:", err);
  }
});

