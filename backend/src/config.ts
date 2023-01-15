import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB = process.env.POSTGRES_DB || 'postgres';
export const SERVER_PORT = process.env.SERVER_PORT || 3003;

export const DB_HOST = process.env.NODE_ENV === 'test'
  ? 'localhost'
  : process.env.DB_HOST;

export const DB_PORT = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_PORT || 5432
  : process.env.DB_PORT || 5432;