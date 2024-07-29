import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../controllers/authors';

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

export default router;
