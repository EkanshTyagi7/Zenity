document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const ctaButtons = document.getElementById("cta-buttons");
  const accountBtnContainer = document.getElementById(
    "index-account-btn-container"
  );
  const accountBtn = document.getElementById("index-account-button");
  const accountDropdown = document.getElementById("index-account-dropdown");
  const dropdownItems = accountDropdown
    ? accountDropdown.querySelectorAll(".dropdown-item")
    : [];

  if (token) {
    if (ctaButtons) ctaButtons.style.display = "none";
    if (accountBtnContainer) accountBtnContainer.style.display = "flex";
  }

  if (accountBtn && accountDropdown) {
    accountBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      accountDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (
        !accountBtn.contains(e.target) &&
        !accountDropdown.contains(e.target)
      ) {
        accountDropdown.classList.remove("show");
      }
    });

    dropdownItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        switch (item.id) {
          case "index-my-profile":
            alert("My Profile feature coming soon!");
            break;
          case "index-account-settings":
            alert("Account Settings feature coming soon!");
            break;
          case "index-logout":
            localStorage.removeItem("token");
            window.location.href = "index.html";
            break;
        }
        accountDropdown.classList.remove("show");
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const getStartedBtn = document.querySelector(".hero .btn-solid");
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "signIn.html?redirect=dashboard.html";
      } else {
        window.location.href = "dashboard.html";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const footerCommunityBtn = document.querySelector(".footer .community-btn");
  if (footerCommunityBtn) {
    footerCommunityBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "signIn.html?redirect=dashboard.html";
      } else {
        window.location.href = "dashboard.html";
      }
    });
  }
});

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

document.querySelectorAll(".feature-card, .why-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});

const joinImage = document.querySelector(".join-image img");
const joinText = document.querySelector(".join-text");

if (joinImage && joinText) {
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

const fadeSection = document.querySelector(".fade-toggle");
const joinobserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fadeSection.classList.add("visible");
      } else {
        fadeSection.classList.remove("visible");
      }
    });
  },
  { threshold: 0.3 }
);
if (fadeSection) {
  joinobserver.observe(fadeSection);
}

document.addEventListener("DOMContentLoaded", () => {
  const communityBtn = document.querySelector(".glow-button");
  if (communityBtn) {
    communityBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "signIn.html?redirect=community.html";
      } else {
        window.location.href = "community.html";
      }
    });
  }
});
