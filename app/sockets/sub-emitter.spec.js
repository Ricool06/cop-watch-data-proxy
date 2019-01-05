const { socket } = require('axon');
const subEmitterSocket = require('./sub-emitter');
const config = require('../../config');

describe('SubEmitterSocket', () => {
  test('should connect the socket to the gateway', async (done) => {
    const fakeGateway = socket('pub');

    subEmitterSocket.sock.on('connect', (socketInstance) => {
      expect(socketInstance.readable).toBeTruthy();
      subEmitterSocket.close();
      fakeGateway.close();
      done();
    });

    fakeGateway.bind(config.app.subscribeSocketPort, config.app.gatewayHost);
  });
});
