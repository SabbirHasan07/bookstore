import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksByAuthorId
} from '../controllers/books';
import { knex } from '../db';
const router = Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post(
  '/',
  [
    body('title').isString().notEmpty(),
    body('published_date').isDate(),
    body('author_id').isInt().custom(async (value) => {
      const authorExists = await knex('authors').where({ id: value }).first();
      if (!authorExists) {
        return Promise.reject('Invalid author ID');
      }
    }),
  ],
  createBook
);
router.put(
  '/:id',
  [
    body('title').isString().notEmpty(),
    body('published_date').isDate(),
    body('author_id').isInt().custom(async (value) => {
      const authorExists = await knex('authors').where({ id: value }).first();
      if (!authorExists) {
        return Promise.reject('Invalid author ID');
      }
    }),
  ],
  updateBook
);
router.delete('/:id', deleteBook);
router.get('/author/:id', getBooksByAuthorId);

// In the books router file
router.get('/author/:id', async (req, res) => {
  try {
    const authorId = parseInt(req.params.id, 10);
    const books = await knex('books').where({ author_id: authorId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});


export default router;
