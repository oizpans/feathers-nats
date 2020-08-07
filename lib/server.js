const debug = require('debug')('feathers-nats:server');
const { GeneralError } = require('@feathersjs/errors');

const instance = require('./instance');

module.exports = function (params = {}) {
  return async function () {
    const app = this;
    const name = app.get('name');
    if (!name) {
      throw new Error('App name is required');
    }

    const nats = instance(params);

    debug(`Connected to NATS on ${params.url} and replying on ${name}.*`);

    // handling find method
    nats.subscribe(`${name}.*.find`, function (request, res, subject) {
      const [, service, method] = subject.split('.');
      debug(`Request for ${name}.${service}.${method}`);
      const req = request;

      // check if service is registered
      if (!Object.keys(app.services).includes(service)) {
        return nats.publish(res, new GeneralError(`Feathers-nats server: Service ${service} is not found on ${name}`));
      }

      // check if the 'service method' is registered
      if (!Object.keys(app.service(service)).includes(method)) {
        return nats.publish(
          res,
          new GeneralError(`Feathers-nats server: Service ${service} with method ${method} is not found on ${name}`)
        );
      }

      app.services[service]
        .find(req.params)
        .then((result) => {
          nats.publish(res, result);
        })
        .catch(function (error) {
          nats.publish(res, error);
        });
    });

    // handling get method
    nats.subscribe(`${name}.*.get`, { queue: `${name}` }, function (request, res, subject) {
      const [, service, method] = subject.split('.');
      debug(`Request for ${name}.${service}.${method}`);
      const req = request;

      // check if service is registered
      if (!Object.keys(app.services).includes(service)) {
        return nats.publish(res, new GeneralError(`Feathers-nats server: Service ${service} is not found on ${name}`));
      }

      // check if the 'service method' is registered
      if (!Object.keys(app.service(service)).includes(method)) {
        return nats.publish(
          res,
          new GeneralError(`Feathers-nats server: Service ${service} with method ${method} is not found on ${name}`)
        );
      }

      app.services[service]
        .get(req.id, req.params)
        .then((result) => {
          nats.publish(res, result);
        })
        .catch(function (error) {
          nats.publish(res, error);
        });
    });

    // handling create method
    nats.subscribe(`${name}.*.create`, { queue: `${name}` }, function (request, res, subject) {
      const [, service, method] = subject.split('.');
      debug(`Request for ${name}.${service}.${method}`);
      const req = request;

      // check if service is registered
      if (!Object.keys(app.services).includes(service)) {
        return nats.publish(res, new GeneralError(`Feathers-nats server: Service ${service} is not found on ${name}`));
      }

      // check if the 'service method' is registered
      if (!Object.keys(app.service(service)).includes(method)) {
        return nats.publish(
          res,
          new GeneralError(`Feathers-nats server: Service ${service} with method ${method} is not found on ${name}`)
        );
      }

      app.services[service]
        .create(req.data, req.params)
        .then((result) => {
          nats.publish(res, result);
        })
        .catch(function (error) {
          nats.publish(res, error);
        });
    });

    // handling patch method
    nats.subscribe(`${name}.*.patch`, { queue: `${name}` }, function (request, res, subject) {
      const [, service, method] = subject.split('.');
      debug(`Request for ${name}.${service}.${method}`);
      const req = request;

      // check if service is registered
      if (!Object.keys(app.services).includes(service)) {
        return nats.publish(res, new GeneralError(`Feathers-nats server: Service ${service} is not found on ${name}`));
      }

      // check if the 'service method' is registered
      if (!Object.keys(app.service(service)).includes(method)) {
        return nats.publish(
          res,
          new GeneralError(`Feathers-nats server: Service ${service} with method ${method} is not found on ${name}`)
        );
      }

      app.services[service]
        .patch(req.id, req.data, req.params)
        .then((result) => {
          nats.publish(res, result);
        })
        .catch(function (error) {
          nats.publish(res, error);
        });
    });

    // handling update method
    nats.subscribe(`${name}.*.update`, { queue: `${name}` }, function (request, res, subject) {
      const [, service, method] = subject.split('.');
      debug(`Request for ${name}.${service}.${method}`);
      const req = request;

      // check if service is registered
      if (!Object.keys(app.services).includes(service)) {
        return nats.publish(res, new GeneralError(`Feathers-nats server: Service ${service} is not found on ${name}`));
      }

      // check if the 'service method' is registered
      if (!Object.keys(app.service(service)).includes(method)) {
        return nats.publish(
          res,
          new GeneralError(`Feathers-nats server: Service ${service} with method ${method} is not found on ${name}`)
        );
      }

      app.services[service]
        .update(req.id, req.data, req.params)
        .then((result) => {
          nats.publish(res, result);
        })
        .catch(function (error) {
          nats.publish(res, error);
        });
    });

    // handling remove method
    nats.subscribe(`${name}.*.remove`, { queue: `${name}` }, function (request, res, subject) {
      const [, service, method] = subject.split('.');
      debug(`Request for ${name}.${service}.${method}`);
      const req = request;

      // check if service is registered
      if (!Object.keys(app.services).includes(service)) {
        return nats.publish(res, new GeneralError(`Feathers-nats server: Service ${service} is not found on ${name}`));
      }

      // check if the 'service method' is registered
      if (!Object.keys(app.service(service)).includes(method)) {
        return nats.publish(
          res,
          new GeneralError(`Feathers-nats server: Service ${service} with method ${method} is not found on ${name}`)
        );
      }

      app.services[service]
        .remove(req.id, req.params)
        .then((result) => {
          nats.publish(res, result);
        })
        .catch(function (error) {
          nats.publish(res, error);
        });
    });
  };
};
