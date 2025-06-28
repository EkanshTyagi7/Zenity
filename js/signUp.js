// Form submission with loading state
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const submitBtn = this.querySelector(".btn-primary");
  submitBtn.classList.add("loading");
  submitBtn.textContent = "Creating your account...";

  // Simulate API call
  setTimeout(() => {
    submitBtn.classList.remove("loading");
    submitBtn.textContent = "Welcome to Zenity! 🎉";
    submitBtn.style.background = "linear-gradient(135deg, #a8e6cf, #ffd93d)";
  }, 2000);
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
