const { gql } = require('apollo-server-express');

module.exports = gql`
  type Event {
    id: Int!
    eventName: String!
    date: String!
    description: String!
    user: User!
  }

  type Guest {
    id: Int!
    invitedBy: String!
    user: User!
    eventId: Int!
  }

  extend type Query {
    getAllEvents(input: getAllEventsInput!): getAllEventsResponse!
    getInvitedUsers(input: getInvitedUsersInput!): getInvitedUsersResponse
    getEventDetail(input: getEventDetailInput!): getEventDetailResponse!
    getAllCreatedEvents(input: getAllCreatedEventsInput!): getAllCreatedEventsResponse!
  }
  extend type Mutation {
    createEvents(input: createEventInput!): createEventResponse!
    inviteUser(input: inviteUserInput!): inviteUserResponse!
    updateEvent(input: updateEventInput!): updateEventResponse!
    getAllEvents(input: getAllEventsInput!): getAllEventsResponse!
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

  input getAllEventsInput {
    limit: Int
    page: Int
    sort: String
    search: String
  }

  input getInvitedUsersInput {
    eventId: ID!
  }

  input getEventDetailInput {
    eventId: ID!
  }

  type getAllEventsResponse {
    message: String!
    events: [Event!]
  }

  type getInvitedUsersResponse {
    message: String!
    guests: [Guest!]
  }

  input getAllCreatedEventsInput {
    limit: Int
    page: Int
    sort: String
    search: String
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

  type getEventDetailResponse {
    event: Event!
  }

  type getAllCreatedEventsResponse {
    message: String!
    events: [Event!]
  }
`;
