
var smartCrop = require('../');
var test = require('tape');
var readFileSync = require('fs').readFileSync;

test('faces', function(t) {
  smartCrop({
    image: readFileSync(__dirname + '/obama.jpg'),
    width: 200,
    height: 100
  }, function(err, results) {
      if (err) return t.end(err);

      t.equal(results.method, 'faces');
      t.equal(results.right - results.left, 200);
      t.equal(results.bottom - results.top, 100);
      t.notEqual(results.left, 0);
      t.notEqual(results.top, 0);
      t.end();
    });
});

test('good-features', function(t) {
  smartCrop({
    image: readFileSync(__dirname + '/moon.jpg'),
    width: 200,
    height: 100
  }, function(err, results) {
      if (err) return t.end(err);

      t.equal(results.method, 'good-features');
      t.equal(results.right - results.left, 200);
      t.equal(results.bottom - results.top, 100);
      t.notEqual(results.left, 0);
      t.notEqual(results.top, 0);
      t.end();
    });
});
