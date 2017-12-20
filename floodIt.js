window.onload = function() {
	initGame();
}	

/* default game variables */
var colorsClass = ['red', 'blue', 'aqua', 'green', 'violette', 'yellow', 'brown', 'silver', 'pink'];	
var boardColors = colorsClass.length;
var tileWidth =  28;
var tileHeight = 28;

var board = new board_class();
	board.objMapId = 'board';

var resetBoard = [];
var boardSize = 7;
var moveCount = '';
var maxMoveCount = '';
var boardDificulty = 0;
var gameOver = false;

var boardHtml = $('#board');
var boardContentPadding = 4;
/* default game variables */

function getGameSettings() {
	boardSize = parseInt($('#boardSize option:selected').val());
	boardColors = parseInt($('#boardColors option:selected').val());
	boardDificulty = parseInt($('#boardDificulty option:selected').val());

	boardHtml.css('width', (boardSize * tileWidth + boardContentPadding));
	boardHtml.css('height', (boardSize * tileHeight + boardContentPadding));

	maxMoveCount = Math.round(boardSize * 2 - boardDificulty + (boardColors / 2));
	moveCount = 0;
	gameOver = false;
}

/* set default game stuff */
function initGame() {
	getGameSettings();

	// init game board
	board.cols = boardSize;
	board.rows = boardSize;
	board.init('');
	initBoard();
	board.draw();

	showGameControls(1);
	showInformation();
}
/* set default game stuff */

// Show the game information like moves, score
function showInformation() {
	$('#movesInfo').html(moveCount + ' / ' + maxMoveCount);
}

// Init the game board with the pieces
function initBoard () {
	var maxRows = board.getRows();
	var maxCols = board.getCols();
	var mainSquare = '';
	var boardPositionTop = boardHtml.position().top;
	var boardPositionLeft = boardHtml.position().left;
	var cursorWPixel = boardContentPadding;
	var cursorHPixel = boardContentPadding;

	// build board game with squares
	for (i = 0; i < maxRows; i++) {
		if ( i > 0 ) {
			cursorHPixel = i * tileHeight + boardPositionTop + boardContentPadding;
		} else {
			cursorHPixel = 0 + boardPositionTop + boardContentPadding;
		}

		for (j = 0; j < maxCols; j++) {
			if ( j > 0 ) {
				cursorWPixel = j * tileWidth + boardPositionLeft + boardContentPadding;
			} else {
				cursorWPixel = 0+ boardPositionLeft + boardContentPadding;
			}
			
			color = colorsClass[generateRandom(boardColors)];
			//piece = new board_piece_class();
			piece = board.getBoardPosition(i, j);
			piece.color = color;
			piece.className = 'tile ' + color;
			piece.value = 0;
			piece.posX = cursorWPixel;
			piece.posY = cursorHPixel;

			//board.setBoardPosition(i, j, piece);	

			if (i == 0 && j == 0) {
				mainSquare = piece;	
			}
		}
	}

	// get top left square and this is the main square
	mainSquare.value = 1;
	flood_neighbours(0, 0, mainSquare.color);

	// Create a backup from board in the initial state
	board.copy(resetBoard);
}

function resetToInitialBoard() {
	board.load(resetBoard);
}

// Show the game controls, like the button with the colors to click on them
function showGameControls(withEvents) {
	var counter = 0;
	var color, className;
	var output = '<TABLE border="1">';
		output += '<TR>';

	for (i = 0; i < boardColors; i++) {
		color = colorsClass[i];
		className = 'button ' + color;
		counter += 1;

		if (counter == 4) {
			output += '</TR><TR>';
			counter = 1;
		}

		if (withEvents) {
			output += '<TD CLASS="' + className + '" ONCLICK="flood(\'' + color + '\');"></TD>';
		} else {
			output += '<TD CLASS="' + className + '"></TD>';
		}
	}

	output += '</TR>';
	output += '</TABLE>';

	$('#controlPad').html(output);
}

// This function will return a boolean in the result of checking if there free squares that are not flooded
function all_flooded () {
	var maxRows = board.rows;
	var maxCols = board.cols;

	 /* Change the color of all the flooded squares. */
	for (i = 0; i < maxRows; i++) {	
		for (j = 0; j < maxCols; j++) {
			square = board.getBoardPosition(i, j);

            if (square.value == 0) {
                return false;
            }
        }
    }

    return true;
}

// Main game core engine function, this function will update all already flooded squares and will initialize the search for neighbours
function flood (color) {
	var maxRows = board.rows;
	var maxCols = board.cols;

    if (gameOver)
        return;

    if (board.getBoardPosition(0, 0).color == color)
        return;

    moveCount += 1;
	showInformation();

	 /* Change the color of all the flooded squares. */
	for (i = 0; i < maxRows; i++) {	
		for (j = 0; j < maxCols; j++) {
			square = board.getBoardPosition(i, j);

			if (square.value == 1) {
				square.color = color;
				square.className = 'tile ' + color;
			}
		}
	}

	 /* Change the color of all the neighbours with same color from the flooded squares. */
	for (i = 0; i < maxRows; i++) {	
		for (j = 0; j < maxCols; j++) {
			square = board.getBoardPosition(i, j);

			if (square.value == 1) {
				flood_neighbours(i, j, color);
			}
		}
	}

	// update graphics
	board.draw();

	// check game status
	if (all_flooded ()) {
        gameOver = true;
		showGameControls();

		if ( confirm ("You win. Play a new game?") ) {
			initGame();
        }
    } else if (moveCount == maxMoveCount) {
		if ( confirm("You lost. Repeat board?") ) {
			resetToInitialBoard();
			initGame();
		}
    }
}

// this function searchs for neighbours
function flood_neighbours (row, col, color) {
	if (row < boardSize - 1) {
		test_color_flood(row + 1, col, color);
	}

	if (row > 0) {
		test_color_flood(row - 1, col, color);
	}

	if (col < boardSize - 1) {
		test_color_flood(row, col + 1, color);
	}

	if (col > 0) {
		test_color_flood(row, col - 1, color);
	}
}

// this function will test if this square will be flooeded
function test_color_flood (row, col, color) {
	var square = board.getBoardPosition(row, col);

    if (square.value == 1)
        return;

    if (square.color == color) {
		square.value = 1;

        /* Recurse to make sure that we get any connected neighbours. */
        flood_neighbours (row, col, color);
    }
}
