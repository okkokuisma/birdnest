/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import cors from 'cors';

import { fetchAndUpdate } from './utils';
import { SERVER_PORT } from './config';
import { testConnection } from './db/initDb';
import { getAll } from './db/pilotService';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ndz', async (_req, res) => {
  const dateTime = new Date(Date.now() - 10 * 60 * 1000);
  const pilots = await getAll(dateTime);
  return res.json(pilots);
});

const start = () => {
  testConnection()
    .then(() => {
      setInterval(async () => await fetchAndUpdate(), 2000);
      app.listen(SERVER_PORT, () => {
        console.log(`Server running on port ${SERVER_PORT}`);
      });
    })
    .catch((error) => console.log(error));
};

start();
