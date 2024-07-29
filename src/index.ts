import express = require('express');
import bodyParser from 'body-parser';
import authorsRouter from './routes/authors';
import booksRouter from './routes/books';
import dotenv from 'dotenv';


dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on this port ${PORT}`);
});


