const { socket } = require('axon');
const config = require('../../config');

const pubSocket = socket('pub');

pubSocket.connect(config.app.publishSocketPort, config.app.gatewayHost);

module.exports = pubSocket;
