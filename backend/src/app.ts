import express from 'express';
import path from 'path';
import cors from 'cors';

import { FRONTEND_BUILD_DIR } from './config';
import ndzmRouter from './controllers/ndz';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api/ndz', ndzmRouter);
app.use(express.static('build'));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(FRONTEND_BUILD_DIR as string, 'index.html'));
});

app.use((_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
});

export default app;
