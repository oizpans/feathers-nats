const feathers = require('@feathersjs/feathers');
const { Client } = require('../../../lib');

const app = feathers();

app.set('application', 'ClientAppName_test');

global.APPLICATION = 'ClientAppName_test';

app.configure(
  Client({
    url: 'nats://nats:4222',
    json: true,
  })
);

module.exports = app;
