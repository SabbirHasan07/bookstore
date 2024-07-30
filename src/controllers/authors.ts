import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Author } from '../models/author';
import { knex } from '../db';

export const getAuthors = async (req: Request, res: Response) => {
  try {
    const authors: Author[] = await knex('authors').select('*');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const author: Author = await knex('authors').where({ id }).first();
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createAuthor = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, bio, birthdate } = req.body;

  try {
    const [author] = await knex('authors').insert({ name, bio, birthdate }).returning('*');
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateAuthor = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, bio, birthdate } = req.body;

  try {
    const [author] = await knex('authors').where({ id }).update({ name, bio, birthdate }).returning('*');
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rowsDeleted = await knex('authors').where({ id }).del();
    if (rowsDeleted === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const searchAuthorsByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Invalid or empty name parameter' });
    }

    const authors = await knex('authors')
      .where('name', 'like', `%${name.trim()}%`);
      console.log(authors);
    res.json(authors);
  } catch (error: any) {
    console.error('Error searching authors:', error);
    res.status(500).json({ message: 'Error searching authors', error: error.message });
  }
};
