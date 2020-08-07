process.env.DEBUG = 'feathers-nats*';
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');

const delay = require('delay');
const objectId = require('mongoose').Types.ObjectId;
const serverPublish1 = require('../app/server/server-publish1');
const gateway1 = require('../app/gateway/server1');

describe('Integration Test', () => {
  const client1 = feathers();

  beforeAll(async (done) => {
    client1.configure(socketio(io('http://localhost:3000')));
    gateway1.listen(3000, '0.0.0.0');
    await delay(500);
    done();
  });

  afterAll(async (done) => {
    await delay(500);
    done();
  });

  beforeEach(async () => {
    await serverPublish1.services['products'].Model.deleteMany();
  });

  it('Can call create method on gateway and get a response', async () => {
    let product;
    client1.service(`ServerAppName.products`).on('created', (result) => {
      product = result;
    });
    const createProduct = await client1.service(`ServerAppName.products`).create({
      name: 'testproduct',
      price: '100',
    });
    await delay(500);
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
    expect(product).toBeTruthy();
  });

  it('Can call updated method on gateway and get a response', async () => {
    let product;
    client1.service(`ServerAppName.products`).on('updated', (result) => {
      product = result;
    });
    const createProduct = await client1.service(`ServerAppName.products`).create({
      name: 'testproduct',
      price: '100',
    });

    const updateProduct = await client1.service(`ServerAppName.products`).update(createProduct._id, {
      name: 'update-testproduct',
      price: '200',
    });

    await delay(500);
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
    expect(objectId.isValid(updateProduct._id)).toBeTruthy();
    expect(product).toBeTruthy();
  });

  it('Can call patch method on gateway and get a response', async () => {
    let product;
    client1.service(`ServerAppName.products`).on('patched', (result) => {
      product = result;
    });
    const createProduct = await client1.service(`ServerAppName.products`).create({
      name: 'testproduct',
      price: '100',
    });

    const patchProduct = await client1.service(`ServerAppName.products`).patch(createProduct._id, {
      name: 'new-testproduct',
    });

    await delay(500);
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
    expect(objectId.isValid(patchProduct._id)).toBeTruthy();
    expect(product).toBeTruthy();
  });

  it('Can call remove method on gateway and get a response', async () => {
    let product;
    client1.service(`ServerAppName.products`).on('removed', (result) => {
      product = result;
    });
    const createProduct = await client1.service(`ServerAppName.products`).create({
      name: 'testproduct',
      price: '100',
    });

    const removedProduct = await client1.service(`ServerAppName.products`).remove(createProduct._id);

    await delay(500);
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
    expect(objectId.isValid(removedProduct._id)).toBeTruthy();
    expect(product).toBeTruthy();
  });
});
