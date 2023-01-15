/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import cors from 'cors';

import { fetchNdz } from './utils';
import { SERVER_PORT } from './config';
import { testConnection } from './db/initDb';

const app = express();
app.use(cors());
app.use(express.json());

// app.get('/drones', async (_req, res) => {
//   const response = await fetchDrones();
//   if (!response.data) {
//     return res.status(400).end();
//   }

//   const parsed = parseDroneXml(response.data);
//   return res.json(parsed);
// });

app.get('/ndz', async (_req, res) => {
  const pilots = await fetchNdz();
  console.log(pilots);
  return res.json(pilots);
});

const start = () => {
  testConnection()
    .then(() => {
      app.listen(SERVER_PORT, () => {
        console.log(`Server running on port ${SERVER_PORT}`);
      });
    })
    .catch((error) => console.log(error));
};

start();
