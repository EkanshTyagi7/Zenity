function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).userId;
  } catch (_) {
    return null;
  }
}

function isNewUserUnlocked() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  localStorage.setItem("hasSignedInOnce", "true");
  return localStorage.getItem("hasSignedInOnce") === "true";
}

async function fetchCurrentStreak() {
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken();
  if (!token || !userId) return 0;
  try {
    const res = await fetch(`http://localhost:8001/api/log/streaks/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return Number(data.currentStreak || 0);
  } catch (_) {
    return 0;
  }
}

async function fetchLevelXP() {
  const token = localStorage.getItem("token");
  if (!token) return { level: 1, xp: 0, nextLevelXP: 100 };
  try {
    const res = await fetch("http://localhost:8001/api/auth/level", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { level: 1, xp: 0, nextLevelXP: 100 };
    const data = await res.json();
    return {
      level: Number(data.level || 1),
      xp: Number(data.xp || 0),
      nextLevelXP: Number(data.nextLevelXP || 100),
    };
  } catch (_) {
    return { level: 1, xp: 0, nextLevelXP: 100 };
  }
}

const achievements = [
  {
    id: 1,
    name: "New User",
    description: "Complete your signup and join the community",
    icon: "⭐",
    condition: () => isNewUserUnlocked(),
    colors: ["#8b5cf6", "#ec4899"],
  },
  {
    id: 2,
    name: "5‑Day Streak",
    description: "Maintain a 5‑day streak in Daily Log",
    icon: "🔥",
    condition: async () => (await fetchCurrentStreak()) >= 5,
    colors: ["#3b82f6", "#06b6d4"],
  },
];

const badges = [
  {
    id: "lvl1-complete",
    name: "Level 1 Complete",
    requirement: "Reach Level 2 (fill XP bar)",
    icon: "🏅",
    condition: async () => {
      const { level, xp, nextLevelXP } = await fetchLevelXP();
      return level >= 2 || (nextLevelXP > 0 && xp >= nextLevelXP);
    },
    colors: ["#ffd93d", "#ff9a8b"],
  },
];

function switchTab(tabName) {
  document
    .querySelectorAll(".tab-button")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
  document
    .querySelectorAll(".section")
    .forEach((sec) => sec.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");
}

async function renderAchievements() {
  const grid = document.getElementById("achievementsGrid");
  grid.innerHTML = "";
  for (const a of achievements) {
    const unlocked =
      typeof a.condition === "function" ? await a.condition() : false;
    const card = document.createElement("div");
    card.className = `achievement-card ${unlocked ? "unlocked" : "locked"}`;
    if (unlocked) {
      card.style.setProperty("--card-color-1", a.colors[0]);
      card.style.setProperty("--card-color-2", a.colors[1]);
    }
    card.innerHTML = `
      <div class="achievement-icon">${a.icon}</div>
      <div class="achievement-name">${a.name}</div>
      <div class="achievement-description">${a.description}</div>
      <div class="achievement-status">
        <div class="status-dot ${unlocked ? "completed" : ""}"></div>
        <span>${unlocked ? "Completed" : "Locked"}</span>
      </div>`;
    grid.appendChild(card);
  }
}

async function renderBadges() {
  const grid = document.getElementById("badgesGrid");
  if (!grid) return;
  grid.innerHTML = "";
  for (const b of badges) {
    const unlocked =
      typeof b.condition === "function" ? await b.condition() : false;
    const card = document.createElement("div");
    card.className = `badge-card ${unlocked ? "unlocked" : "locked"}`;
    if (unlocked) {
      card.style.setProperty("--badge-color-1", b.colors[0]);
      card.style.setProperty("--badge-color-2", b.colors[1]);
    }
    card.innerHTML = `
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
      <div class="badge-requirement">${b.requirement}</div>
      <div class="achievement-status" style="justify-content:center;margin-top:10px">
        <div class="status-dot ${unlocked ? "completed" : ""}"></div>
        <span>${unlocked ? "Unlocked" : "Locked"}</span>
      </div>`;
    grid.appendChild(card);
  }
}

function showLevelUpNotification(level) {
  const note = document.createElement("div");
  note.style.cssText = `
        position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        background:linear-gradient(45deg,#8b5cf6,#ec4899);color:#fff;
        padding:20px 40px;border-radius:15px;font-size:1.2rem;font-weight:bold;
        z-index:1000;animation:levelUp 2s ease-out forwards;
        box-shadow:0 20px 60px rgba(139,92,246,.5)`;
  note.textContent = `🎉 Level Up! You're now Level ${level}!`;
  document.body.appendChild(note);
  const style = document.createElement("style");
  style.textContent = `@keyframes levelUp{
        0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}
        50%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}
        100%{opacity:0;transform:translate(-50%,-50%) scale(1)}
      }`;
  document.head.appendChild(style);
  setTimeout(() => {
    note.remove();
    style.remove();
  }, 2000);
}

function init() {
  renderAchievements();
  renderBadges();
}
init();
