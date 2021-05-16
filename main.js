const Player = {
  computer: 'X',
  user: 'O',
  choicePlayer: function() {
    players = [this.computer, this.user];
    idx = Math.floor(Math.random() * 2);
    this.curPlayer = players[idx];
    if(this.curPlayer === this.computer) {
      this.randomPlay();
    }
  },

  changePlayer: function() {
    this.curPlayer = this.curPlayer === 'X' ? 'O' : 'X';
  },

  randomPlay: function() {
    let id = Math.floor(Math.random() * 9);
    this.doMove(id, this.computer);
    this.changePlayer();
  },

  doMove: function(id, player) {
    document.getElementById(id + 1).innerHTML = player;
    Board.setCell(id, player, 1);
  }
}

const Board = {
  cells: [],
  lines: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],
  count: 0,
  winer: "",
  
  initCells: function() {
    for(let i = 0; i < 9; i++) {
      this.cells[i] = "";
      document.getElementById(i + 1).innerHTML = "";
    }
    this.count = 0;
  },

  getEmptyCells: function() {
    let emptyCells = [];
    for(let i = 0; i < 9; i++){
      if (this.cells[i] === "") {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  },

  setCell: function(id, value, count) {
    this.cells[id] = value;
    this.count += count;
  },

  compareLine: function(i, j, k, player) {
    if(this.cells[i] !== player) {
      return false;
    } else if (this.cells[i] === this.cells[j] && this.cells[j] === this.cells[k]) {
      return true;
    } 
    return false;
  },

  isWin: function(player) {
    for(const line of this.lines) {
      if(this.compareLine(line[0], line[1], line[2], player)) {
        this.winer = player;
        return true;
      }
    }
    return false;
  },

  isDraw: function() {
    return this.count === 9;
  },

  evaluation: function() {
    if(this.winer === Player.computer) {
      this.winer = "";
      return 1;
    } else if(this.winer === Player.user) {
      this.winer = "";
      return -1;
    } else {
      return 0;
    }
  }
}

const BestCell = {
  bestCell: 0,
  bestScore: -1000,

  setCell: function(cell, score) {
    if(this.bestScore < score) {
      this.bestCell = cell;
      this.bestScore = score;
    }
  },

  initBestCell: function() {
    this.bestScore = -1000;
  },

  doMove: function() {
    Player.doMove(this.bestCell, Player.computer);
    this.initBestCell();
  },

  minimax: function(depth, player, alpha, beta){
    let turn = player === 'X' ? 'O' : 'X';
    if(Board.isWin(turn) || Board.isDraw()) {
      return Board.evaluation();
    }

    const emptyCells = Board.getEmptyCells();
    if(player === Player.computer) {
      let score, maxScore = -1000;
      for(const cell of emptyCells) {
        Board.setCell(cell, Player.computer, 1);
        score = this.minimax(depth + 1, Player.user, alpha, beta);
        Board.setCell(cell, "", -1);
        maxScore = Math.max(score, maxScore);
        alpha = Math.max(maxScore, alpha);
        if(depth === 0) {
          this.setCell(cell, maxScore);
        }
        if(beta <= alpha) {
          break;
        }
      }
      return maxScore;
    } else {
      let score, minScore = 1000;
      for(const cell of emptyCells) {
        Board.setCell(cell, Player.user, 1);
        score = this.minimax(depth + 1, Player.computer, alpha, beta);
        Board.setCell(cell, "", -1);
        minScore = Math.min(score, minScore);
        beta = Math.min(minScore, beta);
        if(beta <= alpha) {
          break;
        }
      }
      return minScore;
    }
  }
}

const Game = {
  isGameOver: false,
  initGame: function() {
    Board.initCells();
    Player.choicePlayer();
    BestCell.initBestCell();
    this.displayMsg(`${Player.curPlayer}'s turn`);
    this.isGameOver = false;
  },

  displayMsg: function(msg) {
    document.querySelector('.winner').innerHTML = msg
  },

  checkFinish: function(player) {
    this.isGameOver = true;
    if(Board.isWin(player)) {
      this.displayMsg(`${Player.curPlayer}'s won!!`);
    } else if(Board.isDraw()) {
      this.displayMsg('Draw!!');
    } else {
      this.isGameOver = false;
      Player.changePlayer();
      this.displayMsg(`${Player.curPlayer}'s trun`);
    }
  },

  onCellClicked: function(event) {
    let id = event.target.id;
    let value = event.target.innerHTML;
    if(this.isGameOver || value != "") {
      return;
    }

    Player.doMove(id - 1, Player.user);
    this.checkFinish(Player.user);
    if(!this.isGameOver) {
      this.playComputer();
    }
  },

  playComputer: function() {
    BestCell.minimax(0, Player.computer, -1000, 1000);
    BestCell.doMove();
    this.checkFinish(Player.computer);
  },

  onButtonClicked: function() {
    this.initGame();
  },

  setEventListener: function() {
    const reset = document.querySelector('button');
    const cells = document.querySelector('.board');
    reset.addEventListener('click', () => this.onButtonClicked());
    cells.addEventListener('click', event => this.onCellClicked(event));
  }
}

Game.initGame();
Game.setEventListener();