const { socket } = require('axon');
const config = require('../../config');

const subEmitterSocket = socket('sub-emitter');

subEmitterSocket.connect(config.app.subscribeSocketPort, config.app.gatewayHost);

module.exports = subEmitterSocket;
