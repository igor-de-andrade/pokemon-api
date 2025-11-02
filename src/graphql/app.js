const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key';

const app = express();

// Middleware para extrair usuário do token JWT
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.trainerId;
    } catch (err) {
      req.userId = null;
    }
  } else {
    req.userId = null;
  }
  next();
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ userId: req.userId, req })
});

module.exports = { app, server };
