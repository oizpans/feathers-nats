process.env.DEBUG = 'feathers-nats*';

const delay = require('delay');
const objectId = require('mongoose').Types.ObjectId;

const server = require('../app/pubsub/server');
const client = require('../app/pubsub/client');

describe('Integration Test', () => {
  beforeEach(async () => {
    await server.services['products'].Model.deleteMany();
  });

  afterAll(async (done) => {
    await delay(100);
    done();
  });

  it.only('Can publish a message and receive on a subscribe', async () => {
    server.subscribe();
    client.publish();
    await delay(100);
    expect(server.var1).toEqual('value1');
  });
});
