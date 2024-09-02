const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];



const cells = document.querySelectorAll('.cell');
let turn;
let computerMark;  // This will be either 'X' or 'O', decided at the start of
                   // the game.



// Add global selector for the turn indicator
const turnIndicator = document.getElementById('turn-indicator');

function updateTurnIndicator() {
  if (turn === computerMark) {
    turnIndicator.textContent = `Computer's Turn (${computerMark})`;
  } else {
    let playerMark = turn;
    turnIndicator.textContent = `Player's Turn (${playerMark})`;
  }
}



function placeMark(cell, currentTurn) {
  cell.textContent = currentTurn;
}

function checkWin(currentTurn) {
  for (const combination of winCombinations) {
    if (combination.every(index => cells[index].textContent === currentTurn)) {
      return combination;  // Return the winning combination indexes
    }
  }
  return null;
}

function drawWinLine(winCombination) {
  winCombination.forEach(index => {
    cells[index].classList.add('winner');
  });
}

function handleClick(event) {
  const cell = event.target;
  if (cell.textContent === '') {  // Prevent clicking on filled cells
    placeMark(cell, turn);

    // Check for win or tie
    const winCombination = checkWin(turn);
    if (winCombination) {
      endGame(winCombination);
    } else if (checkTie()) {
      endGame(null);
    } else {
      // Switch turns
      turn = turn === 'X' ? 'O' : 'X';
      // If it's now the computer's turn, call computerMove
      if (turn === computerMark) {
        setTimeout(computerMove, 500);  // Delay to simulate thinking
      }
    }
  }
  updateTurnIndicator();
}


function checkTie() {
  return [...cells].every(cell => {
    return cell.textContent === 'X' || cell.textContent === 'O';
  });
}

function endGame(winCombination) {
  if (winCombination) {
    drawWinLine(winCombination);
    alert(`${turn} wins!`);
  } else {
    alert('Tie game!');
  }
  setTimeout(resetGame, 2000);  // Reset game after 2 seconds
}

function resetGame() {
  // Reset marks and clear the board
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winner');
    cell.removeEventListener('click', handleClick);
  });
  // Decide who starts the new game
  decideStarter();
  updateTurnIndicator();
}

function decideStarter() {
  if (Math.random() < 0.5) {
    turn = 'X';          // Computer starts as 'X'
    computerMark = 'X';  // Computer will use 'X' for this game
    updateTurnIndicator();
    computerMove();  // Computer makes the first move
  } else {
    turn = 'X';          // Player starts as 'X', and the computer will use 'O'
    computerMark = 'O';  // Computer will use 'O' for this game
    updateTurnIndicator();
    cells.forEach(cell => {
      cell.addEventListener('click', handleClick, {once: true});
    });
  }
}

function chooseBestMove() {
  let move = findWinningMove('O');
  if (move != null) {
    return move;
  }

  move = findWinningMove('X');
  if (move != null) {
    return move;
  }

  // Play center
  if (isCellEmpty(4)) {
    return 4;
  }

  // Play opposite corner
  move = findOppositeCorner();
  if (move != null) {
    return move;
  }

  // Play empty corner
  move = findEmptyCorner();
  if (move != null) {
    return move;
  }

  // Play empty side
  return findEmptySide();
}

function findWinningMove(player) {
  for (const combination of winCombinations) {
    const [a, b, c] = combination;
    if (cells[a].textContent === player && cells[b].textContent === player &&
        cells[c].textContent === '') {
      return c;
    }
    if (cells[a].textContent === player && cells[c].textContent === player &&
        cells[b].textContent === '') {
      return b;
    }
    if (cells[b].textContent === player && cells[c].textContent === player &&
        cells[a].textContent === '') {
      return a;
    }
  }
  return null;
}

function isCellEmpty(index) {
  return cells[index].textContent === '';
}

function findOppositeCorner() {
  const cornerPairs = {0: 8, 2: 6, 6: 2, 8: 0};
  for (const [corner, opposite] of Object.entries(cornerPairs)) {
    if (cells[corner].textContent === 'X' && isCellEmpty(opposite)) {
      return parseInt(opposite);
    }
  }
  return null;
}

function findEmptyCorner() {
  const corners = [0, 2, 6, 8];
  for (const corner of corners) {
    if (isCellEmpty(corner)) {
      return corner;
    }
  }
  return null;
}

function findEmptySide() {
  const sides = [1, 3, 5, 7];
  for (const side of sides) {
    if (isCellEmpty(side)) {
      return side;
    }
  }
  return null;
}



function computerMove() {
  let cellIndex = chooseBestMove();  // This should decide the best move for the
                                     // computer's mark.
  if (cellIndex !== null) {
    const cell = cells[cellIndex];
    placeMark(
        cell,
        computerMark);  // Use the computer's persistent mark for the move.
    const winCombination = checkWin(computerMark);

    if (winCombination) {
      endGame(winCombination);
    } else if (checkTie()) {
      endGame(null);
    } else {
      turn = computerMark === 'X' ?
          'O' :
          'X';                // Switch turns after the computer move.
      updateTurnIndicator();  // Ensure we update the turn indicator here
      // Re-enable clicking only if it's the player's turn.
      cells.forEach(
          cell => cell.addEventListener('click', handleClick, {once: true}));
    }
  }
}


// Start the game
decideStarter();