let habits = [];
let currentEditingIndex = -1;

//quotes
const quotes = [
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "A habit cannot be tossed out the window; it must be coaxed down the stairs a step at a time.",
    author: "Mark Twain",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "Chains of habit are too light to be felt until they are too heavy to be broken.",
    author: "Warren Buffett",
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt",
  },
  {
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki",
  },
];

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  updateCurrentDate();
  displayDailyQuote();
  loadHabits();
  renderHabits();
});

function updateCurrentDate() {
  const now = new Date();
  const options = { month: "short", day: "numeric", year: "numeric" };
  document.getElementById("currentDate").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
}

function displayDailyQuote() {
  const today = new Date().getDate();
  const quote = quotes[today % quotes.length];
  document.getElementById("quoteText").textContent = `"${quote.text}"`;
  document.getElementById("quoteAuthor").textContent = `- ${quote.author}`;
}

function openAddHabit() {
  currentEditingIndex = -1;
  document.getElementById("lightboxTitle").textContent = "Add New Habit";
  document.getElementById("habitName").value = "";
  document.getElementById("habitDays").value = "";
  document.getElementById("lightbox").style.display = "flex";
}

function editHabit(index) {
  currentEditingIndex = index;
  const habit = habits[index];
  document.getElementById("lightboxTitle").textContent = "Edit Habit";
  document.getElementById("habitName").value = habit.name;
  document.getElementById("habitDays").value = habit.totalDays;
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function saveHabit() {
  const name = document.getElementById("habitName").value.trim();
  const days = parseInt(document.getElementById("habitDays").value);

  if (!name || !days || days < 1) {
    alert("Please enter a valid habit name and number of days");
    return;
  }

  if (currentEditingIndex === -1) {
    // Add new habit
    const newHabit = {
      name: name,
      totalDays: days,
      completedDays: [],
      startDate: new Date().toISOString().split("T")[0],
    };
    habits.push(newHabit);
  } else {
    // Edit existing habit
    habits[currentEditingIndex].name = name;
    habits[currentEditingIndex].totalDays = days;
  }

  saveHabits();
  renderHabits();
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

function toggleTodayCheck(habitIndex = null) {
  if (habitIndex === null) return;

  const habit = habits[habitIndex];
  const today = new Date().toISOString().split("T")[0];
  const todayIndex = habit.completedDays.indexOf(today);

  if (todayIndex > -1) {
    habit.completedDays.splice(todayIndex, 1);
  } else {
    habit.completedDays.push(today);
  }

  saveHabits();
  openHabitDetail(habitIndex);
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

function saveHabits() {
  // In a real app, this would save to a database
  // For now, we'll use localStorage simulation
  console.log("Habits saved:", habits);
}

function loadHabits() {
  // In a real app, this would load from a database
  // For demo purposes, we'll start with empty habits
  habits = [];
}
