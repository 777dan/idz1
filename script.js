const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("scoreText");
const gameOver = document.getElementById("gameOver");
const menu = document.getElementById("menu");
const pause = document.getElementById("pause");
const finalScoreText = document.getElementById("finalScore");

const imgRoad = new Image();
imgRoad.src = "./images/road.png";
const imgPlayer = new Image();
imgPlayer.src = "./images/player.png";

const npcImages = [
    new Image(),
    new Image(),
    new Image()
];
npcImages[0].src = "./images/npc1.png";
npcImages[1].src = "./images/npc2.png";
npcImages[2].src = "./images/npc3.png";

let score = 0;
let gameStarted = false;
let isGameOver = false;
let isPaused = false;
let roadY = 0;
let speed = 8;
let spawnInterval;
let gameInterval;

const lanes = [40, 100, 160, 220];
let playerLane = 2;
let npcArr = [];
const carWidth = 40;

const player = {
    x: lanes[playerLane],
    y: 330,
    width: 40,
    height: 70
};

imgPlayer.onload = () => {
    player.height = player.width * (imgPlayer.naturalHeight / imgPlayer.naturalWidth);
};

function togglePause() {
    if (!gameStarted || isGameOver) return;
    isPaused = !isPaused;

    if (isPaused) {
        pause.classList.remove("hidden");
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
    } else {
        pause.classList.add("hidden");
        gameInterval = setInterval(update, 20);
        spawnInterval = setInterval(spawnNpc, 1500);
    }
}


window.addEventListener("keydown", (e) => {
    if (!gameStarted || isGameOver) return;
    if (e.key === "p" || e.key === "P") {
        togglePause();
    }

    if (e.key === "ArrowLeft") {
        if (playerLane > 0) {
            playerLane--;
            player.x = lanes[playerLane];
        }
    } else if (e.key === "ArrowRight") {
        if (playerLane < lanes.length - 1) {
            playerLane++;
            player.x = lanes[playerLane];
        }
    }
});

function spawnNpc() {
    if (!gameStarted || isGameOver || isPaused) return;

    let pos_x = lanes[Math.floor(Math.random() * lanes.length)];

    let isLaneBlocked = false;
    for (let i = 0; i < npcArr.length; i++) {
        if (npcArr[i].x === pos_x && npcArr[i].y < 50) {
            isLaneBlocked = true;
            break;
        }
    }

    if (isLaneBlocked) return;

    let randomImg = npcImages[Math.floor(Math.random() * npcImages.length)];

    const npcObj = {
        x: pos_x,
        y: -100,
        width: carWidth,
        height: 70,
        speed: 3,
        img: randomImg
    };

    npcObj.height = npcObj.width * (randomImg.naturalHeight / randomImg.naturalWidth);
    npcArr.push(npcObj);
}

function start() {
    score = 0;
    npcArr = [];
    isGameOver = false;
    isPaused = false;
    playerLane = 2;
    player.x = lanes[playerLane];
    pause.classList.add("hidden");
    gameOver.classList.add("hidden");
    menu.classList.add("hidden");
    gameStarted = true;

    clearInterval(spawnInterval);
    clearInterval(gameInterval);
    spawnInterval = setInterval(spawnNpc, 1500);
    gameInterval = setInterval(update, 20);
}

function update() {
    if (!gameStarted || isGameOver || isPaused) return;

    roadY += speed;
    if (roadY >= canvas.height) roadY = 0;

    for (let i = 0; i < npcArr.length; i++) {
        npcArr[i].y += (speed - npcArr[i].speed);
        let colX = player.x < npcArr[i].x + npcArr[i].width && player.x + player.width > npcArr[i].x;
        let colY = player.y < npcArr[i].y + npcArr[i].height && player.y + player.height > npcArr[i].y;

        if (colX && colY) {
            isGameOver = true;
            clearInterval(spawnInterval);
            clearInterval(gameInterval);
            finalScoreText.innerText = "Пройдено: " + Math.floor(score) + " км";
            gameOver.classList.remove("hidden");
            return;
        }
    }

    npcArr = npcArr.filter(npc => npc.y < canvas.height + 150);
    score += 0.05;
    scoreText.innerText = "Дистанція: " + Math.floor(score) + " км";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgRoad, 0, roadY, canvas.width, canvas.height);
    ctx.drawImage(imgRoad, 0, roadY - canvas.height, canvas.width, canvas.height);

    for (let i = 0; i < npcArr.length; i++) {
        ctx.drawImage(npcArr[i].img, npcArr[i].x, npcArr[i].y, npcArr[i].width, npcArr[i].height);
    }

    ctx.drawImage(imgPlayer, player.x, player.y, player.width, player.height);
}