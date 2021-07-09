import {json} from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import {createContext} from './init';
import {route} from './route';
// import {connectToDb} from './services/mongo/mongo';
import {connectToDb} from './services/cassandra/cassandra';

dotenv.config();

const app = express();

const port = process.env.PORT;
// const mongoURI = process.env.MONGO_URI;
// const mongoDB = process.env.MONGO_DB;
const url = process.env.CASSANDRA_URI.split(", ");
const keyspace = process.env.KEYSPACE;
const localDataCenter = process.env.LOCALDATACENTER;
const userCassandra = process.env.CASSANDRA_USER;
const passwordCassandra = process.env.CASSANDRA_PASS;

app.use(json());

connectToDb(url, keyspace , localDataCenter ,userCassandra,passwordCassandra).then(db => {
  const ctx = createContext(db);
  route(app, ctx);
  http.createServer(app).listen(port, () => {
    console.log('Start server at port ' + port);
  });
});
