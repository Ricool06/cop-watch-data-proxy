const { Given, When, Then } = require('cucumber');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

Given('the police data API is up', function () { });

When('a {string} message is received from the gateway with topic {string} and query:', function (method, topic, query, done) {
  const requestId = topic.split()[0];

  this.gatewaySubSocket.subscribe(`${requestId}:final-response`);
  this.gatewaySubSocket.once('message', (responseTopic, response) => {
    this.response = response;
    done();
  });

  const message = {
    method,
    query: {
      query,
    },
  };
  this.gatewayPubSocket.send(topic, message);
});

Then('I receive a valid stop and search response:', function (exampleResponseString) {
  const exampleResponse = JSON.parse(exampleResponseString);
  expect(this.response).to.have.deep.keys(exampleResponse);
});
