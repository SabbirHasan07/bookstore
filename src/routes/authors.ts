import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  searchAuthorsByName
} from '../controllers/authors';
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
    
    const [authors, totalAuthors] = await Promise.all([
      knex('authors').limit(limitNumber).offset(offset),
      knex('authors').count('* as count').first()
    ]);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total: totalAuthors?.count,
      authors
    });
  } catch (error) {
    console.error('Error retrieving authors:', error);
    res.status(500).json({ message: 'Error retrieving authors' });
  }
});

router.get('/:id', getAuthorById);
router.post(
  '/',
  [
    body('name').isString().notEmpty(),
    body('birthdate').isDate(),
  ],
  createAuthor
);
router.put(
  '/:id',
  [
    body('name').isString().notEmpty(),
    body('birthdate').isDate(),
  ],
  updateAuthor
);
router.delete('/:id', deleteAuthor);

// Search authors by name
router.get('/search', searchAuthorsByName);

export default router;
