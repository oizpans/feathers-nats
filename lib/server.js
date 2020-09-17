const debug = require('debug')('feathers-nats:server');
const { GeneralError } = require('@feathersjs/errors');

const instance = require('./instance');

module.exports = function (params = {}) {
  return async function () {
    const app = this;
    const name = app.get('name');
    const services = app.services;
    if (!name) {
      throw new Error('App name is required');
    }
    const nats = instance(params);

    debug(`Connected to NATS on ${params.url} and replying on ${name}.*`);

    for (const service in services) {
      // FIND
      debug(` Subscribing to ${name}.${service}.find`);
      nats.subscribe(`${name}.${service}.find`, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${name}.${service}.${method}`);
          result = await app.services[service].find(req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // GET
      debug(` Subscribing to ${name}.${service}.get`);
      nats.subscribe(`${name}.${service}.get`, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${name}.${service}.${method}`);
          result = await app.services[service].get(req.id, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // CREATE
      debug(` Subscribing to ${name}.${service}.create`);
      nats.subscribe(`${name}.${service}.create`, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${name}.${service}.${method}`);
          result = await app.services[service].create(req.data, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // PATCH
      debug(` Subscribing to ${name}.${service}.patch`);
      nats.subscribe(`${name}.${service}.patch`, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${name}.${service}.${method}`);
          result = await app.services[service].patch(req.id, req.data, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // UPDATE
      debug(` Subscribing to ${name}.${service}.update`);
      nats.subscribe(`${name}.${service}.update`, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${name}.${service}.${method}`);
          result = await app.services[service].update(req.id, req.data, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });

      // REMOVE
      debug(` Subscribing to ${name}.${service}.remove`);
      nats.subscribe(`${name}.${service}.remove`, async (req, res, subject) => {
        let result = null;
        try {
          const [, service, method] = subject.split('.');
          debug(`Request for ${name}.${service}.${method}`);
          result = await app.services[service].remove(req.id, req.params);
        } catch (error) {
          nats.publish(res, error);
        }
        nats.publish(res, result);
      });
    }
  };
};
