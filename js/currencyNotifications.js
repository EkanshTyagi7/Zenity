let activeNotifications = [];

function showCurrencyNotification(message, type = "coins") {
  const notification = document.createElement("div");
  notification.className = "currency-notification";

  let icon, backgroundColor;
  if (type === "stars") {
    icon = "⭐";
    backgroundColor = "#fbbf24";
  } else if (type === "deduction") {
    icon = "⚠️";
    backgroundColor = "#ef4444";
  } else {
    icon = "💰";
    backgroundColor = "#f59e0b";
  }

  const topPosition = 20 + activeNotifications.length * 80;

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

  if (!document.querySelector("#currency-notification-styles")) {
    const style = document.createElement("style");
    style.id = "currency-notification-styles";
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

  activeNotifications.push(notification);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in";
    notification.style.transform = "translateX(100%)";
    notification.style.opacity = "0";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
      const index = activeNotifications.indexOf(notification);
      if (index > -1) {
        activeNotifications.splice(index, 1);
      }
      repositionNotifications();
    }, 300);
  }, 3000);
}

function repositionNotifications() {
  activeNotifications.forEach((notification, index) => {
    const newTopPosition = 20 + index * 80;
    notification.style.top = `${newTopPosition}px`;
  });
}

function showCombinedCurrencyNotification(coinsAwarded, starsAwarded) {
  let message = "";
  if (coinsAwarded > 0 && starsAwarded > 0) {
    message = `+${coinsAwarded} Coins & +${starsAwarded} Stars earned!`;
  } else if (coinsAwarded > 0) {
    message = `+${coinsAwarded} Coins earned!`;
  } else if (starsAwarded > 0) {
    message = `+${starsAwarded} Stars earned!`;
  }

  if (message) {
    showCurrencyNotification(message, "combined");
  }
}

window.showCurrencyNotification = showCurrencyNotification;
window.showCombinedCurrencyNotification = showCombinedCurrencyNotification;
