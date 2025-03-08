const setupScreen = document.querySelector('.setup-screen');
const gameContainer = document.querySelector('.container');
const startGameButton = document.querySelector('#start-game');
const newGameButton = document.querySelector('#new-game');
const playerCountSelect = document.querySelector('#player-count');
const playerSymbolSelect = document.querySelector('#player-symbol');
const cells = document.querySelectorAll('.cont');
const statusText = document.querySelector('#status');
const resetButton = document.querySelector('#reset-button');
const scoreDisplay = document.querySelector('#score');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isComputerPlaying = false;
let computerSymbol = '';
let scores = { X: 0, O: 0 };

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGameButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', newGame);
resetButton.addEventListener('click', resetGame);

function startGame() {
    const playerCount = playerCountSelect.value;
    const playerSymbol = playerSymbolSelect.value;
    isComputerPlaying = playerCount === '1';
    computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
    currentPlayer = 'X';
    resetGame(); // Reset the game state when starting
    statusText.textContent = 'Game Started! It\'s X\'s turn'; // Notify that the game has started
}

function newGame() {
    resetGame();
    scores = { X: 0, O: 0 };
    updateScore();
    statusText.textContent = 'New Game Started! It\'s X\'s turn'; // Notify that a new game has started
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer === 'X' ? 'x' : 'o');

    checkForWinner();
}

function checkForWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition.map(index => gameState[index]);
        if (a && a === b && b === c) {
            condition.forEach(index => {
                cells[index].classList.add('winner');
            });
            scores[currentPlayer]++;
            updateScore();
            statusText.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }
    }

    if (!gameState.includes('')) {
        statusText.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `It's ${currentPlayer}'s turn`;

    if (isComputerPlaying && currentPlayer === computerSymbol) {
        computerMove();
    }
}

function computerMove() {
    let availableCells = gameState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    if (randomCell !== undefined) {
        gameState[randomCell] = computerSymbol;
        cells[randomCell].textContent = computerSymbol;
        cells[randomCell].classList.add(computerSymbol === 'X' ? 'x' : 'o');
        checkForWinner();
    }
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
    if (isComputerPlaying && currentPlayer === computerSymbol) {
        computerMove();
    }
}

function updateScore() {
    scoreDisplay.textContent = `X: ${scores['X']} | O: ${scores['O']}`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));