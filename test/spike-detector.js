
/*global describe, it*/

var chai = require('chai');
var moment = require('moment');

var spikeD;

var assert = chai.assert;

describe('spike-detection', function () {
  'use strict';

  var requireSpikeDetection =  function (days){
    spikeD = require('../lib/spike-detector')({days: days});
  };

  it('supports config in days', function () {
    var numerOfDays = 7;
    requireSpikeDetection(numerOfDays);

    var eightDaysAgo = moment().subtract(numerOfDays+1, 'days');
    assert.isUndefined(spikeD.getNormalTrafficDay(eightDaysAgo));

    var sevenDaysAgo = moment().subtract(numerOfDays, 'days');
    assert.typeOf(spikeD.getNormalTrafficDay(sevenDaysAgo), 'array', 'we have an array');
  });

  it('increments', function () {
    requireSpikeDetection(7);
    var now = moment();
    var hour = now.format('H');

    assert.isUndefined(spikeD.getNormalTrafficDay(now)[hour]);

    spikeD.increment();
    spikeD.increment();
    assert.equal(spikeD.getNormalTrafficDay(now)[hour], 2);
  });

});
