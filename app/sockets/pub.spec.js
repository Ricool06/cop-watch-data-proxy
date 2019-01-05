const { socket } = require('axon');
const pubSocket = require('./pub');
const config = require('../../config');

describe('PubSocket', () => {
  test('should connect the socket to the gateway', async (done) => {
    const fakeGateway = socket('sub');

    pubSocket.on('connect', (socketInstance) => {
      expect(socketInstance.readable).toBeTruthy();
      pubSocket.close();
      fakeGateway.close();
      done();
    });

    fakeGateway.bind(config.app.publishSocketPort, config.app.gatewayHost);
  });
});
