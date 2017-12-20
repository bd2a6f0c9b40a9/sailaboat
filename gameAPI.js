function board_piece_class () {
	this.name = '';
	this.value = '';
	this.style = '';
	this.colour = '';
	this.className = '';
	this.posRow = '';
	this.posCol = '';
	this.cpu = '';
	this.html = '';
	this.posX = '';
	this.posY = '';
	this.posWidth = '';
	this.posHeight = '';
	
	this.draw = function() {
		return '<div class="' + this.className + '" style="top: ' + this.posY + 'px; left: ' + this.posX + 'px;"></div>';
	}
}

function board_class () {
	this.name = '';
	this.rows = '';
	this.cols = '';
	this.objMapId = '';
	this.board = [];

	this.init = function(obj) {
		for(var i = 0; i < this.rows; i++) {
			this.board[i] = [];

			for(var j = 0; j < this.cols; j++) {
				if (!obj || obj == '') {
					board.setBoardPosition(i, j, new board_piece_class());
				} else {
					this.board[i][j] = obj;
				}
			}
		}
	}

	this.getRows = function() { return this.rows; }
	this.getCols = function() { return this.cols; }

	this.getBoardPosition = function(x, y) { return this.board[x][y]; }
	this.setBoardPosition = function(x, y, obj) { this.board[x][y] = obj; }

	this.getAllBoardPositions = function() {
		var str = '';
		
		for(var i = 0; i < this.rows; i++) {
			str += '<br>';
			for(var j = 0; j < this.cols; j++) {
				str += this.getBoardPosition(i, j);
			}
		}

		return str;
	}

	this.draw = function() {
		var obj = this;
		var maxRows = obj.getRows();
		var maxCols = obj.getCols();
		var cellObj = '';		
		var output = '';

		for (i = 0; i < maxRows; i++) {
			for (j = 0; j < maxCols; j++) {
				cellObj = obj.getBoardPosition(i, j);

				output += cellObj.draw();
			}
		}

		document.getElementById(obj.objMapId).innerHTML = output;
	}

	this.copy = function(copyBoard) {
		var obj = this;
		var maxRows = obj.getRows();
		var maxCols = obj.getCols();
		var cellObj = '';

		for (i = 0; i < maxRows; i++) {
			copyBoard[i] = [];
			for (j = 0; j < maxCols; j++) {
				copyBoard[i][j] = obj.getBoardPosition(i, j);
			}
		}
	}
	
	this.load = function(loadBoard) {
		var obj = this;
		var cellObj = '';

		for (i = 0; i < loadBoard.length; i++) {
			for (j = 0; j < loadBoard[i].length; j++) {
				this.board[i][j] = loadBoard[i][j];
			}
		}
	}
}

function generateRandom (maxRange) {
	return Math.floor(Math.random() * (maxRange));
}

function getObj_byId (id) {
	return document.getElementById(id);
}
