require('reflect-metadata');
const { Container } = require('inversify');
const { socket } = require('axon');
const graphqlModule = require('graphql');
const TYPES = require('../../types');
const GetPoliceDataSubscriber = require('.');

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
    
    mockGraphqlSchema = jest.fn();
    mockResolvers = jest.fn();

    container.bind(TYPES.PubSocket).toConstantValue(pubSocketSpy);

    container.bind(TYPES.GraphqlSchema).toConstantValue(mockGraphqlSchema);
    container.bind(TYPES.Resolvers).toConstantValue(mockResolvers);

    container.bind(TYPES.EventSubscriber).to(GetPoliceDataSubscriber);
    getPoliceDataSubscriber = container.get(TYPES.EventSubscriber);
  });

  test('should have correct topic', () => {
    expect(getPoliceDataSubscriber.topic).toEqual('*:get-police-data:*');
  });

  test('.handle() should send response with good data', () => {
    const mockResponseData = { data: { someKey: 'someValue' } };
    const mockUserId = 'user-id';
    const mockRequest = ''
    graphqlModule.graphql = jest.fn().mockReturnValue(new Promise(resolve => resolve(mockResponseData)));

    getPoliceDataSubscriber.handle();
  });
});
