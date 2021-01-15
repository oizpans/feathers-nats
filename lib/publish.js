const debug = require('debug')('feathers-nats:publish');
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

    debug(`Connected to NATS on ${params.url} and publishing for ${application}.${services}.*`);

    for (const service of services) {
      if (!app.services[`${service}`]) {
        throw new Error('You are trying to publish events for a service that doesnt exist');
      }

      app.service(`${service}`).on('created', (data) => {
        debug(`publish ${application}.${service}.created`);
        nats.publish(`${application}.${service}.created`, data);
      });

      app.service(`${service}`).on('updated', (data) => {
        debug(`publish ${application}.${service}.updated`);
        nats.publish(`${application}.${service}.updated`, data);
      });

      app.service(`${service}`).on('patched', (data) => {
        debug(`publish ${application}.${service}.updated`);
        nats.publish(`${application}.${service}.patched`, data);
      });

      app.service(`${service}`).on('removed', (data) => {
        debug(`publish ${application}.${service}.removed`);
        nats.publish(`${application}.${service}.removed`, data);
      });
    }
  };
};
