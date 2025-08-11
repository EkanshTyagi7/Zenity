let activeXPNotifications = [];

function showXPNotification(message, isLevelUp = false) {
  const notification = document.createElement("div");
  notification.className = "xp-notification";

  const topPosition = 200 + activeXPNotifications.length * 80;

  notification.style.cssText = `
    position: fixed;
    top: ${topPosition}px;
    right: 20px;
    background: ${isLevelUp ? "#10b981" : "#3b82f6"};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-weight: 600;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    word-wrap: break-word;
  `;

  notification.textContent = message;

  if (!document.getElementById("xp-notification-styles")) {
    const style = document.createElement("style");
    style.id = "xp-notification-styles";
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

  activeXPNotifications.push(notification);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in";
    notification.style.transform = "translateX(100%)";
    notification.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
      const index = activeXPNotifications.indexOf(notification);
      if (index > -1) {
        activeXPNotifications.splice(index, 1);
      }
      repositionXPNotifications();
    }, 300);
  }, 3000);
}

function repositionXPNotifications() {
  activeXPNotifications.forEach((notification, index) => {
    const newTopPosition = 200 + index * 80;
    notification.style.top = `${newTopPosition}px`;
  });
}

window.showXPNotification = showXPNotification;
