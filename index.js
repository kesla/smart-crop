'use strict';
var opencv = require('opencv');
var Queue = require('basic-queue');
var centerFromFacesQueue = new Queue(_centerFromFaces, 1);

module.exports = function smartCrop(options, callback) {
  opencv.readImage(options.image, function(err, matrix) {
    if (err) return callback(err);

    centerFromFaces(matrix, function(err, center) {
      if (err) return callback(err);

      var method;
      if (center) {
        method = 'faces';
      } else {
        method = 'good-features';
        center = centerFromGoodFeatures(matrix);
      }

      callback(
        null,
        toResult(matrix, center, options.width, options.height, method)
      );
    });
  });
};

function toResult(matrix, center, width, height, method) {
  var left = Math.round(center.x / matrix.width() * (matrix.width() - width));
  var top = Math.round(center.y / matrix.height() * (matrix.height() - height));
  return {
    method: method,
    left: left,
    top: top,
    right: left + width,
    bottom: top + height
  };
}

function centerFromFaces(matrix, callback) {
  centerFromFacesQueue.add({ matrix: matrix, callback: callback });
}

function _centerFromFaces(options, done) {
  function callback (err, faces) {
    options.callback(err, faces);
    done(err);
  }
  
  options.matrix.detectObject(opencv.FACE_CASCADE, {}, function(err, faces) {
    if (err) return callback(err);

    if (faces.length === 0) return callback();
    
    var weight = 0;
    var x = 0;
    var y = 0;
    faces.forEach(function(face) {
      weight = weight + face.width * face.height;
      x = x + (face.x + face.width / 2) * face.width * face.height;
      y = y + (face.y + face.height / 2) * face.width * face.height;
    });

    callback(null, {
      x: x / weight,
      y: y / weight
    });
  });
}

function centerFromGoodFeatures(matrix) {
  var x = 0;
  var y = 0;
  var weight = 0;
  matrix.goodFeaturesToTrack().forEach(function(point) {
    weight = weight + 1;
    x = x + point[0];
    y = y + point[1];
  });
  return {
    x: x / weight,
    y: y / weight
  };
}