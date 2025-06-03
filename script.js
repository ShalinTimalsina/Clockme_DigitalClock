let timerInterval, stopwatchInterval;
let timerTime = 0, stopwatchTime = 0;
let isTimerRunning = false, isStopwatchRunning = false;

const timerDisplay = document.getElementById("timer-display");
const stopwatchDisplay = document.getElementById("stopwatch-display");
const presetSelect = document.getElementById("preset-select");
const beepSound = new Audio("assets/beep.mp3");

const hoursSelect = document.getElementById("hours-select");
const minutesSelect = document.getElementById("minutes-select");
const secondsSelect = document.getElementById("seconds-select");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

const swStartBtn = document.getElementById("sw-start-btn");
const swPauseBtn = document.getElementById("sw-pause-btn");
const swResetBtn = document.getElementById("sw-reset-btn");

const timerSection = document.getElementById("timer-section");
const stopwatchSection = document.getElementById("stopwatch-section");

const timerBtn = document.getElementById("timer-btn");
const stopwatchBtn = document.getElementById("stopwatch-btn");

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')} : ${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
}

// Populate hours, minutes, seconds selects
function populateTimeSelectors() {
    for (let i = 0; i <= 23; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i.toString().padStart(2, '0');
        hoursSelect.appendChild(option);
    }
    for (let i = 0; i <= 59; i++) {
        const optionM = document.createElement("option");
        optionM.value = i;
        optionM.textContent = i.toString().padStart(2, '0');
        minutesSelect.appendChild(optionM);

        const optionS = document.createElement("option");
        optionS.value = i;
        optionS.textContent = i.toString().padStart(2, '0');
        secondsSelect.appendChild(optionS);
    }
}
populateTimeSelectors();

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timerTime);
}

function toggleTimerButtons(running) {
    startBtn.disabled = running;
    pauseBtn.disabled = !running;
    resetBtn.disabled = !running && timerTime === 0;
}

function startTimer() {
    if (timerTime <= 0 || isTimerRunning) return;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timerTime > 0) {
            timerTime--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            beepSound.play();
            isTimerRunning = false;
            toggleTimerButtons(false);
            presetSelect.disabled = false;
            enableModeSwitch(true);
        }
    }, 1000);
    isTimerRunning = true;
    toggleTimerButtons(true);
    presetSelect.disabled = true;
    enableModeSwitch(false);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    toggleTimerButtons(false);
    presetSelect.disabled = false;
    enableModeSwitch(true);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerTime = 0;
    updateTimerDisplay();
    isTimerRunning = false;
    toggleTimerButtons(false);
    presetSelect.disabled = false;
    enableModeSwitch(true);
}

function setCustomTime() {
    if (isTimerRunning) return; // Prevent changing while running
    const hrs = parseInt(hoursSelect.value, 10);
    const mins = parseInt(minutesSelect.value, 10);
    const secs = parseInt(secondsSelect.value, 10);
    timerTime = hrs * 3600 + mins * 60 + secs;
    updateTimerDisplay();
    toggleTimerButtons(false);
}

function setPresetTime() {
    if (isTimerRunning) return; // Prevent changing preset while running
    const presetSeconds = parseInt(presetSelect.value, 10);
    if (!isNaN(presetSeconds) && presetSeconds > 0) {
        timerTime = presetSeconds;
        updateTimerDisplay();

        // Update selectors to reflect the preset
        const hrs = Math.floor(presetSeconds / 3600);
        const mins = Math.floor((presetSeconds % 3600) / 60);
        const secs = presetSeconds % 60;
        hoursSelect.value = hrs;
        minutesSelect.value = mins;
        secondsSelect.value = secs;

        toggleTimerButtons(false);
    }
}

// --- STOPWATCH FUNCTIONS ---
function updateStopwatchDisplay() {
    stopwatchDisplay.textContent = formatTime(stopwatchTime);
}

function toggleStopwatchButtons(running) {
    swStartBtn.disabled = running;
    swPauseBtn.disabled = !running;
    swResetBtn.disabled = !running && stopwatchTime === 0;
}

function startStopwatch() {
    if (isStopwatchRunning) return;
    clearInterval(stopwatchInterval);
    stopwatchInterval = setInterval(() => {
        stopwatchTime++;
        updateStopwatchDisplay();
    }, 1000);
    isStopwatchRunning = true;
    toggleStopwatchButtons(true);
    enableModeSwitch(false);
}

function pauseStopwatch() {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    toggleStopwatchButtons(false);
    enableModeSwitch(true);
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    updateStopwatchDisplay();
    isStopwatchRunning = false;
    toggleStopwatchButtons(false);
    enableModeSwitch(true);
}

// --- MODE SWITCHING ---
function enableModeSwitch(enable) {
    timerBtn.style.pointerEvents = enable ? 'auto' : 'none';
    stopwatchBtn.style.pointerEvents = enable ? 'auto' : 'none';
    timerBtn.style.opacity = enable ? '1' : '0.6';
    stopwatchBtn.style.opacity = enable ? '1' : '0.6';
}

timerBtn.addEventListener("click", () => {
    if (isTimerRunning || isStopwatchRunning) return; // Disable switch when running
    timerBtn.classList.add("active");
    stopwatchBtn.classList.remove("active");
    timerSection.classList.add("active");
    stopwatchSection.classList.remove("active");
});

stopwatchBtn.addEventListener("click", () => {
    if (isTimerRunning || isStopwatchRunning) return; // Disable switch when running
    stopwatchBtn.classList.add("active");
    timerBtn.classList.remove("active");
    stopwatchSection.classList.add("active");
    timerSection.classList.remove("active");
});

// --- EVENT LISTENERS ---

// Timer selectors and presets
hoursSelect.addEventListener("change", setCustomTime);
minutesSelect.addEventListener("change", setCustomTime);
secondsSelect.addEventListener("change", setCustomTime);
presetSelect.addEventListener("change", setPresetTime);

// Timer buttons
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Stopwatch buttons
swStartBtn.addEventListener("click", startStopwatch);
swPauseBtn.addEventListener("click", pauseStopwatch);
swResetBtn.addEventListener("click", resetStopwatch);

// Initialize displays
updateTimerDisplay();
updateStopwatchDisplay();
toggleTimerButtons(false);
toggleStopwatchButtons(false);
