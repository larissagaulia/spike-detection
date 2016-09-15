
/*global describe, it*/

var chai = require('chai');
var moment = require('moment');
var sinon = require('sinon');
var _ = require('lodash')
var spikeD;
var normalTrafficMock = {};
var events = require('events');
var eventEmitter = new events.EventEmitter();

var assert = chai.assert;

describe('spike-detection', function () {
  'use strict';

  var requireSpikeDetection =  function (days){
    spikeD = require('../lib/spike-detector')({days: days});
  };

  var createMock = function (numberOfDays){
    for(var day = 0; day <= numberOfDays; day++){
      normalTrafficMock[moment().subtract(day, 'days').format('YYMMDD')] =
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    }
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
    spikeD.increment(moment(tomorrow));

    assert.isTrue(spy.calledOnce);
    assert.isDefined(spikeD.getNormalTrafficDay(tomorrow));
    assert.equal(Object.keys(spikeD.getNormalTraffic()).length, 8, 'number of keys didn\'t change');
    assert.equal(spikeD.getNormalTrafficDay(tomorrow)[hour], 1);
  });

  it('set initial data', function () {
    var numberOfDays = 7;
    requireSpikeDetection(numberOfDays); 

    createMock(numberOfDays);

    assert.equal(Object.keys(spikeD.getNormalTraffic()).length, 8);
    spikeD.setNormalTraffic(normalTrafficMock);
    assert.equal(Object.keys(spikeD.getNormalTraffic()).length, 8, 'same amout of entries');
    assert.equal(spikeD.getNormalTrafficDay(moment())[3], 3);
    spikeD.increment();
    
    var hour = moment().format('H');
    assert.equal(spikeD.getNormalTrafficDay(moment())[hour], parseInt(hour)+1);
  });

  it('tests _incrementTo with new hour', function () {
    var numberOfDays = 3;
    requireSpikeDetection(numberOfDays);

    var spy_log = sinon.spy(spikeD, 'logLastHourCount');
    var spy_checkSpike = sinon.spy(spikeD, 'checkForSpike');

    var oneHourFromNow = moment().add(1, 'hour');
    spikeD.increment(oneHourFromNow);
    
    assert.isTrue(spy_log.calledOnce);
    assert.isTrue(spy_checkSpike.calledOnce);
  });

  it('should get last hour count', function () {
    var numberOfDays = 3;
    requireSpikeDetection(numberOfDays);
    createMock(numberOfDays);
    spikeD.setNormalTraffic(normalTrafficMock);

    var now = moment();
    var hour = now.format('H');
    spikeD.logLastHourCount(moment());
    assert.equal(spikeD.getNormalTrafficDay(now)[hour], parseInt(hour));   
  });

  it('should get a spike', function () {
    var numberOfDays = 28;
    requireSpikeDetection(numberOfDays);
    createMock(numberOfDays);
    spikeD.setNormalTraffic(normalTrafficMock);

    var now = moment();
    var hour = now.format('H');
    var normalCount = spikeD.getNormalTrafficDay(now)[hour]
    //TODO: make 'spike factor' configurable
    for(var i=0; i<(10*normalCount); i++){
      spikeD.increment(now)
    }
    assert.isTrue(spikeD.checkForSpike(now.add(1, 'hours')));  

  });

  it('should emit a spike event', function(done){
    var eventFired = false
    
    setTimeout(function () {
      assert(eventFired, 'Event did not fire in 100 ms.');
      done();
    }, 100); //timeout with an error in 100 ms
    
    var numberOfDays = 28;
    requireSpikeDetection(numberOfDays);
    createMock(numberOfDays);
    spikeD.setNormalTraffic(normalTrafficMock);

    spikeD.on('spike',function(){
      eventFired = true
    });

    var now = moment();
    var hour = now.format('H');
    var normalCount = spikeD.getNormalTrafficDay(now)[hour]
    //TODO: make 'spike factor' configurable
    for(var i=0; i<(10*normalCount); i++){
      spikeD.increment(now)
    }
    spikeD.checkForSpike(now.add(1, 'hours'))

  });

});
