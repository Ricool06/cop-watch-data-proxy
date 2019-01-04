const { Given, When, Then } = require('cucumber');
const { socket } = require('axon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { publishSocketPort: gatewaySubPort, subscribeSocketPort: gatewayPubPort, gatewayHost } = require('../../config');

chai.use(chaiHttp);
const { expect } = chai;

async function bindSocket(socketObj, port, host) {
  await new Promise((resolve) => {
    socketObj.once('bind', resolve);
    socketObj.bind(port, host);
  });
}

Given('the police data API is up', function () { });

When('a {string} message is received from the gateway with topic {string} and query:', function (method, topic, query, done) {
  const gatewayPubSocket = socket('pub');
  const gatewaySubSocket = socket('sub');

  bindSocket(gatewayPubSocket, gatewayPubPort, gatewayHost);
  bindSocket(gatewaySubSocket, gatewaySubPort, gatewayHost);

  const requestId = topic.split()[0];

  gatewaySubSocket.subscribe(`${requestId}:final-response`);
  gatewaySubSocket.once('message', (responseTopic, response) => {
    this.response = response;
    done();
  });

  const message = { method, query };
  gatewayPubSocket.send(topic, message);
});

Then('I receive a valid stop and search response:', function (exampleResponseString) {
  const exampleResponse = JSON.parse(exampleResponseString);
  expect(this.response).to.have.status(200);
  expect(this.response).to.have.deep.keys(exampleResponse);
});
