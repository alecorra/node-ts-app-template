/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import mysql from 'mysql';
import { createTable, dropTable } from './sql/scripts';

// Allow .env variables
dotenv.config();

// Create DB connection
const db = mysql.createConnection({
  host: process.env.SERVER,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// Connect DB
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.info('Database connected');
});

// Boot express
const app: Application = express();
const port = process.env.APP_PORT;

// Application routing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: 'Hello World!' });
});

app.get('/create-table', (req: Request, res: Response, next: NextFunction) => {
  const sql = createTable;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send('test table created...');
  });
});

app.get('/drop-table', (req: Request, res: Response, next: NextFunction) => {
  const sql = dropTable;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send('test table dropped...');
  });
});

app.post('/populate-table', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const body = req.body;
  const now = new Date();
  const values = { date: now.toString(), body: body.toString() };
  const sql = 'INSERT INTO test SET ?';
  db.query(sql, values, (err) => {
    if (err) throw err;
    res.send('test table updated...');
  });
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
