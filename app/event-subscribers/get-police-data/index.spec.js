require('reflect-metadata');
const { Container } = require('inversify');
const { socket } = require('axon');
const { buildSchema } = require('graphql');
const TYPES = require('../../types');
const GetPoliceDataSubscriber = require('.');

jest.unmock('graphql');

describe('GetPoliceDataSubscriber', () => {
  let getPoliceDataSubscriber;
  let container;
  let pubSocketSpy;
  let mockGraphqlSchema;
  let mockResolvers;

  beforeEach(() => {
    container = new Container();

    pubSocketSpy = socket('pub');
    jest.spyOn(pubSocketSpy, 'send');

    mockGraphqlSchema = buildSchema(`
      type Query {
        someKey: String
      }
    `);
    mockResolvers = {
      someKey: () => 'someValue',
    };

    container.bind(TYPES.PubSocket).toConstantValue(pubSocketSpy);

    container.bind(TYPES.GraphqlSchema).toConstantValue(mockGraphqlSchema);
    container.bind(TYPES.QueryResolvers).toConstantValue(mockResolvers);

    container.bind(TYPES.EventSubscriber).to(GetPoliceDataSubscriber);
    getPoliceDataSubscriber = container.get(TYPES.EventSubscriber);
  });

  test('should have correct topic', () => {
    expect(getPoliceDataSubscriber.topic).toEqual('*:GET:police-data');
  });

  test('.handle() should send response with good data', async () => {
    const mockRequestId = 'request-id';
    const mockRequest = {
      method: 'GET',
      query: {
        query: '{ someKey }',
      },
    };
    const expectedResponse = { data: { someKey: mockResolvers.someKey() } };

    await getPoliceDataSubscriber.handle(mockRequestId, mockRequest);

    expect(pubSocketSpy.send)
      .toHaveBeenCalledWith(`${mockRequestId}:final-response`, expectedResponse);
  });
});
