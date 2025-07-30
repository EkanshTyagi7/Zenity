// Get userId from JWT in localStorage
function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        // Parse JWT (header.payload.signature)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    } catch (e) {
        return null;
    }
}

const userId = getUserIdFromToken();
const currentDate = new Date().toISOString().split('T')[0];
let todayLog = null;
const moodOptions = [
    { value: 1, label: 'Very Low', emoji: '😢', color: '#ef4444' },
    { value: 2, label: 'Low', emoji: '😕', color: '#f97316' },
    { value: 3, label: 'Below Average', emoji: '😐', color: '#eab308' },
    { value: 4, label: 'Average', emoji: '🙂', color: '#84cc16' },
    { value: 5, label: 'Good', emoji: '😊', color: '#22c55e' },
    { value: 6, label: 'Great', emoji: '😄', color: '#10b981' },
    { value: 7, label: 'Excellent', emoji: '😁', color: '#06b6d4' },
    { value: 8, label: 'Amazing', emoji: '🤩', color: '#3b82f6' },
    { value: 9, label: 'Euphoric', emoji: '😍', color: '#8b5cf6' },
    { value: 10, label: 'Blissful', emoji: '🥰', color: '#a855f7' }
];

const symptomOptions = [
    'Headache', 'Fatigue', 'Insomnia', 'Appetite Changes', 'Concentration Issues',
    'Irritability', 'Restlessness', 'Panic', 'Sadness', 'Hopelessness',
    'Racing Thoughts', 'Social Withdrawal', 'Physical Tension', 'Dizziness'
];

const activityOptions = [
    { name: 'Exercise', icon: 'dumbbell', color: '#ef4444' },
    { name: 'Meditation', icon: 'brain', color: '#8b5cf6' },
    { name: 'Reading', icon: 'book', color: '#06b6d4' },
    { name: 'Music', icon: 'music', color: '#f59e0b' },
    { name: 'Gaming', icon: 'gamepad-2', color: '#10b981' },
    { name: 'Art/Creative', icon: 'palette', color: '#ec4899' },
    { name: 'Photography', icon: 'camera', color: '#6366f1' },
    { name: 'Socializing', icon: 'users', color: '#84cc16' },
    { name: 'Work/Study', icon: 'target', color: '#64748b' },
    { name: 'Cooking', icon: 'utensils', color: '#f97316' },
    { name: 'Coffee/Tea', icon: 'coffee', color: '#92400e' },
    { name: 'Nature Walk', icon: 'activity', color: '#059669' }
];


function getDefaultLog() {
    return {
        userId,
        date: currentDate,
        mood: 5,
        anxiety: 3,
        stress: 3,
        energy: 3,
        sleep: { hours: 7, quality: 3 },
        symptoms: [],
        activities: [],
        gratitude: ['', '', ''],
        medications: [],
        notes: '',
        triggers: '',
        achievements: '',
        socialInteraction: 3,
        physicalActivity: 2,
        productivity: 3,
        mindfulness: 1
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Always start with a fresh log for the day
    todayLog = getDefaultLog();
    // Optionally, check if a log exists for today (to allow editing if already saved)
    fetch(`http://localhost:8001/api/log/get?userId=${userId}&date=${currentDate}`)
        .then(res => res.json())
        .then(data => {
            if (data && data._id) {
                // If a log exists for today, load it (allow editing)
                todayLog = data;
            }
            populateLogForm();
            lucide.createIcons();
            attachEventListeners();
        })
        .catch(err => {
            // If error, just show the fresh form
            populateLogForm();
            lucide.createIcons();
            attachEventListeners();
        });
});

function handleLogSubmit() {
    fetch('http://localhost:8001/api/log/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todayLog)
    })
    .then(res => res.json())
    .then(data => {
        // Update streaks on dashboard if we're on the dashboard page
        if (window.location.pathname.includes('dashboard.html')) {
            updateDashboardStreaks();
        }
        window.location.href = 'LogSubmit.html';
    })
    .catch(err => {
        console.error('Failed to save log:', err);
        alert('Error saving log. Try again.');
    });
}

// Function to update streaks on dashboard
async function updateDashboardStreaks() {
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
        console.error('Error updating streaks:', err);
    }
}


function toggleSymptom(symptom) {
    if (todayLog.symptoms.includes(symptom)) {
        todayLog.symptoms = todayLog.symptoms.filter(s => s !== symptom);
    } else {
        todayLog.symptoms.push(symptom);
    }
    populateLogForm();
}


function toggleActivity(activity) {
    if (todayLog.activities.includes(activity)) {
        todayLog.activities = todayLog.activities.filter(a => a !== activity);
    } else {
        todayLog.activities.push(activity);
    }
    populateLogForm();
}

