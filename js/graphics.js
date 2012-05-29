/*
 * This will be an object that will take care of all the drawing procedures. It
 * will draw on the canvas element and create the html & css that will be
 * included. Since only one instance of the object is needed I will create it
 * like this because this forces it to be a singleton.
 */
function DrawStaticShapes(nodeColor, lineColor, canvasId) {
  /*
   * Private static variables used for drawing on the canvas html5 element.
   */
  var CANVAS_WIDTH = 400;
  var CANVAS_HEIGHT = 300;
  var POINT_RADIUS = 10;
  var CANVAS_TOP_OFFSET = 100;
  var CANVAS_LEFT_OFFSET = 0;

  /*
   * Private variables that references the canvas html element as well as the
   * context object. It is assumed that the canvas element to use has id
   * canvas.
   */
  var canvas = document.getElementById(canvasId);
  var context = canvas.getContext("2d");

  /*
   * A private method which creates a new point the the canvas.
   */
  function canvasCircle(x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, true);
    context.fillStyle = nodeColor;
    context.fill(); 
  }

  /*
   * A private method which creates a line between to points.
   */
  function canvasStroke(from, to) {
    context.beginPath();
    context.moveTo(from[0], from[1]);
    context.lineTo(to[0], to[1]);
    context.strokeStyle = lineColor;
    context.stroke();
  }
  
  /*
   * Public function which draws all the points specified in the points array
   * as well as connecting lines between them on the canvas element.
   */
  this.drawPointsWithLinesOnCanvas = function(points) {
    var num_points = points.length;
    
    for(var i = 0; i < num_points; i++) {
      for(var j = i + 1; j < num_points; j++) {
        canvasStroke(points[i], points[j]);
      }
    }

    var num_points = points.length;
    for (var i = 0; i < num_points; i++) {
      canvasCircle(points[i][0], points[i][1], POINT_RADIUS);
    }
  }
}

function DrawMovingParticles(nodeColor, canvasId, pointsController) {
  
  /*
   * Private static variables used for drawing on the canvas html5 element.
   */
  var CANVAS_WIDTH = 800;
  var CANVAS_HEIGHT = 600;
  var POINT_RADIUS = 10;
  var CANVAS_TOP_OFFSET = 100;
  var CANVAS_LEFT_OFFSET = 0;


  var controller = pointsController;

  var path = [];
  var pathLength = 0;
  var pathPos = 0;
  var cnt = 0;
  /*
   * Private variables that references the canvas html element as well as the
   * context object. It is assumed that the canvas element to use has id
   * canvas.
   */
  var canvas = document.getElementById(canvasId);
  var context = canvas.getContext("2d");
  var canvas3 = document.getElementById("canvas3");
  var context3 = canvas3.getContext("2d");


  function canvasStroke3(from, to) {
    context3.beginPath();
    context3.moveTo(from[0], from[1]);
    context3.lineTo(to[0], to[1]);
    context3.strokeStyle = "black";
    context3.stroke();
  }


  function canvasCircle3(x, y, r, e) {
    context3.beginPath();
    context3.arc(x, y, r, 0, Math.PI*2, true);
    context3.fillStyle = "rgba(" + e + "," + e + ",255, 0.5)";
    context3.strokeStyle = "rgba(" + e + "," + e + ",255, 0.5)";
    context3.fill(); 
  }

  function drawExemplars() {
    context3.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    var iterResult = controller.getIterationExemplarResults();
    var length = iterResult.length;

    for(var i = 0; i < length; i++) {
      var indexStart  = iterResult[i][0];
      var indexEnd = iterResult[i][1];
      var pointStart = controller.getPointAt(indexStart);
      var pointEnd = controller.getPointAt(indexEnd);
      canvasStroke3(pointStart, pointEnd);
    }

    var evidence = controller.getNextEvidence();
    var values = [];
    for (var i = 0; i < length; i++) {
      evidence[i][2] = (evidence[i][2] < 0) ? 0 : evidence[i][2];
      values.push(evidence[i][2]);
    }
    var max = Math.max.apply(Math, values);
    max = max <= 0 ? 1 : max;
    
    for(var i = 0; i < length; i++) {
      console.log(evidence[i][2] + ", " + max);
      evidence[i][2] = evidence[i][2] / max;
    }

    //Get max value in the array
    
    for(var i = 0; i < length; i++) {
      //var index  = iterResult[i][1];
      //var point = controller.getPointAt(index);
      var nodeColor = evidence[i][2] > 0 ? Math.round(255*(1-evidence[i][2])) : 255;
      
      canvasCircle3(evidence[i][0], evidence[i][1], 11, nodeColor);
      console.log(evidence[i]);
      /*console.log(max);
      console.log(255*evidence[i][2]);*/
      console.log(nodeColor);
    }
  }


  /*
   * A private method which creates a new point the the canvas.
   */
  function canvasCircle(x, y, r) {
    context.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, true);
    context.fillStyle = controller.getColor();
    context.fill(); 
  }

  this.draw = function() {
    if (pathLength == pathPos) {
      //a stroke draw should happen here
      path = controller.getNextPath();
      pathLength = path.length;  
      pathPos = 0;
      //a stroke assignment should happen here 
      if(cnt == 2){
        drawExemplars();
        cnt = 0;
      }
      cnt++;
    } else {
      canvasCircle(path[pathPos][0], path[pathPos][1], 5);
      pathPos++;
    }
  }
   
}

















