const service = require('feathers-mongoose');
const Model = require('./model');
const hooks = require('./hooks');

module.exports = function products(app) {
  app.use(
    'products',
    service({
      Model,
      paginate: {
        default: 2,
        max: 4,
      },
    })
  );

  app.service('products').hooks(hooks);
};
