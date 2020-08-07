const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const services = require('./services');

const { Client, Subscribe } = require('../../../lib');

const app = express(feathers());

app.configure(socketio());

app.set('name', 'Gateway_test');

global.NAME = 'Gateway_test';

app.configure(
  Client({
    url: 'nats://nats:4222',
    json: true,
  })
);

app.configure(services);

app.configure(
  Subscribe(
    {
      url: 'nats://nats:4222',
      json: true,
    },
    ['ServerAppName_prod.products']
  )
);

app.on('connection', (connection) => {
  app.channel('public').join(connection);
});

// eslint-disable-next-line no-unused-vars
app.publish((data, hook) => {
  return app.channel('public');
});

// A reference to a handler
// const onCreatedListener = (product) => console.log('New product created', product);

// Listen `created` with a handler reference
// app.services.products.on('created', onCreatedListener);

module.exports = app;
