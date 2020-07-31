import dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import userSchema from './graphql/user';

dotenv.config();

const start = async () => {
  const schema = await buildSchema({ resolvers: [userSchema] });

  const server = new ApolloServer({
    schema,
  });

  const app = express();

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: process.env.SERVER_PORT }, () => {
    console.log('Apollo Server on http://localhost:4000/graphql');
  });
};

start()
