process.env.DEBUG = 'feathers-nats*';
const delay = require('delay');
const objectId = require('mongoose').Types.ObjectId;
const client1 = require('../app/client/client1');
const server1 = require('../app/server/server1');

describe('Integration Test', () => {
  beforeEach(async () => {
    await delay(100);
    await server1.services['products'].Model.deleteMany();
  });

  it('Timeout error when there is no active app with specified app name', async () => {
    try {
      const result = await client1.service(`nonExistingApp.products`).create({
        name: 'testproduct',
        price: '100',
      });
    } catch (error) {
      expect(error.code).toEqual(500);
      expect(error.message).toEqual(`Request REQ_TIMEOUT on NATS for nonExistingApp.products.create`);
    }
  });

  it('Error when service does not exist on server app', async () => {
    try {
      await client1.service(`ServerAppName_test.nonExistingService`).create({
        name: 'testproduct',
        price: '100',
      });
    } catch (error) {
      expect(error.code).toEqual(500);
      expect(error.message).toEqual(`Request REQ_TIMEOUT on NATS for ServerAppName_test.nonExistingService.create`);
    }
  });

  it('Can call create method on normal service and get response', async () => {
    const createProduct = await client1.service(`ServerAppName_test.products`).create({
      name: 'testproduct',
      price: '100',
    });
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
  });

  it('Can call get method on normal service and get response', async () => {
    const createProduct = await client1.service(`ServerAppName_test.products`).create({
      name: 'testproduct',
      price: '100',
    });
    const getProduct = await client1.service(`ServerAppName_test.products`).get(createProduct._id);
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
    expect(objectId.isValid(getProduct._id)).toBeTruthy();
  });

  it('Can call find method on normal service and get response', async () => {
    const createProduct = await client1.service(`ServerAppName_test.products`).create({
      name: 'testproduct',
      price: '100',
    });
    const findProduct = await client1.service(`ServerAppName_test.products`).find({});
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
    expect(findProduct.total).toEqual(1);
  });

  it('Can call patch method on normal service and get response', async () => {
    const createProduct = await client1.service(`ServerAppName_test.products`).create({
      name: 'testproduct',
      price: '100',
    });
    const patchProduct = await client1
      .service(`ServerAppName_test.products`)
      .patch(createProduct._id, { name: 'newtestproduct' });
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
    expect(objectId.isValid(patchProduct._id)).toBeTruthy();
  });

  it('Can call update method on normal service and get response', async () => {
    const createProduct = await client1.service(`ServerAppName_test.products`).create({
      name: 'testproduct',
      price: '100',
    });
    const updateProduct = await client1
      .service(`ServerAppName_test.products`)
      .update(createProduct._id, { price: '1000' });
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
    expect(objectId.isValid(updateProduct._id)).toBeTruthy();
  });

  it('Can call remove method on normal service and get response', async () => {
    const createProduct = await client1.service(`ServerAppName_test.products`).create({
      name: 'testproduct',
      price: '100',
    });
    const removeProduct = await client1.service(`ServerAppName_test.products`).remove(createProduct._id);
    expect(objectId.isValid(createProduct._id)).toBeTruthy();
    expect(objectId.isValid(removeProduct._id)).toBeTruthy();
  });

  it('Can call existing create method on custom service and get response', async () => {
    const result = await client1.service(`ServerAppName_test.custom`).create({
      word: 'testcustomdata',
      number: 12342532623,
    });
    expect(result.customServiceResult.word).toEqual('testcustomdata');
    expect(result.customServiceResult.number).toEqual(12342532623);
  });

  it('Error calling nonexisting get method on custom service', async () => {
    try {
      await client1.service(`ServerAppName_test.custom`).get('12423564374574634');
    } catch (e) {
      expect(e.name).toEqual('GeneralError');
    }
  });

  it('Error calling nonexisting find method on custom service', async () => {
    try {
      await client1.service(`ServerAppName_test.custom`).find({});
    } catch (e) {
      expect(e.name).toEqual('GeneralError');
    }
  });

  it('Error calling nonexisting patch method on custom service', async () => {
    try {
      await client1.service(`ServerAppName_test.custom`).patch('12423532643643', { word: 'somewhere' });
    } catch (e) {
      expect(e.name).toEqual('GeneralError');
    }
  });

  it('Error calling nonexisting update method on custom service', async () => {
    try {
      await client1.service(`ServerAppName_test.custom`).update('12423532643643', { word: 'somewhere' });
    } catch (e) {
      expect(e.name).toEqual('GeneralError');
    }
  });

  it('Error calling nonexisting remove method on custom service', async () => {
    try {
      await client1.service(`ServerAppName_test.custom`).remove('12423532643643');
    } catch (e) {
      expect(e.name).toEqual('GeneralError');
    }
  });
});
