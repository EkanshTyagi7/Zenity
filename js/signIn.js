// Add interactive functionality
document.getElementById("signinForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const btn = e.target.querySelector(".btn-primary");
  const originalText = btn.textContent;

  btn.textContent = "Signing in...";
  btn.style.background = "linear-gradient(135deg, #a8e6cf, #c8a8e9)";

  setTimeout(() => {
    btn.textContent = "Welcome back! 🎉";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "linear-gradient(135deg, #ff9a8b, #ffd93d)";
    }, 2000);
  }, 1500);
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

document
  .getElementById("createAccount")
  .addEventListener("click", function (e) {
    e.preventDefault();
    alert("Redirecting to account creation... 🌟");
  });

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
