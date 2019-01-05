/* eslint-disable global-require */
require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('./app/types');
const Application = require('./app');
const GetPoliceDataSubscriber = require('./app/event-subscribers/get-police-data');
const graphqlSchema = require('./app/graphql/schema');
const QueryResolvers = require('./app/graphql/resolvers/query');
const StopsStreetResolver = require('./app/graphql/resolvers/query/stops-street');
const stopsStreetService = require('./app/services/stops-steet');

function main() {
  const container = new Container();

  container.bind(TYPES.GraphqlSchema).toConstantValue(graphqlSchema);
  container.bind(TYPES.EventSubscriber).to(GetPoliceDataSubscriber);
  container.bind(TYPES.SubEmitterSocket).toConstantValue(require('./app/sockets/sub-emitter'));
  container.bind(TYPES.QueryResolvers).to(QueryResolvers);
  container.bind(TYPES.QueryResolver).to(StopsStreetResolver);
  container.bind(TYPES.StopsStreetService).toConstantValue(stopsStreetService);
  container.bind(TYPES.PubSocket).toConstantValue(require('./app/sockets/pub'));

  container.bind(TYPES.Application).to(Application);
  container.get(TYPES.Application).start();
}

module.exports = main;
