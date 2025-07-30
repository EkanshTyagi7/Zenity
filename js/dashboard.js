document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-menu button");
  const navLinks = [
    "DailyLog.html",
    "HabitTracker.html",
    "Achievements.html",
    "shop.html",
    "Rooms.html",
    "community.html",
  ];
  
  // Check authentication and update user greeting
  checkAuthAndUpdateGreeting();
  
  navButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (navLinks[i]) {
        window.location.href = navLinks[i];
      }
    });
  });
});

// Function to check authentication and update greeting
async function checkAuthAndUpdateGreeting() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login
      window.location.href = 'signIn.html';
      return;
    }

    // Verify token and get user info
    const response = await fetch('http://localhost:8001/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // If token is invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = 'signIn.html';
      return;
    }

    const data = await response.json();
    const userName = data.user.name;
    
    // Update the greeting with the user's name
    const greetingElement = document.getElementById('user-greeting');
    if (greetingElement) {
      greetingElement.textContent = `👋 Hello, ${userName}`;
    }
    
  } catch (error) {
    console.error('Auth check failed:', error);
    // On error, redirect to login
    window.location.href = 'signIn.html';
  }
}
