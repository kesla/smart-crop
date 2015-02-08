
var smartCrop = require('./');

var opencv = require('opencv');
var readFileSync = require('fs').readFileSync;

smartCrop({
  image: readFileSync(__dirname + '/test/obama.jpg'),
  width: 200,
  height: 100
}, function(err, results) {
    console.log('obama');
    // results.method === 'faces'
    console.log(
      results.method,
      results.right,
      results.bottom,
      results.left,
      results.top
    );
  });

smartCrop({
  image: readFileSync(__dirname + '/test/moon.jpg'),
  width: 200,
  height: 100
}, function(err, results) {
    console.log('moon');
    // results.method === 'good-features'
    console.log(
      results.method,
      results.right,
      results.bottom,
      results.left,
      results.top
    );
  });
