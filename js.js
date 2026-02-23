const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const roadHeight = 5;
const roadColor = "#000"; // Black road color

// Define different step sizes for desktop and mobile
const desktopStepSize = 10; // Adjust as needed for desktop
const mobileStepSize = 2.8; // Adjust as needed for mobile
const characterWidth = 32; // Adjusted width
const characterHeight = 32; // Adjusted height
let x = 0; // Start the character at the left edge of the road
let y = canvasHeight - characterHeight - roadHeight; // Above the road
const stepSize = isMobileDevice() ? mobileStepSize : desktopStepSize;
let continuousMoveDirection = 0; // 0: No continuous move, 1: Move right, -1: Move left

// Load the character image
const characterImage = new Image();
characterImage.src = "images/ghost.webp"; // Updated path to character image
characterImage.onload = function() {
    // Once the image is loaded, display the character
    drawCharacter();
};
characterImage.onerror = function() {
    console.error("Error loading character image.");
};

// List of background images (scenes)
const backgroundImages = ["images/g-img-0.webp", "images/g-img-5.webp", "images/g-img-4.webp", "images/g-img-3.webp", "images/g-img-2.webp", "images/g-img-1.webp"]; // Updated paths
let currentBackgroundIndex = 0;

// Function to detect if the user is on a mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function drawRoad() {
    ctx.fillStyle = roadColor;
    ctx.fillRect(0, canvasHeight - roadHeight, canvasWidth, roadHeight); // Draw the road as a rectangle
}

function teleportCharacterToOppositeSide() {
    if (x <= 0) {
        // Teleport to the right side
        x = canvasWidth - characterWidth;
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
        canvas.style.backgroundImage = `url("${backgroundImages[currentBackgroundIndex]}")`;
    } else if (x + characterWidth >= canvasWidth) {
        // Teleport to the left side
        x = 0;
        currentBackgroundIndex = (currentBackgroundIndex - 1 + backgroundImages.length) % backgroundImages.length;
        canvas.style.backgroundImage = `url("${backgroundImages[currentBackgroundIndex]}")`;
    }
}

function moveCharacter(dx) {
    x += dx;

    // Check for teleport and background image change
    teleportCharacterToOppositeSide();

    drawCharacter();
}

function startContinuousMove(direction) {
    continuousMoveDirection = direction;
    continueMoving();
}

function stopContinuousMove() {
    continuousMoveDirection = 0;
}

function continueMoving() {
    if (continuousMoveDirection !== 0) {
        moveCharacter(continuousMoveDirection * stepSize);
        requestAnimationFrame(continueMoving);
    }
}

function drawCharacter() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawRoad();
    // Draw the character image
    ctx.drawImage(characterImage, x, y, characterWidth, characterHeight);
}

function handleKeyPress(event) {
    switch (event.key) {
        case "ArrowLeft":
            moveCharacter(-stepSize); // Move left
            break;
        case "ArrowRight":
            moveCharacter(stepSize); // Move right
            break;
        case "a":
            moveCharacter(-stepSize);
            break;
        case "d":
            moveCharacter(stepSize);
            break;
    }
}

function handleTouchStart(event) {
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    // Detect if the touch is on the left or right side of the canvas
    if (touchX < canvasWidth / 2) {
        // Left side, start continuous move to the left
        startContinuousMove(-1);
    } else {
        // Right side, start continuous move to the right
        startContinuousMove(1);
    }
}

function handleTouchEnd(event) {
    // Stop continuous movement when touch ends
    stopContinuousMove();
}

document.addEventListener("keydown", handleKeyPress);
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchend", handleTouchEnd);

// Call drawCharacter after the image is loaded
characterImage.addEventListener("load", drawCharacter);