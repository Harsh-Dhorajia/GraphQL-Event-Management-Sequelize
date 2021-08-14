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
    forgotPassword(input: ForgotPasswordInput!): ForgotPasswordResponse
    resetPassword(input: ResetPasswordInput!): ResetPasswordResponse
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

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    newPassword: String!
  }

  type LoginResponse {
    token: String!
  }

  type ChangePasswordResponse {
    message: String!
  }

  type ForgotPasswordResponse {
    message: String!
  }

  type ResetPasswordResponse {
    message: String!
  }
`;
