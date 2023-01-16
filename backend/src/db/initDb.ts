import { Pool } from 'pg';
import {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  DB_HOST,
  DB_PORT
} from '../config';

const dbPool = new Pool({
    max: 20,
    connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}`,
    idleTimeoutMillis: 30000
});

export const testConnection = async () => {
  const client = await dbPool.connect();
  await client.query('SELECT NOW()');
  client.release();
};

export default dbPool;
