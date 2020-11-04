const debug = require('debug')('feathers-nats:instance');
const errors = require('@feathersjs/errors');
const NATS = require('nats');

let instance = null;

module.exports = function (params = {}) {
  if (!instance) {
    if (!params.url) {
      throw new Error('A url is required for nats server');
    }

    instance = NATS.connect(params);

    instance.on('error', (error) => {
      debug('Nats connection errored', error);
    });

    instance.on('disconnect', () => {
      debug('Nats connection disconnected');
    });

    instance.on('close', () => {
      debug('Nats connection closed');
    });

    instance.on('connect', () => {
      debug('Nats connected.');
    });
  }

  return instance;
};
