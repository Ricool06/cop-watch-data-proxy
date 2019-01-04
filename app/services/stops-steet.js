const axios = require('axios');
const config = require('../../config');

const stopsSteetService = {
  getPoly: async polygon => axios
    .get(`${config.app.policeDataApiURL}/stops-street?poly=${polygon}`)
    .then(response => response.data),
};

module.exports = stopsSteetService;
