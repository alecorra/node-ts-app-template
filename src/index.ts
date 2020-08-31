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
  console.log('MySql connected...');
});

// Boot express
const app: Application = express();
const port = process.env.APP_PORT;

// Application routing
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: 'Hello World!' });
});

app.get('/create-table', (req, res) => {
  const sql = createTable;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send('test table created...');
  });
});

app.get('/drop-table', (req, res) => {
  const sql = dropTable;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send('test table dropped...');
  });
});

app.get('/populate-table', (req, res) => {
  const body = 'This is the request body';
  const now = new Date();
  const values = { date: now.toString(), body: body };
  const sql = 'INSERT INTO test SET ?';
  db.query(sql, values, (err) => {
    if (err) throw err;
    res.send('test table updated...');
  });
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
