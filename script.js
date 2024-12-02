const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const modeButtons = document.querySelectorAll(".mode-btn");
const themeButton = document.querySelector(".theme-btn");
const pauseButton = document.querySelector(".pause-btn");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let paused = false;


let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;


const gameModes = {
  easy: 200,
  medium: 100,
  hard: 50,
};
let currentSpeed = gameModes.medium;


const themes = [
  { background: "#1e1e1e", snake: "#00ff00", food: "#ff0000" },
  { background: "#001f3f", snake: "#ffdc00", food: "#0074d9" },
  { background: "#3d9970", snake: "#111111", food: "#85144b" },
];
let currentTheme = 0;


const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};


const togglePause = () => {
  paused = !paused;
  pauseButton.textContent = paused ? "Resume" : "Pause";
  if (paused) {
    clearInterval(setIntervalId);
  } else {
    setIntervalId = setInterval(initGame, currentSpeed);
  }
};


const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over! Press OK to replay.");
  location.reload();
};


const changeDirection = (e) => {
  if (paused) return;
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
};


const changeTheme = () => {
  currentTheme = (currentTheme + 1) % themes.length;
  const theme = themes[currentTheme];
  document.body.style.background = theme.background;
  document.querySelector(".play-board").style.borderColor = theme.snake;
};


modeButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    const mode = e.target.dataset.mode;
    currentSpeed = gameModes[mode];
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, currentSpeed);
  })
);


const initGame = () => {
  if (gameOver) return handleGameOver();
  if (paused) return;

  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;


  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    highScore = score > highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }


  snakeX += velocityX;
  snakeY += velocityY;


  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];


  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      gameOver = true;
    }
  }

  
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
  }

  playBoard.innerHTML = html;
};


controls.forEach((button) =>
  button.addEventListener("click", () => changeDirection({ key: button.dataset.key }))
);
document.addEventListener("keyup", changeDirection);
themeButton.addEventListener("click", changeTheme);
pauseButton.addEventListener("click", togglePause);


updateFoodPosition();
setIntervalId = setInterval(initGame, currentSpeed);
