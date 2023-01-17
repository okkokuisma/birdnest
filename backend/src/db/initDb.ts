import { Pool } from 'pg';
import { DATABASE_URL } from '../config';
import pgMigrate from 'node-pg-migrate';

const dbPool = new Pool({
    max: 20,
    connectionString: DATABASE_URL,
    idleTimeoutMillis: 30000
});

export const testConnection = async () => {
  const client = await dbPool.connect();
  await client.query('SELECT NOW()');
  client.release();
};

export const runMigrations = async () => {
  if (DATABASE_URL) {
    void await pgMigrate({
      databaseUrl: DATABASE_URL,
      migrationsTable: 'pgmigrations',
      dir: 'migrations',
      direction: 'up'
    });
  }
};

export default dbPool;
