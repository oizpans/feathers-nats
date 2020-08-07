module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      (context) => {
        // Skip sending event
        context.event = null;
      },

      async (context) => {
        // console.log('gateway create');

        return context;
      },
    ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
