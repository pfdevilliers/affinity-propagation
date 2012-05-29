function CalculateSimilarities(points2d) {
  
  var points = points2d;

  function createAndInitArray(dim){
    var array = new Array(dim);
    for(var i = 0; i < dim; i++) {
        array[i] = new Array(dim);
      for(var j = 0; j < dim; j++) {
        array[i][j] = 0;
      }
    }
    return array;
  }

  function sortNumber(a, b) {
    return a - b;
  }
  
  function negSquaredErr(x, y) {
    return -1 * (Math.pow(x[0]-y[0],2) + Math.pow(x[1]-y[1],2));
  }

  function setPrefAsMedian(arr) {
    var len = arr.length;
    var flatArr = [];
    for(var i = 0; i < len; i++) {
      for(var j = 0; j < len; j++) {
        flatArr.push(arr[i][j]);
      }
    }
    // Technique to sort number in javascript
    flatArr.sort(sortNumber);

    var middleVal = flatArr.length/2;
    var median = 0;

    if (middleVal % 1 == 0) {
      median = flatArr[middleVal];   
    } else {
      middleVal = Math.round(middleVal);
      median = (flatArr[middleVal] + flatArr[middleVal+1])/2;
    }
    
    for(var x = 0; x < len; x++) {
      arr[x][x] = median;
    }
  }

  /**
   * This function can be improved by only calculating the upper triangle.
   */
  this.calculateNegativeSquaredError = function() {
    var len = points.length;
    var dim = 2;
    var sim = createAndInitArray(len);
    
    if(dim != points[0].length) {
      throw "Error: this function can only be used on a 2d vector";
    } else {
      var point;
      for(var i = 0; i < len; i++) {
        point = points[i];
        for(var j = 0; j < len; j++) {
          sim[i][j] = negSquaredErr(point, points[j]);
        }
      }
    }
    setPrefAsMedian(sim);
    return sim;
  }
}


function AffinityPropagation(similarity_array, points_controller) {

  var MAX_ITERATIONS = 50;
  var DAMPING = 0.5;

  var controller = points_controller;

  var s = similarity_array;

  var a = createAndInitArray(s.length);
  var r = createAndInitArray(s.length);

  function createAndInitArray(dim){
    var array = new Array(dim);
    for(var i = 0; i < dim; i++) {
        array[i] = new Array(dim);
      for(var j = 0; j < dim; j++) {
        array[i][j] = 0;
      }
    }
    return array;
  }

  function copyArray(array) {
    var dim = array.length; 
    var copy_array = new Array(dim);
    for(var i = 0; i < dim; i++) {
      copy_array[i] = new Array(dim);
      for(var j = 0; j < dim; j++) {
        copy_array[i][j] = array[i][j];
      }
    }
    return copy_array; 
  }

  function addArrays(first, second) {
    var dim = ((first.length == second.length) ? first.length : 0);
    if (dim == 0) {
      throw "The dimensions of the arrays to add are not of the same length"
    } else {
      var add_array = new Array(dim);
      for(var i = 0; i < dim; i++) {
        add_array[i] = new Array(dim);
        for(var j = 0; j < dim; j++) {
          add_array[i][j] = first[i][j] + second[i][j];
        }
      }
    }
    return add_array;
  }
  
  /**
   * Finding the max element in an array from:
   * From http://ejohn.org/blog/fast-javascript-maxmin
   * The other stuff is what I added for the affinity propogation algorithm.
   *
   * TODO: If k = 0 then k - 1 = -1 and this would probably give an error or 
   *       worse undefined behaviour.
   *       if k = lengthOfArray then k + 1 > lengthOfArray and this would be
   *       out of bounds and also give an error.
   */
  function maxElement(array, axis, k) {
    if(k == 0) {
      var testArr = array[axis].slice(k+1);   
    } else if(k == (array[axis].length - 1)) {
      //the slice contains all the values from 0 to k-1
      var testArr = array[axis].slice(0, k);
    } else {
      //the slice contains all the values from 0 to k-1
      var firstPart = array[axis].slice(0, k);
      var secondPart = array[axis].slice(k+1); 
      var testArr = firstPart.concat(secondPart);
    }
    //First Bug Fixed: used the wrong array and used slice wrong 
    return Math.max.apply(Math, testArr);
  }

  function maxSumOfElements(r, i, k) {
    var dim = r.length;
    var sum = 0;
    //Second Bug Fixed: used length instead of dim
    for (var x = 0; x < dim; x++) {
      if(x == k || x == i) {
        //do nothing
      } else {
        sum = sum + Math.max(0, r[x][k]);
      }
    }
    return sum; 
  }
 
  function updateResponsibility(r, s, as, i, k) {
    r[i][k] = s[i][k] - maxElement(as, i, k);

    controller.addResponsibilityToQueue(i, k);

  }

  function updateAvailability(a, r, i, k) {
    a[i][k] = Math.min(0, r[k][k] + maxSumOfElements(r, i, k));

    controller.addAvailabilityToQueue(i, k);
  }
  
  function updateSelfAvailability(a, r, k) {
    a[k][k] = maxSumOfElements(r, k, k);
  }

  function applyDampingFactor(arr, arrOld) {
    var dim = arr.length;

    for(var i = 0; i < dim; i++) {
      for (var j = 0; j < dim; j++) {
        arr[i][j] = (1 - DAMPING)*arr[i][j] + (DAMPING * arrOld[i][j]);
      }
    }
  }

  this.run = function() {
    for(var cnt = 0; cnt < MAX_ITERATIONS; cnt++) {
      var rOld = copyArray(r);
      var as = addArrays(a, s);  

      var length = s.length;
      for(var i = 0; i < length; i++) {
        for (var k = 0; k < length; k++) {
          updateResponsibility(r, s, as, i, k);
        }
      }

      applyDampingFactor(r, rOld);

      var aOld = copyArray(a);
      
      for(var i = 0; i < length; i++) {
        for(var k = 0; k < length; k++) {
          updateAvailability(a, r, i, k);
          if( k == i) {
            updateSelfAvailability(a, r, k);
          }
        }
      }
      
      applyDampingFactor(a, aOld);

      controller.calculateExemplars(r,a)

    }
  }

}
