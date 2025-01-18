const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameArea = document.getElementById("game-area");
const happinessBar = document.getElementById("happiness-bar");
const dangerBar = document.getElementById("danger-bar");
const happinessText = document.getElementById("happiness-text");
const dangerText = document.getElementById("danger-text");
const gameOverScreen = document.getElementById("game-over");
const startGameButton = document.getElementById("start-game");
const restartGameButton = document.getElementById("restart-game");
const baby = document.getElementById("baby");
const showInstructionsButton = document.getElementById("show-instructions");
const instructions = document.getElementById("instructions");
const closeInstructionsButton = document.getElementById("close-instructions");

// Hiển thị hướng dẫn
showInstructionsButton.addEventListener("click", () => {
    instructions.classList.remove("hidden");
});

// Đóng hướng dẫn
closeInstructionsButton.addEventListener("click", () => {
    instructions.classList.add("hidden");
});

let happiness = 100;
let danger = 0;
let isPlaying = false;
let bubbles = [];
const BASE_SPEED = 4.5; // Tốc độ cơ bản
let bubbleInterval;
let clickCount = 0;
window.addEventListener("resize", () => {
    if (!isPlaying) return;
    const gameAreaRect = gameArea.getBoundingClientRect();
    bubbles.forEach(bubble => {
        const rect = bubble.getBoundingClientRect();
        if (
            rect.left < 0 ||
            rect.right > gameAreaRect.width ||
            rect.bottom > gameAreaRect.height
        ) {
            bubble.remove();
        }
    });
});
// Start game
startGameButton.addEventListener("click", () => {
    menu.classList.add("hidden");
    game.classList.remove("hidden");
    startGame();
});

// Restart game
restartGameButton.addEventListener("click", () => {
    location.reload();
});
function updateBars() {
    happinessText.textContent = `Vui vẻ: ${happiness.toFixed(1)}%`;
    dangerText.textContent = `Nguy hiểm: ${danger.toFixed(1)}%`;

    if (happiness <= 0 || danger >= 100) {
        endGame();
    }
}

// Game loop
function startGame() {
    happiness = 100;
    danger = 0;
    clickCount = 0;
    isPlaying = true;
    gameOverScreen.classList.add("hidden");
    updateBars();
    decreaseHappiness();
    setupBabyClick();
}

// Update bars
function updateBars() {
    happinessBar.style.width = `${happiness}%`;
    happinessText.textContent = `Vui vẻ: ${happiness.toFixed(1)}%`;
    dangerBar.style.width = `${danger}%`;
    dangerText.textContent = `Nguy hiểm: ${danger}%`;

    if (happiness <= 0 || danger >= 100) {
        endGame();
    }
}

// Decrease happiness over time
function decreaseHappiness() {
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        happiness -= 3; // Giảm dần theo thời gian
        updateBars();
    }, 500);
}

// Baby click logic
function setupBabyClick() {
    baby.addEventListener("click", () => {
        console.log("Baby clicked!");
        if (!isPlaying) return;

        // Tăng happiness theo tỷ lệ giảm dần
        clickCount++;
        if (clickCount <= 10) {
            happiness = Math.min(happiness + 10, 100);
        } else if (clickCount <= 30) {
            happiness = Math.min(happiness + 5, 100);
        } else {
            happiness = Math.min(happiness + 2, 100);
        }

        updateBars();
        createBubbles();
    });
}

// Create bubbles
function createBubbles() {
    const numBubbles = Math.floor(Math.random() * 10) + 1; // Số bóng ngẫu nhiên
    const gameAreaRect = gameArea.getBoundingClientRect();
    const babyRect = baby.getBoundingClientRect();

    for (let i = 0; i < numBubbles; i++) {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");

        const size = Math.random() * 30 + 20; // Kích thước ngẫu nhiên
        const speed = BASE_SPEED + Math.random(); // Tốc độ ngẫu nhiên

        const startX = Math.random() * gameAreaRect.width; // Vị trí ngang ngẫu nhiên
        const startY = gameAreaRect.height - (babyRect.bottom - gameAreaRect.top); // Vị trí dọc dựa vào đứa bé

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${startX}px`;
        bubble.style.bottom = `${startY}px`;

        // Đăng ký sự kiện click cho bóng
        bubble.addEventListener("click", () => {
            bubble.remove(); // Xóa bóng khi click
            danger = Math.max(danger - 2, 0); // Giảm mức nguy hiểm
            updateBars(); // Cập nhật thanh trạng thái
        });

        // Di chuyển bóng lên trên
        setTimeout(() => {
            bubble.style.transition = `transform ${speed}s linear`;
            bubble.style.transform = `translateY(-${gameAreaRect.height + size}px)`; // Bóng bay lên trần
        }, 100);

        // Xử lý khi bóng chạm trần
        bubble.addEventListener("transitionend", () => {
            const bubbleRect = bubble.getBoundingClientRect();
            if (bubbleRect.top <= gameAreaRect.top) {
                danger = Math.min(danger + 10, 100); // Tăng mức nguy hiểm khi chạm trần
                updateBars();
            }
            bubble.remove(); // Xóa bóng
        });

        gameArea.appendChild(bubble);
    }
}
// End game
// End game
function endGame() {
    isPlaying = false;
    gameOverScreen.classList.remove("hidden");
    gameOverScreen.style.display = "block"; // Hiển thị thông báo Game Over
}