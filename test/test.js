
var smartCrop = require('../');
var test = require('tape');
var readFileSync = require('fs').readFileSync;

test('faces', function(t) {
  smartCrop({
    image: readFileSync(__dirname + '/obama.jpg'),
    width: 10,
    height: 1
  }, function(err, results) {
      if (err) return t.end(err);

      t.equal(results.method, 'faces');
      t.equal(results.left, 0);
      t.equal(results.right, 470);
      t.equal(Math.round(470 / (results.bottom - results.top)), 10);
      t.end();
    });
});

test('good-features', function(t) {
  smartCrop({
    image: readFileSync(__dirname + '/moon.jpg'),
    width: 1,
    height: 10
  }, function(err, results) {
      if (err) return t.end(err);

      t.equal(results.method, 'good-features');
      t.equal(results.top, 0);
      t.equal(results.bottom, 526);
      t.equal(Math.round(526 / (results.right - results.left)), 10);
      t.end();
    });
});
