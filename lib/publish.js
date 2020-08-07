const debug = require('debug')('feathers-nats:publish');
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

    debug(`Connected to NATS on ${params.url} and publishing for ${name}.${services}.*`);

    for (const service of services) {
      if (!app.services[`${service}`]) {
        throw new Error('You are trying to publish events for a service that doesnt exist');
      }

      app.service(`${service}`).on('created', (data) => {
        nats.publish(`${name}.${service}.created`, data);
      });

      app.service(`${service}`).on('updated', (data) => {
        nats.publish(`${name}.${service}.updated`, data);
      });

      app.service(`${service}`).on('patched', (data) => {
        nats.publish(`${name}.${service}.patched`, data);
      });

      app.service(`${service}`).on('removed', (data) => {
        nats.publish(`${name}.${service}.removed`, data);
      });
    }
  };
};
