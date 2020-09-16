# feathers-nats - 1

A simpler refactored version of the feathers-mq client and server

# Events

The nats client is an event emitter, you can listen to several kinds of events.

```javascript
// emitted whenever there's an error. if you don't implement at least
// the error handler, your program will crash if an error is emitted.
nc.on('error', (err) => {
  console.log(err);
});

// connect callback provides a reference to the connection as an argument
nc.on('connect', (nc) => {
  console.log(`connect to ${nc.currentServer.url.host}`);
});

// emitted whenever the client disconnects from a server
nc.on('disconnect', () => {
  console.log('disconnect');
});

// emitted whenever the client is attempting to reconnect
nc.on('reconnecting', () => {
  console.log('reconnecting');
});

// emitted whenever the client reconnects
// reconnect callback provides a reference to the connection as an argument
nc.on('reconnect', (nc) => {
  console.log(`reconnect to ${nc.currentServer.url.host}`);
});

// emitted when the connection is closed - once a connection is closed
// the client has to create a new connection.
nc.on('close', function () {
  console.log('close');
});

// emitted whenever the client unsubscribes
nc.on('unsubscribe', function (sid, subject) {
  console.log('unsubscribed subscription', sid, 'for subject', subject);
});

// emitted whenever the server returns a permission error for
// a publish/subscription for the current user. This sort of error
// means that the client cannot subscribe and/or publish/request
// on the specific subject
nc.on('permission_error', function (err) {
  console.error('got a permissions error', err.message);
});
```

Read more about nats [here](https://github.com/nats-io/nats.js/tree/dc70c0c00b53703f40a92b081381e9ffeacde014#natsjs---nodejs-client)
