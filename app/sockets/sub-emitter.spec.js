const { socket } = require('axon');
const subEmitterSocket = require('./sub-emitter');
const config = require('../../config');

describe('SubEmitterSocket', () => {
  test('should connect the socket to the gateway', async (done) => {
    subEmitterSocket.sock.on('connect', (socketInstance) => {
      expect(socketInstance.readable).toBeTruthy();
      done();
    });

    const fakeGateway = socket('pub');
    fakeGateway.bind(config.app.subscribeSocketPort, config.app.gatewayHost);
  });
});
