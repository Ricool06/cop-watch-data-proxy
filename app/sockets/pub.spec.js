const { socket } = require('axon');
const pubSocket = require('./pub');
const config = require('../../config');

describe('PubSocket', () => {
  test('should connect the socket to the gateway', async (done) => {
    pubSocket.on('connect', (socketInstance) => {
      expect(socketInstance.readable).toBeTruthy();
      done();
    });

    const fakeGateway = socket('sub');
    fakeGateway.bind(config.app.publishSocketPort, config.app.gatewayHost);
  });
});
