import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksByAuthorId,
  searchBooksByTitle
} from '../controllers/books';
import { knex } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ message: 'Invalid page or limit parameter' });
    }

    const offset = (pageNumber - 1) * limitNumber;
    
    const [books, totalBooks] = await Promise.all([
      knex('books').limit(limitNumber).offset(offset),
      knex('books').count('* as count').first()
    ]);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total: totalBooks?.count,
      books
    });
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

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

// Route to get books by a specific author
router.get('/author/:id', getBooksByAuthorId);

// Search books by title
router.get('/search', searchBooksByTitle);

export default router;
