
var points = [[12,12], [250, 40], [200, 200], [388, 288], [100, 30],
              [50,50], [20, 250], [340, 120], [300, 200], [340, 80],
              [40,288], [50,140], [100, 200]
              /*[570,570], [500, 230], [780, 520], [725, 10], [510, 50],
              [10, 500], [20, 330], [120, 450], [230, 500], [60, 234],
              [400,400], [500, 340], [559, 490], [730, 320], [700, 545]*/
              ];

var canvas = document.getElementById("canvasLegend");
var context = canvas.getContext("2d");
var betterThanBlack = "#444";

context.font = "bold 18px Helvetica neue Helvetica sans-serif";
context.textBaseline = "top";
context.fillStyle = betterThanBlack;
context.fillText("Legend:",35,7);


context.font = "normal 16px Helvetica neue Helvetica sans-serif";

function drawCircle(x,y,r,color) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI*2, true);
  context.fillStyle = color;
  context.fill(); 
}

drawCircle(127, 20, 6, "red");
context.fillStyle = betterThanBlack;
context.fillText("Responsibility", 142,10);

drawCircle(280, 20, 6, "green");
context.fillStyle = betterThanBlack;
context.fillText("Availability", 295,10);

for(var i = 0; i < 10; i++) {
circleColor = "rgba(" + (i*25) + "," + (i*25) + ",255, 0.5)";
drawCircle(500 + (i*15), 20, 10, betterThanBlack);
drawCircle(500 + (i*15), 20, 11, circleColor);
}

context.fillStyle = betterThanBlack;
context.fillText("Exemplar", 410,10);

context.fillStyle = betterThanBlack;
context.fillText("Non-Exemplar", 655,10);








var pointsController = new PointsController(points);

var calcSim = new CalculateSimilarities(points);
var simMatrix = calcSim.calculateNegativeSquaredError();

var ap = new AffinityPropagation(simMatrix, pointsController);
ap.run();

var drawStaticShapes = new DrawStaticShapes("black","#eee","canvas");
drawStaticShapes.drawPointsWithLinesOnCanvas(points);

var drawMovingParticles = new DrawMovingParticles("blue", "canvas2", pointsController);
setInterval(drawMovingParticles.draw, 10);

