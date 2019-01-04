require('reflect-metadata');
const { decorate, inject, injectable } = require('inversify');
const TYPES = require('../../../types');

class StopsStreetResolver {
  constructor(stopsStreetService) {
    this.stopsStreetService = stopsStreetService;
  }

  async resolve({ poly }) {
    return this.stopsStreetService.getPoly(poly);
  }
}

decorate(injectable(), StopsStreetResolver);
decorate(inject(TYPES.StopsStreetService), StopsStreetResolver, 0);

module.exports = StopsStreetResolver;
