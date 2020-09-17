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
      debug(` Subscribing to ${name}.${service}.*`);
      nats.subscribe(`${name}.${service}.*`, async (request, res, subject) => {
        let result = null;
        const [, service, method] = subject.split('.');
        debug(`Request for ${name}.${service}.${method}`);
        const req = request;

        try {
          if (method === 'find') {
            result = await app.services[service].find(req.params);
          }
          if (method === 'get') {
            result = await app.services[service].get(req.id, req.params);
          }
          if (method === 'create') {
            result = await app.services[service].create(req.data, req.params);
          }
          if (method === 'patch') {
            result = await app.services[service].patch(req.id, req.data, req.params);
          }
          if (method === 'update') {
            result = await app.services[service].update(req.id, req.data, req.params);
          }
          if (method === 'remove') {
            result = await app.services[service].remove(req.id, req.params);
          }
        } catch (error) {
          nats.publish(res, error);
        }
        console.log('res', res);
        console.log('result', result);
        console.log('request', `Request for ${name}.${service}.${method}`);
        nats.publish(res, result);
      });
    }
  };
};
