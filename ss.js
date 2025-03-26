const gridElement = document.getElementById('grid');
const cells = [];

// Create 81 input boxes (9x9 grid)
for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '9'; // fixed from 2 to 9
    input.className = 'cell';
    cells.push(input);
    gridElement.appendChild(input);
}

//Get values from the UI and build a 2-d array
function getGridValues() {
    const grid = [];
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            const value = parseInt(cells[i * 9 + j].value);
            if (isNaN(value)) {
                grid[i][j] = 0;
            } else {
                grid[i][j] = value;
            }
        }
    }
    return grid;
}

// Update UI with new values
function setGridValues(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cells[i * 9 + j].value = grid[i][j] === 0 ? '' : grid[i][j].toString();
        }
    }
}

function isValid(grid, row, col, num) {
    //check in that particular row or column 
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
            return false;
        }
    }
    //get the (r,c) of the left-top corner 
    const startrow = Math.floor(row / 3) * 3;
    const startcol = Math.floor(col / 3) * 3;
    //check in that 3*3 portion starting from(r,c)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startrow + i][startcol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

// Backtracking algorithm to solve the Sudoku
function solve(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solve(grid)) return true;
                        grid[row][col] = 0; // Backtrack
                    }
                }
                return false;
                //If no number from 1 to 9 worked, 
                //that means there’s no valid solution from this state,
                //so return false.
            }
        }
    }
    return true;
    //If all cells have been successfully filled 
    //(i.e., no 0 was found in the loops), 
    //it means the grid is fully solved → return true.
}

//Solve button action
function solveSudoku() {
    const grid = getGridValues();
    if (solve(grid)) {
        setGridValues(grid);
        alert("Sudoku Solved Successfully!");
    } else {
        alert("No solution exists for this puzzle.");
    }
}

// Clear the grid
function clearSudoku() {
    for (let i = 0; i < 81; i++) {
        cells[i].value = '';
    }
}