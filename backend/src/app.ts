import express from 'express';
import cors from 'cors';
import path from 'path';

import { FRONTEND_BUILD_DIR } from './config';
import ndzmRouter from './controllers/ndz';

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/ndz', ndzmRouter);
app.use(express.static('build'));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(FRONTEND_BUILD_DIR as string, 'index.html'));
});

app.use((_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
});

export default app;
