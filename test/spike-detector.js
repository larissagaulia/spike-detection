
var chai = require('chai');
var spikeD;

var assert = chai.assert;

describe('spike-detection', function () {
  'use strict';

  beforeEach(function () {
    spikeD = require('../lib/spike-detector')();
  });

  it('can be required', function () {
    assert.equal(spikeD.heyThere(), 'Hey there!');
  });

});
