var moment = require('moment');

module.exports = function (options) {

  function SpikeD() {
    this.normalTraffic = {};
    for(var day = 0; day <= options.days; day++){
      this.normalTraffic[moment().subtract(day, 'days').format('YYMMDD')]= new Array(24);
    }
  }

  SpikeD.prototype._incrementTo = function (day, hour) {

    this.normalTraffic[day][hour]= this.normalTraffic[day][hour]? ++this.normalTraffic[day][hour] : 1;
  };

  SpikeD.prototype._updateNormalTraffic = function() {
    delete this.normalTraffic[moment().subtract((options.days+1), 'days').format('YYMMDD')];

    this.normalTraffic[moment().format('YYMMDD')]= new Array(24);
  };

  SpikeD.prototype.increment = function () {
    var now = moment();
    var day = now.format('YYMMDD');
    var hour = now.format('H');

    if(!this.normalTraffic[day]){
      this._updateNormalTraffic(day);
    }

    this._incrementTo(day, hour);
  };

  SpikeD.prototype.getNormalTrafficDay = function (date) {
    //TODO: throw error if it doesnt exist
    var day = moment(date).format('YYMMDD');
    return this.normalTraffic[day];
  };

  return new SpikeD(options);
};
