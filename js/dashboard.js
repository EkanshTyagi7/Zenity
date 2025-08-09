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
  initializeSleepChartCard();
  // Listen for log save events from other pages (via localStorage)
  window.addEventListener('storage', (e) => {
    if (e.key === 'lastLogSavedAt' || e.key === 'lastSleepData') {
      initializeSleepChartCard();
      initializeMentalChartCard();
    }
  });
  initializeMentalChartCard();
  initializeReadSection();
  initializeStreakCalendar();
  initializeMoodHistory();
  
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

// Sleep chart logic
let sleepChart = null;

function initializeSleepChartCard() {
  const canvas = document.getElementById('sleep-chart-canvas');
  const emptyState = document.getElementById('sleep-empty-state');
  const dateLabel = document.getElementById('sleep-date-label');
  if (!canvas || !emptyState) return;

  // Fetch latest log for the user
  (async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        emptyState.style.display = 'block';
        return;
      }
      const res = await fetch('http://localhost:8001/api/log/latest', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success || !data.log || !data.log.sleep) {
        showEmptySleepChart(emptyState, canvas);
        return;
      }
      const log = data.log;
      const hours = typeof log.sleep.hours === 'number' ? log.sleep.hours : null;
      const quality = typeof log.sleep.quality === 'number' ? log.sleep.quality : null;

      if (dateLabel && log.date) {
        const dateObj = new Date(log.date);
        if (!isNaN(dateObj.getTime())) {
          dateLabel.textContent = dateObj.toLocaleDateString();
        } else {
          dateLabel.textContent = log.date;
        }
      }

      if (hours == null && quality == null) {
        showEmptySleepChart(emptyState, canvas);
        return;
      }
      emptyState.style.display = 'none';
      canvas.style.display = 'block';
      renderSleepChart(canvas, hours ?? 0, quality ?? 0);
    } catch (e) {
      showEmptySleepChart(emptyState, canvas);
    }
  })();
}

function showEmptySleepChart(emptyState, canvas) {
  if (sleepChart) {
    sleepChart.destroy();
    sleepChart = null;
  }
  if (canvas) canvas.style.display = 'none';
  if (emptyState) emptyState.style.display = 'block';
}

function renderSleepChart(canvas, hours, quality) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (sleepChart) sleepChart.destroy();

  const qualityLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const qualityIndex = Math.min(Math.max(quality - 1, 0), 4);
  const qualityDisplay = qualityLabels[qualityIndex] || 'Unknown';

  sleepChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Hours Slept', 'Quality'],
      datasets: [{
        label: 'Sleep',
        data: [hours, quality],
        backgroundColor: ['#7c6ae6', '#a584ff'],
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.dataIndex === 0) return `${ctx.dataset.label}: ${hours}h`;
              if (ctx.dataIndex === 1) return `Quality: ${qualityDisplay} (${quality}/5)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (val) => val,
          },
          suggestedMax: Math.max(10, (hours || 0) + 2)
        }
      }
    }
  });
}

// Expose a small hook to refresh the sleep chart after saving a log, if needed
window.refreshSleepChart = initializeSleepChartCard;

// Mental metrics chart logic (radar)
let mentalChart = null;

function initializeMentalChartCard() {
  const canvas = document.getElementById('mental-chart-canvas');
  const empty = document.getElementById('mental-empty-state');
  const dateLabel = document.getElementById('mental-date-label');
  if (!canvas || !empty) return;

  (async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { empty.style.display = 'block'; return; }
      const res = await fetch('http://localhost:8001/api/log/latest', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success || !data.log) { showEmptyMental(canvas, empty); return; }
      const log = data.log;
      if (dateLabel && log.date) {
        const d = new Date(log.date);
        dateLabel.textContent = isNaN(d.getTime()) ? log.date : d.toLocaleDateString();
      }
      const anxiety = typeof log.anxiety === 'number' ? log.anxiety : null;
      const stress = typeof log.stress === 'number' ? log.stress : null;
      const energy = typeof log.energy === 'number' ? log.energy : null;
      if (anxiety == null && stress == null && energy == null) {
        showEmptyMental(canvas, empty); return;
      }
      empty.style.display = 'none';
      canvas.style.display = 'block';
      renderMentalChart(canvas, anxiety ?? 0, stress ?? 0, energy ?? 0);
    } catch (e) {
      showEmptyMental(canvas, empty);
    }
  })();
}

function showEmptyMental(canvas, empty) {
  if (mentalChart) { mentalChart.destroy(); mentalChart = null; }
  if (canvas) canvas.style.display = 'none';
  if (empty) empty.style.display = 'block';
}

function renderMentalChart(canvas, anxiety, stress, energy) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (mentalChart) mentalChart.destroy();

  mentalChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Anxiety', 'Stress', 'Energy'],
      datasets: [{
        label: 'Level (1-5)',
        data: [anxiety, stress, energy],
        backgroundColor: 'rgba(133, 152, 235, 0.28)',
        borderColor: '#8d71eb',
        pointBackgroundColor: '#8d71eb',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#8d71eb',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 5,
          ticks: { stepSize: 1 },
          grid: { color: 'rgba(141,113,235,0.18)' },
          angleLines: { color: 'rgba(141,113,235,0.18)' }
        }
      }
    }
  });
}

// Read section: 3 daily picks refreshed once per day
function initializeReadSection() {
  const list = document.getElementById('read-list');
  if (!list) return;
  try {
    const todayKey = new Date().toISOString().split('T')[0];
    const cacheKey = `readPicks:${todayKey}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      renderRead(JSON.parse(cached));
      return;
    }
  } catch(_) {}

  // Static pool of wellness article ideas; could be replaced with API later
  const pool = [
    { title: '5-Minute Breathing Reset', source: 'Zenity Guides' },
    { title: 'Sleep Hygiene: Small Habits, Big Impact', source: 'Zenity Guides' },
    { title: 'Journaling Prompts for Clarity', source: 'Zenity Guides' },
    { title: 'Gentle Stretch Routine for Desk Days', source: 'Zenity Guides' },
    { title: 'Beat Afternoon Slump with Light Walks', source: 'Zenity Guides' },
    { title: 'Mindful Phone Use: 3 Micro-Rules', source: 'Zenity Guides' },
    { title: 'Hydration and Mood: What Science Says', source: 'Zenity Guides' }
  ];
  // Deterministic daily selection based on date
  const seed = new Date().getDate();
  const picks = [];
  for (let i = 0; i < 3; i++) {
    const idx = (seed + i * 3) % pool.length;
    picks.push(pool[idx]);
  }
  try {
    const todayKey = new Date().toISOString().split('T')[0];
    localStorage.setItem(`readPicks:${todayKey}`, JSON.stringify(picks));
  } catch(_) {}
  renderRead(picks);
}

