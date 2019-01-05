require('reflect-metadata');
const { Container } = require('inversify');
const { socket } = require('axon');
const TYPES = require('./types');
const Application = require('.');

describe('Application', () => {
  let application;
  let container;
  let subEmitterSocketSpy;
  let mockEventSub1;
  let mockEventSub2;

  beforeEach(() => {
    container = new Container();

    subEmitterSocketSpy = socket('sub-emitter');
    jest.spyOn(subEmitterSocketSpy, 'on');

    container.bind(TYPES.SubEmitterSocket).toConstantValue(subEmitterSocketSpy);

    mockEventSub1 = { topic: '*:mockTopic1', handle: jest.fn(args => `correct1${args}`) };
    mockEventSub2 = { topic: 'mockTopic2', handle: jest.fn(args => `correct2${args}`) };

    container.bind(TYPES.EventSubscriber).toConstantValue(mockEventSub1);
    container.bind(TYPES.EventSubscriber).toConstantValue(mockEventSub2);

    container.bind(TYPES.Application).to(Application);
    application = container.get(TYPES.Application);
  });

  test('.start() should subscribe subSocket to all event subscription objects', () => {
    application.start();
    expect(subEmitterSocketSpy.on.mock.calls[0][1](' and other args')).toEqual('correct1 and other args');
    expect(subEmitterSocketSpy.on.mock.calls[1][1](' and other args')).toEqual('correct2 and other args');
    expect(subEmitterSocketSpy.on).toHaveBeenCalledWith(mockEventSub1.topic, expect.any(Function));
    expect(subEmitterSocketSpy.on).toHaveBeenCalledWith(mockEventSub2.topic, expect.any(Function));
  });
});
