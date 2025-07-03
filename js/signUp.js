// Form submission with loading state and backend integration
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitBtn = this.querySelector(".btn-primary");
    const messageDiv = document.getElementById("signupMessage");
    submitBtn.classList.add("loading");
    submitBtn.textContent = "Creating your account...";
    messageDiv.textContent = "";

    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      submitBtn.classList.remove("loading");
      submitBtn.textContent = "Start Your Journey ✨";
      messageDiv.style.color = "#ff4d4f";
      messageDiv.textContent = "Passwords do not match.";
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setTimeout(() => {
          window.location.href = "signIn.html";
        }, 1000);
      } else {
        submitBtn.textContent = "Start Your Journey ✨";
        messageDiv.style.color = "#ff4d4f";
        messageDiv.textContent = data.message || "Signup failed.";
      }
    } catch (err) {
      submitBtn.textContent = "Start Your Journey ✨";
      messageDiv.style.color = "#ff4d4f";
      messageDiv.textContent = "Network error. Please try again.";
    }
    submitBtn.classList.remove("loading");
  });

// Input focus animations
document.querySelectorAll(".form-input").forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.style.transform = "translateY(-2px)";
  });

  input.addEventListener("blur", function () {
    this.parentElement.style.transform = "translateY(0)";
  });
});

// Progress dots animation
let currentDot = 0;
setInterval(() => {
  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.remove("active");
  });
  document.querySelectorAll(".dot")[currentDot].classList.add("active");
  currentDot = (currentDot + 1) % 3;
}, 3000);

// Add subtle parallax effect to floating shapes
document.addEventListener("mousemove", (e) => {
  const shapes = document.querySelectorAll(".shape");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.5;
    const xPos = (x - 0.5) * speed * 20;
    const yPos = (y - 0.5) * speed * 20;
    shape.style.transform = translate(`${xPos}px, ${yPos}px`);
  });
});