function renderRead(picks) {
  const list = document.getElementById('read-list');
  if (!list) return;
  list.innerHTML = '';
  picks.forEach((p, i) => {
    const li = document.createElement('li');
    li.className = 'read-item';
    li.innerHTML = `
      <div class="read-thumb" style="background: ${['#c8b8ff','#b7a8f7','#8d71eb'][i%3]}"></div>
      <div class="read-meta">
        <div class="read-title-text" data-index="${i}">${p.title}</div>
        <div class="read-source">${p.source}</div>
      </div>`;
    list.appendChild(li);
  });

  // Attach click to open modal with content
  list.querySelectorAll('.read-title-text').forEach(el => {
    el.addEventListener('click', () => {
      const i = Number(el.getAttribute('data-index'));
      openReadModal(picks[i]);
    });
  });
}

function openReadModal(pick) {
  const modal = document.getElementById('read-modal');
  const title = document.getElementById('read-modal-title');
  const source = document.getElementById('read-modal-source');
  const body = document.getElementById('read-modal-body');
  const closeBtn = document.getElementById('read-modal-close');
  const backdrop = document.getElementById('read-modal-backdrop');
  if (!modal) return;

  title.textContent = pick.title;
  source.textContent = pick.source;
  body.innerHTML = getArticleHtml(pick.title);
  modal.hidden = false;
  const close = () => { modal.hidden = true; };
  closeBtn.onclick = close;
  backdrop.onclick = close;
}

