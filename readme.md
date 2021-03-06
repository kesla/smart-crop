# smart-crop [![Build Status](https://travis-ci.org/kesla/smart-crop.png?branch=master)](https://travis-ci.org/kesla/smart-crop)

Get smart cropping coordinates to an images (based on https://github.com/thumbor/thumbor/wiki/Detection-algorithms)

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install smart-crop --save
```

## Usage

```js

var smartCrop = require("smart-crop");

var foo = [];
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

```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [basic-queue](https://github.com/mapbox/basic-queue): a basic queue with concurrency
- [opencv](https://github.com/peterbraden/node-opencv): Node Bindings to OpenCV

## Dev Dependencies

- [tape](https://github.com/substack/tape): tap-producing test harness for node and browsers


## License

MIT

_Generated by [package-json-to-readme](https://github.com/zeke/package-json-to-readme)_
