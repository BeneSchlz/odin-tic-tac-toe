const GameBoard = (function(){
    // Private variable that represents the game board as an array with 9 empty slots (for a 3x3 grid)
    const Board = Array(9).fill("");

    // Public method to get the current state of the board
    const getBoard = function() {
        return Board; // Returns the board array so it can be viewed or used externally
    };

     // Public method to place a marker ('X' or 'O') on the board at a specific position
    const addMarker = function(pos, marker){
        // Check if the position is empty (not already occupied by a marker)
        if(Board[pos] === "" ){
            Board[pos] = marker; // If empty, place the marker ('X' or 'O') at the given position
        } else {
            return "Can't play this move"; // If the position is already taken, return an error message
        }
        return Board; // Return the updated board array (useful for debugging or checking the new state)
    }

     // Returning an object with the public methods (getBoard and addMarker)
    // These methods are accessible outside the GameBoard module, while the actual Board array remains private
    return {
        getBoard,   // Allows other objects to access the board's state
        addMarker   // Allows other objects to place markers on the board
    };

})();

const Player = function(name, marker) {
    // The Player factory function takes 'name' and 'marker' as parameters
    // and returns a new player object with those properties.
    return {
        name,   // The player's name (e.g., "Alice" or "Bob")
        marker  // The player's marker ("X" or "O")
    };
};

const GameController = (function() {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayerTurn = player1;

    // Define all possible winning combinations
    const winningCombinations = [
        [0, 1, 2], // Row 1
        [3, 4, 5], // Row 2
        [6, 7, 8], // Row 3
        [0, 3, 6], // Column 1
        [1, 4, 7], // Column 2
        [2, 5, 8], // Column 3
        [0, 4, 8], // Diagonal 1
        [2, 4, 6]  // Diagonal 2
    ];

    const boardElement = document.getElementById('gameBoard');
    const messageElement = document.getElementById('message');
    const restartBtn = document.getElementById('restartBtn');

    // Function to handle placing a marker on the board
    const playerMove = function(position) {
        const marker = currentPlayerTurn.marker;
        const result = GameBoard.addMarker(position, marker);

        if (result === "Can't play this move") {
            messageElement.textContent = "Invalid move. Try again.";
            return;
        }

        updateBoard();
        
        if (checkForWin()) {
            messageElement.textContent = `${currentPlayerTurn.name} wins!`;
            boardElement.removeEventListener('click', handleClick); // Stop further clicks
            return;
        }

        if (checkTie()) {
            messageElement.textContent = "It's a tie!";
            boardElement.removeEventListener('click', handleClick); // Stop further clicks
            return;
        }

        switchPlayerTurn(); 
    };

    // Function to switch turns
    const switchPlayerTurn = function() {
        currentPlayerTurn = currentPlayerTurn === player1 ? player2 : player1;
    };

    // Function to check if the current player has won
    const checkForWin = function() {
        const board = GameBoard.getBoard();
        return winningCombinations.some(combination => {
            return combination.every(index => board[index] === currentPlayerTurn.marker);
        });
    };

    const checkTie = function() {
        const board = GameBoard.getBoard(); 
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                return false;
            }
        }
        return true;
    };

    // Update the DOM to reflect the current board state
    const updateBoard = function() {
        const cells = boardElement.querySelectorAll('.cell');
        const board = GameBoard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    // Handle cell click
    const handleClick = function(event) {
        const index = event.target.dataset.index;
        if (index !== undefined) {
            playerMove(parseInt(index));
        }
    };

    // Restart the game
    const restartGame = function() {
        GameBoard = (function(){
            const Board = Array(9).fill("");
            const getBoard = function() {
                return Board;
            };
            const addMarker = function(pos, marker){
                if(Board[pos] === "" ){
                    Board[pos] = marker;
                } else {
                    return "Can't play this move";
                }
                return Board;
            };
            return {
                getBoard,
                addMarker
            };
        })();

        currentPlayerTurn = player1;
        updateBoard();
        messageElement.textContent = `${currentPlayerTurn.name}'s turn`;
        boardElement.addEventListener('click', handleClick);
    };

    boardElement.addEventListener('click', handleClick);
    restartBtn.addEventListener('click', restartGame);

    return {
        playerMove,
        restartGame
    };
})();