const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');
let snake = [{ x: 640, y: 300 }, { x: 640, y: 300 }, { x: 640, y: 300 }];
let direction = "right";
let intervalId;

window.addEventListener("load", () => {
    setTimeout(() => {
        drawSnake();
        intervalId = setInterval(gameLoop, 500);
    }, 1000);
});

function drawSnake() {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    CTX.fillStyle = '#00ff00';
    snake.forEach((part) => {
        CTX.fillRect(part.x, part.y, 20, 20);
    });
}

document.addEventListener("keydown", (event) => {
    clearInterval(intervalId);
    if (event.key.toUpperCase() === "W" && direction !== "down") {
        direction = "up";
        moveSnake();
    } else if (event.key.toUpperCase() === "A" && direction !== "right") {
        direction = "left";
        moveSnake();
    } else if (event.key.toUpperCase() === "S" && direction !== "up") {
        direction = "down";
        moveSnake();
    } else if (event.key.toUpperCase() === "D" && direction !== "left") {
        direction = "right";
        moveSnake();
    }
    intervalId = setInterval(gameLoop, 500);
});

function moveSnake() {
    let head;
    if (direction === "up") {
        head = { x: snake[0].x, y: snake[0].y - 20 };
        snake.unshift(head);
        snake.pop();
    } else if (direction === "down") {
        head = { x: snake[0].x, y: snake[0].y + 20 };
        snake.unshift(head);
        snake.pop();
    } else if (direction === "left") {
        head = { x: snake[0].x - 20, y: snake[0].y };
        snake.unshift(head);
        snake.pop();
    } else if (direction === "right") {
        head = { x: snake[0].x + 20, y: snake[0].y };
        snake.unshift(head);
        snake.pop();
    }
    drawSnake();
}

function checkWallCollision() {
    let head = snake[0];
    if (head.x == 0 || head.x == CANVAS.width - 20 || head.y == 0 || head.y == CANVAS.height - 20) {
        return true;
    }
}

function gameLoop() {
    if (checkWallCollision()) {
        clearInterval(intervalId);
        return;
    }
    moveSnake();
}