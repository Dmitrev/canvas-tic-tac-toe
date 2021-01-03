var wrapper;
var squares = [];
var turns = [];
var currentPlayer = 0; // Player 1 = 0, Player 2 = 1
var squareSize = 150;
var turnPaddingPercentage = 25;
var restartButton;
var gameOver = false;

function startGame() {
    myGameArea.start();
    drawBoard();
}

function drawBoard() {
    var id = 1;
    var gap = 5;
    var columns = 3;
    var rows = 3;

    // Calculate wrapper squareSize
    var wrapperSize = (squareSize * columns) + (gap * (columns + 1));

    var wrapperCenterX = (myGameArea.canvas.width - wrapperSize) / 2;
    var wrapperCenterY = (myGameArea.canvas.height - wrapperSize) / 2;

    var startX = wrapperCenterX + gap;
    var startY = wrapperCenterY + gap;
    var x = startX;
    var y = startY;

    wrapper = new Rect(wrapperSize, wrapperSize, '#474747', wrapperCenterX, wrapperCenterY);

    for (var i = 0; i < columns; i++) {

        for (var j = 0; j < rows; j++) {

            squares.push(
                new Square(id, squareSize, squareSize, '#fff', x, y)
            );

            id++;
            x += squareSize + gap;
        }

        x = startX;
        y += squareSize + gap;
    }
}

var myGameArea = {
    canvas: document.createElement('canvas'),
    start: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = window.requestAnimationFrame(updateGameArea);
        restartButton = new Button('Restart', this.canvas.width / 2, 300);

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    reset: function () {
        turns = [];
        currentPlayer = 0;
        gameOver = false;
    }
}

function Square(id, width, height, color, x, y) {
    Rect.call(this, width, height, color, x, y);

    this.id = id;
}

