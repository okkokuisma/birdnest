/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import cors from 'cors';

import { fetchNdz } from './utils';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});