/*global describe, it*/

var chai = require('chai');
var assert = chai.assert;
var Deviation = require('../lib/deviation');

describe('deviation', function () {
  'use strict';

  var deviation = new Deviation();
  var testArray = [5, 10, 15, 20, 25];
  var emptyArray = [];

  describe('empty array', function () {
    it('gets average', function () {
      assert.isUndefined(deviation.getAverage(emptyArray));
    });

    it('gets standart deviation', function () {
      assert.isUndefined(deviation.getStandardDeviation(emptyArray));
    });
  });

  describe('non empty array', function () {
    it('gets average', function () {
      assert.equal(deviation.getAverage(testArray), 15);
    });

    it('gets standart deviation', function () {
      assert.equal(deviation.getStandardDeviation(testArray), 7.0710678118654755);
    });
  });

});