function populateLogForm() {
    const formattedDate = new Date(currentDate).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('log-date').textContent = formattedDate;

    const moodOptionsDiv = document.getElementById('mood-options');
    moodOptionsDiv.innerHTML = '';
    moodOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'mood-option' + (todayLog.mood === option.value ? ' selected' : '');
        btn.innerHTML = `<div class="mood-emoji">${option.emoji}</div><div class="mood-label">${option.label}</div>`;
        btn.addEventListener('click', () => {
            todayLog.mood = option.value;
            populateLogForm();
        });
        moodOptionsDiv.appendChild(btn);
    });

    renderScale('anxiety-scale', 'Anxiety Level', 'alert-circle', todayLog.anxiety, 1, 5, ['Very Low', 'Very High'], val => { todayLog.anxiety = val; populateLogForm(); });
    renderScale('stress-scale', 'Stress Level', 'zap', todayLog.stress, 1, 5, ['Very Low', 'Very High'], val => { todayLog.stress = val; populateLogForm(); });
    renderScale('energy-scale', 'Energy Level', 'activity', todayLog.energy, 1, 5, ['Exhausted', 'Energetic'], val => { todayLog.energy = val; populateLogForm(); });
    renderScale('social-scale', 'Social Interaction', 'users', todayLog.socialInteraction, 1, 5, ['Isolated', 'Very Social'], val => { todayLog.socialInteraction = val; populateLogForm(); });
    renderScale('physical-scale', 'Physical Activity', 'dumbbell', todayLog.physicalActivity, 1, 5, ['Sedentary', 'Very Active'], val => { todayLog.physicalActivity = val; populateLogForm(); });
    renderScale('productivity-scale', 'Productivity', 'target', todayLog.productivity, 1, 5, ['Unproductive', 'Highly Productive'], val => { todayLog.productivity = val; populateLogForm(); });
    renderScale('mindfulness-scale', 'Mindfulness Practice', 'brain', todayLog.mindfulness, 1, 5, ['None', 'Extensive'], val => { todayLog.mindfulness = val; populateLogForm(); });

    document.getElementById('sleep-hours').value = todayLog.sleep.hours;
    document.getElementById('sleep-quality').value = todayLog.sleep.quality;

    updateSymptomsUI();
    updateActivitiesUI();

    const gratitudeDiv = document.getElementById('gratitude-list');
    gratitudeDiv.innerHTML = '';
    todayLog.gratitude.forEach((item, idx) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Gratitude ${idx + 1}...`;
        input.value = item;
        input.className = 'input-field';
        input.addEventListener('input', e => {
            todayLog.gratitude[idx] = e.target.value;
        });
        gratitudeDiv.appendChild(input);
    });

    document.getElementById('achievements').value = todayLog.achievements;
    document.getElementById('triggers').value = todayLog.triggers;
    document.getElementById('notes').value = todayLog.notes;

    lucide.createIcons();
}

function renderScale(containerId, title, icon, value, min, max, labels, onChange) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const scaleDiv = document.createElement('div');
    scaleDiv.className = 'scale-selector';
    scaleDiv.innerHTML = `
        <div class="scale-header">
            <i data-lucide="${icon}" class="w-5 h-5 text-purple-600"></i>
            <h3 class="font-semibold text-gray-800">${title}</h3>
        </div>
        <div class="scale-controls">
            <span class="scale-label">${labels[0] || min}</span>
            <div class="scale-buttons"></div>
            <span class="scale-label">${labels[1] || max}</span>
        </div>
    `;
    const buttonsDiv = scaleDiv.querySelector('.scale-buttons');
    for (let i = min; i <= max; i++) {
        const btn = document.createElement('button');
        btn.className = 'scale-button' + (value === i ? ' selected' : '');
        btn.textContent = i;
        btn.addEventListener('click', () => onChange(i));
        buttonsDiv.appendChild(btn);
    }
    container.appendChild(scaleDiv);
}

function updateSymptomsUI() {
    const symptomsDiv = document.getElementById('symptoms-list');
    symptomsDiv.innerHTML = '';
    symptomOptions.forEach(symptom => {
        const btn = document.createElement('button');
        btn.className = 'symptom-button' + (todayLog.symptoms.includes(symptom) ? ' selected' : '');
        btn.textContent = symptom;
        btn.addEventListener('click', () => toggleSymptom(symptom));
        symptomsDiv.appendChild(btn);
    });
}

function updateActivitiesUI() {
    const activitiesDiv = document.getElementById('activities-list');
    activitiesDiv.innerHTML = '';
    activityOptions.forEach(activity => {
        const btn = document.createElement('button');
        btn.className = 'activity-button' + (todayLog.activities.includes(activity.name) ? ' selected' : '');
        btn.innerHTML = `<i data-lucide="${activity.icon}" class="activity-icon" style="color: ${activity.color}"></i><div class="activity-name">${activity.name}</div>`;
        btn.addEventListener('click', () => toggleActivity(activity.name));
        activitiesDiv.appendChild(btn);
    });
    lucide.createIcons();
}

function attachEventListeners() {
    document.getElementById('sleep-hours').addEventListener('input', e => {
        todayLog.sleep.hours = parseFloat(e.target.value) || 0;
    });
    document.getElementById('sleep-quality').addEventListener('change', e => {
        todayLog.sleep.quality = parseInt(e.target.value);
    });

    document.getElementById('achievements').addEventListener('input', e => {
        todayLog.achievements = e.target.value;
    });
    document.getElementById('triggers').addEventListener('input', e => {
        todayLog.triggers = e.target.value;
    });
    document.getElementById('notes').addEventListener('input', e => {
        todayLog.notes = e.target.value;
    });

    document.getElementById('save-log').addEventListener('click', handleLogSubmit);
}
