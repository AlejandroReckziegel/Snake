const CANVAS = document.getElementById("gameCanvas");
const CTX = CANVAS.getContext('2d');
let snake = [{ x: 640, y: 288 }, { x: 624, y: 288 }, { x: 624, y: 288 }];
let direction = "right";
let intervalId;
let food = { x: 0, y: 0 };

const HEAD = {
    "up": "./images/snake head up.png",
    "down": "./images/snake head down.png",
    "left": "./images/snake head left.png",
    "right": "./images/snake head right.png"
};
const BODY = loadImage("./images/snake body.png");

let imagesLoaded = 0;

function loadImage(src) {
    const IMG = new Image();
    IMG.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === Object.keys(HEAD).length + 1) {
            generateFood();
            intervalId = setInterval(gameLoop, 150);
        }
    };
    IMG.src = src;
    return IMG;
}

for (let direction in HEAD) {
    HEAD[direction] = loadImage(HEAD[direction]);
}

window.addEventListener("load", () => {
    document.addEventListener("keydown", (event) => {
        const KEYPRESSED = event.key.toUpperCase();
        let nextDirection;
    
        switch (KEYPRESSED) {
            case "W":
                nextDirection = "up";
                break;
            case "A":
                nextDirection = "left";
                break;
            case "S":
                nextDirection = "down";
                break;
            case "D":
                nextDirection = "right";
                break;
            default:
                return;
        }

        const NEXTHEADX = snake[0].x + (nextDirection === "left" ? -16 : nextDirection === "right" ? 16 : 0);
        const NEXHEADY = snake[0].y + (nextDirection === "up" ? -16 : nextDirection === "down" ? 16 : 0);

        if (!checkSnakeCollision(NEXTHEADX, NEXHEADY)) {
            direction = nextDirection;
            clearInterval(intervalId);
            moveSnake();
            intervalId = setInterval(gameLoop, 150);
        }
    });   
});

function moveSnake() {
    let head;
    if (direction === "up") {
        head = { x: snake[0].x, y: snake[0].y - 16 };
    } else if (direction === "down") {
        head = { x: snake[0].x, y: snake[0].y + 16 };
    } else if (direction === "left") {
        head = { x: snake[0].x - 16, y: snake[0].y };
    } else if (direction === "right") {
        head = { x: snake[0].x + 16, y: snake[0].y };
    }
    snake.unshift(head);
    if (!checkFoodCollision()) {
        snake.pop();
    } else {
        generateFood();
    }
    if (!checkWallCollision() && !checkBodyCollision()) {
        drawSnake();
    }
    drawFood();
}

function drawSnake() {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    let head;
    switch (direction) {
        case "up":
            head = HEAD["up"];
            break;
        case "down":
            head = HEAD["down"];
            break;
        case "left":
            head = HEAD["left"];
            break;
        case "right":
            head = HEAD["right"];
            break;
        default:
            head = HEAD["right"];
            break;
    }
    CTX.drawImage(head, snake[0].x, snake[0].y, 16, 16);

    for (let i = 1; i < snake.length; i++) {
        CTX.drawImage(BODY, snake[i].x, snake[i].y, 16, 16);
    }
}

function checkBodyCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function checkWallCollision() {
    let head = snake[0];
    if (head.x == -16 || head.x == CANVAS.width || head.y == -16 || head.y == CANVAS.height) {
        return true;
    }
    return false;
}

function generateFood() {
    let newX, newY;
    do {
        newX = Math.floor(Math.random() * (CANVAS.width / 16)) * 16;
        newY = Math.floor(Math.random() * (CANVAS.height / 16)) * 16;
    } while (checkSnakeCollision(newX, newY));

    food = { x: newX, y: newY };
}

function checkSnakeCollision(x, y) {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) {
            return true;
        }
    }
    return false;
}

function drawFood() {
    CTX.fillStyle = "red";
    CTX.fillRect(food.x, food.y, 16, 16);
}

function checkFoodCollision() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

function gameLoop() {
    if (checkWallCollision() || checkBodyCollision()) {
        clearInterval(intervalId);
        return;
    }
    moveSnake();
}