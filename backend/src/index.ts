/* eslint-disable @typescript-eslint/no-misused-promises */
import { fetchAndUpdate } from './utils';
import { SERVER_PORT } from './config';
import { testConnection, runMigrations } from './db/initDb';
import app from './app';

const start = () => {
  testConnection()
    .then(async () => {
      await runMigrations();
      setInterval(async () => void await fetchAndUpdate(), 2000);
      app.listen(SERVER_PORT || 3003, () => {
        console.log(`Server running on port ${SERVER_PORT}`);
      });
    })
    .catch((error) => console.log(error));
};

start();