var moment = require('moment');
var _ = require('underscore');

module.exports = function (options) {

  function SpikeD() {
    this.normalTraffic = {};
    for(var day = 0; day <= options.days; day++){
      this.normalTraffic[moment().subtract(day, 'days').format('YYMMDD')]= new Array(24);
    }
  }

  SpikeD.prototype.logLastHourCount = function (date) {
    //TODO: use debug pkg
    var lastHourDate = date.subtract(1, 'hour');
    console.log('last hour count was %s', this.normalTraffic[lastHourDate.format('YYMMDD')][lastHourDate.format('H')] )
    return this.normalTraffic[lastHourDate.format('YYMMDD')][lastHourDate.format('H')];
  };

  SpikeD.prototype.checkForSpike = function (date) {
    //TODO
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
