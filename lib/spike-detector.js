function SpikeD() {
	console.log('bla bla setup');
}

SpikeD.prototype.heyThere = function () {
  return 'Hey there!';
};

module.exports = function () {
  return new SpikeD();
};