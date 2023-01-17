import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB || 'postgres';
export const SERVER_PORT = process.env.SERVER_PORT || 3003;

const DB_HOST = process.env.NODE_ENV === 'test'
  ? 'localhost'
  : process.env.DB_HOST;

const DB_PORT = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_PORT || 5432
  : process.env.DB_PORT || 5432;

export const DATABASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.DATABASE_URL
  : `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}`;

export const FRONTEND_BUILD_DIR = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_BUILD_DIR
  : path.resolve(__dirname, '..', 'build');
