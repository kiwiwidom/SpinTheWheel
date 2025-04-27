const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const addOptionButton = document.getElementById('addOptionButton');
const optionInput = document.getElementById('optionInput');
const spinSound = document.getElementById('spinSound');
const dingSound = document.getElementById('dingSound');
const clearSegmentsButton = document.getElementById("clearSegments");


// Start with empty options
let segments = [];
let colors = [
    "#A8CABA", "#C5E5CF", "#F8E6C1", "#FFB6B9", "#C9C9FF", "#D5AAFF", "#FFEAA7", "#A29BFE", "#81ECEC", "#FAB1A0",
    "#E0BBE4", "#D6E2E9", "#FDE2E2", "#FFDAC1", "#B5EAD7", "#C7CEEA", "#FFD6E0", "#F5F3F4", "#BEE1E6", "#DEFDE0",
    "#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF", "#FFFFFC", "#D0F4DE",
    "#FFEFCA", "#F9C6C9", "#CCE2CB", "#E5E3C9", "#F2C6C2", "#D0E8F2", "#F7D9C4", "#F9F3DF", "#E6E6FA", "#DAD5D5",
    "#C1DADB", "#F8ECD1", "#E2F0CB", "#FFCCBC", "#CFD8DC", "#FFE0B2", "#B2EBF2", "#DCEDC8", "#E1BEE7", "#D7CCC8"
];

let startAngle = 0;
let arc = 0; // No arc yet
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;


// Draw the wheel
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the marker above the wheel
    ctx.save();
    ctx.fillStyle = "red"; // Marker color
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 10, 20); // Start at the left part of the marker
    ctx.lineTo(canvas.width / 2 + 10, 20); // Draw to the right part of the marker
    ctx.lineTo(canvas.width / 2, 0); // Tip of the marker
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
  if (segments.length === 0) {
    // If no segments yet, show a message
    ctx.save();
    ctx.font = "20px 'Quicksand', sans-serif";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.fillText("Add options to spin the wheel!", canvas.width / 2, canvas.height / 2);
    ctx.restore();
    return;
  }
  arc = Math.PI / (segments.length / 2); // Update arc size
  for (let i = 0; i < segments.length; i++) {
    // Draw the marker above the wheel
        
    let angle = startAngle + i * arc;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + arc, false);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();

    // Text
    ctx.save();
    ctx.fillStyle = "black";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.font = "bold 20px 'Quicksand', sans-serif";
    ctx.fillText(segments[i], canvas.width / 2 - 10, 10);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "red"; // Marker color
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 10, 20); // Start at the left part of the marker
    ctx.lineTo(canvas.width / 2 + 10, 20); // Draw to the right part of the marker
    ctx.lineTo(canvas.width / 2, 0); // Tip of the marker
    ctx.closePath();
    ctx.fill()
  }
  ctx.save();
  ctx.fillStyle = "red"; // Marker color
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 10, 20); // Start at the left part of the marker
  ctx.lineTo(canvas.width / 2 + 10, 20); // Draw to the right part of the marker
  ctx.lineTo(canvas.width / 2, 0); // Tip of the marker
  ctx.closePath();
  ctx.fill()
}

// Spin logic
function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  let degrees = startAngle * 180 / Math.PI + 90;
  let arcd = arc * 180 / Math.PI;
  let index = Math.floor((360 - degrees % 360) / arcd) % segments.length;

  ctx.save();
  ctx.font = "bold 20px 'Quicksand', sans-serif";
  ctx.fillStyle = "black";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWheel();
  
  // Calculate position for text box
  const text = "You got: " + segments[index];
  const textWidth = ctx.measureText(text).width;
  const padding = 20;
  const boxWidth = textWidth + 2 * padding;
  const boxHeight = 45; // Height of the box, based on text size
  const radius = 15; // Radius for rounded corners


  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - boxWidth / 2 + radius, canvas.height / 2 - boxHeight / 2); // Start path from the rounded corner
  ctx.arcTo(canvas.width / 2 - boxWidth / 2, canvas.height / 2 - boxHeight / 2, canvas.width / 2 - boxWidth / 2, canvas.height / 2 - boxHeight / 2 + boxHeight, radius); // Top-left corner
  ctx.arcTo(canvas.width / 2 - boxWidth / 2, canvas.height / 2 - boxHeight / 2 + boxHeight, canvas.width / 2 - boxWidth / 2 + boxWidth, canvas.height / 2 - boxHeight / 2 + boxHeight, radius); // Bottom-left corner
  ctx.arcTo(canvas.width / 2 - boxWidth / 2 + boxWidth, canvas.height / 2 - boxHeight / 2 + boxHeight, canvas.width / 2 - boxWidth / 2 + boxWidth, canvas.height / 2 - boxHeight / 2, radius); // Bottom-right corner
  ctx.arcTo(canvas.width / 2 - boxWidth / 2 + boxWidth, canvas.height / 2 - boxHeight / 2, canvas.width / 2 - boxWidth / 2, canvas.height / 2 - boxHeight / 2, radius); // Top-right corner
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "black"; // Text color
  ctx.fillText(text, canvas.width / 2 - 60, canvas.height / 2 + 5);

  ctx.restore();
  dingSound.play();
}

function easeOut(t, b, c, d) {
  let ts = (t /= d) * t;
  let tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

// Add new option
addOptionButton.addEventListener("click", function() {
    const inputText = optionInput.value.trim();
    if (inputText !== "") {
      const newOptions = inputText.split(",").map(opt => opt.trim()).filter(opt => opt.length > 0);
  
      for (let option of newOptions) {
        segments.push(option);
        colors.push("#" + Math.floor(Math.random() * 16777215).toString(16)); // Random color
      }
  
      optionInput.value = ""; // Clear input
      saveSegments();
      drawWheel();
    }
  });

// Start spinning
spinButton.addEventListener("click", function() {
  if (segments.length === 0) return;
  spinAngleStart = Math.random() * 100 + 200;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3000 + 4000;
  rotateWheel();
  spinSound.play();
});


// Cookie Manager
function saveSegments() {
  document.cookie = "wheelSegments=" + encodeURIComponent(JSON.stringify(segments)) + "; path=/; max-age=" + (60*60*24*30); // 30 days
}

function loadSegments() {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === "wheelSegments") {
      segments = JSON.parse(decodeURIComponent(value));
      break;
    }
  }
}

clearSegmentsButton.addEventListener("click", function() {
  segments = [];
  saveSegments();
  drawWheel();
});

loadSegments();
drawWheel();


