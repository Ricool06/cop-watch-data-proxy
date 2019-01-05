require('reflect-metadata');
const { Container } = require('inversify');
const TYPES = require('../../../types');
const StopsStreetResolver = require('./stops-street');

describe('StreetStopResolver', () => {
  let container;
  let mockStopsStreetService;

  beforeAll(() => {
    container = new Container();

    mockStopsStreetService = jest.mock('../../../services/stops-steet');
    container.bind(TYPES.StopsStreetService).toConstantValue(mockStopsStreetService);

    container.bind(TYPES.QueryResolver).to(StopsStreetResolver);
  });

  test('should have resolve method that returns data from StopsStreetService.getPoly', async () => {
    const mockData = [{ location: 'some location' }];
    mockStopsStreetService.getPoly = jest.fn(async () => mockData);
    const expectedPoly = '52.2,0.5:52.8,0.2:52.1,0.88';

    const stopsStreetResolver = container.get(TYPES.QueryResolver);
    const actualData = await stopsStreetResolver.resolve({ poly: expectedPoly });

    expect(mockStopsStreetService.getPoly).toHaveBeenCalledWith(expectedPoly);
    expect(actualData).toEqual(mockData);
  });

  test('should have a name property corresponsing to the endpoint it resolves', () => {
    const stopsStreetResolver = container.get(TYPES.QueryResolver);
    expect(stopsStreetResolver.name).toEqual('stopsStreet');
  });
});
