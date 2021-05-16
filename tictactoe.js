const Player = 'O';
const Computer = 'X'
let currentPlayer = 'O';
let isGameOver = false;
let isAI = false;
let bestID = -1;
let bestScore = -1000;
let Winner = "";
const Lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function initGame() {
  bestID = -1;
  bestScore = -1000;
  isGameOver = false;
  let isAI = false;
  setPlayer();
  if(currentPlayer === Computer) {
    let id = Math.floor(Math.random() * 9) + 1; 
    createElement(id, currentPlayer);
    isFinishGame(Computer);
  } else {
    displayMsg(`${currentPlayer}'s turn`);
  }
}

function setPlayer() {
  const players = [Computer, Player];
  let idx = Math.floor(Math.random() * 2);
  currentPlayer = players[idx];
}

function createElement(id, value) {
  document.getElementById(id).innerHTML = value;
}

function onButtonClick() {
  for (let i = 1; i <= 9; i++){
    createElement(i, "");
  }
  initGame();
}

function isDraw() {
  return getEmptyCells().length === 0;
}

function evaluation() {
  if(Winner === Computer) {
    Winner = "";
    return 1;
  } else if(Winner === Player) {
    Winner = "";
    return -1;
  } else {
    return 0;
  }
}

function getElementArray() {
  const cells = [];
  for(let i = 1; i <= 9; i++) {
    let cell = document.getElementById(i).innerHTML;
    cells.push(cell);
  }
  return cells;
}

function getEmptyCells() {
  const cells = getElementArray();
  const emptyCells = [];
  for (let i = 0; i < cells.length; i++) {
    if(cells[i] === "") {
      emptyCells.push(i + 1);
    }
  }
  return emptyCells;
}

function isSameAll(cell, i, j, k, player) {
  if (cell[i] !== player) return false;
  return cell[i] === cell[j] && cell[j] === cell[k];
}

function checkWins(player) {
  const cells = getElementArray();
  for (const line of Lines) {
    if(isSameAll(cells, line[0], line[1], line[2], player)) {
      Winner = player;
      return true;
    }
  }
  return false;
}

function displayMsg(msg, ) {
  document.querySelector('.winner').innerHTML = msg;
}

function changeTurn() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; 
}

function isFinishGame(player) {
  isGameOver = true;
  if(checkWins(player)) {
    displayMsg(`${currentPlayer}'s won!`);
  } else if (isDraw()) {
    displayMsg('Draw!!');
  } else {
    changeTurn();
    displayMsg(`${currentPlayer}'s turn`);
    isGameOver = false;
  }
}

function playComputer() {
  isAI = true;
  minimax(0, Computer, -1000, 1000);
  createElement(bestID, Computer);
  isFinishGame(Computer);
  bestScore = -1000;
  isAI = false;
}

function onCellClicked(event) {
  if (isGameOver || isAI) {
    return;
  }

  let id = event.target.id;
  let value = event.target.innerHTML;
  if (value == "") {
    createElement(id, currentPlayer);
    isFinishGame(Player);
    if(!isGameOver) {
      playComputer();
    }
  } 
}

function setBestPosition(id, score) {
  if( score > bestScore) {
    bestID = id;
    bestScore = score;
  }
}

function minimax(depth, player, alpha, beta) {
  let turn  = player === 'X' ? 'O' : 'X';
  if(checkWins(turn) || isDraw()) {
    return evaluation();
  }

  const emptyCells = getEmptyCells();
  if(player === Computer) {
    let score, maxScore = -1000;
    for(const cell of emptyCells) {
      createElement(cell, Computer);
      score = minimax(depth + 1, Player, alpha, beta);
      createElement(cell, "");
      maxScore = Math.max(score, maxScore);
      alpha = Math.max(maxScore, alpha);
      if (depth === 0) {
        setBestPosition(cell, maxScore);
      }
      if (beta <= alpha) {
        break;
      }
    }
    return maxScore;
  } else {
    let score, minScore = 1000;
    for(const cell of emptyCells) {
      createElement(cell, Player);
      score = minimax(depth + 1, Computer, alpha, beta);
      createElement(cell, "");
      minScore = Math.min(score, minScore);
      beta = Math.min(minScore, beta);
      if (beta <= alpha) {
        break;
      }
    }
    return minScore
  }
}

function setEventListener() {
  const reset = document.querySelector('button');
  const cells = document.querySelector('.board');
  reset.addEventListener('click', () => onButtonClick());
  cells.addEventListener('click', event => onCellClicked(event));
}

initGame();
setEventListener();
