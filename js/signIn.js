// Add interactive functionality and backend integration for login
document
  .getElementById("signinForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = this.querySelector(".btn-primary");
    const messageDiv = document.getElementById("signinMessage");
    const originalText = btn.textContent;
    btn.textContent = "Signing in...";
    btn.style.background = "linear-gradient(135deg, #a8e6cf, #c8a8e9)";
    messageDiv.textContent = "";

    const formData = new FormData(this);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("http://localhost:8001/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setTimeout(() => {
          window.location.href = "signIn.html";
        }, 1000);
      } else {
        btn.textContent = originalText;
        btn.style.background = "linear-gradient(135deg, #ff9a8b, #ffd93d)";
        messageDiv.style.color = "#ff4d4f";
        messageDiv.textContent = data.message || "Login failed.";
      }
    } catch (err) {
      btn.textContent = originalText;
      btn.style.background = "linear-gradient(135deg, #ff9a8b, #ffd93d)";
      messageDiv.style.color = "#ff4d4f";
      messageDiv.textContent = "Network error. Please try again.";
    }
  });

document.getElementById("googleSignin").addEventListener("click", function () {
  const btn = this;
  const originalText = btn.innerHTML;

  btn.innerHTML = '<div class="google-icon"></div>Connecting...';
  btn.style.background = "#f7fafc";

  setTimeout(() => {
    btn.innerHTML = '<div class="google-icon"></div>Connected! 🎉';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = "white";
    }, 2000);
  }, 1500);
});

// document
//   .getElementById("createAccount")
//   .addEventListener("click", function (e) {
//     e.preventDefault();
//     alert("Redirecting to account creation... 🌟");
//   });

// Add subtle parallax effect to floating elements
document.addEventListener("mousemove", function (e) {
  const elements = document.querySelectorAll(".floating-element");
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  elements.forEach((element, index) => {
    const speed = (index + 1) * 0.5;
    const x = (mouseX - 0.5) * speed;
    const y = (mouseY - 0.5) * speed;

    element.style.transform += ` translate(${x}px, ${y}px)`;
  });
});

// Add form validation feedback
const inputs = document.querySelectorAll(".form-input");
inputs.forEach((input) => {
  input.addEventListener("blur", function () {
    if (this.validity.valid && this.value) {
      this.style.borderColor = "#a8e6cf";
      this.style.boxShadow = "0 0 0 4px rgba(168, 230, 207, 0.1)";
    } else if (!this.validity.valid && this.value) {
      this.style.borderColor = "#ff9a8b";
      this.style.boxShadow = "0 0 0 4px rgba(255, 154, 139, 0.1)";
    } else {
      this.style.borderColor = "rgba(200, 168, 233, 0.3)";
      this.style.boxShadow = "none";
    }
  });
});

// Particle generation
function createParticles() {
  const container = document.querySelector(".particle-container");
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random properties
    const size = Math.random() * 10 + 5;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 15 + 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}vw`;
    particle.style.top = `${posY}vh`;
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;

    container.appendChild(particle);
  }
}

document.addEventListener("DOMContentLoaded", createParticles);
