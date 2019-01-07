const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Location {
    latitude: String!
    longitude: String!
  }

  type StreetStop {
    location: Location
    datetime: String
    type: String
    object_of_search: String
    self_defined_ethnicity: String
    age_range: String
    gender: String
    outcome: String
  }

  type Query {
    stopsStreet(poly: String!): [StreetStop]!
  }
`);

module.exports = schema;
