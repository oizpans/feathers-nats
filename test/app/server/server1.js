const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const mongoose = require('mongoose');
const services = require('./services');

const { Client, Server } = require('../../../lib');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://root:tmp12345@mongo:27017/feathers-mq_test1?authSource=admin', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express(feathers());

app.set('application', 'ServerAppName_test');

global.APPLICATION = 'ServerAppName_test';
app.configure(services);
app.configure(
  Server({
    url: 'nats://nats:4222',
    json: true,
  })
);

module.exports = app;
