const errors = require('@feathersjs/errors');
const NATS = require('nats');

let instance = null;

module.exports = function (params = {}) {
  if (!params.url) {
    throw new Error('A url is required for nats server');
  }

  if (!instance) {
    instance = NATS.connect(params);

    instance.on('error', (error) => {
      debug('Nats connection errored', error);
      throw new errors.GeneralError('NATS connection error', { error: error });
    });

    instance.on('disconnect', () => {
      debug('Nats connection disconnected');
      throw new errors.GeneralErrort('NATS connection has been disconnected');
    });

    instance.on('close', () => {
      debug('Nats connection closed');
      throw new errors.GeneralError('NATS connection has been closed');
    });
  }

  return instance;
};
