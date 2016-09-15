var moment = require('moment');
var _ = require('lodash');
var debug = require('debug')('spikeD');

var events = require('events');
var eventEmitter;

var Deviation = require('./deviation')
var deviation;

module.exports = function (options) {

  function SpikeD() {
    events.EventEmitter.call(this);
    deviation = new Deviation();
    this.normalTraffic = {};
    for(var day = 0; day <= options.days; day++){
      this.normalTraffic[moment().subtract(day, 'days').format('YYMMDD')]= new Array(24);
    }
  }

  SpikeD.prototype.__proto__ = events.EventEmitter.prototype;

  SpikeD.prototype.logLastHourCount = function (date) {
    var previousHourDate = date.subtract(1, 'hour');
    debug('last hour count was' + ' ' + this.normalTraffic[previousHourDate.format('YYMMDD')][previousHourDate.format('H')]);
    return this.normalTraffic[previousHourDate.format('YYMMDD')][previousHourDate.format('H')];
  };

  //TODO: make "spike factor" configurable
  SpikeD.prototype.checkForSpike = function (date) {
    if(!moment.isMoment(date)){
      date = moment(date);
    }
    var previousHour = date.subtract(1, 'hour').format('H');
    var previousHourCount = this.getNormalTrafficDay(date)[previousHour];
    var previousData = [];
    
    var previousDay = undefined;
    //look at same hours on previous days
    for(var day=1; day <= options.days; day++){
      previousDay = this.getNormalTrafficDay(date.subtract(1, 'days'));
      if(previousDay && previousDay[previousHour]) {
        previousData.push(previousDay[previousHour]);
      } else break;
    }

    var average = deviation.getAverage(previousData);
    var sigma = deviation.getStandardDeviation(previousData)

    if(previousHourCount > (average + 3*sigma)){
      debug('got a spike');
      this.emit('spike');
      return true;
    }

    return false;
  };

  SpikeD.prototype._incrementTo = function (date) {
    //check to see if we are entering a new hour
    //if so, log number of requests in the last hour
    var hour = date.format('H');
    var day = date.format('YYMMDD');
    var dayCounter = this.normalTraffic[day];

    if(dayCounter[hour]){
      dayCounter[hour]= ++dayCounter[hour];
    } else {
      dayCounter[hour] = 1;
      this.logLastHourCount(date);
      this.checkForSpike(date);
    }
  };

  SpikeD.prototype._updateNormalTraffic = function(date) {
    date = date || moment();
    this.normalTraffic[date.format('YYMMDD')]= new Array(24);
    delete this.normalTraffic[date.subtract((options.days+1), 'days').format('YYMMDD')];
  };

  SpikeD.prototype.increment = function (date) {
    date = date || moment();
    var day = date.format('YYMMDD');

    // if it's a new day, update
    if(!this.normalTraffic[day]){
      this._updateNormalTraffic(moment(date));
    }

    this._incrementTo(date);
  };

  SpikeD.prototype.getNormalTrafficDay = function (date) {
    //TODO: throw error if it doesnt exist
    var day = moment(date).format('YYMMDD');
    return this.normalTraffic[day];
  };

  SpikeD.prototype.getNormalTraffic = function () {
    return this.normalTraffic;
  };

  //TODO: find better way to feed memory
  SpikeD.prototype.setNormalTraffic = function (normalTraffic) {
    return _.extend(this.normalTraffic, normalTraffic);
  };

  return new SpikeD(options);
};
