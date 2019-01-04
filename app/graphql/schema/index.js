const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Location {
    latitude: String!
    longitude: String!
  }

  type StreetStop {
    location: Location!
  }

  type Query {
    stopsStreet: [StreetStop]!
  }
`);

module.exports = schema;