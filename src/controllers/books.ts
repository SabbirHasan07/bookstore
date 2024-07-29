import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Book } from '../models/book';
import { knex } from '../db';

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books: Book[] = await knex('books').select('*');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book: Book = await knex('books').where({ id }).first();
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, published_date, author_id } = req.body;

  try {
    const [book] = await knex('books').insert({ title, description, published_date, author_id }).returning('*');
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, published_date, author_id } = req.body;

  try {
    const [book] = await knex('books').where({ id }).update({ title, description, published_date, author_id }).returning('*');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rowsDeleted = await knex('books').where({ id }).del();
    if (rowsDeleted === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBooksByAuthorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const books: Book[] = await knex('books').where({ author_id: id }).select('*');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const searchBooksByTitle = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Invalid or empty title parameter' });
    }

    const books = await knex('books')
      .where('title', 'like', `%${title.trim()}%`);

    res.json(books);
  } catch (error: any) {
    console.error('Error searching books:', error);
    res.status(500).json({ message: 'Error searching books', error: error.message });
  }
};
