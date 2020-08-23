import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { SpotifySchema } from './graphql';
import authRoutes from './routes/auth';
import { repository } from './repositories';

dotenv.config();

const start = async () => {
  const schema = await buildSchema({ resolvers: [SpotifySchema] });

  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@violet.zoqgo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.error(`Error connecting to MongoDB`, err);
  }

  const app = express();
  app.use(
    cors({
      exposedHeaders: `accessToken`,
      // origin: [`https://savelist.herokuapp.com`, `http://localhost:4000/graphql`],
      // allowedHeaders: `Origin, X-Requested-With, Content-Type, Accept`,
    }),
  );
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('/', authRoutes);

  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      const accessToken = await repository.validateToken(
        req.headers.accesstoken as string,
      );
      if (accessToken) {
        res.header({ accessToken });
        return { accessToken };
      }
    },
  });

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(
      `Server listening on ${process.env.PORT || 4000}\nApollo Server listening on ${process.env.PORT || 4000}/graphql`,
    );
  });
};

start();
