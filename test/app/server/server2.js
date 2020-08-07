const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const mongoose = require('mongoose');
const services = require('./services');

const { Client, Server } = require('../../../lib');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://root:tmp12345@mongo:27017/feathers-mq_test2?authSource=admin', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express(feathers());

app.set('name', 'ServerAppName_test');

global.NAME = 'ServerAppName_test';

app.configure(
  Server({
    url: 'nats://nats:4222',
    json: true,
  })
);

app.configure(services);

module.exports = app;
