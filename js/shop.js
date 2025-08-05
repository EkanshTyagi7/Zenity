// Game data
const gameData = {
  avatars: [
    {
      id: 1,
      name: "Zen Master",
      emoji: "🧘",
      cost: 500,
      unlocked: true,
      equipped: true,
    },
    {
      id: 2,
      name: "Warrior",
      emoji: "⚔",
      cost: 750,
      unlocked: false,
      equipped: false,
    },
    {
      id: 3,
      name: "Sage",
      emoji: "🔮",
      cost: 1000,
      unlocked: false,
      equipped: false,
    },
    {
      id: 4,
      name: "Guardian",
      emoji: "🛡",
      cost: 1250,
      unlocked: false,
      equipped: false,
    },
    {
      id: 5,
      name: "Mystic",
      emoji: "✨",
      cost: 1500,
      unlocked: false,
      equipped: false,
    },
    {
      id: 6,
      name: "Phoenix",
      emoji: "🔥",
      cost: 2000,
      unlocked: false,
      equipped: false,
    },
  ],
  pets: [
    {
      id: 1,
      name: "Calm Cat",
      emoji: "🐱",
      cost: 300,
      unlocked: true,
      equipped: true,
    },
    {
      id: 2,
      name: "Wise Owl",
      emoji: "🦉",
      cost: 450,
      unlocked: false,
      equipped: false,
    },
    {
      id: 3,
      name: "Peaceful Panda",
      emoji: "🐼",
      cost: 600,
      unlocked: false,
      equipped: false,
    },
    {
      id: 4,
      name: "Zen Dragon",
      emoji: "🐉",
      cost: 900,
      unlocked: false,
      equipped: false,
    },
    {
      id: 5,
      name: "Spirit Fox",
      emoji: "🦊",
      cost: 1200,
      unlocked: false,
      equipped: false,
    },
    {
      id: 6,
      name: "Aurora Wolf",
      emoji: "🐺",
      cost: 1800,
      unlocked: false,
      equipped: false,
    },
  ],
  themes: [
    {
      id: 1,
      name: "Ocean Breeze",
      emoji: "🌊",
      cost: 400,
      unlocked: true,
      equipped: true,
    },
    {
      id: 2,
      name: "Forest Calm",
      emoji: "🌲",
      cost: 650,
      unlocked: false,
      equipped: false,
    },
    {
      id: 3,
      name: "Mountain Peace",
      emoji: "🏔",
      cost: 800,
      unlocked: false,
      equipped: false,
    },
    {
      id: 4,
      name: "Desert Zen",
      emoji: "🏜",
      cost: 1100,
      unlocked: false,
      equipped: false,
    },
    {
      id: 5,
      name: "Space Serenity",
      emoji: "🌌",
      cost: 1400,
      unlocked: false,
      equipped: false,
    },
    {
      id: 6,
      name: "Aurora Dreams",
      emoji: "🌈",
      cost: 1700,
      unlocked: false,
      equipped: false,
    },
  ],
};

let currentSection = "pets";
let currentIndex = 0;
let userCoins = 1250;
let userStars = 1250;
 
// Add these right after your gameData constant
let authToken = localStorage.getItem('authToken');

// Add this new function (keep all your existing variables)
async function loadUserData() {
  if (!authToken) return;
  
  try {
    const response = await fetch('/api/shop', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      const data = await response.json();
      userCoins = data.coins;
      userStars = data.stars;
      
      // Update unlocked items
      data.unlockedItems.forEach(item => {
        const category = gameData[`${item.itemType}s`];
        const itemObj = category?.find(i => i.id === item.itemId);
        if (itemObj) itemObj.unlocked = true;
      });

      // Update equipped items
      if (data.equippedItems) {
        Object.entries(data.equippedItems).forEach(([type, id]) => {
          const category = gameData[`${type}s`];
          category?.forEach(item => {
            item.equipped = item.id === id;
          });
        });
      }
    }
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
}

function updateCurrencyDisplay() {
  document.getElementById("coins").textContent = userCoins;
  document.getElementById("stars").textContent = userStars;
}

// Initialize
 async function init() {
  createBackgroundParticles();
  // Set initial UI values for coins and stars
  //document.getElementById("coins").textContent = userCoins;
  //document.getElementById("stars").textContent = userStars;
   await loadUserData(); // Added this line
  updateCurrencyDisplay(); // Added this line
  renderCards();
  updateNavigation();
 }

// Create animated background particles
function createBackgroundParticles() {
  const container = document.querySelector(".background-particles");
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    container.appendChild(particle);
  }
}

