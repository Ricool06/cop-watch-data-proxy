require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('../../../types');
const QueryResolvers = require('.');

describe('QueryResolvers', () => {
  let container;
  let mockStreetStopsResolver;

  beforeAll(() => {
    container = new Container();

    mockStreetStopsResolver = jest.mock('./stops-street');

    container.bind(TYPES.QueryResolver).toConstantValue(mockStreetStopsResolver);
    container.bind(TYPES.QueryResolvers).to(QueryResolvers);
  });

  test('.stopsStreet() should call street-stops resolver', () => {
    mockStreetStopsResolver.resolve = jest.fn();
    mockStreetStopsResolver.name = 'stopsStreet';
    const expectedArgs = { poly: '52.2,0.5:52.8,0.2:52.1,0.88', otherArg: 'something' };

    const queryResolvers = container.get(TYPES.QueryResolvers);
    expect(queryResolvers.stopsStreet).toBeDefined();
    queryResolvers.stopsStreet(expectedArgs);

    expect(mockStreetStopsResolver.resolve).toHaveBeenCalledWith(expectedArgs);
  });
});
