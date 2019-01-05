const TYPES = {
  Application: Symbol.for('Application'),
  PubSocket: Symbol.for('PubSocket'),
  SubEmitterSocket: Symbol.for('SubEmitterSocket'),
  EventSubscriber: Symbol.for('EventSubscriber'),
  GraphqlSchema: Symbol.for('GraphqlSchema'),
  QueryResolvers: Symbol.for('QueryResolvers'),
  QueryResolver: Symbol.for('StopsStreetResolver'),
  StopsStreetService: Symbol.for('StopsStreetService'),
};

module.exports = TYPES;
