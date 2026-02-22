const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let square = {x: 55, y: 55, size: 40, color: "green"};
let gameWon = false;
let gameLost = false;
let keyReleased = true;

let timeLeft = 25;
let lastTime = performance.now();

function Player() {
ctx.fillStyle = square.color;
ctx.fillRect(square.x, square.y, square.size, square.size);
}

function gameLoop(timestamp) {
const delta = timestamp - lastTime;
lastTime = timestamp;

if (!gameWon && !gameLost) timeLeft -= delta / 1000;
if (timeLeft <= 0 && !gameWon) gameLost = true;

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "pink";
ctx.fillRect(0, 0, canvas.width, canvas.height);

drawMap();
Player();

ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.textAlign = "left";
ctx.textBaseline = "top";
ctx.fillText("Time: " + timeLeft.toFixed(1), 10, 10);

const tiles = getOverlappingTiles(square.x, square.y);
if (tiles.some(t => t.type === 2)) gameWon = true;

if (gameWon) {
ctx.fillStyle = "white";
ctx.font = "40px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("You won!", canvas.width / 2, canvas.height / 2 - 40);
ctx.fillText("Press ENTER to play again.", canvas.width / 2, canvas.height / 2 + 20);
return;
}

if (gameLost) {
ctx.fillStyle = "white";
ctx.font = "40px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("You ran out of time!", canvas.width / 2, canvas.height / 2 - 40);
ctx.fillText("Press ENTER to try again.", canvas.width / 2, canvas.height / 2 + 20);
return;
}

requestAnimationFrame(gameLoop);
}

function isWallAt(x, y) {
const col = Math.floor(x / tileSize);
const row = Math.floor(y / tileSize);
if (row < 0 || row >= map.length) return true;
if (col < 0 || col >= map[0].length) return true;
return map[row][col] === 1;
}

function isSquareColliding(x, y) {
const left = x;
const right = x + square.size;
const top = y;
const bottom = y + square.size;
return (
isWallAt(left, top) ||
isWallAt(right, top) ||
isWallAt(left, bottom) ||
isWallAt(right, bottom)
);
}

document.addEventListener("keydown", (event) => {
if (gameWon || gameLost) return;
const step = 3;
let newX = square.x;
let newY = square.y;
if (event.key === "ArrowLeft") newX -= step;
if (event.key === "ArrowRight") newX += step;
if (event.key === "ArrowUp") newY -= step;
if (event.key === "ArrowDown") newY += step;
if (!isSquareColliding(newX, newY)) {
square.x = newX;
square.y = newY;
}
});

document.addEventListener("keydown", (event) => {
if ((gameWon || gameLost) && keyReleased && event.key === "Enter") {
keyReleased = false;
resetGame();
}
});

document.addEventListener("keyup", () => {
keyReleased = true;
});

const tileSize = 50;

const map = [
[1,1,1,1,1,1,1,1,1,1],
[1,0,1,0,0,0,0,0,2,1],
[1,0,1,0,1,1,1,1,1,1],
[1,0,1,0,0,0,0,0,0,1],
[1,0,1,1,1,1,1,0,1,1],
[1,0,0,0,1,0,0,0,1,1],
[1,0,1,0,0,0,1,0,0,1],
[1,0,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1]
];

function drawMap() {
for (let r = 0; r < map.length; r++) {
for (let c = 0; c < map[r].length; c++) {
if (map[r][c] === 1) ctx.fillStyle = "grey";
else if (map[r][c] === 2) ctx.fillStyle = "orange";
else ctx.fillStyle = "yellow";
ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
}
}
}

function getOverlappingTiles(x, y) {
const tiles = [];
const left = Math.floor(x / tileSize);
const right = Math.floor((x + square.size - 1) / tileSize);
const top = Math.floor(y / tileSize);
const bottom = Math.floor((y + square.size - 1) / tileSize);
for (let r = top; r <= bottom; r++) {
for (let c = left; c <= right; c++) {
tiles.push({ row: r, col: c, type: map[r][c] });
}
}
return tiles;
}

function resetGame() {
square.x = 55;
square.y = 55;
gameWon = false;
gameLost = false;
timeLeft = 25;
lastTime = performance.now();
requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);