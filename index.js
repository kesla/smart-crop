'use strict';
var opencv = require('opencv');

module.exports = function smartCrop(options, callback) {
  opencv.readImage(options.image, function(err, matrix) {
    if (err) return callback(err);

    centerFromFaces(matrix, function(err, center) {
      if (err) return callback(err);

      callback(
        null,
        toResult(matrix, center, options.width, options.height, 'faces')
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
  matrix.detectObject(opencv.FACE_CASCADE, {}, function(err, faces) {
    if (err) return callback(err);

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