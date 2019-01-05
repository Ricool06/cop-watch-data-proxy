require('reflect-metadata');
const { Container } = require('inversify');
const { socket } = require('axon');
const { buildSchema } = require('graphql');
const { GraphQLError } = require('graphql/error');
const TYPES = require('../../types');
const GetPoliceDataSubscriber = require('.');

jest.unmock('graphql');

describe('GetPoliceDataSubscriber', () => {
  let container;
  let pubSocketSpy;
  let mockGraphqlSchema;
  let mockResolvers;
  let mockRequest;
  let mockRequestId;

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
    mockRequest = {
      method: 'GET',
      query: {
        query: '{ someKey }',
      },
    };
    mockRequestId = 'request-id';

    container.bind(TYPES.PubSocket).toConstantValue(pubSocketSpy);
    container.bind(TYPES.GraphqlSchema).toConstantValue(mockGraphqlSchema);
    container.bind(TYPES.EventSubscriber).to(GetPoliceDataSubscriber);
  });

  test('should have correct topic', () => {
    container.bind(TYPES.QueryResolvers).toConstantValue(mockResolvers);
    const getPoliceDataSubscriber = container.get(TYPES.EventSubscriber);
    expect(getPoliceDataSubscriber.topic).toEqual('*:GET:police-data');
  });

  test('.handle() should send response with good data', async () => {
    container.bind(TYPES.QueryResolvers).toConstantValue(mockResolvers);
    const getPoliceDataSubscriber = container.get(TYPES.EventSubscriber);

    const expectedResponse = { body: { data: { someKey: mockResolvers.someKey() } }, status: 200 };

    await getPoliceDataSubscriber.handle([mockRequestId, mockRequest]);

    expect(pubSocketSpy.send)
      .toHaveBeenCalledWith(`${mockRequestId}:final-response`, expectedResponse);
  });

  test('.handle() should respond with 400 to bad requests', async () => {
    container.bind(TYPES.QueryResolvers).toConstantValue(mockResolvers);
    const getPoliceDataSubscriber = container.get(TYPES.EventSubscriber);

    mockRequest = {
      method: 'GET',
      query: {
        query: '{{broken{a::d()))) someKaaaey }',
      },
    };

    await getPoliceDataSubscriber.handle([mockRequestId, mockRequest]);

    expect(pubSocketSpy.send)
      .toHaveBeenCalledWith(`${mockRequestId}:final-response`, expect.anything());

    const response = pubSocketSpy.send.mock.calls[0][1];

    expect(response.body.errors[0].message).toBeDefined();
    expect(response.body.errors[0].locations).toBeDefined();
    expect(response.status).toBe(400);
  });

  test('.handle() should respond with forwarded status code to onward errors', async () => {
    const expectedStatus = 500;
    const expectedMessage = 'Whoops';
    mockResolvers = {
      someKey: () => {
        throw new GraphQLError(
          expectedMessage, null, null, null, null, null,
          { status: expectedStatus },
        );
      },
    };

    container.bind(TYPES.QueryResolvers).toConstantValue(mockResolvers);
    const getPoliceDataSubscriber = container.get(TYPES.EventSubscriber);
    await getPoliceDataSubscriber.handle([mockRequestId, mockRequest]);

    expect(pubSocketSpy.send)
      .toHaveBeenCalledWith(`${mockRequestId}:final-response`, expect.anything());

    const response = pubSocketSpy.send.mock.calls[0][1];

    expect(response.body.errors[0].message).toBe(expectedMessage);
    expect(response.body.errors[0].locations).toBeDefined();
    expect(response.status).toBe(500);
  });
});
