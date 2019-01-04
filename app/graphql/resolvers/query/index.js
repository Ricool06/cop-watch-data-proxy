require('reflect-metadata');
const { decorate, multiInject, injectable } = require('inversify');
const TYPES = require('../../../types');

class QueryResolvers {
  constructor(queryResolverArray) {
    queryResolverArray
      .forEach((resolver) => {
        this[resolver.name] = args => resolver.resolve(args);
      });
  }
}

decorate(injectable(), QueryResolvers);
decorate(multiInject(TYPES.QueryResolver), QueryResolvers, 0);

module.exports = QueryResolvers;
