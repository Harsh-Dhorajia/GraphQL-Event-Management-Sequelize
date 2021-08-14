const { gql } = require('apollo-server-express');
const userType = require('./user');
const eventType = require('./event');

const rootType = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

module.exports = [rootType, userType, eventType];
