window.onload = function() {
    console.log("Window loaded");
    document.getElementById("menu").style.display = "block";
};

let moveStack = [];
let gridHistory = [];

function showSolver() {
    console.log("Showing solver mode");
    document.getElementById("menu").style.display = "none";
    document.getElementById("solver-container").style.display = "block";
    createGrid("sudoku-grid-solver");
}

function showGame() {
    console.log("Showing game mode");
    document.getElementById("menu").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    createGrid("sudoku-grid");
}

function createGrid(tableId) {
    console.log("Creating grid for", tableId);
    let table = document.getElementById(tableId);
    table.innerHTML = "";
    let colors = ["#e6f7ff", "#ccf2ff", "#ffcccc", "#ffeb99", "#d9f2d9", "#ffccff", "#ff9966", "#99ffcc", "#d9d9d9"];
    for (let i = 0; i < 9; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement("td");
            let input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.oninput = function() { validateInput(input); };
            input.style.color = "black";
            input.style.border = "1px solid black";
            
            let blockIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            cell.style.backgroundColor = colors[blockIndex];
            cell.style.border = "1px solid black";
            
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function validateInput(input) {
    let val = input.value;
    if (!/[1-9]/.test(val)) {
        input.value = "";
    }
}

function getGrid(tableId) {
    let grid = [];
    let rows = document.querySelectorAll(`#${tableId} tr`);
    for (let i = 0; i < 9; i++) {
        let row = [];
        let cells = rows[i].querySelectorAll("input");
        for (let j = 0; j < 9; j++) {
            row.push(cells[j].value ? parseInt(cells[j].value) : 0);
        }
        grid.push(row);
    }
    return grid;
}

function setGrid(tableId, grid) {
    let rows = document.querySelectorAll(`#${tableId} tr`);
    for (let i = 0; i < 9; i++) {
        let cells = rows[i].querySelectorAll("input");
        for (let j = 0; j < 9; j++) {
            cells[j].value = grid[i][j] !== 0 ? grid[i][j] : "";
            cells[j].removeAttribute("disabled"); 
            cells[j].style.color = "black";
            cells[j].style.backgroundColor = "inherit";
            cells[j].style.border = "1px solid black";
            
            if (grid[i][j] !== 0) {
                cells[j].setAttribute("disabled", true);
            }
        }
    }
}


function isValid(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
            return false;
        }
    }
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function solve(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solve(grid)) {
                            return true;
                        }
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function solveSudoku() {
    let grid = getGrid("sudoku-grid-solver");
    if (!isValidSudoku(grid)) {
        alert("Invalid Sudoku input! Please correct the errors.");
        return;
    }
    let originalGrid = JSON.parse(JSON.stringify(grid));
    
    if (solve(grid)) {
        setGrid("sudoku-grid-solver", grid);
    } else {
        alert("No solution exists! Please correct your input.");
        setGrid("sudoku-grid-solver", originalGrid);
    }
}

function submitSudoku() {
    let grid = getGrid("sudoku-grid");

    // Check if the grid is empty (all values are 0)
    let isEmpty = grid.every(row => row.every(cell => cell === 0));

    if (isEmpty) {
        alert("Empty Sudoku! Please fill in the numbers.");
        return;
    }

    if (isValidSudoku(grid)) {
        alert("You won!");
    } else {
        alert("Incorrect solution! Try again.");
    }
}


function isValidSudoku(grid) {
    function isValidGroup(group) {
        let seen = new Set();
        for (let num of group) {
            if (num !== 0) {
                if (seen.has(num)) return false;
                seen.add(num);
            }
        }
        return true;
    }
    
    for (let i = 0; i < 9; i++) {
        if (!isValidGroup(grid[i])) return false;
    }
    
    for (let i = 0; i < 9; i++) {
        let col = [];
        for (let j = 0; j < 9; j++) {
            col.push(grid[j][i]);
        }
        if (!isValidGroup(col)) return false;
    }
    
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            let box = [];
            for (let k = 0; k < 3; k++) {
                for (let g = 0; g < 3; g++) {
                    box.push(grid[i + k][j + g]);
                }
            }
            if (!isValidGroup(box)) return false;
        }
    }
    
    return true;
}

function clearGrid() {
    let solverVisible = document.getElementById("solver-container").style.display === "block";
    let tableId = solverVisible ? "sudoku-grid-solver" : "sudoku-grid";
    createGrid(tableId);
}

function generateRandomGrid() {
    let baseGrid = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(numbers);

    let numMap = {};
    for (let i = 0; i < 9; i++) {
        numMap[i + 1] = numbers[i];
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            baseGrid[i][j] = numMap[baseGrid[i][j]];
        }
    }

    // Shuffle rows within each 3-row block
    for (let i = 0; i < 9; i += 3) {
        let rows = [0, 1, 2];
        shuffle(rows);
        baseGrid.splice(i, 3, ...rows.map(r => baseGrid[i + r]));
    }

    // Shuffle columns within each 3-column block
    for (let i = 0; i < 9; i++) {
        let cols = [0, 1, 2];
        shuffle(cols);
        let newRow = [];
        for (let j = 0; j < 3; j++) {
            newRow.push(baseGrid[i][j * 3 + cols[0]]);
            newRow.push(baseGrid[i][j * 3 + cols[1]]);
            newRow.push(baseGrid[i][j * 3 + cols[2]]);
        }
        baseGrid[i] = newRow;
    }

    return baseGrid;
}

function generatePuzzle(difficulty) {
    console.log("Generating puzzle for", difficulty);
    let filledCells = difficulty === 'easy' ? 35 : difficulty === 'medium' ? 30 : 25;
    
    let grid = generateRandomGrid(); // Use a shuffled grid instead of a fixed one
    solve(grid);

    let cellsToRemove = 81 - filledCells;
    while (cellsToRemove > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (grid[row][col] !== 0) {
            grid[row][col] = 0;
            cellsToRemove--;
        }
    }
    setGrid("sudoku-grid", grid);
}


document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        let difficulty = this.getAttribute("data-difficulty");
        generatePuzzle(difficulty);
    });
});

document.getElementById("reset-btn").addEventListener("click", function() {
    let currentDifficulty = document.querySelector(".difficulty-btn.active").getAttribute("data-difficulty");
    generatePuzzle(currentDifficulty);
});
