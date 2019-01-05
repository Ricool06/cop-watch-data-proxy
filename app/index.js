const {
  decorate, inject, multiInject, injectable,
} = require('inversify');
const TYPES = require('./types');

class Application {
  constructor(subSocket, eventSubscribers) {
    this.subSocket = subSocket;
    this.eventSubscribers = eventSubscribers;
  }

  start() {
    this.eventSubscribers
      .map(subscriber => this.subSocket.on(subscriber.topic, (...args) => subscriber.handle(args)));
  }
}

decorate(injectable(), Application);
decorate(inject(TYPES.SubEmitterSocket), Application, 0);
decorate(multiInject(TYPES.EventSubscriber), Application, 1);

module.exports = Application;
