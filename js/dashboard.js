document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-menu button");
  const navLinks = [
    "DailyLog.html",
    "HabitTracker.html",
    "Achievements.html",
    "shop.html",
    "Rooms.html",
    "Community.html",
  ];
  navButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (navLinks[i]) {
        window.location.href = navLinks[i];
      }
    });
  });

  // Fetch and update coins and stars
  const authToken = localStorage.getItem('token');
  if (authToken) {
    fetch('http://localhost:8001/api/shop', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
      .then(res => res.json())
      .then(data => {
        // Find the star and coin spans in the header
        const starSpan = document.querySelector('.icon-item img[alt="Stars"]').nextElementSibling;
        const coinSpan = document.querySelector('.icon-item img[alt="Coins"]').nextElementSibling;
        if (starSpan) starSpan.textContent = data.stars;
        if (coinSpan) coinSpan.textContent = data.coins;
      })
      .catch(err => console.error('Failed to fetch user shop data:', err));
  }
});
