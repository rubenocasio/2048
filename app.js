document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.querySelector('#score');
    const resultDisplay = document.querySelector('#result');
    const width = 4;
    let board = Array.from({ length: 4 }, () => Array(4).fill(0));
    let score = 0;

    function renderBoard() {
        gridDisplay.innerHTML = ''; // Clear the grid
        board.flat().forEach(value => {
            const square = document.createElement('div');
            square.innerHTML = value || '';
            square.style.backgroundColor = getTileColor(value);
            gridDisplay.appendChild(square);
        });
        scoreDisplay.innerHTML = score;
    }

    function slideAndMerge(line) {
        const filteredLine = line.filter(num => num);
        for (let i = 0; i < filteredLine.length - 1; i++) {
            if (filteredLine[i] === filteredLine[i + 1]) {
                filteredLine[i] *= 2;
                filteredLine[i + 1] = 0;
                score += filteredLine[i];
            }
        }
        return filteredLine.filter(num => num).concat(Array(4 - filteredLine.filter(num => num).length).fill(0));
    }

    function transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    function move(direction) {
        if (direction === 'left') board = board.map(slideAndMerge);
        if (direction === 'right') board = board.map(row => slideAndMerge(row.reverse()).reverse());
        if (direction === 'up') board = transpose(transpose(board).map(slideAndMerge));
        if (direction === 'down') board = transpose(transpose(board).map(row => slideAndMerge(row.reverse()).reverse()));
        generate();
        renderBoard();
        checkForWin();
    }

    function generate() {
        const emptyTiles = [];
        board.forEach((row, rowIndex) =>
            row.forEach((value, colIndex) => {
                if (value === 0) emptyTiles.push({ rowIndex, colIndex });
            })
        );

        if (emptyTiles.length === 0) {
            checkForGameOver();
            return;
        }

        const { rowIndex, colIndex } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;
    }

    const controls = {
        ArrowLeft: () => move('left'),
        ArrowRight: () => move('right'),
        ArrowUp: () => move('up'),
        ArrowDown: () => move('down'),
    };

    document.addEventListener('keydown', (e) => {
        if (controls[e.key]) controls[e.key]();
    });

    function checkForWin() {
        if (board.flat().includes(2048)) {
            resultDisplay.innerHTML = 'You WIN!!!';
            document.removeEventListener('keydown', control);
        }
    }

    function checkForGameOver() {
        if (!board.flat().includes(0)) {
            resultDisplay.innerHTML = 'You LOSE!!!';
            document.removeEventListener('keydown', control);
        }
    }

    const tileColors = {
        0: '#afa192',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#ffcea4',
        32: '#e8c064',
        64: '#ffab6e',
        128: '#fd9982',
        256: '#ead79c',
        512: '#76daff',
        1024: '#beeaa5',
        2048: '#d7d4f0',
    };

    function getTileColor(value) {
        return tileColors[value] || '#000';
    }

    // Initialize the game
    generate();
    generate();
    renderBoard();
});
