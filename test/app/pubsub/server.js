const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const mongoose = require('mongoose');
const services = require('./services');

const { Server, Instance } = require('../../../lib');

const nats = Instance({
  url: 'nats://nats:4222',
  json: true,
  timeout: 2000,
});

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://root:tmp12345@mongo:27017/feathers_pubsub?authSource=admin', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express(feathers());

app.set('application', 'Subscribe_test');

global.APPLICATION = 'Subscribe_test';

app.configure(
  Server({
    url: 'nats://nats:4222',
    json: true,
  })
);

app.configure(services);

app.var1 = null;

app.subscribe = async () => {
  nats.subscribe('var1', function (msg) {
    app.var1 = msg;
  });
};

module.exports = app;
