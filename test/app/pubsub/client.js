const feathers = require('@feathersjs/feathers');
const { Client, Instance } = require('../../../lib');

const app = feathers();

const nats = Instance({
  url: 'nats://nats:4222',
  json: true,
  timeout: 2000,
});

app.set('name', 'Publish_test');

global.NAME = 'Publish_test';

app.configure(
  Client({
    url: 'nats://nats:4222',
    json: true,
    timeout: 2000,
  })
);

app.publish = async () => {
  nats.publish('var1', 'value1');
};
module.exports = app;
