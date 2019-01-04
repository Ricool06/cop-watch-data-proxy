require('reflect-metadata');
const nock = require('nock');
const axios = require('axios');
const config = require('../../config');
const nockFixturesDirectory = require('../../nock-fixtures');
const stopsStreetService = require('./stops-steet');

const testDescription = describe('StopsStreetService', async () => {
  let nockDone;

  beforeAll(async () => {
    nock.back.fixtures = nockFixturesDirectory;
    nock.back.setMode('record');

    nockDone = await nock.back(`${testDescription.getFullName()}.json`)
      .then(response => response.nockDone);
  });

  afterAll(() => {
    nockDone();
  });

  test('should fetch street stops within given poly', async () => {
    const polygon = '52.2,0.5:52.8,0.2:52.1,0.88';

    const expectedResponse = await axios
      .get(`${config.app.policeDataApiURL}/stops-street?poly=${polygon}`)
      .then(response => response.data);

    const actualResponse = await stopsStreetService.getPoly(polygon);

    expect(actualResponse).toEqual(expectedResponse);
  });
});
