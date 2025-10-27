//custom variables for y-coordinate of sun & horizon
let shapeHeight;

let designWidth = 400;
let designHeight= 400;
let horizon ;
function setup() {
  createCanvas(windowWidth,windowHeight);
  horizon =height/1.5;
}

function draw() {

  //shape follows y-coordinate of mouse
  shapeHeight = mouseY;
  currentWidth = mouseX;

  //light blue background if the shape is above horizon

  //with if-else statement
  if (shapeHeight < horizon) {
    background("orange"); // blue if above horizon
    
  } else {
    background("black"); // grey if below horizon
  }

  //sun
  fill("yellow");
  
  rect(width/2.5, shapeHeight, width/6);
  textSize(20);
  fill("white");
  text('Hi! My name is Alexander. I am a UW student.', currentWidth/2, shapeHeight/2);
  


  // draw line for horizon
  stroke('lavender');
  line(0,horizon,width,horizon);

  //grass

  fill("lightgreen");

  rect(0, horizon, width, height);

}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  horizon = height / 2; // recalc horizon after resize
}

