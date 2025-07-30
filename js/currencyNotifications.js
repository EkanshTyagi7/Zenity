// Currency Notifications - Similar to XP notifications
let activeNotifications = [];

function showCurrencyNotification(message, type = 'coins') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'currency-notification';
  
  // Set icon and color based on type
  let icon, backgroundColor;
  if (type === 'stars') {
    icon = '⭐';
    backgroundColor = '#fbbf24';
  } else if (type === 'deduction') {
    icon = '⚠️';
    backgroundColor = '#ef4444'; // Red for deductions
  } else {
    icon = '💰';
    backgroundColor = '#f59e0b';
  }
  
  // Calculate position based on number of active notifications
  // Start from 20px to avoid conflicts with XP notifications
  const topPosition = 20 + (activeNotifications.length * 80);
  
  notification.style.cssText = `
    position: fixed;
    top: ${topPosition}px;
    right: 20px;
    background: ${backgroundColor};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-weight: 600;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  notification.innerHTML = `${icon} ${message}`;
  
  // Add animation styles if not already present
  if (!document.querySelector('#currency-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'currency-notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to active notifications array
  activeNotifications.push(notification);
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
      // Remove from active notifications array
      const index = activeNotifications.indexOf(notification);
      if (index > -1) {
        activeNotifications.splice(index, 1);
      }
      // Reposition remaining notifications
      repositionNotifications();
    }, 300);
  }, 3000);
}

// Function to reposition remaining notifications
function repositionNotifications() {
  activeNotifications.forEach((notification, index) => {
    const newTopPosition = 20 + (index * 80);
    notification.style.top = `${newTopPosition}px`;
  });
}

// Function to show combined currency notification
function showCombinedCurrencyNotification(coinsAwarded, starsAwarded) {
  let message = '';
  if (coinsAwarded > 0 && starsAwarded > 0) {
    message = `+${coinsAwarded} Coins & +${starsAwarded} Stars earned!`;
  } else if (coinsAwarded > 0) {
    message = `+${coinsAwarded} Coins earned!`;
  } else if (starsAwarded > 0) {
    message = `+${starsAwarded} Stars earned!`;
  }
  
  if (message) {
    showCurrencyNotification(message, 'combined');
  }
}

// Make functions available globally
window.showCurrencyNotification = showCurrencyNotification;
window.showCombinedCurrencyNotification = showCombinedCurrencyNotification; 