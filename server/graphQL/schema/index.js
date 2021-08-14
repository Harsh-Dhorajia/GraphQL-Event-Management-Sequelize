const { gql } = require('apollo-server-express');
const userType = require('./user');

const rootType = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

module.exports = [rootType, userType];
