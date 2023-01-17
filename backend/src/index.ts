/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import cors from 'cors';
import path from 'path';

import { fetchAndUpdate } from './utils';
import { SERVER_PORT, FRONTEND_BUILD_DIR } from './config';
import { testConnection, runMigrations } from './db/initDb';
import { getAll } from './db/pilotService';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ndz', async (_req, res) => {
  const dateTime = new Date(Date.now() - 10 * 60 * 1000);
  const pilots = await getAll(dateTime);
  return res.json(pilots);
});

app.use(express.static('build'));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(FRONTEND_BUILD_DIR as string, 'index.html'));
});

app.use((_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
});

const start = () => {
  testConnection()
    .then(async () => {
      await runMigrations();
      setInterval(async () => await fetchAndUpdate(), 2000);
      app.listen(SERVER_PORT, () => {
        console.log(`Server running on port ${SERVER_PORT}`);
      });
    })
    .catch((error) => console.log(error));
};

start();