
/*global describe, it*/

var chai = require('chai');
var moment = require('moment');
var sinon = require('sinon');
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

  it('increments on date of datastructure creation +1', function () {
    requireSpikeDetection(7);
    var spy = sinon.spy(spikeD, '_updateNormalTraffic');

    //set one day in the future
    var tomorrow = moment().add(1, 'day');
    var hour = tomorrow.format('H');

    assert.isUndefined(spikeD.getNormalTrafficDay(tomorrow));
    assert.equal(Object.keys(spikeD.getNormalTraffic()).length, 8);
    spikeD.increment(moment().add(1, 'day'));

    assert.isTrue(spy.calledOnce);
    assert.isDefined(spikeD.getNormalTrafficDay(tomorrow));
    assert.equal(Object.keys(spikeD.getNormalTraffic()).length, 8, 'number of keys didn\'t change');
    assert.equal(spikeD.getNormalTrafficDay(tomorrow)[hour], 1);
  });

});
