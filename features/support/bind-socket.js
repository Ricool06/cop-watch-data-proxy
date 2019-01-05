const { Before } = require('cucumber');
const { socket } = require('axon');
const { publishSocketPort: gatewaySubPort, subscribeSocketPort: gatewayPubPort, gatewayHost } = require('../../config');
const config = require('../../config');
const main = require('../../server');

const gatewayPubSocket = socket('pub');
const gatewaySubSocket = socket('sub');

/**
 * All of this is to reset the ports of the connected sockets
 * because cucumber intercepts TCP socket port binding and sets
 * them to random ports instead
 */
async function bindSocket(socketObj, port, host) {
  return new Promise((resolve) => {
    let newSocketPort;

    socketObj.on('bind', () => {
      newSocketPort = socketObj.address().port;
      resolve(newSocketPort);
    });
    socketObj.bind(port, host);
  });
}

Before(async () => {
  const pubPromise = bindSocket(gatewayPubSocket, gatewayPubPort, gatewayHost);
  config.app.publishSocketPort = await bindSocket(gatewaySubSocket, gatewaySubPort, gatewayHost);
  config.app.subscribeSocketPort = await pubPromise;
  main();
});

module.exports = {
  gatewayPubSocket,
  gatewaySubSocket,
};
