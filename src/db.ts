import knex from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

export { knexInstance as knex };
