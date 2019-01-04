const { decorate, inject, injectable } = require('inversify');
const { graphql } = require('graphql');
const TYPES = require('../../types');

class GetPoliceDataSubscriber {
  constructor(graphqlSchema, resolvers, pubSocket) {
    this.topic = '*:GET:police-data';
    this.graphqlSchema = graphqlSchema;
    this.resolvers = resolvers;
    this.pubSocket = pubSocket;
  }

  async handle(requestId, request) {
    return graphql(this.graphqlSchema, request.query.query, this.resolvers)
      .then(response => this.pubSocket.send(`${requestId}:final-response`, response));
  }
}

decorate(injectable(), GetPoliceDataSubscriber);
decorate(inject(TYPES.GraphqlSchema), GetPoliceDataSubscriber, 0);
decorate(inject(TYPES.QueryResolvers), GetPoliceDataSubscriber, 1);
decorate(inject(TYPES.PubSocket), GetPoliceDataSubscriber, 2);

module.exports = GetPoliceDataSubscriber;
