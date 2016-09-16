var _ = require('lodash');

function Deviation(locationData, userLocale) {
  'use strict';

  this.getAverage = function (array) {
    var count = array.length;
    //From a statistical point-of-view, the average of no sample points should not exist.
    if(count === 0 ){
      return undefined;
    }

    return _.reduce(array, function(sum, n) {
      return sum + n/count;
    }, 0);
  };

  this.getStandardDeviation = function (array) {
    var length = array.length;

    if(length === 0){
      return undefined;
    }

    var average = this.getAverage(array);

    var variance =  _.reduce(array, function(sum, n) {
      return sum + Math.pow((n - average), 2)/length;
    }, 0);

    return Math.sqrt(variance);
  };

}

module.exports = Deviation;
