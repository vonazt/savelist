import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { BabySchema } from './graphql';

dotenv.config();
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@violet.zoqgo.mongodb.net/anais?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log(`Successfully connected to mongoDB`),
);

const start = async () => {
  const schema = await buildSchema({ resolvers: [BabySchema] });

  const server = new ApolloServer({
    schema,
  });

  const app = express();

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: process.env.SERVER_PORT }, () => {
    console.log(
      `Apollo Server on http://localhost:${process.env.SERVER_PORT}/graphql`,
    );
  });
};

start();
