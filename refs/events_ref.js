const EventEmmiter = require('events');

class Logger extends EventEmmiter {
  log(message) {
    this.emit('message', `${message} ${Date.now()}`);
  }
}

const logger = new Logger();

logger.on('message', data => {
  console.log('data: ', data);
});

logger.log('Hello');
logger.log('Hello');
logger.log('Hello');
