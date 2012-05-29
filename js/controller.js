function PointsController(points) {
  
  var NUM_NODES = points.length;

  var pointsArr = points; 
  var pointsLength = points.length;
  var pathArr = buildPathwayArray(pointsArr); 
  var rQueue = [];
  var aQueue = [];
  //This is the evidence that a point is an exemplar
  var eQueue = [];
  var selector = 0;
  var evidence = [];
  var exemplarResultsPerIter = [];

  /**
   * TODO: The affinity propagation is essentially correct. Although when I'm
   * creating the visualisation here I turn a number of things around, to 
   * illustrate the messages sent. I believe that it is still correct.
   */
  this.addResponsibilityToQueue = function (i, k) {
    var singleRPath = pathArr[(i * NUM_NODES) + k];
    rQueue.push(singleRPath);
  }

  this.addAvailabilityToQueue = function (i, k) {
    var singleSPath = pathArr[(k * NUM_NODES) + i]; 
    aQueue.push(singleSPath);
  }

  this.addEvidenceToQueue = function(k, total) {
    var nodeAndEvidence = [];
    nodeAndEvidence[0] = pointsArr[k][0];
    nodeAndEvidence[1] = pointsArr[k][1];
    nodeAndEvidence[2] = total;
    eQueue.push(nodeAndEvidence);
  }

  function getNextRSequence() {
    var rIteration = [];

    if (rQueue.length > 0) { 
      for (var i = 0; i < (pointsLength*pointsLength); i++) {
        rIteration.push(rQueue.shift());
      }
      return rIteration.reduce(function(a,b) {
          return a.concat(b);
        });

    } else {
      var emptyArr = [];
      return emptyArr;
    }
  }

  function getNextASequence() {
    var aIteration = [];
    if (aQueue.length > 0) { 
      for (var i = 0; i < (pointsLength*pointsLength); i++) {
        aIteration.push(aQueue.shift());
      }
      return aIteration.reduce(function(a,b) {
          return a.concat(b);
        });
    } else {
      var emptyArr = [];
      return emptyArr;
    }
  }

  this.getNextEvidence = function() {
    var eIteration = [];
    if (eQueue.length > 0) { 
      for (var i = 0; i < pointsLength; i++) {
        eIteration.push(eQueue.shift());
      }
      return eIteration;
    } else {
      var emptyArr = [];
      return emptyArr;
    }
  }


  this.getColor = function() {
    if((selector-1) % 2 == 0) {
      return "red";
    } else {
      return "green";
    } 
  } 

  this.getNextPath = function() {
    if (selector % 2 == 0) {
      selector++;
      return getNextRSequence();
    } else {
      selector++;
      return getNextASequence();
    }
  }

  function getIntermediatePoints(p1, p2) {
    var path = [];
    var numPoints = 10;
    var xOffset = (p1[0] - p2[0]) / numPoints;
    var yOffset = (p1[1] - p2[1]) / numPoints;

    path.push([p1[0], p1[1]]); 
    for (var i = 0; i < numPoints; i++) { 
      path.push([p1[0] - (i*xOffset), p1[1] - (i*yOffset)]);
    }
    path.push([p2[0], p2[1]]);
    
    return path;
  }

  function buildPathwayArray(arr) {
    var len = arr.length;
    var memQueue = [];
    for(var i = 0; i < len; i++) {
      for(var j = 0; j < len; j++) {
        memQueue.push(getIntermediatePoints(arr[i], arr[j]));
      }
    }
    return memQueue;
  }

  this.calculateExemplars = function(r,a) {
    //we can safely assume that the dimensionsion of a and r is the same.
    var dim = r.length;
    var iterResults = [];
    var maxValue = -1 * (Number.MAX_VALUE);
    //console.log(maxValue);

    for(var i = 0; i < dim; i++) {
      maxValue = -1 * (Number.MAX_VALUE);
      var currentMax = [];
      currentMax[0] = i;
      for (var k = 0; k < dim; k++) {

        if (k == i) {
          this.addEvidenceToQueue(k, a[k][k] + r[k][k]);
        }
        if((a[i][k] + r[i][k]) > maxValue) {
           currentMax[1] = k;
           maxValue = a[i][k] + r[i][k];
           currentMax[2] = maxValue;
        }
      }
      iterResults.push(currentMax);
      //console.log(iterResults);
    }
    exemplarResultsPerIter.push(iterResults);
  }

  this.getIterationExemplarResults = function() {
    return exemplarResultsPerIter.shift();
  }

  this.getPointAt = function(index) { 
    return points[index];
  }

}
