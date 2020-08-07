const debug = require('debug')('feathers-nats:server');
const { GeneralError } = require('@feathersjs/errors');

const instance = require('./instance');

module.exports = function (params = {}, services = []) {
  return async function () {
    const app = this;
    const name = app.get('name');
    if (!name) {
      throw new Error('App name is required');
    }

    const nats = instance(params);

    debug(`Connected to NATS on ${params.url} and subscribing to events for ${services}`);

    for (const service_environment of services) {
      const service = service_environment.replace(/_local|_dev|_stage|_prod/gi, '');

      if (!app.services[`${service}`]) {
        throw new Error('You are trying to subscribe for a service that doesnt exist locally');
      }

      nats.subscribe(`${service_environment}.created`, function (data) {
        app.services[`${service}`].emit('created', data);
      });

      nats.subscribe(`${service_environment}.updated`, function (data) {
        app.services[`${service}`].emit('updated', data);
      });

      nats.subscribe(`${service_environment}.patched`, function (data) {
        app.services[`${service}`].emit('patched', data);
      });

      nats.subscribe(`${service_environment}.removed`, function (data) {
        app.services[`${service}`].emit('removed', data);
      });
    }
  };
};
