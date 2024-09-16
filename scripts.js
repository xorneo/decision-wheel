const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let options = [];
let startAngle = 0;
let arc;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

function addDecision() {
    const decisionList = document.getElementById("decision-list");
    const newInput = document.createElement("input");
    newInput.setAttribute("type", "text");
    newInput.setAttribute("class", "decision-input");
    newInput.setAttribute("placeholder", "Enter Decision");
    decisionList.appendChild(newInput);
}

function createWheel() {
    const inputs = document.querySelectorAll(".decision-input");
    options = [];
    
    inputs.forEach(input => {
        const value = input.value.trim();
        if (value) {
            options.push(value);
        }
    });
    
    if (options.length < 2) {
        alert("Please enter at least two decisions!");
        return;
    }

    // Show the wheel section
    document.getElementById('wheel-container').style.display = 'block';

    arc = Math.PI * 2 / options.length;  // Evenly divide the circle by the number of options
    drawWheel();
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;  // Set the radius of the wheel

    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous drawing

    // Draw each segment
    for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;
        
        // Rotate through 4 colors
        if (i % 4 === 0) {
            ctx.fillStyle = "#003300";  // Dark green
        } else if (i % 4 === 1) {
            ctx.fillStyle = "#00cc00";  // Light green
        } else if (i % 4 === 2) {
            ctx.fillStyle = "#007700";  // Medium green
        } else {
            ctx.fillStyle = "#004400";  // Darker green
        }

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Add text to the segment
        ctx.save();
        ctx.translate(centerX + Math.cos(angle + arc / 2) * (radius - 70), centerY + Math.sin(angle + arc / 2) * (radius - 70));  // Text positioning
        ctx.rotate(angle + Math.PI / 2);  // Keep the text upright
        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 18px Arial";
        ctx.fillText(options[i], -ctx.measureText(options[i]).width / 2, 0);  // Center text within the segment
        ctx.restore();
    }
}

function spinWheel() {
    // Set random starting angle and spin duration for unpredictability
    spinAngleStart = Math.random() * 10 + 10;  // Random starting spin angle between 10 and 20 degrees
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 5000;  // Spin for between 5 and 8 seconds for unpredictability
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;  // Increase spin time by 30 ms
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);  // Gradually slow the wheel down
    startAngle += (spinAngle * Math.PI) / 180;
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcd = (arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    ctx.save();
    ctx.font = "bold 24px 'Courier New', monospace";
    const resultText = options[index];
    document.getElementById("result").innerHTML = `Answer: ${resultText}`;
    ctx.restore();
}

// Adjusted easing function for unpredictability
function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);  // Easier deceleration for unpredictability
}
