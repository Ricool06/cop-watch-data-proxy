const { BeforeAll, AfterAll } = require('cucumber');
const nock = require('nock');
const nockFixturesDirectory = require('../../nock-fixtures');

BeforeAll(async () => {
  nock.back.fixtures = nockFixturesDirectory;
  nock.back.setMode('record');

  const localRequestFilter = request => !request.scope.match(/127\.0\.0\.1:[0-9]*/);
  const nockBackConfig = {
    after: () => nock.enableNetConnect('127.0.0.1'),
    afterRecord: requests => requests.filter(localRequestFilter),
  };

  this.nockDone = await nock
    .back('e2e.json', nockBackConfig)
    .then(response => response.nockDone);
});

AfterAll(() => {
  this.nockDone();
});