function getArticleHtml(title) {
  const paragraphs = {
    '5-Minute Breathing Reset': [
      'Find a comfortable seat. Close your eyes or soften your gaze.',
      'Inhale through the nose for 4 seconds, hold for 2, exhale for 6. Repeat for five cycles.',
      'Notice the sensation in your chest and shoulders. Release tension with each exhale.'
    ],
    'Sleep Hygiene: Small Habits, Big Impact': [
      'Aim for a consistent sleep-wake time, even on weekends.',
      'Reduce screens 60 minutes before bed. Try a warm light or a short page of reading.',
      'Keep your room cool and dark. A small wind-down routine signals your brain to sleep.'
    ],
    'Journaling Prompts for Clarity': [
      '1) What do I need right now? 2) What can I let go of? 3) What would make tomorrow 1% better?',
      'Write freely for five minutes. Don’t edit. Let thoughts flow onto the page.',
      'Close by writing one gentle intention for tomorrow.'
    ],
    'Mindful Phone Use: 3 Micro-Rules': [
      'Move distracting apps off your home screen or use Focus modes.',
      'Create a charging station outside the bedroom.',
      'Before unlocking your phone, ask: Why now? What for? What else could I do instead?'
    ],
    'Gentle Stretch Routine for Desk Days': [
      'Neck rolls, shoulder circles, and hip openers—one minute each.',
      'Stand every 30–45 minutes. Shake out your hands and take 3 slow breaths.',
      'Finish with a forward fold and calf stretch to re-energize.'
    ],
    'Beat Afternoon Slump with Light Walks': [
      'A 10-minute outdoor walk improves alertness and mood.',
      'Pair with sunshine and water for a triple boost.',
      'Schedule it on your calendar to make it a non-negotiable micro-habit.'
    ],
    'Hydration and Mood: What Science Says': [
      'Mild dehydration can reduce concentration and elevate fatigue.',
      'Aim for steady sips across the day; keep a bottle within reach.',
      'Add a pinch of electrolytes during workouts or hot days.'
    ],
  };
  const content = paragraphs[title] || ['Short article coming soon.'];
  return content.map(p => `<p>${p}</p>`).join('');
}

// Streak calendar: mark which days this month have a log
async function initializeStreakCalendar() {
  const grid = document.getElementById('calendar-grid');
  const monthLabel = document.getElementById('streak-month-label');
  if (!grid || !monthLabel) return;
  grid.innerHTML = '';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  monthLabel.textContent = monthName;

  // Build grid placeholders from weekday index of first day
  const startWeekday = firstDay.getDay(); // 0=Sun
  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day';
    empty.style.visibility = 'hidden';
    grid.appendChild(empty);
  }

  // Fetch latest log dates for the month (naive: query each day using existing endpoint)
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    try { userId = JSON.parse(atob(token.split('.')[1])).userId; } catch(_) {}
  }

  const dayHasLog = new Set();
  if (userId) {
    // sequential fetch per day (month length <= 31) using /api/log/get?userId&date
    const promises = [];
    const formatLocalDate = (dt) => {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = formatLocalDate(new Date(year, month, d));
      promises.push(
        fetch(`http://localhost:8001/api/log/get?userId=${userId}&date=${dateStr}`)
          .then(r => r.json())
          .then(data => { if (data && data._id) dayHasLog.add(d); })
          .catch(() => {})
      );
    }
    await Promise.all(promises);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const div = document.createElement('div');
    div.className = 'cal-day' + (dayHasLog.has(d) ? ' logged' : '');
    if (d === now.getDate()) div.classList.add('today');
    grid.appendChild(div);
  }
}

// Mood history: 7–14 days line with emoji markers
async function initializeMoodHistory() {
  const canvas = document.getElementById('mood-history-canvas');
  const empty = document.getElementById('mood-empty-state');
  const label = document.getElementById('mood-range-label');
  if (!canvas || !label) return;
  const ctx = canvas.getContext('2d');

  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    try { userId = JSON.parse(atob(token.split('.')[1])).userId; } catch(_) {}
  }

  const logs = [];
  const days = 10; // gather last 10 days
  const formatLocalDate = (dt) => {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatLocalDate(d);
    if (userId) {
      try {
        // reuse existing endpoint by date
        const res = await fetch(`http://localhost:8001/api/log/get?userId=${userId}&date=${dateStr}`);
        const data = await res.json();
        if (data && data._id && typeof data.mood === 'number') {
          logs.push({ date: dateStr, mood: data.mood });
        } else {
          logs.push({ date: dateStr, mood: null });
        }
      } catch { logs.push({ date: dateStr, mood: null }); }
    } else {
      logs.push({ date: dateStr, mood: null });
    }
  }

  const labels = logs.map(l => new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  const values = logs.map(l => l.mood ?? null);
  if (values.every(v => v == null)) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  label.textContent = `${labels[0]} - ${labels[labels.length-1]}`;

  // Convert emojis by mood (1..10) to array for tooltip markers
  const moodEmojis = ['😢','😕','😐','🙂','😊','😄','😁','🤩','😍','🥰'];

  // Draw line chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: '#8d71eb',
        backgroundColor: 'rgba(141,113,235,0.2)',
        pointRadius: 4,
        pointBackgroundColor: '#8d71eb',
        spanGaps: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed.y;
              if (v == null) return 'No mood logged';
              const idx = Math.min(Math.max(Math.round(v) - 1, 0), 9);
              return `${moodEmojis[idx]} Mood: ${v}`;
            }
          }
        }
      },
      scales: {
        y: { suggestedMin: 1, suggestedMax: 10, ticks: { stepSize: 1 } }
      }
    }
  });
}
