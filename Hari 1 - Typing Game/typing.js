const WORDS = [
    "A Certain Romance",
    "Bigger Boys and Stolen Sweethearts",
    "Choo Choo",
    "Cigarette Smoke",
    "Dancing Shoes",
    "Fake Tales of San Francisco",
    "Knock a Door Run",
    "Mardy Bum",
    "On the Run From the MI5",
    "Riot Van",
    "Scummy",
    "Still Take You Home",
    "My Propeller",
    "Dangerous Animal",
    "Cornerstone",
    "Pretty Visitors",
    "Crying Lightning",
    "The Jeweller's Hand",
    "Briantstorm",
    "D Is for Dangerous",
    "Teddy Picker",
    "Balaclava",
    "Do Me a Favour",
    "Old Yellow Bricks",
    "505",
    "This House Is a Circus",
    "The Bad Thing",
];


let currentWord = "";
let score = 0;
let timeLeft = 30;
let isPlaying = false;
let totalTyped = 0;
let correctTyped = 0;

const wordContainer = document.getElementById("word-container");
const inputField = document.getElementById("input-field");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const accuracyElement = document.getElementById("accuracy");
let currentTimeSetting = 30;

function initGame() {
  showNewWord();
  currentTimeSetting = parseInt(document.getElementById('time-select').value);
  timeLeft = currentTimeSetting;
  inputField.value = "";
  score = 0;
  timeLeft = 30;
  totalTyped = 0;
  correctTyped = 0;
  updateDisplay();
  inputField.focus();
  inputField.disabled = false;
}

function showNewWord() {
  currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  wordContainer.textContent = currentWord;
  wordContainer.className = "";
}

function updateDisplay() {
  scoreElement.textContent = score;
  timerElement.textContent = timeLeft;
  accuracyElement.textContent = calculateAccuracy();
}

function calculateAccuracy() {
  return totalTyped === 0 ? 100 : Math.round((correctTyped / totalTyped) * 100);
}

function checkInput() {
  //sounds.key.play();
  const userInput = inputField.value;
  totalTyped++;

  if (userInput === currentWord) {
    //sounds.correct.play();
    correctTyped += currentWord.length;
    score += currentWord.length;
    showNewWord();
    inputField.value = "";
    updateDisplay();
    wordContainer.classList.add('new-word');
        setTimeout(() => {
            showNewWord();
            wordContainer.classList.remove('new-word');
        }, 300);
  } else {
    wordContainer.className =
      userInput === currentWord.slice(0, userInput.length)
        ? "correct"
        : "incorrect";
    correctTyped += countMatchingChars(userInput, currentWord);
  }
}

function countMatchingChars(input, target) {
  let matchCount = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === target[i]) matchCount++;
  }
  return matchCount;
}

function startTimer() {
  isPlaying = true;
  const timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

/* const sounds = {
    key: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2861/2861-preview.mp3'] }),
    correct: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3'] }),
    gameover: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2591/2591-preview.mp3'] })
}; */

let highscores = JSON.parse(localStorage.getItem('highscores')) || {
    '30': 0,
    '60': 0,
    '120': 0
};


function endGame() {
  //sounds.gameover.play();
  if(score > highscores[currentTimeSetting]) {
      highscores[currentTimeSetting] = score;
      localStorage.setItem('highscores', JSON.stringify(highscores));
  }

  isPlaying = false;
  wordContainer.textContent = "Game Over!";
  inputField.disabled = true;
  document.getElementById(
    "result"
  ).textContent = `Final Score: ${score} | Accuracy: ${calculateAccuracy()}%`;
}

inputField.addEventListener("input", () => {
  if (!isPlaying) startTimer();
  checkInput();
});

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !isPlaying) {
    initGame();
    document.getElementById("result").textContent = "";
  }
});

document.getElementById('highscores-btn').addEventListener('click', () => {
    const modal = document.getElementById('highscores-modal');
    const list = document.getElementById('highscores-list');
    
    list.innerHTML = `
        <p>30s: ${highscores[30]}</p>
        <p>60s: ${highscores[60]}</p>
        <p>120s: ${highscores[120]}</p>
    `;
    
    modal.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('highscores-modal').style.display = 'none';
});

initGame();