function Rect(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function TurnX(square) {
    this.square = square;
    this.topLeft = [this.square.x, this.square.y];
    this.bottomRight = [this.square.x + this.square.width, this.square.y + this.square.height];
    this.topRight = [this.square.x + this.square.width, this.square.y];
    this.bottomLeft = [this.square.x, this.square.y + this.square.height];

    this.update = function() {

        // Calc padding
        var padding = this.square.width * (turnPaddingPercentage / 100);


        // Apply padding

        var paddedTopLeft = [this.topLeft[0] + padding, this.topLeft[1] + padding];
        var paddedBottomRight = [this.bottomRight[0] - padding, this.bottomRight[1] - padding];
        var paddedTopRight = [this.topRight[0] - padding, this.topRight[1] + padding];
        var paddedBottomLeft = [this.bottomLeft[0] + padding, this.bottomLeft[1] - padding];


        var ctx = myGameArea.context;
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#FF0000';
        ctx.moveTo(paddedTopLeft[0], paddedTopLeft[1]);
        ctx.lineTo(paddedBottomRight[0], paddedBottomRight[1]);
        ctx.moveTo(paddedTopRight[0], paddedTopRight[1]);
        ctx.lineTo(paddedBottomLeft[0], paddedBottomLeft[1]);
        ctx.stroke();
    }
}

function TurnO(square) {
    this.square = square;

    this.update = function() {

        var paddingMultiplier = (100 - turnPaddingPercentage * 2) / 100;
        var radius = squareSize / 2 * paddingMultiplier;


        var centerX = this.square.x + (this.square.width / 2);
        var centerY = this.square.y + (this.square.height / 2);
        var ctx = myGameArea.context;
        ctx.beginPath();
        ctx.strokeStyle = '#0000FF';
        ctx.lineWidth = 10;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function nextTurn() {
    // trick to toggle between 0 & 1, by check if if divisible by 2
    currentPlayer = (currentPlayer + 1) % 2;
}

function updateTurnText() {
    let ctx = myGameArea.context;

    let currentPlayerIcon = currentPlayer === 0 ? 'X' : 'O';
    ctx.fillStyle = currentPlayer === 0 ? 'red' : 'blue';
    ctx.font = '50px sans-serif';
    let turnText;
    if (!gameOver) {
        turnText = `Player ${currentPlayerIcon} turn`;
    } else {
        turnText = `Game OVER Player ${currentPlayerIcon} won the game`;
    }
    let text = ctx.measureText(turnText);
    let centerX = (myGameArea.canvas.width - text.width) / 2;
    ctx.fillText(turnText, centerX, 200);
}

function Button(text, x, y) {
    this.width = null; // Computed based on the text
    this.height = null; // Computed based on the text
    this.text = text;
    this.x = x;
    this.y = y;

    this.update = function () {
        var border = 2;
        var padding = 10;
        let fontSize = 25;
        let ctx = myGameArea.context;
        ctx.textBaseline = 'top';
        ctx.font = `${fontSize}px sans-serif`;
        let text = ctx.measureText(`${this.text}`);

        var buttonWidth = text.width + (padding * 2);
        var offsetX = text.width / 2;
        var offsetY = fontSize / 2;
        var buttonHeight = fontSize + (padding * 2);

        // Border
        ctx.fillStyle = '#2a3d4a';
        let borderWidth = buttonWidth + (border * 2);
        let borderHeight = buttonHeight + (border * 2);
        let borderX = x - border - offsetX;
        let borderY = y - border - offsetY;
        ctx.fillRect(borderX, borderY, borderWidth, borderHeight);

        ctx.fillStyle = '#8bc5ff';
        ctx.fillRect(x - offsetX, y - offsetY, buttonWidth, buttonHeight);

        ctx.fillStyle = '#2a3d4a';
        ctx.fillText(this.text, x - offsetX + padding, y - offsetY + padding);

        this.width = borderWidth;
        this.height = borderHeight;
    }
}

function updateGameArea() {
    myGameArea.clear();

    wrapper.update();
    squares.forEach(function (square) {
        square.update();
    });

    turns.forEach(function(turn) {
        turn.update();
    });

    if (gameOver) {
        restartButton.update();
    }

    updateTurnText();

    window.requestAnimationFrame(updateGameArea);
}

function checkWin() {
    // Normalize data
    let turnsX = [];
    let turnsO = [];

    turns.forEach(function (turn) {
        if (turn instanceof TurnX) {
            turnsX.push(turn.square.id);
        } else {
            turnsO.push(turn.square.id);
        }
    });

    if (
        // horizontal
        (turnsX.includes(1) && turnsX.includes(2) && turnsX.includes(3))
        || (turnsX.includes(4) && turnsX.includes(5) && turnsX.includes(6))
        || (turnsX.includes(7) && turnsX.includes(8) && turnsX.includes(9))

        // vertical
        || ((turnsX.includes(1) && turnsX.includes(4) && turnsX.includes(7)))
        || ((turnsX.includes(2) && turnsX.includes(5) && turnsX.includes(8)))
        || ((turnsX.includes(3) && turnsX.includes(6) && turnsX.includes(9)))
        // Diagonal
        || ((turnsX.includes(1) && turnsX.includes(5) && turnsX.includes(9)))
        || ((turnsX.includes(3) && turnsX.includes(5) && turnsX.includes(7)))

    ) {

        gameOver = true;
        return true;

        // X Wins

    } else if (
        (turnsO.includes(1) && turnsO.includes(2) && turnsO.includes(3))
        || (turnsO.includes(4) && turnsO.includes(5) && turnsO.includes(6))
        || (turnsO.includes(7) && turnsO.includes(8) && turnsO.includes(9))

        // vertical
        || ((turnsO.includes(1) && turnsO.includes(4) && turnsO.includes(7)))
        || ((turnsO.includes(2) && turnsO.includes(5) && turnsO.includes(8)))
        || ((turnsO.includes(3) && turnsO.includes(6) && turnsO.includes(9)))
        // Diagonal
        || ((turnsO.includes(1) && turnsO.includes(5) && turnsO.includes(9)))
        || ((turnsO.includes(3) && turnsO.includes(5) && turnsO.includes(7)))
    ) {
        // O Wins
        gameOver = true;
        return true;
    }

    return false;
}

myGameArea.canvas.addEventListener('mousedown', function (e) {

    var clickedX = e.clientX;
    var clickedY = e.clientY;


    // Check if clicked on square
    squares.forEach(function (square) {
        if (gameOver) {
            return;
        }
        var minX = square.x;
        var maxX = square.x + square.width;

        var minY = square.y;
        var maxY = square.y + square.height;

        if (clickedX >= minX && clickedX <= maxX && clickedY >= minY && clickedY <= maxY) {
            var occupied = false;

            turns.forEach(function (turn) {
                if (turn.square.id === square.id) {
                    occupied = true;
                }
            });

            if (occupied === true) {
                return false;
            }

            var newTurn = currentPlayer === 0
                ? new TurnX(square)
                : new TurnO(square);


            turns.push(newTurn);

            if (!checkWin()) {
                nextTurn();
            }
        }
    });

    // Check if clicked on reset button
    var minX = restartButton.x;
    var maxX = restartButton.x + restartButton.width;

    var minY = restartButton.y;
    var maxY = restartButton.y + restartButton.height;

    if (clickedX >= minX && clickedX <= maxX && clickedY >= minY && clickedY <= maxY) {
        myGameArea.reset();
    }

});