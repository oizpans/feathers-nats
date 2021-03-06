const debug = require('debug')('feathers-nats:subscribe');
const { GeneralError } = require('@feathersjs/errors');

const instance = require('./instance');

module.exports = function (params = {}, services = []) {
  return async function () {
    const app = this;
    const application = app.get('application');
    if (!application) {
      throw new Error('App application is required');
    }

    const nats = instance(params);

    debug(`Connected to NATS on ${params.url} and subscribing to events for ${services}`);

    for (const service_environment of services) {
      const parts1 = service_environment.split('_');
      const parts2 = service_environment.split('.');

      // const service = service_environment.replace(/_local|_dev|_stage|_prod/gi, '');
      const service = `${parts1[0]}.${parts2[1]}`;

      if (!app.services[`${service}`]) {
        throw new Error('You are trying to subscribe for a service that doesnt exist locally');
      }

      nats.subscribe(`${service_environment}.created`, function (data) {
        debug(`subscribe ${service_environment}.created`);
        app.services[`${service}`].emit('created', data);
      });

      nats.subscribe(`${service_environment}.updated`, function (data) {
        debug(`subscribe ${service_environment}.updated`);
        app.services[`${service}`].emit('updated', data);
      });

      nats.subscribe(`${service_environment}.patched`, function (data) {
        debug(`subscribe ${service_environment}.patched`);
        app.services[`${service}`].emit('patched', data);
      });

      nats.subscribe(`${service_environment}.removed`, function (data) {
        debug(`subscribe ${service_environment}.removed`);
        app.services[`${service}`].emit('removed', data);
      });
    }
  };
};
