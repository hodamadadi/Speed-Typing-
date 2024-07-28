let startTime, endTime;
let isGameStarted = false;
let mistakes = 0;

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "JavaScript is a versatile programming language.",
  "Speed typing can improve your productivity.",
  "Practice makes perfect in typing and coding.",
  "Hello World! This is a sample typing text.",
];

const textToTypeElem = document.getElementById("text-to-type");
const userInputElem = document.getElementById("user-input");
const timeElem = document.getElementById("time");
const wpmElem = document.getElementById("wpm");
const mistakesElem = document.getElementById("mistakes");
const progressElem = document.getElementById("progress");
const progressTextElem = document.getElementById("progress-text");
const scoreElem = document.getElementById("score");
const resultWindow = document.getElementById("result-window");
const resultTextElem = document.getElementById("result-text");
const resultTimeElem = document.getElementById("result-time");
const resultWpmElem = document.getElementById("result-wpm");
const resultMistakesElem = document.getElementById("result-mistakes");
const resultProgressTextElem = document.getElementById("result-progress-text");
const resultProgressElem = document.getElementById("result-progress");
const resultSound = document.getElementById("result-sound");
const startSound = document.getElementById("start-sound");
const resetSound = document.getElementById("reset-sound");

const levelThresholds = {
  good: 0,
  average: 50,
  fluent: 100,
  fast: 150,
  pro: 200,
};

function getRandomText() {
  const randomIndex = Math.floor(Math.random() * sampleTexts.length);
  return sampleTexts[randomIndex];
}

function startGame() {
  if (isGameStarted) return;
  isGameStarted = true;
  const randomText = getRandomText();
  textToTypeElem.textContent = randomText;
  userInputElem.value = "";
  mistakes = 0;
  updateMistakes();
  userInputElem.focus();
  startTime = new Date();
  resultWindow.style.display = "none"; // Hide result window when starting a new game
  startSound.play(); // Play start sound
}

function resetGame() {
  isGameStarted = false;
  userInputElem.value = "";
  textToTypeElem.textContent = 'Press "Start Game" to begin.';
  timeElem.textContent = "0";
  wpmElem.textContent = "0";
  mistakesElem.textContent = "0";
  scoreElem.textContent = "0";
  progressElem.style.width = "0";
  progressTextElem.textContent = "Good";
  resultWindow.style.display = "none"; // Hide result window
  resetSound.play(); // Play reset sound
}

function calculateWPM(startTime, endTime, textLength) {
  const timeInMinutes = (endTime - startTime) / 60000;
  return Math.round(textLength / 5 / timeInMinutes);
}

function updateMistakes() {
  const inputText = userInputElem.value;
  const sampleText = textToTypeElem.textContent;
  mistakes = 0;
  for (let i = 0; i < inputText.length; i++) {
    if (inputText[i] !== sampleText[i]) {
      mistakes++;
    }
  }
  mistakesElem.textContent = mistakes;
}

function updateProgressBar(wpm) {
  let progressPercentage = 0;
  let level = "Good";

  if (wpm >= levelThresholds.pro) {
    progressPercentage = 100;
    level = "Pro";
  } else if (wpm >= levelThresholds.fast) {
    progressPercentage = 75;
    level = "Fast";
  } else if (wpm >= levelThresholds.fluent) {
    progressPercentage = 50;
    level = "Fluent";
  } else if (wpm >= levelThresholds.average) {
    progressPercentage = 25;
    level = "Average";
  } else {
    level = "Good";
  }

  progressElem.style.width = progressPercentage + "%";
  progressTextElem.textContent = level;
}

function calculateScore(wpm, mistakes) {
  const baseScore = wpm * 10;
  const penalty = mistakes * 5;
  let score = Math.max(0, baseScore - penalty); // Score cannot be negative
  // Cap the score between 1 and 100
  score = Math.min(100, Math.max(1, score));
  return score;
}

function playResultSound() {
  resultSound.play();
}

function showResults() {
  const sampleText = textToTypeElem.textContent;
  const timeTaken = timeElem.textContent;
  const wpm = wpmElem.textContent;
  const mistakes = mistakesElem.textContent;
  const progressLevel = progressTextElem.textContent;
  const progressWidth = progressElem.style.width;

  const score = calculateScore(parseInt(wpm), parseInt(mistakes));
  scoreElem.textContent = score;

  // Determine if the user won or lost based on some criteria
  playResultSound(); // Play result sound

  resultTextElem.textContent = sampleText;
  resultTimeElem.textContent = timeTaken;
  resultWpmElem.textContent = wpm;
  resultMistakesElem.textContent = mistakes;
  resultProgressTextElem.textContent = progressLevel;
  resultProgressElem.style.width = progressWidth;
  resultWindow.style.display = "block"; // Show the result window
}

userInputElem.addEventListener("input", () => {
  if (isGameStarted) {
    updateMistakes();
    const sampleText = textToTypeElem.textContent;
    if (userInputElem.value === sampleText) {
      endTime = new Date();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      timeElem.textContent = timeTaken;
      const wpm = calculateWPM(startTime, endTime, sampleText.length);
      wpmElem.textContent = wpm;
      updateProgressBar(wpm);
      showResults();
      isGameStarted = false;
    }
  }
});

document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("reset-game").addEventListener("click", resetGame);
