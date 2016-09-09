var moment = require('moment');
var _ = require('underscore');
var debug = require('debug')('spikeD');

module.exports = function (options) {

  function SpikeD() {
    this.normalTraffic = {};
    for(var day = 0; day <= options.days; day++){
      this.normalTraffic[moment().subtract(day, 'days').format('YYMMDD')]= new Array(24);
    }
  }

  SpikeD.prototype.logLastHourCount = function (date) {
    var previousHourDate = date.subtract(1, 'hour');
    debug('last hour count was' + ' ' + this.normalTraffic[previousHourDate.format('YYMMDD')][previousHourDate.format('H')]);
    return this.normalTraffic[previousHourDate.format('YYMMDD')][previousHourDate.format('H')];
  };

  //TODO: make it more elegant _.reduce(....)? make "spike factor" configurable
  SpikeD.prototype.checkForSpike = function (date) {
    var previousHour = date.subtract(1, 'hour').format('H');
    var previousHourCount = this.getNormalTrafficDay(date)[previousHour];
    var weeks = 0;
    var cumulatedCount = 0;
    
    var previousWeek = undefined;
    //look at same hours on previous weeks
    for(var day=7; day <= options.days; day+=7){
      previousWeek = this.getNormalTrafficDay(date.subtract(7, 'days'));
      if(previousWeek && previousWeek[previousHour]) {
        cumulatedCount += previousWeek[previousHour];
        weeks++;
      }
    }

    if(weeks && (previousHourCount > 10*cumulatedCount/weeks)){
      debug('got a spike');
      return true;
    }

    return false;
  };

  SpikeD.prototype._incrementTo = function (date) {
    //check to see if we are entering a now hour
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
