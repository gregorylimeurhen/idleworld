// To define character and map
var character = document.querySelector(".character");
var map = document.querySelector(".map");

// To set initial position
var x = 88.5;
var y = 34;

// To handle directional (and multi-directional) input
var held_directions = [];
// To set speed in px/frame
var speed = 1;

const placeCharacter = () => {
  var pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')); // To set pixelSize

  const held_direction = held_directions[0]; // To set held_direction to first item in held_directions array
  // To set up player movement
  if (held_direction) {
    if (held_direction === directions.right) { x += speed; }
    if (held_direction === directions.left) { x -= speed; }
    if (held_direction === directions.down) { y += speed; }
    if (held_direction === directions.up) { y -= speed; }
    character.setAttribute("facing", held_direction);
  }
  character.setAttribute("walking", held_direction ? "true" : "false");

  // To create "walls"
  var leftLimit = -8;
  var rightLimit = (16 * 11) + 8;
  var topLimit = -8 + 32;
  var bottomLimit = (16 * 7);
  if (x < leftLimit) { x = leftLimit; }
  if (x > rightLimit) { x = rightLimit; }
  if (y < topLimit) { y = topLimit; }
  if (y > bottomLimit) { y = bottomLimit; }

  // To create margins for camera so that player is centred
  var camera_left = pixelSize * 66;
  var camera_top = pixelSize * 42;

  // To move (translate, in 2D) map and character
  map.style.transform = `translate3d( ${-x * pixelSize + camera_left}px, ${-y * pixelSize + camera_top}px, 0 )`;
  character.style.transform = `translate3d( ${x * pixelSize}px, ${y * pixelSize}px, 0 )`;
}


// To set up game loop
const step = () => {
  placeCharacter();
  window.requestAnimationFrame(() => {
    step();
  })
}

// To initiate game loop
step();

// To define directions
const directions = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
}

// To define keybinds for directions
const keys = {
  87: directions.up,
  65: directions.left,
  68: directions.right,
  83: directions.down,
}


document.addEventListener("keydown", (e) => {
  var dir = keys[e.which];
  if (dir && held_directions.indexOf(dir) === -1) {
    held_directions.unshift(dir); // To add dir to start of array, as first item
  }
})

document.addEventListener("keyup", (e) => {
  var dir = keys[e.which];
  var index = held_directions.indexOf(dir);
  if (index > -1) {
    held_directions.splice(index, 1); // To remove dir from array
  }
});

// To add dpad functionality for mouse and touch
var isPressed = false;
const removePressedAll = () => {
  document.querySelectorAll(".dpad-button").forEach(d => {
    d.classList.remove("pressed")
  })
}

document.body.addEventListener("mousedown", () => {
  console.log('mouse is down')
  isPressed = true;
});

document.body.addEventListener("mouseup", () => {
  console.log('mouse is up')
  isPressed = false;
  held_directions = [];
  removePressedAll();
});

const handleDpadPress = (direction, click) => {
  if (click) {
    isPressed = true;
  }

  held_directions = (isPressed) ? [direction] : []

  if (isPressed) {
    removePressedAll();
    document.querySelector(".dpad-" + direction).classList.add("pressed");
  }
}

// To bind events for dpad
document.querySelector(".dpad-left").addEventListener("touchstart", (e) => handleDpadPress(directions.left, true));
document.querySelector(".dpad-up").addEventListener("touchstart", (e) => handleDpadPress(directions.up, true));
document.querySelector(".dpad-right").addEventListener("touchstart", (e) => handleDpadPress(directions.right, true));
document.querySelector(".dpad-down").addEventListener("touchstart", (e) => handleDpadPress(directions.down, true));

document.querySelector(".dpad-left").addEventListener("mousedown", (e) => handleDpadPress(directions.left, true));
document.querySelector(".dpad-up").addEventListener("mousedown", (e) => handleDpadPress(directions.up, true));
document.querySelector(".dpad-right").addEventListener("mousedown", (e) => handleDpadPress(directions.right, true));
document.querySelector(".dpad-down").addEventListener("mousedown", (e) => handleDpadPress(directions.down, true));

document.querySelector(".dpad-left").addEventListener("mouseover", (e) => handleDpadPress(directions.left));
document.querySelector(".dpad-up").addEventListener("mouseover", (e) => handleDpadPress(directions.up));
document.querySelector(".dpad-right").addEventListener("mouseover", (e) => handleDpadPress(directions.right));
document.querySelector(".dpad-down").addEventListener("mouseover", (e) => handleDpadPress(directions.down));