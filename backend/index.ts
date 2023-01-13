/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import axios from 'axios';
import xmlparser from 'xml-js';
import cors from 'cors';

import { parseDrones } from './utils';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/drones', async (_req, res) => {
  const response = await axios.get<string>('https://assignments.reaktor.com/birdnest/drones');
  if (!response.data) {
    return res.status(400).end();
  }

  const drones = xmlparser.xml2js(response.data, { compact: true });
  const parsed = parseDrones(drones);
  return res.json(parsed);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});