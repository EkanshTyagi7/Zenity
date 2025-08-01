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
  
  // Initialize account dropdown functionality
  initializeAccountDropdown();
  
  navButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (navLinks[i]) {
        window.location.href = navLinks[i];
      }
    });
  });

  // Mood options mapping (should match DailyLog.js)
  const moodOptions = [
    { value: 1, label: 'Very Low', emoji: '😢' },
    { value: 2, label: 'Low', emoji: '😕' },
    { value: 3, label: 'Below Average', emoji: '😐' },
    { value: 4, label: 'Average', emoji: '🙂' },
    { value: 5, label: 'Good', emoji: '😊' },
    { value: 6, label: 'Great', emoji: '😄' },
    { value: 7, label: 'Excellent', emoji: '😁' },
    { value: 8, label: 'Amazing', emoji: '🤩' },
    { value: 9, label: 'Euphoric', emoji: '😍' },
    { value: 10, label: 'Blissful', emoji: '🥰' }
  ];

  // Load the user's latest mood emoji for the dashboard
  async function loadUserEmoji() {
    const container = document.getElementById('emoji-3d-container');
    if (!container) return;
    container.innerHTML = '';
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:8001/api/log/latest', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.log && typeof data.log.mood === 'number') {
        const moodObj = moodOptions.find(m => m.value === data.log.mood);
        if (moodObj) {
          container.innerHTML = `<span class="emoji-3d" title="${moodObj.label}">${moodObj.emoji}</span>`;
        }
      }
      // If no log or mood, leave empty
    } catch (err) {
      // On error, leave empty
      container.innerHTML = '';
    }
  }

  // Load the currently equipped pet and display in pets-3d-container
  function loadEquippedPet() {
    const petsContainer = document.getElementById('pets-3d-container');
    if (!petsContainer) return;
    petsContainer.innerHTML = '';
    // Try to get equipped pet from localStorage (set by shop.js)
    let equippedPet = null;
    try {
      const petsData = JSON.parse(localStorage.getItem('shopPets'));
      if (Array.isArray(petsData)) {
        equippedPet = petsData.find(p => p.equipped);
      }
    } catch (e) {}
    // Fallback: default to Calm Cat if nothing found
    if (!equippedPet) {
      equippedPet = { emoji: '🐱', name: 'Calm Cat' };
    }
    petsContainer.innerHTML = `<span class="pets-3d" title="${equippedPet.name}">${equippedPet.emoji}</span>`;
  }

  // Load and display user currency (coins and stars)
  async function loadUserCurrency() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8001/api/auth/currency', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update stars display
          const starsElement = document.querySelector('.icon-item span');
          if (starsElement) {
            starsElement.textContent = data.stars;
          }
          
          // Update coins display
          const coinsElement = document.querySelectorAll('.icon-item span')[1];
          if (coinsElement) {
            coinsElement.textContent = data.coins;
          }
        }
      }
    } catch (err) {
      console.error('Error loading currency:', err);
    }
  }

  // Load and display user streaks
  async function loadUserStreaks() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Get user ID from token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId;

      const response = await fetch(`http://localhost:8001/api/log/streaks/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const currentStreak = data.currentStreak || 0;
        const highestStreak = data.highestStreak || 0;

        // Update the streak display in the dashboard
        const streakValues = document.querySelector('.streak-texts .values');
        if (streakValues) {
          streakValues.innerHTML = `Current: <strong>${currentStreak}</strong> | Highest: <strong>${highestStreak}</strong>`;
        }
      }
    } catch (err) {
      console.error('Error loading streaks:', err);
    }
  }

  // Load and display user level and XP
  async function loadUserLevelXP() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8001/api/auth/level', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) return;

      const data = await response.json();
      if (data.success) {
        // Update Level
        const levelElement = document.querySelector('.xp-level-text');
        if (levelElement) {
          levelElement.innerHTML = `Level <strong>${data.level}</strong>`;
        }
        
        // Update XP
        const xpElement = document.querySelector('.xp-value');
        if (xpElement) {
          xpElement.textContent = `XP: ${data.xp}/${data.nextLevelXP}`;
        }
        
        // Update XP Bar
        const xpBar = document.querySelector('.xp-bar');
        if (xpBar) {
          const percent = data.nextLevelXP > 0 ? (data.xp / data.nextLevelXP) * 100 : 100;
          xpBar.style.width = `${percent}%`;
        }
      }
    } catch (err) {
      console.error('Error loading level/XP:', err);
    }
  }

  loadUserEmoji();
  loadEquippedPet();
  loadUserCurrency(); // Add this line to load currency
  loadUserStreaks();
  loadUserLevelXP(); // Call the new function here
  
  // Initialize currency display
  if (window.currencyManager) {
    window.currencyManager.initialize();
  }
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

// Function to initialize account dropdown
function initializeAccountDropdown() {
  const accountButton = document.getElementById('account-button');
  const accountDropdown = document.getElementById('account-dropdown');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  // Toggle dropdown on account button click
  accountButton.addEventListener('click', (e) => {
    e.stopPropagation();
    accountDropdown.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!accountButton.contains(e.target) && !accountDropdown.contains(e.target)) {
      accountDropdown.classList.remove('show');
    }
  });

  // Handle dropdown item clicks
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = item.id;
      
      switch(itemId) {
        case 'my-profile':
          handleMyProfile();
          break;
        case 'account-settings':
          handleAccountSettings();
          break;
        case 'logout':
          handleLogout();
          break;
      }
      
      // Close dropdown after item click
      accountDropdown.classList.remove('show');
    });
  });
}

// Handle My Profile click
function handleMyProfile() {
  console.log('My Profile clicked');
  // TODO: Navigate to profile page or show profile modal
  alert('My Profile feature coming soon!');
}

// Handle Account Settings click
function handleAccountSettings() {
  console.log('Account Settings clicked');
  // TODO: Navigate to account settings page or show settings modal
  alert('Account Settings feature coming soon!');
}

// Handle Logout click
function handleLogout() {
  console.log('Logout clicked');
  
  // Clear local storage
  localStorage.removeItem('token');
  
  // Show logout message
  // alert('Logged out successfully!');
  
  // Redirect to login page
  window.location.href = 'index.html';
}

// Function to show XP notifications (available globally)
function showXPNotification(message, isLevelUp = false) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'xp-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isLevelUp ? '#10b981' : '#3b82f6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-weight: 600;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.textContent = message;
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Make notification function available globally immediately
window.showXPNotification = showXPNotification;
