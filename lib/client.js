const debug = require('debug')('feathers-nats:client');
const NATS = require('nats');
const { GeneralError } = require('@feathersjs/errors');

const instance = require('./instance');

module.exports = function (params = {}) {
  return async function () {
    const app = this;
    const name = app.get('name');
    if (!name) {
      throw new Error('App name is required');
    }

    const timeout = params.timeout || 2000;

    const nats = instance(params);

    debug(`Connected to NATS on ${params.url} and requesting from ${name}.*`);

    app.service = function (service) {
      const regex = /(^\/)|(\/$)/g;

      service = service.replace(regex, '');

      if (app.services[service]) {
        return app.services[service];
      }

      const _request = function (method, request) {
        return new Promise(async (resolve, reject) => {
          try {
            nats.request(`${service}.${method}`, request, { max: 1, timeout: timeout }, function (reply) {
              if (reply instanceof NATS.NatsError) {
                debug(reply);
                debug(`Got error on NATS reply for ${service}.${method}`);
                return reject(new GeneralError(`Request ${reply.code} on NATS for ${service}.${method}`));
              }
              debug(`Got reply on NATS for ${service}.${method}`);

              if (reply && reply.errors) {
                return reject(reply);
              }

              return resolve(reply);
            });
          } catch (error) {
            return reject(new GeneralError(error));
          }
        });
      };

      return {
        find(params = {}) {
          const method = 'find';
          const request = {
            params,
          };
          return _request(method, request);
        },

        get(id, params = {}) {
          const method = 'get';
          const request = {
            id,
            params,
          };
          return _request(method, request);
        },

        create(data = {}, params = {}) {
          const method = 'create';
          const request = {
            data,
            params,
          };
          return _request(method, request);
        },

        update(id, data = {}, params = {}) {
          const method = 'update';
          const request = {
            id,
            data,
            params,
          };
          return _request(method, request);
        },

        patch(id, data = {}, params = {}) {
          const method = 'patch';
          const request = {
            id,
            data,
            params,
          };
          return _request(method, request);
        },

        remove(id, params = {}) {
          const method = 'remove';
          const request = {
            id,
            params,
          };
          return _request(method, request);
        },
      };
    };
  };
};
