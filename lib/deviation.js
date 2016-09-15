var _ = require('lodash');

function Deviation(locationData, userLocale) {
  'use strict';

  this.getAverage = function (array) {
    var count = array.length;
    return _.reduce(array, function(sum, n) {
      return sum + n/count;
    }, 0) 
  };

  this.getStandardDeviation = function (array) {
    var average = this.getAverage(array);
    var length = array.length;

    var variance =  _.reduce(array, function(sum, n) {
      return sum + Math.pow((n - average), 2)/length;
    }, 0)

    return Math.sqrt(variance);
  };

}

module.exports = Deviation;