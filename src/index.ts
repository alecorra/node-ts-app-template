/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import mysql from 'mysql';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import { createTable, dropTable } from './sql/scripts';
import * as log from './utils/logs';

// MongoDb model
import { Post } from './models/Post';

// Allow .env variables
dotenv.config();

// Create DB connection
const db = mysql.createConnection({
  host: process.env.SERVER,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Connect DB
db.connect((err) => {
  if (err) {
    throw err;
  }
  log.ok('SQL database connected');
});

// Connect to mongoDb
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => log.ok('MongoDB connected'))
    .catch((err) => log.error(`MongoDB connection failed => ${err.message}`));
}

// Boot express
const app: Application = express();
const port = process.env.APP_PORT || 8080;
app.use(bodyParser.json()); // from express 4.x express.bodyParser() is no longer bundled
app.use(cors());

// Application routing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: 'Hello World!' });
});

app.post('/create-table', (req: Request, res: Response, next: NextFunction) => {
  const sql = createTable;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send('test table created...');
  });
});

app.post('/populate-table', (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const values = { date: now.toString(), body: JSON.stringify(req.body) };
  const sql = 'INSERT INTO test SET ?';
  db.query(sql, values, (err) => {
    if (err) throw err;
    res.send('test table updated...');
  });
});

app.delete('/drop-table', (req: Request, res: Response, next: NextFunction) => {
  const sql = dropTable;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send('test table dropped...');
  });
});

// Routing with mongoDb
app.post('/mongo', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

app.get('/mongo', async (req, res) => {
  try {
    const getPosts = await Post.find();
    res.json(getPosts);
  } catch (err) {
    res.json({ message: err });
  }
});

// Start server
app.listen(port, () => log.info(`Server is listening on port ${port}`));
