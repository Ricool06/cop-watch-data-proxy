const { setWorldConstructor } = require('cucumber');
const { gatewayPubSocket, gatewaySubSocket } = require('./bind-socket');

function World() {
  this.gatewayPubSocket = gatewayPubSocket;
  this.gatewaySubSocket = gatewaySubSocket;
}

setWorldConstructor(World);
