const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "./image/bg.png"

const coinImg = new Image();
coinImg.src = "./image/coin.png"

const coinMp3 = new Audio();
coinMp3.src = "./sounds/1.mp3"


let box = 32,
score = 0,
eat_data = 0,
color_snake = 000000,
speedTimer = 100,
pauseGame = false,
lost_units_of_tail = 0,
sizeCoin = 25,
speedSnake = 15;

let coin = {
    x: Math.floor((Math.random() * (39 * 32) + (1 * 32))),
    y: Math.floor((Math.random() * (14 * 32) + (3 * 32)))
}

let snake = [];
snake[0] = {
    x: 20 * box,
    y: 10 * box
}

document.addEventListener("keydown", direction);

let dir;

function direction(event) {
    //console.log(event.keyCode)
    if(event.keyCode == 68 && dir != "left") {
        dir = "right"
        // && dir != "left"
        //console.log("вправо")
    }
    if(event.keyCode == 65 && dir != "right") {
        dir = "left"
        // && dir != "right"
        //console.log("влево")
    }
    if(event.keyCode == 87 && dir != "back") {
        dir = "forward"
        // && dir != "back"
        //console.log("вперёд")
    }
    if(event.keyCode == 83 && dir != "forward") {
        dir = "back"
        // && dir != "forward"
        //console.log("назад")
    }
    if(event.keyCode == 80 && pauseGame == false) {
        clearInterval(game);
        pauseGame = true;
        return
    }
    if(event.keyCode == 80 && pauseGame == true) {
        game = setInterval(drawGame, speedTimer);
        pauseGame = false;
        return
    }
    if(event.keyCode == 107 && speedTimer < 300) {
        speedTimer += 1;
    }
    if(event.keyCode == 109 && speedTimer > 10) {
        speedTimer -= 1;
    }
}

function eatTail(head, arr) {
    for(let i = 0; i < arr.length; i++) {
        if(head.x == arr[i].x && head.y == arr[i].y) {
            for(let i_2 = i; i_2 < arr.length; i_2++) {
                snake.splice(i_2, 1);
                lost_units_of_tail += 1;
            }
        }
    }
}

function drawGame() { 
    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(coinImg, coin.x, coin.y, sizeCoin, sizeCoin)

    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "#c554ff" : `#d481ff`;
        ctx.fillRect(snake[i].x, snake[i].y, box, box)
    }
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(snakeX >= coin.x-sizeCoin && snakeX <= coin.x+sizeCoin && snakeY >= coin.y-sizeCoin && snakeY <= coin.y+sizeCoin) {
            score += 1;
            coin = {
                x: Math.floor((Math.random() * (40 * 32) + (1 * 32))),
                y: Math.floor((Math.random() * (15 * 32) + (3 * 32)))
            }
            coinMp3.play();
        } else {
            snake.pop();
        }

    /*if(snakeX == coin.x && snakeY == coin.y || 
        snakeX == coin.x+32) {
        score += 1;
        coin = {
            x: Math.floor((Math.random() * 39 + 2)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box,
        }
        coinMp3.play();
    } else {
        snake.pop();
    }*/

    if(snakeX < box && dir == "left") {
        snakeX = 1312;
        snakeY = snake[0].y;
    }
    if(snakeX > box * 40 && dir == "right") {
        snakeX = 0
        snakeY = snake[0].y;
    }
    if(snakeY < 3 * box && dir == "forward") {
        snakeX = snake[0].x;
        snakeY = 576;
    }

    if(snakeY > box * 17 && dir == "back") {
        snakeX = snake[0].x;
        snakeY = 64;
    }

    if(dir == "right") {
        snakeX += speedSnake;
        //console.log("вправо")
    }

    if(dir == "left") {
        snakeX -= speedSnake;
        //console.log("влево")
    }

    if(dir == "forward") {
        snakeY -= speedSnake;
        //console.log("вперёд")
    }

    if(dir == "back") {
        snakeY += speedSnake;
        //console.log("назад")
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    eatTail(newHead, snake);
    snake.unshift(newHead)

    ctx.fillStyle = "#6a6a6a";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.7, box * 1.8)

    ctx.fillStyle = "#6a6a6a";
    ctx.font = "10px Arial";
    ctx.fillText(`Скорость: ${speedTimer} (Нажмите клавишу P дважды чтобы обновить) [+/- - для изменения]`, box * 9.5, box * 1)

    ctx.fillStyle = "#6a6a6a";
    ctx.font = "10px Arial";
    ctx.fillText(`Потеряно единиц хвоста: ${lost_units_of_tail}`, box * 9.5, box * 1.3)
}

let game = setInterval(drawGame, speedTimer)