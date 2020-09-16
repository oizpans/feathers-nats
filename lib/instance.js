const debug = require('debug')('feathers-nats:instance');
const errors = require('@feathersjs/errors');
const NATS = require('nats');

let instance = null;

module.exports = function (params = {}) {
  if (!params.url) {
    throw new Error('A url is required for nats server');
  }

  if (!instance) {
    instance = NATS.connect(params);
  }

  return instance;
};
