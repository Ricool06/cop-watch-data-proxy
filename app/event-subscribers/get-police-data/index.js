const { decorate, inject, injectable } = require('inversify');
const TYPES = require('../../types');

class GetPoliceDataSubscriber {
  constructor(graphqlSchema, resolvers, pubSocket) {
    this.topic = '*:get-police-data:*';
  }
}

decorate(injectable(), GetPoliceDataSubscriber);
decorate(inject(TYPES.GraphqlSchema), GetPoliceDataSubscriber, 0);
decorate(inject(TYPES.Resolvers), GetPoliceDataSubscriber, 1);
decorate(inject(TYPES.PubSocket), GetPoliceDataSubscriber, 2);

module.exports = GetPoliceDataSubscriber;
