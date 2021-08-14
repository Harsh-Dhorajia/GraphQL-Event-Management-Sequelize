const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphQL/schema');
const resolvers = require('./graphQL/resolvers');
const context = require('./graphQL/context');
const db = require('./models');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/graphql',
  },
  context,
});

db.sequelize.sync({ alter: true })
  // eslint-disable-next-line promise/always-return
  .then(async () => {
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`listening on port ${process.env.PORT}`);
    });
    // eslint-disable-next-line no-console
    console.log('DB connection established');
  }).catch(error => {
    // eslint-disable-next-line no-console
    console.log('Error in db connection');
    throw new Error(error);
  });

server.applyMiddleware({ app });

module.exports = app;
