# feathers-nats - 1

A simpler refactored version of the feathers-mq client and server

# Events

```javascript
import { instance } from 'feathers-nats';
// emitted whenever there's an error. if you don't implement at least
// the error handler, your program will crash if an error is emitted.
instance.on('error', (err) => {
  console.log(err);
});
```

Read more about nats [here](https://github.com/nats-io/nats.js/tree/dc70c0c00b53703f40a92b081381e9ffeacde014#natsjs---nodejs-client)