// Attach switchSection to window so inline onclick works
window.switchSection = function(section) {
  currentSection = section;
  currentIndex = 0;

  // Update nav buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    if (btn.textContent.trim().toLowerCase() === section) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update title
  const titles = {
    avatars: "Avatars Collection",
    pets: "Pets Collection",
    themes: "Themes Collection",
  };
  document.getElementById("sectionTitle").textContent = titles[section];

  renderCards();
  updateNavigation();
}

// Render cards
function renderCards() {
  const wrapper = document.getElementById("cardsWrapper");
  const items = gameData[currentSection];

  wrapper.innerHTML = "";

  items.forEach((item, index) => {
    const card = document.createElement("div");
    // Remove 'equipped' class to prevent green badge
    card.className = `card${item.equipped ? "" : ""}`;

    let buttonHtml = "";
    if (item.unlocked) {
      if (item.equipped) {
        // Show Equipped on the equipped card
        buttonHtml = `<button class=\"unlock-btn\" disabled>Equipped</button>`;
      } else {
        // Show Equip button for unlocked but not equipped
        buttonHtml = `<button class=\"unlock-btn\" onclick=\"handleEquip(${item.id})\">Equip</button>`;
      }
    } else {
      // Show unlock button with coin or star image
      let imgSrc = 'img/dollar.png';
      let imgAlt = 'coin';
      if (currentSection === 'pets') {
        imgSrc = 'img/star.png';
        imgAlt = 'star';
      }
      buttonHtml = `<button class=\"unlock-btn\" onclick=\"handleUnlock(${item.id})\"><img src='${imgSrc}' alt='${imgAlt}' style='width:22px;height:22px;vertical-align:middle;margin-right:8px;'>${item.cost}</button>`;
    }

    card.innerHTML = `
      <div class=\"card-image\">${item.emoji}</div>
      <div class=\"card-title\">${item.name}</div>
      ${buttonHtml}
    `;
    wrapper.appendChild(card);
  });

  // Update transform
  updateCardsPosition();
}

// Attach handleUnlock to window so inline onclick works
/* window.handleUnlock = function(itemId) {
  const item = gameData[currentSection].find((i) => i.id === itemId);
  if (!item || item.unlocked) return;

  // Determine which currency to use
  let canBuy = false;
  if (currentSection === 'pets') {
    if (userStars >= item.cost) {
      userStars -= item.cost;
      canBuy = true;
      document.getElementById("stars").textContent = userStars;
    }
  } else {
    if (userCoins >= item.cost) {
      userCoins -= item.cost;
      canBuy = true;
      document.getElementById("coins").textContent = userCoins;
    }
  }

  if (canBuy) {
    item.unlocked = true;
    renderCards();
    showUnlockAnimation(item.name);
  } else {
    if (currentSection === 'pets') {
      showInsufficientStarsAnimation();
    } else {
      showInsufficientCoinsAnimation();
    }
  }
}


// Attach handleEquip to window so inline onclick works
window.handleEquip = function(itemId) {
  const items = gameData[currentSection];
  const toEquip = items.find((i) => i.id === itemId);
  if (!toEquip || !toEquip.unlocked) return;

  // Find the currently equipped item
  const currentlyEquipped = items.find((i) => i.equipped);
  if (currentlyEquipped) currentlyEquipped.equipped = false;

  // Equip selected
  toEquip.equipped = true;
  renderCards();
}
*/
// Replace your current window.handleUnlock with this:
window.handleUnlock = async function(itemId) {
  const item = gameData[currentSection].find(i => i.id === itemId);
  if (!item || item.unlocked) return;

  if (!authToken) {
    showLoginPrompt();
    return;
  }

  const currencyType = currentSection === 'pets' ? 'stars' : 'coins';
  const currentCurrency = currencyType === 'stars' ? userStars : userCoins;

  if (currentCurrency < item.cost) {
    showInsufficientCurrencyAnimation(currencyType);
    return;
  }

  try {
    const response = await fetch('/api/shop/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        itemId: itemId,
        itemType: currentSection.slice(0, -1), // "pets" -> "pet"
        cost: item.cost
      })
    });

    if (!response.ok) throw new Error('Purchase failed');
    
    const result = await response.json();
    userCoins = result.coins;
    userStars = result.stars;
    item.unlocked = true;

    updateCurrencyDisplay();
    renderCards();
    showUnlockAnimation(item.name);
  } catch (error) {
    console.error("Purchase error:", error);
    showErrorAnimation("Failed to save purchase");
  }
};

