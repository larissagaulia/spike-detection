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

  SpikeD.prototype._updateNormalTraffic = function(date) {
    date = date || moment();
    this.normalTraffic[date.format('YYMMDD')]= new Array(24);
    delete this.normalTraffic[date.subtract((options.days+1), 'days').format('YYMMDD')];
  };

  SpikeD.prototype.increment = function (date) {
    date = date || moment();
    var day = date.format('YYMMDD');
    var hour = date.format('H');

    if(!this.normalTraffic[day]){
      this._updateNormalTraffic(date);
    }

    this._incrementTo(day, hour);
  };

  SpikeD.prototype.getNormalTrafficDay = function (date) {
    //TODO: throw error if it doesnt exist
    var day = moment(date).format('YYMMDD');
    return this.normalTraffic[day];
  };

  SpikeD.prototype.getNormalTraffic = function () {
    return this.normalTraffic;
  };

  return new SpikeD(options);
};
