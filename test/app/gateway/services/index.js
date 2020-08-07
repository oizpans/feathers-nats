const hooks = require('./hooks');

module.exports = function services(app) {
  app.use('ServerAppName.products', app.service(`ServerAppName_prod.products`));

  const service = app.service('ServerAppName.products');
  service.hooks(hooks);
};
