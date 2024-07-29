
import { Router } from 'express';
import {body} from 'express-validator';
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../controllers/authors';
import { knex } from '../db';

const router = Router();

router.get('/', getAuthors);
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
// In the authors router file
router.get('/:id/books', async (req, res) => {
  try {
    const authorId = parseInt(req.params.id, 10);
    const books = await knex('books').where({ author_id: authorId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});


export default router;
