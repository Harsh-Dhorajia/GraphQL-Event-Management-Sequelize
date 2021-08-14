const { gql } = require('apollo-server-express');

module.exports = gql`
  type Event {
    id: Int!
    eventName: String!
    date: String!
    description: String!
  }

  extend type Mutation {
    createEvents(input: createEventInput!): createEventResponse!
    inviteUser(input: inviteUserInput!): inviteUserResponse!
    updateEvent(input: updateEventInput!): updateEventResponse!
  }

  input inviteUserInput {
    eventId: ID!
    email: String!
  }

  input createEventInput {
    eventName: String!
    description: String!
    date: String!
  }

  input updateEventInput {
    eventId: ID!
    eventName: String!
    description: String!
    date: String!
  }

  type updateEventResponse {
    event: Event!
    message: String!
  }

  type createEventResponse {
    event: Event!
    message: String!
  }

  type inviteUserResponse {
    message: String!
  }

`;
