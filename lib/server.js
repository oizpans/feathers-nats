const debug = require('debug')('feathers-nats:server');
const { GeneralError } = require('@feathersjs/errors');

const instance = require('./instance');

module.exports = function (params = {}) {
  return async function () {
    const app = this;
    const application = app.get('application');
    const { services } = app;
    if (!application) {
      throw new Error('App application is required');
    }
    const nats = instance(params);

    debug(`Connected to NATS on ${params.url} and replying on ${application}.*`);

    for (const service in services) {
      // FIND
      debug(` Subscribing to ${application}.${service}.find`);
      nats.subscribe(`${application}.${service}.find`, { queue: application }, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${application}.${service}.${method}`);
          result = await app.services[service].find(req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // GET
      debug(` Subscribing to ${application}.${service}.get`);
      nats.subscribe(`${application}.${service}.get`, { queue: application }, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${application}.${service}.${method}`);
          result = await app.services[service].get(req.id, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // CREATE
      debug(` Subscribing to ${application}.${service}.create`);
      nats.subscribe(`${application}.${service}.create`, { queue: application }, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${application}.${service}.${method}`);
          result = await app.services[service].create(req.data, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // PATCH
      debug(` Subscribing to ${application}.${service}.patch`);
      nats.subscribe(`${application}.${service}.patch`, { queue: application }, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${application}.${service}.${method}`);
          result = await app.services[service].patch(req.id, req.data, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // UPDATE
      debug(` Subscribing to ${application}.${service}.update`);
      nats.subscribe(`${application}.${service}.update`, { queue: application }, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${application}.${service}.${method}`);
          result = await app.services[service].update(req.id, req.data, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // REMOVE
      debug(` Subscribing to ${application}.${service}.remove`);
      nats.subscribe(`${application}.${service}.remove`, { queue: application }, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${application}.${service}.${method}`);
          result = await app.services[service].remove(req.id, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });
    }
  };
};
