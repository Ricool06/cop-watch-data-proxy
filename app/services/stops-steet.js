const axios = require('axios');
const { GraphQLError } = require('graphql/error');
const config = require('../../config');

const stopsSteetService = {
  getPoly: async polygon => axios
    .get(`${config.app.policeDataApiURL}/stops-street?poly=${polygon}`)
    .then(({ data }) => data)
    .catch(({ response: { status, data } }) => {
      const err = new GraphQLError(data, null, null, null, null, null, { status });
      throw err;
    }),
};

module.exports = stopsSteetService;