// Replace your current window.handleEquip with this:
window.handleEquip = async function(itemId) {
  if (!authToken) return;

  try {
    const response = await fetch('/api/shop/equip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        itemType: currentSection.slice(0, -1), // "pets" -> "pet"
        itemId: itemId
      })
    });

    if (response.ok) {
      gameData[currentSection].forEach(item => {
        item.equipped = item.id === itemId;
      });
      renderCards();
    }
  } catch (error) {
    console.error("Equip failed:", error);
  }
};
// Add these near your other animation functions
function showLoginPrompt() {
  const notification = document.createElement("div");
  notification.innerHTML = `
    <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                background:linear-gradient(135deg,#ff9a44,#ff6b6b);color:white;
                padding:20px 40px;border-radius:15px;font-weight:bold;z-index:1000;
                animation:shake 0.6s ease-in-out;box-shadow:0 10px 30px rgba(0,0,0,0.3)">
      Please <a href="/login" style="color:white;text-decoration:underline">login</a> to save progress!
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function showErrorAnimation(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    background:linear-gradient(135deg,#ff6b6b,#ff8e8e);color:white;
    padding:20px 40px;border-radius:15px;font-weight:bold;z-index:1000;
    animation:shake 0.6s ease-in-out;box-shadow:0 10px 30px rgba(0,0,0,0.3)
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 1500);
}

function showInsufficientCurrencyAnimation(currencyType) {
  const message = currencyType === 'stars' 
    ? "⭐ Insufficient Stars!" 
    : "💰 Insufficient Coins!";
  showErrorAnimation(message);
}

// Show unlock animation
function showUnlockAnimation(itemName) {
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #4ecdc4, #44a08d);
                color: white;
                padding: 20px 40px;
                border-radius: 15px;
                font-weight: bold;
                font-size: 18px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                animation: unlockPop 2s ease-out forwards;
            `;
  notification.textContent = `🎉 ${itemName} Unlocked!`;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 2000);
}

// Show insufficient coins animation
function showInsufficientCoinsAnimation() {
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
                color: white;
                padding: 20px 40px;
                border-radius: 15px;
                font-weight: bold;
                font-size: 18px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                animation: shake 0.6s ease-in-out;
            `;
  notification.textContent = "💰 Insufficient Coins!";
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 1500);
}

// Show insufficient stars animation
function showInsufficientStarsAnimation() {
  const notification = document.createElement("div");
  notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
                color: white;
                padding: 20px 40px;
                border-radius: 15px;
                font-weight: bold;
                font-size: 18px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                animation: shake 0.6s ease-in-out;
            `;
  notification.textContent = "⭐ Insufficient Stars!";
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 1500);
}

// Slide cards
function slideCards(direction) {
  const items = gameData[currentSection];
  const maxIndex = Math.max(0, items.length - 3);

  currentIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction));
  updateCardsPosition();
  updateNavigation();
}

// Update cards position
function updateCardsPosition() {
  const wrapper = document.getElementById("cardsWrapper");
  // Card width + gap (min-width in CSS + gap)
  let cardWidth = 320 + 20; // 320px card + 20px gap
  // Responsive: match CSS
  if (window.innerWidth <= 1100 && window.innerWidth > 768) {
    cardWidth = 250 + 20;
  } else if (window.innerWidth <= 768) {
    cardWidth = 180 + 20;
  }
  wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Update navigation arrows
function updateNavigation() {
  const items = gameData[currentSection];
  const prevBtn = document.querySelector(".nav-arrow.prev");
  const nextBtn = document.querySelector(".nav-arrow.next");

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= items.length - 3;
}

// Touch/swipe support
let startX = 0;
let isDragging = false;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
});

document.addEventListener("touchend", (e) => {
  if (!isDragging) return;

  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      slideCards(1); // Swipe left - next
    } else {
      slideCards(-1); // Swipe right - prev
    }
  }

  isDragging = false;
});

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
            @keyframes unlockPop {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
            
            @keyframes shake {
                0%, 100% { transform: translate(-50%, -50%) translateX(0); }
                25% { transform: translate(-50%, -50%) translateX(-10px); }
                75% { transform: translate(-50%, -50%) translateX(10px); }
            }
        `;
document.head.appendChild(style);

// Initialize the app
init();
