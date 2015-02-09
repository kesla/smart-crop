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
        matrix.width() / matrix.height() < options.width / options.height ?
          cropVertical(matrix, center, options.width, options.height, method) :
          cropHorizontal(matrix, center, options.width, options.height, method)
      );
    });
  });
};

function cropHorizontal(matrix, center, width, height, method) {
  var newWidth = width / height * matrix.height();
  var left = Math.max(Math.round( center.x - newWidth / 2 ), 0);
  var right = Math.min(left + newWidth, matrix.width());
  left = right - newWidth;
  
  return {
    method: method,
    left: left,
    right: right,
    top: 0,
    bottom: matrix.height()
  }
}

function cropVertical(matrix, center, width, height, method) {
  var newHeight = height / width * matrix.width();
  var top = Math.max(Math.round(center.y - newHeight / 2), 0);
  var bottom = Math.min(top + newHeight, matrix.height());
  top = top - newHeight();
  
  return {
    method: method,
    left: 0,
    right: matrix.width(),
    top: top,
    bottom: bottom
  }
}

function centerFromFaces(matrix, callback) {
  centerFromFacesQueue.add({
    matrix: matrix,
    callback: callback
  });
}

function _centerFromFaces(options, done) {
  function callback(err, faces) {
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