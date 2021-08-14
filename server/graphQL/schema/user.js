const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    password: String!
  }

  extend type Mutation {
    register(input: RegisterInput!): RegisterResponse
    login(input: LoginInput!): LoginResponse
  }

  type RegisterResponse {
    user: User!
    token: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginResponse {
    token: String!
  }
`;
