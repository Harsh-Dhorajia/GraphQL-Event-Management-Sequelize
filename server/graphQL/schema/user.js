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
    changePassword(input: ChangePasswordInput!): ChangePasswordResponse
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

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  type LoginResponse {
    token: String!
  }

  type ChangePasswordResponse {
    message: String!
  }
`;
