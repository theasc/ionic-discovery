const { gql } = require('apollo-server-express');

module.exports = gql`
    type Sentences {
        id: ID!
        username: String!
        sentence: String!
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    
    extend type Query {
        sentences: [Sentences]
        sentencesByUsername(username:String!): [Sentences]
    }
    
    extend type Mutation {
        createSentence(username:String!, sentence:String!): Sentences
        removeSentence(id: ID!):Boolean!
    }
`
