const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    login: String!
    nickname: String!
    sex: String!
  }

  type AuthPayload {
    token: String!
  }

  type Capture {
    captureId: ID!
    pokemonId: Int!
    sex: String!
    level: Int!
  }

  type SpeciesCount {
    captured: Int!
    total: Int!
  }

  type Query {
    users: [User!]!
    me: User
    captures: [Capture!]!
    speciesCount: SpeciesCount!
  }

  type Mutation {
    login(login: String!, password: String!): AuthPayload!
    register(login: String!, password: String!, nickname: String!, sex: String!, initialPokemon: Int): AuthPayload!
    addCapture(pokemonId: Int!, sex: String!, level: Int!): Capture!
    updateCaptureLevel(captureId: ID!, level: Int!): Capture!
    deleteCapture(captureId: ID!): Boolean!
  }
`;
