let habits = [];
let currentEditingIndex = -1;
let currentEditingId = null;

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  updateCurrentDate();
  displayDailyQuote();
  loadHabits();
});

function updateCurrentDate() {
  const now = new Date();
  const options = { month: "short", day: "numeric", year: "numeric" };
  document.getElementById("currentDate").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
}

async function displayDailyQuote() {
  try {
    const res = await fetch("http://localhost:8001/api/quote");
    if (!res.ok) throw new Error("Failed to fetch quote");
    const quote = await res.json();
    document.getElementById("quoteText").textContent = `"${quote.text}"`;
    document.getElementById("quoteAuthor").textContent = `- ${quote.author}`;
  } catch (err) {
    console.error("Error fetching quote:", err);
    document.getElementById("quoteText").textContent =
      '"Start your day with a good habit!"';
    document.getElementById("quoteAuthor").textContent = "- Zenity";
  }
}


function openAddHabit() {
  currentEditingIndex = -1;
  currentEditingId = null;
  document.getElementById("lightboxTitle").textContent = "Add New Habit";
  document.getElementById("habitName").value = "";
  document.getElementById("habitDays").value = "";
  document.getElementById("lightbox").style.display = "flex";
}

function editHabit(index) {
  currentEditingIndex = index;
  const habit = habits[index];
  currentEditingId = habit._id;
  document.getElementById("lightboxTitle").textContent = "Edit Habit";
  document.getElementById("habitName").value = habit.name;
  document.getElementById("habitDays").value = habit.totalDays;
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

async function saveHabit() {
  const name = document.getElementById("habitName").value.trim();
  const days = parseInt(document.getElementById("habitDays").value);

  if (!name || !days || days < 1) {
    alert("Please enter a valid habit name and number of days");
    return;
  }

  if (currentEditingIndex === -1) {
    // Add new habit
    try {
      const res = await fetch("http://localhost:8001/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          totalDays: days,
          startDate: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) throw new Error("Failed to add habit");
    } catch (err) {
      alert("Error adding habit");
    }
  } else {
    // Edit existing habit
    try {
      const res = await fetch(`http://localhost:8001/api/habits/${currentEditingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          totalDays: days,
        }),
      });
      if (!res.ok) throw new Error("Failed to update habit");
    } catch (err) {
      alert("Error updating habit");
    }
  }
  await loadHabits();
  closeLightbox();
}

function renderHabits() {
  const habitsList = document.getElementById("habitsList");
  habitsList.innerHTML = "";

  habits.forEach((habit, index) => {
    const completedCount = habit.completedDays.length;
    const habitCard = document.createElement("div");
    habitCard.className = "habit-card";
    habitCard.onclick = () => openHabitDetail(index);

    habitCard.innerHTML = `
                    <div class="habit-header">
                        <div class="habit-name">${habit.name}</div>
                        <button class="edit-btn" onclick="event.stopPropagation(); editHabit(${index})">Edit</button>
                    </div>
                    <div class="habit-progress">${completedCount}/${habit.totalDays} days</div>
                `;

    habitsList.appendChild(habitCard);
  });
}

function openHabitDetail(index) {
  const habit = habits[index];
  document.getElementById("detailHabitName").textContent = habit.name;
  document.getElementById(
    "detailHabitProgress"
  ).textContent = `${habit.completedDays.length}/${habit.totalDays}`;

  // Check if today is marked
  const today = new Date().toISOString().split("T")[0];
  const todayCheckBtn = document.getElementById("todayCheckBtn");
  todayCheckBtn.className = habit.completedDays.includes(today)
    ? "check-btn checked"
    : "check-btn";
  todayCheckBtn.onclick = () => toggleTodayCheck(index);

  renderCalendar(habit);

  document.getElementById("mainView").style.display = "none";
  document.getElementById("habitDetail").style.display = "block";
}

async function toggleTodayCheck(habitIndex = null) {
  if (habitIndex === null) return;
  const habit = habits[habitIndex];
  
  try {
    // Get user ID from token
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to update habits');
      return;
    }
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId;

    const res = await fetch(`http://localhost:8001/api/habits/${habit._id}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    });
    
    if (!res.ok) throw new Error("Failed to toggle day");
    
    const data = await res.json();
    
    // Show XP notification if XP was awarded or deducted
    if (data.xpChange !== 0) {
      const message = data.xpChange > 0 
        ? `+${data.xpChange} XP earned for completing habit!`
        : `${data.xpChange} XP deducted for unmarking habit.`;
      
      // Show notification if we're on dashboard page
      if (window.showXPNotification) {
        window.showXPNotification(message, data.leveledUp);
      } else {
        console.log(message);
      }
      
      // If user leveled up, show special notification
      if (data.leveledUp) {
        const levelUpMessage = `🎉 Congratulations! You reached Level ${data.newLevel}!`;
        if (window.showXPNotification) {
          window.showXPNotification(levelUpMessage, true);
        } else {
          console.log(levelUpMessage);
        }
      }
    }
    
    // Show currency notification if currency was awarded or deducted
    if (data.coinsAwarded !== 0 && data.starsAwarded !== 0) {
      if (data.wasCompleted) {
        // Habit was completed - show award notification
        const currencyMessage = `+${data.coinsAwarded} Coins & +${data.starsAwarded} Stars earned for completing habit!`;
        if (window.showCombinedCurrencyNotification) {
          window.showCombinedCurrencyNotification(data.coinsAwarded, data.starsAwarded);
        } else {
          console.log(currencyMessage);
        }
      } else {
        // Habit was unchecked - show deduction notification
        const currencyMessage = `${data.coinsAwarded} Coins & ${data.starsAwarded} Stars deducted for unchecking habit.`;
        if (window.showCurrencyNotification) {
          window.showCurrencyNotification(currencyMessage, 'deduction');
        } else {
          console.log(currencyMessage);
        }
      }
      
      // Update currency manager with new values
      if (window.currencyManager && data.remainingCoins !== undefined && data.remainingStars !== undefined) {
        window.currencyManager.coins = data.remainingCoins;
        window.currencyManager.stars = data.remainingStars;
        window.currencyManager.updateUI();
      }
    }
    
    await loadHabits();
    openHabitDetail(habitIndex);
  } catch (err) {
    alert("Error toggling day");
  }
}

function renderCalendar(habit) {
  const calendarGrid = document.getElementById("calendarGrid");
  calendarGrid.innerHTML = "";

  const startDate = new Date(habit.startDate);
  const today = new Date();

  for (let i = 0; i < habit.totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.textContent = i + 1;

    const dateString = currentDate.toISOString().split("T")[0];

    if (currentDate > today) {
      dayElement.classList.add("future");
    } else if (habit.completedDays.includes(dateString)) {
      dayElement.classList.add("completed");
    } else {
      dayElement.classList.add("missed");
    }

    calendarGrid.appendChild(dayElement);
  }
}

function backToMain() {
  document.getElementById("habitDetail").style.display = "none";
  document.getElementById("mainView").style.display = "block";
  renderHabits();
}

document.querySelector(".add-habit-btn").addEventListener("click", () => {
  openAddHabit();
});

document.querySelector(".back-btn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

document.querySelector(".back-to-main").addEventListener("click", () => {
  backToMain();
});

document.querySelector(".check-btn").addEventListener("click", () => {
  toggleTodayCheck();
});

document.querySelector(".btn-secondary").addEventListener("click", () => {
  closeLightbox();
});

document.querySelector(".btn-primary").addEventListener("click", () => {
  saveHabit();
});


async function loadHabits() {
  try {
    const res = await fetch("http://localhost:8001/api/habits");
    habits = await res.json();
    renderHabits();
  } catch (err) {
    console.error("Failed to load habits", err);
  }
}
