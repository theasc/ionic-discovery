const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const models = require('./models');
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const app = express();
const port = 4000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    context: {models}
});

server.applyMiddleware({ app, cors: true});

app.listen({port}, () => console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`))
