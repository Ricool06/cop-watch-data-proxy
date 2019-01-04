const TYPES = {
  Application: Symbol.for('Application'),
  PubSocket: Symbol.for('PubSocket'),
  SubEmitterSocket: Symbol.for('SubEmitterSocket'),
  EventSubscriber: Symbol.for('EventSubscriber'),
  GraphqlSchema: Symbol.for('GraphqlSchema'),
  Resolvers: Symbol.for('Resolvers'),
};

module.exports = TYPES;
